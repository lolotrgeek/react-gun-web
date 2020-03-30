import React from 'react'
import { SubHeader } from './Header'
import { Grid, Button, TextField } from '@material-ui/core/'
import { CirclePicker } from 'react-color'
import { nameValid } from '../constants/Validators'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 */
export default function Name(props) {
    return (
      <Grid>
      <SubHeader title={nameValid(props.name) ? props.name : 'New Project'} color={props.color ? props.color : ''} />
      <Grid container direction='column' justify='flex-start' alignItems='center' className={props.classes.space} >
        <form className={props.classes.form}>
          <TextField variant="outlined" label="name" value={nameValid(props.name) ? props.name : ''} onChange={event => props.setName(event.target.value)} />
        </form>
        <Grid item xs className={props.classes.space}>< CirclePicker  onChangeComplete={props.selectColor} /></Grid>
        <Grid item xs className={props.classes.space} >
          <Button variant="contained" color="primary" onClick={() => props.submitProject()}>Submit</Button>
        </Grid>
      </Grid>
    </Grid>
    )
}