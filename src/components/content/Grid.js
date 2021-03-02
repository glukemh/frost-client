import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import EditButton from '../EditButton';
import * as comp from './';

const useStyles = makeStyles(theme => ({
    default: {
        padding: "10px",
        position: "relative",
        display: "inline-flex",
        flexGrow: 1
    },
    selected: {
        outline: "2px dashed lightblue"
    },
    itemNoChild: {
        minHeight: "300px"
    },
    containerNoChild: {
        minHeight: "320px"
    }
}))

const GridComp = props => {
    const classes = useStyles();

    return (
        <Grid
            container={props.isContainer}
            item={!props.isContainer} 
            className={clsx(classes.default, {
                [classes.selected]: props.editing && (props.selected === props.id),
                [classes.itemNoChild]: props.editing && !props.children.length && !props.isContainer,
                [classes.containerNoChild]: props.editing && !props.children.length && props.isContainer
            })}
            xs={props.xs}
        >
            {props.editing && <EditButton name={props.isContainer ? "Container" : "Item"} parentId={props.id}/>}
            {props.children.map(child => React.createElement(comp[child.comp], child.props, child.inner))}                
        </Grid>
    );

}

GridComp.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
    parentId: PropTypes.string,
    editing: PropTypes.bool.isRequired,
    selected: PropTypes.string,
    isContainer: PropTypes.bool.isRequired,
    xs: PropTypes.number
}

const mapStateToProps = (state, ownProps) => ({
    children: state.contentState.contentComp[ownProps.id].childIds.map(id => state.contentState.contentComp[id]),
    parentId: state.contentState.contentComp[ownProps.id].parentId,
    editing: state.contentState.editing,
    selected: state.contentState.selected,
    isContainer: state.contentState.contentComp[ownProps.id].props.isContainer,
    xs: state.contentState.contentComp[ownProps.id].props.xs
})


export default connect(mapStateToProps, {})(GridComp);
