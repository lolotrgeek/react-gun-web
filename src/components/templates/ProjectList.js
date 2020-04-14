import React from 'react'
import { projectValid, isRunning } from '../../constants/Validators'

import { SubHeader, Header } from '../atoms/Header'
import { RunningTimer } from '../organisms/RunningTimer'
import { UnEvenGrid } from '../atoms/Grid'
import { Title } from '../molecules/Title'
import { Button } from '../atoms/Button'
import Grid from '../atoms/Grid'
import { View, ScrollView } from 'react-native'
import Typography from '../atoms/Typography'
import { useStyles, theme } from '../../themes/DefaultTheme'


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
            flexGrow: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
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
            <ScrollView>
                {props.projects.map(project => {
                    return (
                        <View
                            key={project[0]}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: theme.spacing(2),

                            }} >
                            <View style={{ width: 100 }}>
                                <Title to={props.projectlink(project[0])} color={project[1].color} variant='h6'>
                                    {projectValid(project) ? project[1].name : ''}
                                </Title>
                            </View>

                            <View style={{ marginLeft: 150, }}>
                                <Button variant="contained" color="primary" onPress={() => {
                                    if (isRunning(props.runningTimer)) { props.finishTimer(props.runningTimer); props.stop() };
                                    props.startTimer(project)
                                }}>Start</Button>
                            </View>


                        </View>
                    )
                })}
            </ScrollView>

        </View >
    )
}