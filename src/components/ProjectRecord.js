import React from 'react'
import Stateless from './Stateless'
import SideMenu from './SideMenu'
import Popup from './Popup'
import { SubTitle } from './Title'
import { Link } from './Link'
import { SubHeader } from './Header'
import { UnEvenGrid } from './Grid'
import Grid from '@material-ui/core/Grid'
import { MoodDisplay, EnergyDisplay, TimePeriod } from './TimerDisplay'
import { RunningTimer } from './RunningTimer'
import { dayHeaders, sayDay, totalTime, secondsToString } from '../constants/Functions'
import { isRunning, isTimer } from '../constants/Validators'


/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {function} props.popupAccept
 * @param {function} props.popupReject

 */
export default function ProjectRecord(props) {
    return (
        <Grid>
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
                    name={props.runningProject[1] ? props.runningProject[1].name : ''}
                    color={props.runningProject[1] ? props.runningProject[1].color : ''}
                    count={props.count}
                    stop={() => { props.finishTimer(props.runningTimer); props.stop() }}
                />
                : ''}
            {/* <SpacingGrid headers={['Started', 'Ended', 'Energy', 'Mood']} /> */}
            {dayHeaders(props.timers.sort((a, b) => new Date(b[1].started) - new Date(a[1].started))).map((day, index) => {
                return (
                    <Grid key={index} className={props.classes.listClass} >
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
                                            // simpleDate(creation),
                                            // timeString(new Date(timer[1].started)) ,'-', timeString(new Date(timer[1].ended)),
                                            <TimePeriod start={started} end={ended} />,
                                            <EnergyDisplay energy={timer[1].energy} />,
                                            <MoodDisplay mood={timer[1].mood} />,
                                            secondsToString(totalTime(started, ended)),
                                        ]} />
                                </Link>
                            )
                        })}
                    </Grid>
                )
            })}
        </Grid >
    )
}