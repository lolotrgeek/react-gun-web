import React, { useState } from 'react';
import Grid from '../atoms/Grid'
import { useStyles } from '../../themes/DefaultTheme'
import { View } from 'react-native'
import Slider from '@react-native-community/slider'
import Typography from '../atoms/Typography';

const sliderBackground = 'linear-gradient(0deg, rgba(191,191,191,0) 0%, rgba(0,125,255,0) 25%, rgba(39,255,0,0) 50%, rgba(255,252,0,0) 75%, rgba(255,154,0,1) 100%)'

const energyColor = (energy) => {
    let color
    if (energy > 75) color = 'orange'
    if (energy > 50 && energy < 75) color = 'yellow'
    if (energy === 50) color = 'green'
    if (energy < 50 && energy > 25) color = 'blue'
    if (energy < 25) color = 'grey'
    return color
}

const mix = function (color_1, color_2, weight) {
    function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
    function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 

    weight = (typeof (weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

    var color = "#";

    for (var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
        var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
            v2 = h2d(color_2.substr(i, 2)),

            // combine the current pairs from each source color, according to the specified weight
            val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));

        while (val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit

        color += val; // concatenate val to our new color string
    }

    return color; // PROFIT!
};
function pickHex(color1, color2, weight) {
    var p = weight;
    var w = p * 2 - 1;
    var w1 = (w / 1 + 1) / 2;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2)];
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
const calcColor = (sliderWidth, energy) => {
    const gradient = [
        [0, [193, 193, 193]],
        [25, [0, 128, 0]],
        [50, [0, 0, 255]],
        [75, [0, 0, 255]],
        [100, [255, 0, 0]]
    ];
    let colorRange = []
    gradient.map((value, index) => {
        if (energy <= value[0]) {
            colorRange = [index - 1, index]
            return false
        }
        return false
    })

    //Get the two closest colors
    var firstcolor = gradient[colorRange[0]][1];
    var secondcolor = gradient[colorRange[1]][1];

    //Calculate ratio between the two closest colors
    var firstcolor_x = sliderWidth * (gradient[colorRange[0]][0] / 100);
    var secondcolor_x = sliderWidth * (gradient[colorRange[1]][0] / 100) - firstcolor_x;
    // var slider_x = sliderWidth * (energy / 100) - firstcolor_x;
    var ratio = energy / secondcolor_x
    //Get the color with pickHex(thx, less.js's mix function!)
    var result = pickHex(secondcolor, firstcolor, ratio);
    return result
}

export function EnergySlider(props) {
    const classes = useStyles();
    const [color, setColor] = useState('')
    const [width, setWidth] = useState(0)
    const [value, setValue] = useState(props.startingEnergy? props.startingEnergy : 0)
    return (
        <View style={{width: props.width ? props.width : 340 }} onLayout={event => setWidth(event.nativeEvent.layout.width)} >
            <Slider
                style={{ height: 50, color: color && color.length > 0 ? color : calcColor(width, props.startingEnergy) }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                thumbTintColor={color}
                minimumTrackTintColor={color}
                maximumTrackTintColor={color}
                onSlidingComplete={change => props.setEnergy(change)}
                value={value}
                onValueChange={change => {setValue(change); setColor(calcColor(width, value))}}
            />
        </View>
    )
}