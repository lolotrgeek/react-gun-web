import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns'; 
import { secondsToString } from '../../constants/Functions'

// import Grid from '../atoms/Grid'
import Grid from '@material-ui/core/Grid'

import { IconButton } from '../atoms/IconButton';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faGrin, faSmile, faMeh, faFrown, faDizzy } from "@fortawesome/free-solid-svg-icons";


export function PickerDate(props) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container direction="row" alignItems="flex-end" justify="center">
        <Grid item >
          <h3>{props.label}</h3>
        </Grid>
        <Grid item >
          <IconButton aria-label="previous day" onClick={props.previousDay}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={'sm'}
              color="grey"
            />
          </IconButton>
        </Grid>
        <Grid item>
          <DatePicker
            margin="normal"
            id="date-picker-dialog"
            format="MM/dd/yyyy"
            value={props.startdate}
            disableFuture={true}
            onChange={props.onDateChange}
            maxDate={props.maxDate}

          />
        </Grid>
        <Grid item >
          <IconButton aria-label="next day" onClick={props.nextDay}>
            <FontAwesomeIcon
              icon={faChevronRight}
              size={'sm'}
              color="grey"
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
        <Grid container direction="row" alignItems="flex-end" justify="center">
          <Grid item >
            <h3>{props.label}</h3>
          </Grid>
          <Grid item >
            <IconButton aria-label="subtract 5 minutes" onClick={props.subtractMinutes}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={'sm'}
                color="grey"
              />
            </IconButton>
          </Grid>
          <Grid item >
            {props.running ?
              <TimePicker
                inputValue='tracking'
                disabled='true'
                invalidDateMessage=''
                format="HH:mm:ss a"
                style={{ cursor: 'pointer' }}
              />
              :
              <TimePicker
                margin="normal"
                views={['hours', 'minutes', 'seconds']}
                opento='hours'
                value={props.time}
                onChange={props.onTimeChange}
                format="HH:mm:ss a"
                ampm={true}
                style={{ cursor: 'pointer' }}

              />
            }
          </Grid>

          <Grid item >
            <IconButton aria-label="add 5 minutes" onClick={props.addMinutes}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size={'sm'}
                color="grey"

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
        <Grid container direction="row" alignItems="flex-end" justify="center">
          <Grid item >
            <IconButton aria-label="subtract 5 minutes" onClick={props.subtractMinutes}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={'sm'}
                color="grey"
              />
            </IconButton>
          </Grid>
          <Grid item >
            <h3>{secondsToString(props.total)}</h3>
          </Grid>

          <Grid item >
            <IconButton aria-label="add 5 minutes" onClick={props.addMinutes}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size={'sm'}
                color="grey"
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
          size={'lg'}
          onClick={props.onGreat}
        />

        <FontAwesomeIcon
          icon={faSmile}
          size={'lg'}
          color="green"
          onClick={props.onGood}
        />

        <FontAwesomeIcon
          icon={faMeh}
          size={'lg'}
          color="purple"

          onClick={props.onMeh}
        />

        <FontAwesomeIcon
          icon={faFrown}
          size={'lg'}
          color="blue"
          onClick={props.onSad}
        />

        <FontAwesomeIcon
          icon={faDizzy}
          size={'lg'}
          color="grey"
          onClick={props.onAwful}
        />

      </Grid>
    </Grid>
  )
}