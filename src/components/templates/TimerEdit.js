import React from 'react'
import Stateless from '../molecules/Stateless'
import SideMenu from '../molecules/SideMenu'
import Popup from '../atoms/Popup'
import { SubHeader } from '../atoms/Header'
import { Title, } from '../atoms/Title'
import { MoodPicker } from '../molecules/MoodPicker'
import { PickerDate, PickerTime } from '../organisms/Pickers'
import { EnergySlider } from '../molecules/EnergySlider'
import { Button } from '@material-ui/core/'
import Grid from '../atoms/Grid'
import { secondsToString } from '../../constants/Functions'
import { endOfDay } from 'date-fns'
import { isRunning, isTimer, projectValid } from '../../constants/Validators'
// import { Button } from './Button'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {*} props.started
 * @param {*} props.total
 * @param {Array} props.sideMenuOptions
 * @param {function} props.popupAccept
 * @param {function} props.popupReject
 * @param {function} props.onDateChange
 */
export default function Name(props) {
    return (
        <Grid className={props.classes.listRoot}>
            <Popup content='Confirm Restore?' onAccept={() => props.popupAccept()} onReject={() => props.popupReject()} />
            {projectValid(props.project) && isTimer(props.timer) ?
                <SubHeader
                    title={projectValid(props.project) ? `${props.project[1].name}` : 'No Timer Here'}
                    color={projectValid(props.project) ? props.project[1].color : ''} />
                : <Stateless />
            }

            {props.timer && isTimer(props.timer) ?
                <SideMenu options={props.sideMenuOptions} />
                : ' '}
            {props.timer && isTimer(props.timer) ?
                <Grid container direction='column' justify='flex-start' alignItems='center'>
                    <Grid item xs={12}> <Title variant='h5'>{secondsToString(props.total)}</Title> </Grid>

                    <Grid item xs={12}>
                        <PickerDate
                            label='Date'
                            startdate={props.started}
                            onDateChange={newDate => props.chooseNewDate(newDate)}
                            maxDate={endOfDay(new Date())}
                            previousDay={() => props.previousDay()}
                            nextDay={() => props.nextDay()}
                        />
                        {/* {started.toString()} */}
                        <PickerTime
                            label='Start'
                            time={props.started}
                            onTimeChange={newTime => props.chooseNewStart(newTime)}
                            addMinutes={() => props.increaseStarted()}
                            subtractMinutes={() => props.decreaseStarted()}
                        />
                        {/* {ended.toString()} */}
                        <PickerTime
                            label='End'
                            time={props.ended}
                            onTimeChange={newTime => props.chooseNewEnd(newTime)}
                            addMinutes={() => props.increaseEnded()}
                            running={isRunning(props.timer)}
                            subtractMinutes={() => props.decreaseEnded()}
                        />

                        {
                            props.timer[1] ?
                                <EnergySlider
                                    startingEnergy={props.energy}
                                    onEnergySet={(event, value) => props.setEnergy(value)}
                                /> : ''
                        }
                        <MoodPicker
                            onGreat={() => props.setMood('great')}
                            onGood={() => props.setMood('good')}
                            onMeh={() => props.setMood('meh')}
                            onBad={() => props.setMood('bad')}
                            onAwful={() => props.setMood('awful')}
                            selected={props.mood}
                        />
                    </Grid >
                    <Grid item className={props.classes.space2} xs={12}>
                        <Button variant="contained" color="primary" onClick={() => props.saveButtonAction()}>Save</Button>
                    </Grid>
                </Grid >
                :
                <Grid container direction='column' justify='center' alignItems='center'>
                    <Button variant="contained" color="primary" onClick={() => props.noTimersAction()}> Projects </Button>
                </Grid>
            }
        </Grid >
    )
}
