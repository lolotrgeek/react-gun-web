import React from 'react'
import { projectValid } from '../../constants/Validators'

import Stateless from '../molecules/Stateless'
import { Title } from '../atoms/Title'
import { SubHeader } from '../atoms/Header'
import { UnEvenGrid } from '../atoms/Grid'
import Grid from '../atoms/Grid'

import Typography from '../atoms/Typography'
import {Button} from '../atoms/Button'


/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @todo consider adding project id to header for reference
 */
export default function ProjectHistory(props) {
    return (
        <Grid>
        {projectValid(props.project) && props.edits && props.edits.length > 0 ?
          <SubHeader
            className={props.classes.space}
            title={`${props.project[1].name} History`}
            buttonClick={props.headerButtonAction}
            buttonText='Edit'
          /> : <Stateless />}
  
        <Grid className={props.classes.space}>
          {props.edits.map(edit => {
            return (
              <Grid key={edit[2]} className={props.classes.listClass}>
  
                {edit.length === 3 ? <Title color={edit[1].color} variant='h6' >
                  {edit.length === 3 ? edit[1].name : ''}
                </Title>
                  : ''}
                <Typography>{props.displayStatus(edit)}</Typography>
                {props.displayRestoreButton(edit) ?
                  <UnEvenGrid
                    values={[
                      <Typography>{props.displayStatusDate(edit)}</Typography>,
                      <Button variant="contained" color="primary" onClick={() => {
                        props.restoreButtonAction(edit)
                      }}>Restore</Button>
                    ]}
                  />
                  : <UnEvenGrid values={[<Typography>{props.displayStatusDate(edit)}</Typography>]} />}
              </Grid>
            )
          })}
        </Grid>
      </Grid >
    )
}