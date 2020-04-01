import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid as WebGrid } from '@material-ui/core/';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: '1.2rem'
  },
  paper: {
    height: 50,
    width: 100,
  },
  control: {
    padding: theme.spacing(1),
  },
  typography: {
    fontSize: '1.1rem'
  }
}));

export default function Grid(props) {
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
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          {props.values ? props.values.map(value => (
            <Grid key={value} wrap="nowrap" item xs>
              <Typography>{value}</Typography>
            </Grid>
          )) : ''}
        </Grid>
      </Grid>
    </Grid>
  );
}


export function UnEvenGrid(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Grid container direction='row' justify="space-between" alignItems="center" >
          {props.values ? props.values.map((value, index) => (
            <Grid className={classes.control} key={index}>
              {value}
            </Grid>
          )) : ''}
        </Grid>
      </Grid>
    </Grid>
  );
}

export function EvenGrid(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Grid container direction='row' justify="center" alignItems="center" >
          {props.values ? props.values.map((value, index) => (
            <Grid className={classes.control} key={index}>
              {value}
            </Grid>
          )) : ''}
        </Grid>
      </Grid>
    </Grid>
  );
}

