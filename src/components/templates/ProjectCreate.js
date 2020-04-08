import React from 'react'
import { nameValid } from '../../constants/Validators'

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
export default function PrpojectCreate(props) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      ...props.classes.listRoot
    }}>
      <SubHeader
        style={props.classes.space}
        title={nameValid(props.name) ? props.name : 'New Project'}
        color={props.color ? props.color : 'grey'}
      />


      <TextField
        variant="outlined"
        label="name"
        style={{...props.classes.spaceAround, width: 240 }}
        value={nameValid(props.name) ? props.name : null}
        onChange={text => props.setName(text)}
      />


      <CirclePicker selectColor={props.selectColor} />

      <Grid style={props.classes.spaceBelow} item >

        <Button variant="contained" color="primary" onPress={() => props.submitProject()}>Submit</Button>

      </Grid>
    </View>
  )
}