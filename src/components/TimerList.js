import React from 'react'
import { UnEvenGrid } from './Grid'
import { Grid } from '@material-ui/core/'
import { SubHeader } from './Header'
import Stateless from './Stateless'
import { Link } from './Link'
import { secondsToString, totalTime } from '../constants/Functions'
import { MoodDisplay, EnergyDisplay, TimePeriod } from './TimerDisplay'

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
