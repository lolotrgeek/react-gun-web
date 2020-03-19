import React, { useState, useEffect, useContext } from 'react'
import { useParams } from "react-router-dom"
import useCounter from '../hooks/useCounter'
import { isRunning, isTimer } from '../constants/Validators'
import { elapsedTime, fullDate } from '../constants/Functions'
import { trimSoul } from '../constants/Store'
import { gun, restoreProject } from '../constants/Data'
import SpacingGrid, { UnEvenGrid } from '../components/Grid'
import { Grid, Typography, makeStyles, Divider, Button } from '@material-ui/core/'
import { projectValid } from '../constants/Validators'
import { projectEditlink, projectCreatelink, projectlink, timerRunninglink } from '../routes/routes'
import { Title } from '../components/Title'
import { Link } from '../components/Link'
// import { Button } from '../components/Button'
import { Header, SubHeader } from '../components/Header'
import { RunningTimer } from '../components/RunningTimer'
import { useHistory } from "react-router-dom"
import { useStyles } from '../themes/DefaultTheme'
import Stateless from '../components/Stateless'
import Popup from '../components/Popup'
import { PopupContext } from '../contexts/PopupContext'
import { useAlert } from 'react-alert'


export default function ProjectHistory() {
  const { projectId } = useParams()
  const [online, setOnline] = useState(false)
  const [alerted, setAlert] = useState([])
  const [project, setProject] = useState([])
  const [edits, setEdits] = useState([])
  const classes = useStyles();
  const alert = useAlert()
  let history = useHistory()
  let { state, dispatch } = useContext(PopupContext)

  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])
  useEffect(() => {
    gun.get('history').get('projects').get(projectId).map().on((projectValue, projectGunKey) => {
      console.log('History ', projectGunKey, projectValue)
      setEdits(edits => [...edits, [projectId, trimSoul(projectValue), projectGunKey]])
    }, { change: true })
    return () => gun.get('history').off()
  }, [online]);

  useEffect(() => {
    gun.get('projects').get(projectId).on((projectValue, projectGunKey) => {
      setProject([projectId, trimSoul(projectValue)])
    }, { change: true })
    return () => gun.get('projects').off()
  }, [online]);

  const displayStatusDate = edit => {
    if (edit[1].edited || edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
    if (edit[1].deleted && typeof edit[1].deleted === 'string') return fullDate(new Date(edit[1].created))
    if (edit[1].status === 'done') return fullDate(new Date(edit[1].ended))

  }

  const displayStatus = edit => {
    // console.log(edit[1], project[1])
    if (JSON.stringify(edit[1]) === JSON.stringify(project[1])) return 'Current Entry'
    else if (edit[1].deleted && typeof edit[1].deleted === 'string') return 'Restored Entry'
    else if (!edit[1].edited && edits.length > 1) return 'Original Entry'
    // else if (edit[1].edited && edit[1].edited.length > 0) return fullDate(new Date(edit[1].edited))
    else if (edit[1].edited && edit[1].edited.length > 0) return 'Edit Entry'
    else return ''
  }

  const displayRestoreButton = edit => {
    if (JSON.stringify(edit[1]) === JSON.stringify(project[1])) return false
    else if (!edit[1].edited && edits.length > 1) return true
    else if (edit[1].edited && edit[1].edited.length > 0) return true
    else return false
  }

  const editRestore = edit => restoreProject([edit[0], edit[1]])

  return (
    <Grid>
      {projectValid(project) && edits && edits.length > 0 ?
        <SubHeader
          className={classes.space}
          title={`${project[1].name} History`}
          buttonClick={() => {
            history.push(projectEditlink(project[0]))
          }}
          buttonText='Edit'
        /> : <Stateless />}

      <Grid className={classes.space}>
        {edits.map(edit => {
          return (
            <Grid key={edit[2]} className={classes.listClass}>

              {edit.length === 3 ? <Title color={edit[1].color} variant='h6' >
                {edit.length === 3 ? edit[1].name : ''}
              </Title>
                : ''}

              {displayRestoreButton(edit) ?
                <UnEvenGrid
                  values={[
                    <Typography>{displayStatus(edit)}</Typography>,
                    <Button variant="contained" color="primary" onClick={() => {
                      editRestore(edit)
                    }}>Restore</Button>
                  ]}
                />
                : <UnEvenGrid values={[<Typography>{displayStatus(edit)}</Typography>]} />}
            </Grid>
          )
        })}
      </Grid>
    </Grid >
  )
}