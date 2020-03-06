import React from 'react'
import { colorValid } from '../constants/Validators'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
// import Typography from '@material-ui/core/Typography'
import { Grid, Button, TextField, makeStyles, Typography } from '@material-ui/core/'

export function Title(props) {
    return (
        <Grid container direction='row' justify='flex-start' alignItems='center'>
            {colorValid(props.color) ? <FiberManualRecordIcon style={{ color: props.color }}/> : '' }
            <Typography variant={props.variant} style={{ color: '#000', textDecoration: 'none' }}>
                {props.name}
            </Typography>

        </Grid >
    )
}

