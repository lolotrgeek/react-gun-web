import React from 'react'
import { projectValid, isRunning } from '../../constants/Validators'

import { SubHeader } from '../atoms/Header'
import { RunningTimer } from '../organisms/RunningTimer'
import { UnEvenGrid } from '../atoms/Grid'
import { Title } from '../molecules/Title'
import { Link } from '../atoms/Link'
import { Button } from '../atoms/Button'
import Grid from '../atoms/Grid'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {Object} props.count
 */
export default function ProjectList(props) {
    return (
        <Grid className={props.classes.listRoot}>
            <SubHeader
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

            <Grid container className={props.classes.space}>
                {props.projects.map(project => {
                    return (
                        <UnEvenGrid
                            style={props.classes.listClass}
                            key={project[0]}
                            values={[
                                <Link to={props.projectlink(project[0])} >
                                    <Title color={project[1].color} variant='h6'>
                                        {projectValid(project) ? project[1].name : null}
                                    </Title>
                                </Link>,
                                <Button variant="contained" color="primary" onClick={() => {
                                    if (isRunning(props.runningTimer)) { props.finishTimer(props.runningTimer); props.stop() };
                                    props.startTimer(project)
                                }}>Start</Button>
                            ]}
                        />
                    )
                })}
            </Grid>
        </Grid>
    )
}