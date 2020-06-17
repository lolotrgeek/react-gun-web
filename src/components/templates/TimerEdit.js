import React from 'react'
import { isRunning, isTimer, projectValid } from '../../constants/Validators'
import { secondsToString } from '../../constants/Functions'
import { endOfDay } from 'date-fns' // TODO move to functions

import Stateless from '../molecules/Stateless'
import SideMenu from '../molecules/SideMenu'
import Popup from '../atoms/Popup'
import { SubHeader } from '../atoms/Header'
import { Title, } from '../molecules/Title'
import { MoodPicker } from '../molecules/MoodPicker'
import { PickerDate, PickerTime } from '../organisms/Pickers'
import { EnergySlider } from '../molecules/EnergySlider'
import Grid from '../atoms/Grid'
import { Button } from '../atoms/Button'
import { View } from 'react-native'

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
export default function TimerEdit(props) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            ...props.classes.listRoot
        }}>
            <SideMenu options={props.sideMenuOptions} />
            <Popup content='Confirm Delete?' onAccept={() => props.popupAccept()} onReject={() => props.popupReject()} />

            {projectValid(props.project) && isTimer(props.timer) ?
                <SubHeader
                    title={projectValid(props.project) ? `${props.project.name}` : 'No Timer Here'}
                    color={projectValid(props.project) ? props.project.color : null} />

                : <Stateless />
            }

            {props.timer && isTimer(props.timer) ?

                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'column'
                }} >

                    <Title variant='h5'>{secondsToString(props.total)}</Title>

                    <PickerDate
                        label='Date'
                        startdate={props.started}
                        onDateChange={props.chooseNewDate}
                        maxDate={endOfDay(new Date())}
                        previousDay={props.previousDay}
                        nextDay={props.nextDay}
                    />
                    {/* {started.toString()} */}
                    <PickerTime
                        label='Start'
                        time={props.started}
                        onTimeChange={props.chooseNewStart}
                        addMinutes={props.increaseStarted}
                        subtractMinutes={props.decreaseStarted}
                    />
                    {/* {ended.toString()} */}
                    <PickerTime
                        label='End'
                        time={props.ended}
                        onTimeChange={props.chooseNewEnd}
                        addMinutes={props.increaseEnded}
                        running={isRunning(props.timer)}
                        subtractMinutes={props.decreaseEnded}
                    />

                    {
                        props.timer ?
                            <EnergySlider
                                setEnergy={props.setEnergy}
                                startingEnergy={props.energy}
                            /> : null
                    }
                    <MoodPicker
                        onGreat={() => props.setMood('great')}
                        onGood={() => props.setMood('good')}
                        onMeh={() => props.setMood('meh')}
                        onBad={() => props.setMood('bad')}
                        onAwful={() => props.setMood('awful')}
                        selected={props.mood}
                    />

                    <Button style={props.classes.spaceAbove} variant="contained" color="primary" onPress={() => props.saveButtonAction()}>Save</Button>

                </View >
                :
                <Grid container direction='column' justify='center' alignItems='center'>
                    <Button variant="contained" color="primary" onPress={() => props.noTimersAction()}> Projects </Button>
                </Grid>

            }
        </View>
    )
}
