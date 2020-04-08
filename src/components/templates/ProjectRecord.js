import React from 'react'
import { dayHeaders, sayDay, totalTime, secondsToString } from '../../constants/Functions'
import { isRunning, isTimer } from '../../constants/Validators'

import Stateless from '../molecules/Stateless'
import SideMenu from '../molecules/SideMenu'
import Popup from '../atoms/Popup'
import { SubTitle } from '../molecules/Title'
import { Link } from '../atoms/Link'
import { SubHeader } from '../atoms/Header'
import { UnEvenGrid } from '../atoms/Grid'
import Grid from '../atoms/Grid'
import EnergyDisplay from '../molecules/EnergyDisplay'
import MoodDisplay from '../molecules/MoodDisplay'
import { RunningTimer } from '../organisms/RunningTimer'
import { TimePeriod } from '../molecules/TimePeriod'
import Typography from '../atoms/Typography'
import { View } from 'react-native'


/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {function} props.popupAccept
 * @param {function} props.popupReject

 */
export default function ProjectRecord(props) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            ...props.classes.listRoot
        }}>
            <Popup content='Confirm Delete?' onAccept={() => props.popupAccept()} onReject={() => props.popupReject()} />
            {props.project && props.project[1] ?
                <SubHeader
                    color={props.project[1].color}
                    title={props.project[1].name}
                    buttonText='Start Timer'
                    buttonClick={() => {
                        if (isRunning(props.runningTimer)) { props.stop(); props.finishTimer(props.runningTimer) }
                        props.startTimer(props.project)
                    }}
                /> : <Stateless />
            }
            <SideMenu
                options={props.sideMenuOptions}
            />
            {isRunning(props.runningTimer) ?
                <RunningTimer
                    className={props.classes.space}
                    name={props.runningProject[1] ? props.runningProject[1].name : null}
                    color={props.runningProject[1] ? props.runningProject[1].color : null}
                    count={props.count}
                    stop={() => { props.finishTimer(props.runningTimer); props.stop() }}
                />
                : null}

            {dayHeaders(props.timers.sort((a, b) => new Date(b[1].started) - new Date(a[1].started))).map((day, index) => {
                return (
                    <View key={index} style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }} >
                        <SubTitle>{sayDay(day.title)}</SubTitle>
                        {/* {console.log(day.data)} */}
                        {day.data.map(timer => {
                            if (!isTimer(timer)) return (null)
                            if (timer[1].status === 'running') return (null)
                            let ended = new Date(timer[1].ended)
                            let started = new Date(timer[1].started)
                            return (

                                <Link key={timer[0]} to={props.timerlink(props.project[0], timer[0])}>
                                    <UnEvenGrid
                                        values={[
                                            <TimePeriod start={started} end={ended} />,
                                            <EnergyDisplay energy={timer[1].energy} />,
                                            <MoodDisplay mood={timer[1].mood} />,
                                            <Typography>{secondsToString(totalTime(started, ended))}</Typography>
                                        ]}
                                    />

                                </Link>

                            )
                        })}
                    </View >
                )
            })}
        </View >
    )
}