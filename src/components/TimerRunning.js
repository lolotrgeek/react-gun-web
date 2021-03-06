import React from 'react'
import { Title } from '../components/Title'
import { Button } from '../components/Button'
import { SubHeader } from '../components/Header'
import Popup from '../components/Popup'
import Stateless from '../components/Stateless'
import { EnergySlider } from '../components/EnergySlider'
import { MoodPicker } from '../components/MoodPicker'
import { Grid } from '@material-ui/core/'
import { isTimer, projectValid, isRunning } from '../constants/Validators'
import { secondsToString } from '../constants/Functions'

/**
 * 
 * @param {*} props
 * @param {*} props.classes
 * @param {Array} props.runningTimer
 * @param {Array} props.runningProject
 * @param {*} props.count
 * @param {string} props.mood
 * @param {*} props.setMood
 * @param {function} props.noTimerAction
 * @param {function} props.popupAccept
 * @param {function} props.popupReject
 */
export default function TimerRunning(props) {
    return (
        <Grid >
            <Popup content='Confirm Delete?' onAccept={() => props.popupAccept()} onReject={() => props.popupReject()} />
            {projectValid(props.runningProject) && isTimer(props.runningTimer) ?
                <SubHeader
                    title={projectValid(props.runningProject) ? `${props.runningProject[1].name}` : 'Timer'}
                    color={projectValid(props.runningProject) ? props.runningProject[1].color : ''}
                />
                : <Stateless />
            }
            {!props.runningTimer[1] ?
                <Grid container className={props.classes.space} direction='column' justify='center' alignItems='center'>
                    <Button variant="contained" color="primary" onClick={() => props.noTimerAction()} > Project List </Button>
                </Grid>
                : ''}
            {props.runningTimer && props.runningTimer[1] ?
                <Grid container direction='column' justify='center' alignItems='center'>
                    <Grid item xs={12}> <Title variant='h2'>{secondsToString(props.count)}</Title> </Grid>

                    <Grid item xs={12}>
                        <MoodPicker
                            onGreat={() => props.setMood('great')}
                            onGood={() => props.setMood('good')}
                            onMeh={() => props.setMood('meh')}
                            onBad={() => props.setMood('bad')}
                            onAwful={() => props.setMood('awful')}
                            selected={props.mood}
                        />
                        <EnergySlider
                            startingEnergy={props.energy}
                            onEnergySet={(event, value) => props.setEnergy(value)}
                        />
                    </Grid >
                    <Grid item className={props.classes.space} xs={12}>
                        <Button variant="contained" color="primary" onClick={() => {
                            if (isRunning(props.runningTimer)) {
                                props.timerCompleteAction()
                            };
                        }}>Done</Button>
                    </Grid>
                </Grid >
                : ''}
        </Grid >
    )
}
