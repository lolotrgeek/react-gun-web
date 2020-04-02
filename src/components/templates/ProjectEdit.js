import React from 'react'
import { nameValid } from '../../constants/Validators'

import Popup from '../atoms/Popup'
import SideMenu from '../molecules/SideMenu'
import { SubHeader } from '../atoms/Header'
import Grid from '../atoms/Grid'
import { CirclePicker } from 'react-color' // TODO native color picker

import { Button } from '../atoms/Button'
import { TextField } from '../atoms/TextField'


/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 */
export default function Name(props) {
  return (
    <Grid container direction='column' justify='center' alignItems='center'>
      <Popup content='Confirm Delete?' onAccept={() => props.popupAccept()} onReject={() => props.popupReject()} />
      <SubHeader title={nameValid(props.name) ? props.name : 'New Project'} color={props.color ? props.color : ''} />
      <SideMenu
        options={props.sideMenuOptions}
      />
      <Grid container direction='column' justify='flex-start' alignItems='center' className={props.classes.form}>
        <TextField variant="outlined" label="name" value={nameValid(props.name) ? props.name : ''} onChange={event => props.setName(event.target.value)} />
        <Grid item className={props.classes.space}><CirclePicker onChangeComplete={props.selectColor} /></Grid>
        <Grid item className={props.classes.space}>
          <Button variant="contained" color="primary" onClick={() => props.submitProject()}>Submit</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}