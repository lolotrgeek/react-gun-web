import React from 'react'
import { nameValid } from '../../constants/Validators'

import Popup from '../atoms/Popup'
import SideMenu from '../molecules/SideMenu'
import { SubHeader } from '../atoms/Header'
import Grid from '../atoms/Grid'
import { ColorPicker as CirclePicker } from '../molecules/ColorPicker'

import { Button } from '../atoms/Button'
import { TextField } from '../atoms/TextField'
import { View } from 'react-native'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 */
export default function ProjectEdit(props) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      ...props.classes.listRoot
    }}>
      <SideMenu options={props.sideMenuOptions} />
      <Popup content='Confirm Delete?' onAccept={() => props.popupAccept()} onReject={() => props.popupReject()} />
      <SubHeader
        title={nameValid(props.name) ? props.name : 'New Project'}
        color={props.color ? props.color : null}
      />

      <TextField
        variant="outlined"
        label="name"
        style={{...props.classes.spaceAround, width: 240 }}
        value={nameValid(props.name) ? props.name : ''}
        onChange={event => event.target ? props.setName(event.target.value) : ''}
      />
      <CirclePicker selectColor={props.selectColor} />
      <Grid item className={props.classes.space}>
        <Button variant="contained" color="primary" onPress={() => props.submitProject()}>Submit</Button>
        <Button variant="contained" color="primary" onPress={() => props.cancelEdit()}>Cancel</Button>
      </Grid>
    </View>
  )
}