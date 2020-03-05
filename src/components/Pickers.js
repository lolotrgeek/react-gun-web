import React from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';

export function PickerDate(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <DatePicker
          margin="normal"
          id="date-picker-dialog"
          label={props.label ? props.label : "Date picker dialog"}
          format="MM/dd/yyyy"
          value={props.startdate}
          disableFuture={true}
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
export function PickerTime(props) {
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container direction="row" alignItems="flex-end" justify="center" spacing={1}>
          <Grid item >
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color="grey"
              onClick={props.subtractMinutes}
              style={{ marginBottom: 16, cursor: 'pointer' }}
            />
          </Grid>
          <Grid item >
            {props.running ?
              <TimePicker
                inputValue='tracking'
                disabled='true'
                invalidDateMessage=''
                format="HH:mm:ss"
              />
              :
              <TimePicker
                margin="normal"
                id="time-picker"
                views={['hours', 'minutes', 'seconds']}
                opento='hours'
                label={props.label ? props.label : "Time picker"}
                value={props.time}
                onChange={props.onTimeChange}
                format="HH:mm:ss"
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            }
          </Grid>

          <Grid item >
            <FontAwesomeIcon
              icon={faChevronRight}
              size={30}
              color="grey"
              onClick={props.addMinutes}
              style={{ marginBottom: 16, cursor: 'pointer' }}
            />
          </Grid>

        </Grid>

      </MuiPickersUtilsProvider>

    </div>

  );
} 