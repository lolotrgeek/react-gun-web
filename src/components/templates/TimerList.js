import React from 'react'
import { UnEvenGrid } from '../atoms/Grid'
import Grid from '../atoms/Grid'
import { SubHeader } from '../atoms/Header'
import Stateless from '../molecules/Stateless'
import { Link } from '../atoms/Link'
import { secondsToString, totalTime } from '../../constants/Functions'
import { MoodDisplay, EnergyDisplay, TimePeriod } from '../molecules/TimerDisplay'

/**
 * 
 * @param {*} props
 * @param {*} props.classes
 * @param {*} props.timers
 * @param {*} props.timerlink
 */
export default function TimerList(props) {
    return (
        <Grid className={props.classes.listRoot}>
            {props.timers && props.timers.length > 0 ?
                <SubHeader className={props.classes.space} title='All timers' /> :
                <Stateless />
            }
            {props.timers.map(timer => {
                return (
                    <Grid key={timer[0]} className={props.classes.listClass} >
                        <Link key={timer[0]} to={props.timerlink(timer[1].project, timer[0])}>
                            <UnEvenGrid
                                values={[
                                    // simpleDate(creation),
                                    // timeString(new Date(timer[1].started)) ,'-', timeString(new Date(timer[1].ended)),
                                    <TimePeriod start={new Date(timer[1].started)} end={new Date(timer[1].ended)} />,
                                    <EnergyDisplay energy={timer[1].energy} />,
                                    <MoodDisplay mood={timer[1].mood} />,
                                    secondsToString(totalTime(new Date(timer[1].started), new Date(timer[1].ended))),
                                ]} />
                        </Link>
                    </Grid>

                )
            })}
        </Grid >
    )
}
