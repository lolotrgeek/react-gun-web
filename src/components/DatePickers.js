import React from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

export function DatePicker(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label={props.label ? props.label : "Date picker dialog"}
          format="MM/dd/yyyy"
          value={props.startdate}
          onChange={props.onDateChange}
          maxDate={props.maxDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
export function TimePicker(props) {
  return (
    <div>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>

        <FontAwesomeIcon
          icon={faChevronLeft}
          size={20}
          color="grey"
          onClick={props.subtractMinutes}
        />
        <Grid container justify="space-around">
          {props.running ?
            <KeyboardTimePicker
              inputValue='tracking'
              disabled='true'
              invalidDateMessage=''
            /> :
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              views={['hours', 'minutes', 'seconds']}
              opento='hours'
              label={props.label ? props.label : "Time picker"}
              value={props.time}
              onChange={props.onTimeChange}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />}
        </Grid>
        <FontAwesomeIcon
          icon={faChevronRight}
          size={20}
          color="grey"
          onClick={props.addMinutes}
        />
      </MuiPickersUtilsProvider>

    </div>

  );
} 