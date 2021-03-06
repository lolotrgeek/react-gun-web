import React from 'react'
import Stateless from './Stateless'
import { SubHeader } from './Header'
import { RunningTimer } from './RunningTimer'
import { UnEvenGrid } from './Grid'
import { Title } from './Title'
import { Link } from './Link'
import { Grid, Button } from '@material-ui/core/'
// import { Button } from './Button'
import { projectValid, isRunning } from '../constants/Validators'

/**
 * 
 * @param {*} props
 * @param {Object} props.classes
 * @param {Object} props.count
 */
export default function ProjectList(props) {
    return (
        <Grid className={props.classes.listRoot}>
            {props.projects && props.projects.length > 0 ?
                <SubHeader
                    className={props.classes.space}
                    title='Projects'
                    buttonClick={props.headerButtonAction}
                    buttonText='New Project' /> :
                <Stateless />
            }

            {isRunning(props.runningTimer) ?
                <RunningTimer
                    className={props.classes.space}
                    name={props.runningProject[1] ? props.runningProject[1].name : ''}
                    color={props.runningProject[1] ? props.runningProject[1].color : ''}
                    count={props.count}
                    stop={() => { props.finishTimer(props.runningTimer); props.stop() }}
                />
                : ''}

            <Grid className={props.classes.space}>
                {props.projects.map(project => {
                    return (
                        <Grid key={project[0]} className={props.classes.listClass}>
                            <UnEvenGrid
                                values={[
                                    <Link to={props.projectlink(project[0])} >
                                        <Title color={project[1].color} variant='h6'>
                                            {projectValid(project) ? project[1].name : ''}
                                        </Title>
                                    </Link>,
                                    <Button variant="contained" color="primary" onClick={() => {
                                        if (isRunning(props.runningTimer)) { props.finishTimer(props.runningTimer); props.stop() };
                                        props.startTimer(project)
                                    }}>Start</Button>
                                ]}
                            />
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    )
}