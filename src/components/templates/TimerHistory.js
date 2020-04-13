import React from 'react'
import { nameValid, isTimer } from '../../constants/Validators'
import { secondsToString, totalTime, } from '../../constants/Functions'

import EnergyDisplay from '../molecules/EnergyDisplay'
import MoodDisplay from '../molecules/MoodDisplay'
import Stateless from '../molecules/Stateless'
import { SubHeader } from '../atoms/Header'
import Popup from '../atoms/Popup'
import Grid from '../atoms/Grid'
import { Button } from '../atoms/Button'

import { Card, CardContent, CardActions } from '../atoms/Card';
import Typography from '../atoms/Typography'
import { TimePeriod } from '../molecules/TimePeriod'
import { View } from 'react-native'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {Array} props.project
 * @param {Array} props.timer
 * @param {Array} props.edits
 * @param {boolean} props.displayRestoreButton
 * @param {function} props.displayStatusDate 
 * @param {function} props.displayStatus
 * @param {function} props.restoreButtonAction
 * @param {function} props.popupAccept
 * @param {function} props.popupReject
 */
export default function TimerHistory(props) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            ...props.classes.listRoot
        }}>
            {props.project && props.project[1] ?
                <SubHeader
                    color={props.project[1].color}
                    title={nameValid(props.project[1].name) ? props.project[1].name : null}
                />
                : <Stateless />}

            <Typography className={props.classes.spaceBelow} variant='h4'>
                {props.timer[1] && nameValid(props.timer[1].name) && isTimer(props.timer) ? props.timer[1].name : 'Timer History '}
            </Typography>
            <View style={{ flex: 1, }}>
                {props.edits.map((edit) => {
                    console.log(edit[1])
                    let started = new Date(edit[1].started)
                    let ended = new Date(edit[1].ended)
                    return (
                        <View style={{
                            flex: 1,
                            ...props.classes.space,
                            ...props.classes.card
                        }}>
                            <Card key={edit[2]}  >
                                <Popup content='Confirm Restore?' onAccept={() => props.popupAccept()} onReject={() => props.popupReject()} />
                                <CardContent>
                                    <Typography variant='h6'>{props.displayStatusDate(edit)}</Typography>
                                    <Typography variant='subtitle1'>{props.displayStatus(edit)}</Typography>
                                    <View style={{
                                        justifyContent: 'space-evenly',
                                        alignItems: 'flex-start',
                                        flexDirection: 'row',
                                    }}>
                                        <TimePeriod start={started} end={ended} />
                                        <EnergyDisplay energy={edit[1].energy} />
                                        <MoodDisplay mood={edit[1].mood} />
                                        <Typography>{secondsToString(totalTime(started, ended))}</Typography>
                                    </View>
                                </CardContent>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <CardActions>

                                        {props.displayRestoreButton(edit) ?
                                            <Button variant='contained' color='primary' size="small" onPress={() => props.restoreButtonAction(edit)}> Restore </Button>
                                            : null}

                                    </CardActions>
                                </View>
                            </Card>
                        </View>
                    )
                })}
            </View>

        </View >
    )
}
