import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 50,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

export default function SpacingGrid(props) {
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
