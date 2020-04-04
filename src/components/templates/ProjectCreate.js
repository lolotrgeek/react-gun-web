import React from 'react'
import { nameValid } from '../../constants/Validators'

import { SubHeader } from '../atoms/Header'
import Grid from '../atoms/Grid'
import {ColorPicker as CirclePicker} from '../molecules/ColorPicker'

import { Button} from '../atoms/Button'
import {TextField} from '../atoms/TextField'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 */
export default function PrpojectCreate(props) {
    return (
      <Grid>
      <SubHeader title={nameValid(props.name) ? props.name : 'New Project'} color={props.color ? props.color : ''} />
      <Grid container direction='column' justify='flex-start' alignItems='center' className={props.classes.space} >
        <form className={props.classes.form}>
          <TextField variant="outlined" label="name" value={nameValid(props.name) ? props.name : ''} onChange={event => props.setName(event.target.value)} />
        </form>
        <Grid item className={props.classes.space}>< CirclePicker  selectColor={props.selectColor} /></Grid>
        <Grid item className={props.classes.space} >
          <Button variant="contained" color="primary" onClick={() => props.submitProject()}>Submit</Button>
        </Grid>
      </Grid>
    </Grid>
    )
}