import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { contActions } from '../actions';
import { ROOT_COMP } from '../constants/contReducerConstants';
import { DRAWER_WIDTH, DURATION } from '../constants/appBody';
import * as comp from './content';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Transition } from 'react-transition-group';
import Grid from "@material-ui/core/Grid";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
  
const useStyles = makeStyles(theme => ({
  defaultBody: {
    transform: "translateX(0px)",
    transition: `transform ${DURATION}ms cubic-bezier(.6,.01,.51,1.01)`
  },
  enteringBody: {
    transform: `translateX(-${DRAWER_WIDTH/2}px)`
  },
  enteredBody: {
    transform: `translateX(-${DRAWER_WIDTH/2}px)`
  },
  exitingBody: {
    transform: "translateX(0vw)"
  },
  exitedBody: {
    transfrom: "translateX(0vw)"
  },
  leftItem: {
  },
  middleItem: {
    outline: "1px dashed black",
    display: "flex",
  },
  rightItem: {
    flexGrow: 1
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.light,
    backgroundColor: 'rgba(0,0,0,0)'
  }
}));

function LoadingBackdrop(props) {
  const classes = useStyles();

  return (
      <Backdrop className={classes.backdrop} open={props.loading} transitionDuration={{enter: 300, exit: 300}}>
        <CircularProgress color="inherit" />
      </Backdrop>
  );
}

function AppBody(props) {
    const classes = useStyles();

    React.useEffect(() => {
        props.getBody();
    }, []); /* Loops forever without empty props for dependency (only should run once on mount) */

    return (
      <>
        <Transition in={props.toolsOpen} timeout={DURATION}>
          {state => (
            <Grid container className={clsx(classes.defaultBody, classes[`${state}Body`])}>
              <Grid item className={classes.leftItem} md={2} xs={12}>left</Grid>
              <Grid item className={classes.middleItem} md={8} xs={12}>
                {React.createElement((comp[props.rootComp.comp] || props.rootComp.comp), props.rootComp.props, props.rootComp.inner)}
              </Grid>
              <Grid item className={classes.rightItem} >right</Grid>
            </Grid>
          )}
        </Transition>
        <LoadingBackdrop loading={props.loading} />
      </>
    );
}


AppBody.propTypes = {
    getBody: PropTypes.func.isRequired,
    rootComp: PropTypes.object.isRequired,
    toolsOpen: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    rootComp: state.contentState.contentComp[ROOT_COMP],
    toolsOpen: state.navState.toolsOpen,
    loading: state.contentState.loading
})

export default connect(mapStateToProps, { getBody: contActions.getBody })(AppBody);