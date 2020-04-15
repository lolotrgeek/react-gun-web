import React from 'react'
import { colorValid } from '../../constants/Validators'
import { TitleIcon } from '../atoms/Icon'
import Typography from '../atoms/Typography'
import Grid from '../atoms/Grid'
import { Link } from '../atoms/Link'
import { View } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


const truncate = (input) => input.length > 15 ? `${input.substring(0, 15)}...` : input

/**
 * 
 * @param {*} props 
 * @param {*} props.color
 * @param {*} props.variant  
 */
export function Title(props) {

    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        }}>
            {/* {colorValid(props.color) ? <TitleIcon name='circle' size={20} color={props.color} /> : null} */}
            {colorValid(props.color) ? <FontAwesome5 name='circle' size={20} color={props.color} solid /> : null}
            {props.to ?
                <Link to={props.to} >
                    <Typography variant={props.variant} color="textPrimary" style={{ textTransform: 'capitalize' }}>
                        {truncate(props.children)}
                    </Typography>
                </Link>
                :
                <Typography variant={props.variant} color="textPrimary" style={{ textTransform: 'capitalize' }}>
                    {truncate(props.children)}
                </Typography>
            }
        </View >
    )
}

export function SubTitle(props) {
    return <Typography variant='h5' style={{ textDecoration: 'none', textTransform: 'capitalize' }}>{truncate(props.children)}</Typography>
}