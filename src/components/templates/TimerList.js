import React from 'react'
import { UnEvenGrid } from '../atoms/Grid'
import Grid from '../atoms/Grid'
import { SubHeader } from '../atoms/Header'
import Stateless from '../molecules/Stateless'
import { Link } from '../atoms/Link'
import { secondsToString, totalTime} from '../../constants/Functions'
import EnergyDisplay  from '../molecules/EnergyDisplay'
import MoodDisplay from '../molecules/MoodDisplay'
import { TimePeriod } from '../molecules/TimePeriod'

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
                    <Grid key={timer.id} className={props.classes.listClass} >
                        <Link key={timer.id} to={props.timerlink(timer.project, timer.id)}>
                            <UnEvenGrid
                                values={[
                                    // simpleDate(creation),
                                    // timeString(new Date(timer.started)) ,'-', timeString(new Date(timer.ended)),
                                    <TimePeriod start={new Date(timer.started)} end={new Date(timer.ended)} />,
                                    <EnergyDisplay energy={timer.energy} />,
                                    <MoodDisplay mood={timer.mood} />,
                                    secondsToString(totalTime(new Date(timer.started), new Date(timer.ended))),
                                ]} />
                        </Link>
                    </Grid>

                )
            })}
        </Grid >
    )
}
