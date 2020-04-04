import React, { useState } from 'react';
import { secondsToString, simpleDate, chooseNewDate, timeString } from '../../constants/Functions'

import { Text, TouchableOpacity } from 'react-native';
import Grid from '../atoms/Grid'

import { IconButton } from '../atoms/IconButton';
// import { TimePicker, DatePicker } from '../molecules/DatePickers.native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";


export function PickerDate(props) {
  const [show, setShow] = useState(false);

  return (
    <Grid container direction="row" alignItems="flex-end" justify="center">
      <Grid item >
        <Text>{props.label}</Text>
      </Grid>
      <Grid item >
        <TouchableOpacity accessibilityLabel="previous day" onPress={() => props.previousDay()}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={'sm'}
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
            onChange={(event, newDate) => {props.onDateChange(newDate); setShow(false)}}
            maximumDate={props.maxDate}
          />)}
      </Grid>
      <Grid item >
        <TouchableOpacity accessibilityLabel="next day" onPress={() => props.nextDay()}>
          <FontAwesomeIcon
            icon={faChevronRight}
            size={'sm'}
            color="grey"
          />
        </TouchableOpacity>
      </Grid>
    </Grid>
  );
}
export function PickerTime(props) {
  const [show, setShow] = useState(false);
  console.log(props.show)
  return (
    <Grid container direction="row" alignItems="flex-end" justify="center">
      <Grid item >
        <Text>{props.label}</Text>
      </Grid>
      <Grid item >
        <TouchableOpacity accessibilityLabel="subtract 5 minutes" onPress={props.subtractMinutes}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={'sm'}
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
            onChange={(event, newTime) =>{ props.onTimeChange(newTime); setShow(false)}}
          />)}
      </Grid>

      <Grid item >
        <TouchableOpacity accessibilityLabel="add 5 minutes" onPress={props.addMinutes}>
          <FontAwesomeIcon
            icon={faChevronRight}
            size={'sm'}
            color="grey"

          />
        </TouchableOpacity>
      </Grid>
    </Grid>


  );
}