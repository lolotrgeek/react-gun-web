import React from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faGrin, faSmile, faMeh, faFrown, faDizzy  } from "@fortawesome/free-solid-svg-icons";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';
import { secondsToString } from '../constants/Functions'

export function PickerDate(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container direction="row" alignItems="flex-end" justify="center" spacing={1}>
        <Grid item >
          <IconButton aria-label="previous day">
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={20}
              color="grey"
              onClick={props.previousDay}
            />
          </IconButton>
        </Grid>
        <Grid item>
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
        <Grid item >
          <IconButton aria-label="next day">
            <FontAwesomeIcon
              icon={faChevronRight}
              size={20}
              color="grey"
              onClick={props.nextDay}
            />
          </IconButton>
        </Grid>
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
            <IconButton aria-label="subtract 5 minutes">
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color="grey"
                onClick={props.subtractMinutes}
              />
            </IconButton>
          </Grid>
          <Grid item >
            {props.running ?
              <TimePicker
                inputValue='tracking'
                disabled='true'
                invalidDateMessage=''
                format="HH:mm:ss"
                style={{ cursor: 'pointer' }}
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
                ampm={true}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
                style={{ cursor: 'pointer' }}

              />
            }
          </Grid>

          <Grid item >
            <IconButton aria-label="add 5 minutes">
              <FontAwesomeIcon
                icon={faChevronRight}
                size={20}
                color="grey"
                onClick={props.addMinutes}
              />
            </IconButton>
          </Grid>
        </Grid>

      </MuiPickersUtilsProvider>

    </div>

  );
}

export function PickerSeconds(props) {
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container direction="row" alignItems="flex-end" justify="center" spacing={1}>
          <Grid item >
            <IconButton aria-label="subtract 5 minutes">
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color="grey"
                onClick={props.subtractMinutes}
              />
            </IconButton>
          </Grid>
          <Grid item >
            <h3>{secondsToString(props.total)}</h3>
          </Grid>

          <Grid item >
            <IconButton aria-label="add 5 minutes">
              <FontAwesomeIcon
                icon={faChevronRight}
                size={20}
                color="grey"
                onClick={props.addMinutes}
              />
            </IconButton>
          </Grid>
        </Grid>

      </MuiPickersUtilsProvider>

    </div>
  );
}

export function PickerMood(props) {
  return (
      <Grid container direction="row" justify="center" alignItems="flex-start" >
          <Grid>

              <FontAwesomeIcon
                  icon={faGrin}
                  color="orange"
                  size={40}
                  onClick={props.onGreat}
              />

              <FontAwesomeIcon
                  icon={faSmile}
                  size={40}
                  color="green"
                  onClick={props.onGood}
              />

              <FontAwesomeIcon
                  icon={faMeh}
                  size={40}
                  color="purple"
          
                  onClick={props.onMeh}
              />

              <FontAwesomeIcon
                  icon={faFrown}
                  size={40}
                  color="blue"
                  onClick={props.onSad}
              />

              <FontAwesomeIcon
                  icon={faDizzy}
                  size={40}
                  color="grey"
                  onClick={props.onAwful}
              />

          </Grid>
      </Grid>
  )
}