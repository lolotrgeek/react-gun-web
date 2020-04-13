import React, { useState } from 'react';
import { secondsToString, simpleDate, chooseNewDate, timeString } from '../../constants/Functions'

import { Text, TouchableOpacity } from 'react-native';
import Grid from '../atoms/Grid'

import { IconButton } from '../atoms/IconButton';
// import { TimePicker, DatePicker } from '../molecules/DatePickers.native';
import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/FontAwesome5'
import { View } from 'react-native'

const debug = false

export function PickerDate(props) {
  const [show, setShow] = useState(false);

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexDirection: 'row'
    }} >
      <Grid item >
        <Text>{props.label}</Text>
      </Grid>
      <Grid item >
        <TouchableOpacity accessibilityLabel="previous day" onPress={() => props.previousDay()}>
          <Icon
            name='chevron-left'
            size={20}
            color="grey"
          />
        </TouchableOpacity>
      </Grid>
      <Grid item>
        <TouchableOpacity onPress={() => setShow(true)} >
          <Text>{simpleDate(props.startdate)}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            mode='date'
            value={props.startdate}
            onChange={(event, newDate) => { setShow(false) ; props.onDateChange(newDate);  }}
            maximumDate={props.maxDate}
          />)}
      </Grid>
      <Grid item >
        <TouchableOpacity accessibilityLabel="next day" onPress={() => props.nextDay()}>
          <Icon
            name='chevron-right'
            size={20}
            color="grey"
          />
        </TouchableOpacity>
      </Grid>
    </View>
  );
}
export function PickerTime(props) {
  const [show, setShow] = useState(false);
  debug && console.log(props.show)
  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'flex-end',
      flexDirection: 'row'
    }} >
      <Grid item >
        <Text>{props.label}</Text>
      </Grid>
      <Grid item >
        <TouchableOpacity accessibilityLabel="subtract 5 minutes" onPress={props.subtractMinutes}>
          <Icon
            name='chevron-left'
            size={20}
            color="grey"
          />
        </TouchableOpacity>
      </Grid>
      <Grid item >
        {props.running ?
          <Text>Tracking...</Text> :
          <TouchableOpacity onPress={() => setShow(true)} >
            <Text>{timeString(props.time)}</Text>
          </TouchableOpacity>
        }

        {show && (
          <DateTimePicker
            mode='time'
            value={props.time}
            onChange={(event, newTime) => { setShow(false); props.onTimeChange(newTime);  }}
          />)}
      </Grid>

      <Grid item >
        <TouchableOpacity accessibilityLabel="add 5 minutes" onPress={props.addMinutes}>
          <Icon
            name='chevron-right'
            size={20}
            color="grey"
          />
        </TouchableOpacity>
      </Grid>
    </View>


  );
}