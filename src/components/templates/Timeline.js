import React from 'react'
import { isRunning, projectValid } from '../../constants/Validators'
import { dayHeaders, sayDay, secondsToString, sumProjectTimers } from '../../constants/Functions'

import { Button } from '../atoms/Button'

import Grid from '../atoms/Grid'
import { SubHeader, Header } from '../atoms/Header'
import { Title, SubTitle } from '../molecules/Title'
import { Link } from '../atoms/Link'
import { UnEvenGrid } from '../atoms/Grid'
import { RunningTimer } from '../organisms/RunningTimer'
import { View } from 'react-native'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {function} props.headerButtonAction
 * @param {Array} props.projects
 * @param {Array} props.timers
 * @param {Array} props.runningProject
 * @param {Array} props.runningTimer
 * @param {Array} props.runningTimer
 * @param {function} props.finishTimer
 * @param {number} props.count
 * @param {number} props.stop
 * @param {function} props.projectlink
 * @param {function} props.createTimer
 * @param {function} props.countButtonAction
 * 
 */
export default function Timeline(props) {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            ...props.classes.listRoot
        }}>
            <Header
                className={props.classes.space}
                title='Timeline'
                buttonClick={props.headerButtonAction}
                buttonText={props.projects && props.projects.length > 0 ? 'Projects' : 'New Project'}
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


            {sumProjectTimers(dayHeaders(props.timers.sort((a, b) => new Date(b[1].started) - new Date(a[1].started)))).map((day, index) => {
                return (
                    <View key={index}>
                        <SubTitle>{sayDay(day.title)}</SubTitle>
                        {day.data.map(item => props.projects.map(project => {
                            if (item.status === 'running') return (null)
                            if (project[0] === item.project) {
                                return (
                                    <UnEvenGrid key={project[0]} values={[
                                        <Title to={props.projectlink(item.project)} variant='h6' color={project[1].color} >{projectValid(project) ? project[1].name : null}</Title>,
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onPress={() => {
                                                if (isRunning(props.runningTimer)) { props.finishTimer(props.runningTimer); props.stop() };
                                                props.startTimer(item.project)
                                            }}>
                                            {secondsToString(item.total)}
                                        </Button>
                                    ]} />
                                )
                            }
                            else return (null)
                        })
                        )}
                    </View>
                )
            })}

        </View >
    )
}