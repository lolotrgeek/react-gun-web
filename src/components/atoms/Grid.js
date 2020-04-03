import React from 'react';
import { Grid as WebGrid } from '@material-ui/core/';
import { View } from 'react-native';
import { useStyles, theme } from '../../themes/DefaultTheme'


export default function Grid(props) {

  return <View
    style={{
      display: 'flex',
      flex: 1,
      flexBasis: props.container && props.spacing ? theme.spacing(props.spacing) : '',
      flexDirection: props.container && props.direction ? props.direction : 'column',
      alignItems: props.container && props.alignItems ? props.alignItems : 'flex-start',
      justifyContent: props.container && props.justify ? props.justify : 'flex-start',
      width: props.container ? '100%' : '',
      flexWrap: props.wrap ? props.wrap : 'wrap',
      // padding: props.spacing ? theme.spacing(props.spacing) : 0,
      margin: props.item ? theme.spacing(2) : 0,
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

export function NativeGrid(props) {
  return <WebGrid component={View} {...props} />
}

export function MaterialGrid(props) {
  return <WebGrid
    spacing={props.spacing}
    className={props.className}
    container={props.container}
    item={props.item}
    xs={props.xs}
    wrap={props.wrap}
    justify={props.justify}
    direction={props.direction}
    alignItems={props.alignItems}
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
      )) : ''}
        <Grid container justify="center" spacing={2}>
          {props.values ? props.values.map(value => (
            <Grid key={value} wrap="nowrap" item xs>
              {value}
            </Grid>
          )) : ''}
        </Grid>
    </Grid>
  );
}


export function UnEvenGrid(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
        <Grid container direction='row' justify="space-between" alignItems="center" >
          {props.values ? props.values.map((value, index) => (
            <Grid className={classes.control} key={index}>
              {value}
            </Grid>
          )) : ''}
      </Grid>
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
        )) : ''}
      </Grid>
    </Grid>
  );
}

