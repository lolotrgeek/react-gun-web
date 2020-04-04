import React from 'react';
import { View, } from 'react-native';
import {Icon as FontAwesome5 } from 'react-native-vector-icons/FontAwesome5'
import { useStyles } from '../../themes/DefaultTheme'


export default function MoodPicker(props) {
    const styles = useStyles()
    return (
        <View style={styles.container}>
            <View style={styles.moodContainer}>
                <FontAwesome5
                    name='grin'
                    color='orange'
                    style={{
                        fontWeight: props.selected === 'great' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'great' ? 60 : 40
                    }}
                    onPress={props.onGreat}
                />
                <FontAwesome5
                    name='smile'
                    size={40}
                    color='green'
                    style={{
                        fontWeight: props.selected === 'good' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'good' ? 60 : 40
                    }}
                    onPress={props.onGood}
                />
                <FontAwesome5
                    name='meh'
                    size={40}
                    color='purple'
                    style={{
                        fontWeight: props.selected === 'meh' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'meh' ? 60 : 40
                    }}
                    onPress={props.onMeh}
                />
                <FontAwesome5
                    name='frown'
                    size={40}
                    color='blue'
                    style={{
                        fontWeight: props.selected === 'bad' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'bad' ? 60 : 40
                    }}
                    onPress={props.onSad}
                />
                <FontAwesome5
                    name='dizzy'
                    size={40}
                    color='grey'
                    style={{
                        fontWeight: props.selected === 'awful' ? 'bold' : 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        fontSize: props.selected === 'awful' ? 60 : 40
                    }}
                    onPress={props.onAwful}
                />
            </View >
        </View>
    );
}