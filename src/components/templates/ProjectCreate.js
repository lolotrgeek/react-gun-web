import React from 'react'
import { nameValid } from '../../constants/Validators'

import { SubHeader } from '../atoms/Header'
import Grid from '../atoms/Grid'
import { ColorPicker as CirclePicker } from '../molecules/ColorPicker'

import { Button } from '../atoms/Button'
import { TextField } from '../atoms/TextField'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 */
export default function PrpojectCreate(props) {
  return (
    <Grid container direction='column' justify='center' alignItems='center' className={props.classes.space} >
      <SubHeader
        title={nameValid(props.name) ? props.name : 'New Project'}
        color={props.color ? props.color : null}
      />
      <TextField
        variant="outlined"
        label="name"
        style={{ width: 240 }}
        value={nameValid(props.name) ? props.name : null}
        onChange={text => props.setName(text)}
      />

      <Grid item className={props.classes.space}>
        < CirclePicker selectColor={props.selectColor} />
      </Grid>
      <Grid item className={props.classes.space} >
        <Button variant="contained" color="primary" onClick={() => props.submitProject()}>Submit</Button>
      </Grid>

    </Grid>
  )
}