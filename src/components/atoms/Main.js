import React from 'react'
import { SafeAreaView } from 'react-native';

/**
 * @param {*} props 
 */
const Main = props => <SafeAreaView
    {...props}
    children={props.children}
    style={{
        display: 'flex',
        flex: 1,
        flexBasis: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        ...props.style,
        ...props.className,
    }}
/>;

export default Main