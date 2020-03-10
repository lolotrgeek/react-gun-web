import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from "react-router-dom"
import { createProject } from '../constants/Data'
import { Grid, Button, TextField, makeStyles } from '@material-ui/core/'
import { CirclePicker } from 'react-color'
import { colorValid, nameValid, projectValid } from '../constants/Validators'
import { SubHeader } from '../components/Header'
import { useAlert } from 'react-alert'
import { projectsListLink } from '../routes/routes'

const useStyles = makeStyles(theme => ({
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  }

}));

export default function ProjectCreateScreen() {
  const [alerted, setAlert] = useState([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const alert = useAlert()
  let history = useHistory()

  const classes = useStyles();

  useEffect(() => {
    if (alerted && alerted.length > 0) {
      alert.show(alerted[1], {
        type: alerted[0]
      })
    }
    return () => alerted
  }, [alerted])


  const handleSelectedColor = (color, event) => {
    console.log(color)
    console.log(event)
    setColor(color.hex)
  }

  const handleSubmitProject = () => {
    if (!nameValid(name)) {
      // alert('Need valid name');
      setAlert([
        'Error',
        'Need valid name',
      ])
      return false
    }
    if (!colorValid(color)) {
      // alert('Need valid color');
      setAlert([
        'Error',
        'Need valid color',
      ])
      return false
    }
    else {
      
      createProject(name, color)
      setAlert([
        'Success',
        `Project ${name} Created!`,
      ])
      history.push(projectsListLink())
    }
  }
  return (
    <Grid container direction='column' justify='center' alignItems='center' spacing={4}>
      <SubHeader title={nameValid(name) ? name : 'New Project'} color={color ? color : ''} />
      <Grid container direction='column' justify='flex-start' alignItems='center' spacing={5}>
        <form className={classes.form}>
          <TextField variant="outlined" label="name" value={nameValid(name) ? name : ''} onChange={event => setName(event.target.value)} />
        </form>
        <Grid item xs><CirclePicker onChangeComplete={handleSelectedColor} /></Grid>
        <Grid item xs>
          <Button variant="contained" color="primary" onClick={() => handleSubmitProject()}>Submit</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}