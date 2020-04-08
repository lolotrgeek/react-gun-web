import React from 'react'
import { projectValid, isRunning } from '../../constants/Validators'

import { SubHeader, Header } from '../atoms/Header'
import { RunningTimer } from '../organisms/RunningTimer'
import { UnEvenGrid } from '../atoms/Grid'
import { Title } from '../molecules/Title'
import { Button } from '../atoms/Button'
import Grid from '../atoms/Grid'
import {View} from 'react-native'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {Object} props.count
 */
export default function ProjectList(props) {
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
                title='Projects'
                buttonClick={props.headerButtonAction}
                buttonText='New Project'
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
            <Grid container direction='column' justify="flex-start" alignItems="center" >
                {props.projects.map(project => {
                    return (
                        <Grid key={project[0]} container style={props.classes.listClass} direction='row' justify="space-around" alignItems="flex-start" >
                            <Grid item>
                                <Title to={props.projectlink(project[0])} color={project[1].color} variant='h6'>
                                    {projectValid(project) ? project[1].name : null}
                                </Title>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onPress={() => {
                                    if (isRunning(props.runningTimer)) { props.finishTimer(props.runningTimer); props.stop() };
                                    props.startTimer(project)
                                }}>Start</Button>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>

        </View >
    )
}