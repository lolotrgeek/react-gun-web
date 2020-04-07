import React from 'react';
import { View } from 'react-native';
import { useStyles, theme } from '../../themes/DefaultTheme'


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
      flex: 1,
      flexBasis: props.container && props.spacing ? theme.spacing(props.spacing) : 'auto',
      flexDirection: props.container && props.direction ? props.direction : 'column',
      alignItems: props.container && props.alignItems ? props.alignItems : 'flex-start',
      justifyContent: props.container && props.justify ? props.justify : 'flex-start',
      width: props.container ? '100%' : 'auto',
      flexWrap: props.wrap ? props.wrap : 'wrap',
      margin: props.item ? theme.spacing(2) : 0,
      ...props.style,
      ...props.className,
    }}
    xs={props.xs}
    sm={props.sm}
    md={props.md}
    lg={props.lg}
    xl={props.xl}
    children={props.children}
  />
}

export function SpacingGrid(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      {props.headers ? props.headers.map(header => (
        <Grid key={header} wrap="nowrap" item xs>
          <h3>{header}</h3>
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
    <Grid container direction='row' justify="space-between" alignItems="center" >
      {props.values ? props.values.map((value, index) => (
        <Grid className={classes.control} key={index}>
          {value}
        </Grid>
      )) : null}
    </Grid>

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

