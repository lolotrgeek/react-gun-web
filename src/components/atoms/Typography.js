import React from 'react'
import {Text} from 'react-native-paper'

const handleVariant = (variant) => {
    if (variant === 'h1') return 100
    if (variant === 'h2') return 70
    if (variant === 'h3') return 50
    if (variant === 'h4') return 40
    if (variant === 'h5') return 30
    if (variant === 'h6') return 20
}

const Typography = props => <Text style={ { fontSize: handleVariant(props.variant)}}>{props.children}</Text>

export default Typography