import React from 'react'

import Grid from '../atoms/Grid'
import { secondsToString } from '../../constants/Functions';
import { Link } from '../atoms/Link'
import { timerRunninglink } from '../../routes/routes'

import { Button } from '../atoms/Button'
import Typography from '../atoms/Typography'
import { Card, CardActions, CardContent } from '../atoms/Card';
import { useStyles } from '../../themes/DefaultTheme'
import { View } from 'react-native'

export function RunningTimer(props) {
    const classes = useStyles();
    const [width, setWidth] = React.useState(340)
    return (
        <View style={{...classes.space}} onLayout={event => setWidth(event.nativeEvent.layout.width)} >
            <Card style={{
                width: width,
                backgroundColor: props.color, 
                ...classes.spaceFull
            }} >
                <Link to={props.link ? props.link : timerRunninglink()}>
                    <CardContent>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>

                            <Typography variant='h6'>
                                {props.name}
                            </ Typography>

                            <Typography variant='h6'>
                                {`${secondsToString(props.count)}`}
                            </ Typography>
                        </View>


                    </CardContent>
                </Link>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', ...classes.space2 }}>
                    <CardActions>
                        <Button className={classes.button} variant="contained" color="primary" onPress={props.stop}>Stop</Button>
                    </CardActions>
                </View>

            </Card>
        </View >

    )
}
