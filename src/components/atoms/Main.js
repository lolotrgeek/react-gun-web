import React from 'react'
import { SafeAreaView } from 'react-native';

/**
 * @param {*} props 
 */
const Main = props => <SafeAreaView {...props} children={props.children}/>;

export default Main