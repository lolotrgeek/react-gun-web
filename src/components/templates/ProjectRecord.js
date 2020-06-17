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
import { View, SectionList } from 'react-native'

const debug = false

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
            {props.project && props.project ?
                <SubHeader
                    color={props.project.color}
                    title={props.project.name}
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
                : null}
            <SectionList style={{ width: '100%' }}
                sections={dayHeaders(props.timers.sort((a, b) => new Date(b[1].started) - new Date(a[1].started)))}
                keyExtractor={(item, index) => item + index}
                renderSectionHeader={({ section: { title } }) => {
                    return (<SubTitle >{sayDay(title)}</SubTitle>)
                }}
                renderItem={({ item }) => {
                    debug && console.log(item)
                    let timer = item
                    if (!isTimer(timer)) return (null)
                    // if (timer.status === 'running') return (null)
                    let ended = new Date(timer.ended)
                    let started = new Date(timer.started)
                    return (
                        <Link key={timer.id} to={props.timerlink(props.project.id, timer.id)} >
                            <UnEvenGrid
                                values={[
                                    <TimePeriod start={started} end={ended} />,
                                    <EnergyDisplay energy={timer.energy} />,
                                    <MoodDisplay mood={timer.mood} />,
                                    <Typography>{secondsToString(totalTime(started, ended))}</Typography>
                                ]}
                            />
                        </Link>
                    )
                }}
            />
        </View >
    )
}