import React from 'react';
import Grid from '../atoms/Grid'
import Typography from '../atoms/Typography';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { IconButton } from '../atoms/IconButton'
import { View } from 'react-native'

export function MoodPicker(props) {
    let moods = [
        { name: 'great', click: props.onGreat, icon: 'grin', color: 'orange' },
        { name: 'good', click: props.onGood, icon: 'smile', color: 'green' },
        { name: 'meh', click: props.onMeh, icon: 'meh', color: 'purple' },
        { name: 'bad', click: props.onBad, icon: 'frown', color: 'blue' },
        { name: 'awful', click: props.onAwful, icon: 'dizzy', color: 'grey' },

    ]
    return (

        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        }}>

            <Typography>{props.label ? props.label : ''}</Typography>
            {moods.map(mood => (
                <IconButton key={mood.name} style={{ margin: 20 }} onPress={mood.click} >
                    <Icon
                        name={mood.icon}
                        color={mood.color}
                        size={40}
                        style={{
                            fontWeight: props.selected === mood.name ? 'bold' : 'normal',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            fontSize: props.selected === mood.name ? 40 : 20
                        }}
                    />
                </IconButton>

            ))}

        </View>

    );
}