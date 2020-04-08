import React from 'react'
import { Title } from '../molecules/Title'
import { Button } from '../atoms/Button'
import { SubHeader } from '../atoms/Header'
import Popup from '../atoms/Popup'
import Stateless from '../molecules/Stateless'
import { EnergySlider } from '../molecules/EnergySlider'
import { MoodPicker } from '../molecules/MoodPicker'
import Grid from '../atoms/Grid'
import { isTimer, projectValid, isRunning } from '../../constants/Validators'
import { secondsToString } from '../../constants/Functions'
import {View } from 'react-native'

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
    const [width, setWidth] = React.useState(340)
    return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            ...props.classes.listRoot
        }}>
            <Popup content='Confirm Delete?' onAccept={() => props.popupAccept()} onReject={() => props.popupReject()} />
            {projectValid(props.runningProject) && isTimer(props.runningTimer) ?
                <SubHeader
                    title={projectValid(props.runningProject) ? `${props.runningProject[1].name}` : 'Timer'}
                    color={projectValid(props.runningProject) ? props.runningProject[1].color : null}
                />
                : <Stateless />
            }
            {!props.runningTimer[1] ?
                <Grid container className={props.classes.space} direction='column' justify='center' alignItems='center'>
                    <Button variant="contained" color="primary" onPress={() => props.noTimerAction()} > Project List </Button>
                </Grid>
                : null}
            {props.runningTimer && props.runningTimer[1] ?
                <Grid container direction='column' justify='flex-start' alignItems='center'>
                    <Grid item>
                        <Title variant='h2'>{secondsToString(props.count)}</Title>
                    </Grid>

                    <Grid item>
                        <MoodPicker
                            onGreat={() => props.setMood('great')}
                            onGood={() => props.setMood('good')}
                            onMeh={() => props.setMood('meh')}
                            onBad={() => props.setMood('bad')}
                            onAwful={() => props.setMood('awful')}
                            selected={props.mood}
                        />
                        <View onLayout={event => setWidth(event.nativeEvent.layout.width)}>
                            <EnergySlider
                                width={width}
                                startingEnergy={props.energy}
                                onEnergySet={(event, value) => props.setEnergy(value)}
                            />
                        </View>

                    </Grid >

                    <Button variant="contained" color="primary" onPress={() => {
                        if (isRunning(props.runningTimer)) {
                            props.timerCompleteAction()
                        };
                    }}>Done</Button>

                </Grid >
                : null}
        </View >
    )
}
