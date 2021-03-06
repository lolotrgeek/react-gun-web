import React from 'react'
import { SubHeader } from './Header'
import { Title } from './Title'
import { UnEvenGrid } from './Grid'
import { Grid, Button } from '@material-ui/core/'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {Object} props.projects
 * @param {function} props.restoreButtonAction 
 * 
 */
export default function Name(props) {
    return (
        <Grid>
        <SubHeader
          className={props.classes.space}
          title='Project Trash'
        />
  
        <Grid className={props.classes.space}>
          {props.projects.map(project => {
            return (
              <Grid key={project[0]} className={props.classes.listClass}>
                <UnEvenGrid
                  values={[
                    <Title color={project[1].color} variant='h6' >{ project[1].name }</Title>,
                    <Button variant="contained" color="primary" onClick={() => props.restoreButtonAction(project) }>Restore</Button>
                  ]}
                />
  
              </Grid>
            )
          })}
        </Grid>
      </Grid >
    )
}