import React from 'react'
import ToolbarAndroid from '@react-native-community/toolbar-android';

/**
 * https://github.com/react-native-community/toolbar-android/blob/master/doc/toolbarandroid.md
 * @param {*} props 
 */
export const ToolBar = props => (
    <ToolbarAndroid
        {...props}
        title={props.title}
        subtitle={props.subtitle}
        navIcon={props.icon}
    />

);