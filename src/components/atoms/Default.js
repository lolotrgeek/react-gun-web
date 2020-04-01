import React from 'react'
import { Link } from "react-router-dom"
import {Button, TextField, makeStyles } from '@material-ui/core/'
import Grid from '../atoms/Grid'


export default function Default(props) {
    return (
        <Grid container direction='column' justify='center' alignItems='center' spacing={4}>
            <h2>Projects</h2>
            <Link to='/project/create'><Button variant="contained" color="primary">New Project</Button></Link>
            <h3>Project List</h3>

        </Grid>
    )
}