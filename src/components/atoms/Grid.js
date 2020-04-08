import React from 'react';
import { View } from 'react-native';
import { useStyles, theme } from '../../themes/DefaultTheme'
import Typography from './Typography';


/**
 * Native Grid Implementation
 * https://material-ui.com/components/grid/#interactive
 * @param {*} props 
 * @param {boolean} props.container 
 * @param {boolean} props.item 
 * @param {String} props.alignItems 
 * @param {String} props.justify 
 * @param {String} props.direction 
 */
export default function Grid(props) {

  return <View
    style={{
      display: 'flex',
      flex: props.container ? 1 : 0,
      flexDirection: props.container && props.direction ? props.direction : 'column',
      alignItems: props.container && props.alignItems ? props.alignItems : 'center',
      justifyContent: props.container && props.justify ? props.justify : 'flex-start',
      width: props.container ? '100%' : 'auto',
      flexWrap: props.wrap ? props.wrap : 'wrap',
      margin: props.item ? theme.spacing(2) : 0,
      overflow: 'hidden',
      ...props.style,
      ...props.className,
    }}
    // xs={props.xs}
    // sm={props.sm}
    // md={props.md}
    // lg={props.lg}
    // xl={props.xl}
    children={props.children}
  />
}

export function SpacingGrid(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      {props.headers ? props.headers.map(header => (
        <Grid key={header} wrap="nowrap" item xs>
          <Typography>{header}</Typography>
        </Grid>
      )) : null}
      <Grid container justify="center" spacing={2}>
        {props.values ? props.values.map(value => (
          <Grid key={value} wrap="nowrap" item xs>
            {value}
          </Grid>
        )) : null}
      </Grid>
    </Grid>
  );
}


export function UnEvenGrid(props) {
  const classes = useStyles();
  return (
    <View style={{
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row'
    }} >
      {props.values ? props.values.map((value, index) => (
        <View style={classes.control} key={index}>
          {value}
        </View>
      )) : null}
    </View>

  );
}

export function EvenGrid(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid container direction='row' justify="center" alignItems="center" >
        {props.values ? props.values.map((value, index) => (
          <Grid className={classes.control} key={index}>
            {value}
          </Grid>
        )) : null}
      </Grid>
    </Grid>
  );
}

