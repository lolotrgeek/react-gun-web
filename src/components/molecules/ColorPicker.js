import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Grid from '../atoms/Grid'
import * as material from 'material-colors'

export const ColorSwatch = (props) => {

    const styles = StyleSheet.create({
        swatch: {
            width: props.circleSize,
            height: props.circleSize,
            marginRight: props.circleSpacing,
            marginBottom: props.circleSpacing,
            borderRadius: props.circleSpacing,
            backgroundColor: props.color,
        },
    })
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={styles.swatch} key={props.color} />
        </TouchableOpacity>
    )
}

export function ColorPicker(props) {
    const colors = [
        material.red['500'], material.pink['500'], material.purple['500'],
        material.deepPurple['500'], material.indigo['500'], material.blue['500'],
        material.lightBlue['500'], material.cyan['500'], material.teal['500'],
        material.green['500'], material.lightGreen['500'], material.lime['500'],
        material.yellow['500'], material.amber['500'], material.orange['500'],
        material.deepOrange['500'], material.brown['500'], material.blueGrey['500']
    ]

    const swatch = {
        width: 252,
        circleSize: 28,
        circleSpacing: 14,
    }
    return (
        <Grid style={{ width: swatch.width}} container direction='row' justify='center' alignItems='center'>
            {colors.map(color =>
                <ColorSwatch
                    key={color}
                    width={swatch.width}
                    circleSpacing={swatch.circleSpacing}
                    circleSize={swatch.circleSize}
                    color={color}
                    onPress={() => props.selectColor(color)}
                />
            )}
        </Grid>
    )
}