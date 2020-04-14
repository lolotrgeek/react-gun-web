import React from 'react'
// import { Button as MaterialButton} from '@material-ui/core';
import { Card as PaperCard } from 'react-native-paper';

/**
 * https://callstack.github.io/react-native-paper/card.html
 * @param {*} props 
 */
export const Card = props => <PaperCard {...props} children={props.children} /> ;
/**
 * https://callstack.github.io/react-native-paper/card-actions.html
 * @param {*} props 
 */
export const CardActions = props => <PaperCard.Actions {...props} children={props.children} />
/**
 * https://callstack.github.io/react-native-paper/card-content.html
 * @param {*} props 
 */
export const CardContent = props => <PaperCard.Content {...props} children={props.children} />

/**
 * https://callstack.github.io/react-native-paper/card-title.html
 * @param {*} props 
 */
export const CardTitle = props => <PaperCard.Title {...props} title={props.children} />