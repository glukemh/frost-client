import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navActions, contActions } from '../actions';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { BreadcrumbItem } from 'reactstrap';

const useStyles = makeStyles(theme => ({
    drawer: {
        backgroundColor: "ghostwhite",
        flexShrink: 0,
        paddingRight: "10px",
        paddingLeft: "10px"
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    drawerPaper: {
        backdropFilter: "blur(20px)",
        backgroundColor: "transparent",
        width: "300px"
    },
}));



const ToolsDrawer = props => {
    
    const classes = useStyles();

    const handleView = () => {}

    const handleClose = () => {
        props.toggleTools();
        props.toggleEditing();
    }

    const handleClick = (compName, compProps) => {
        props.insertComp(compName, props.selected, null, compProps);
    }

    const view = {
        Components: {
            breadcrumb: ["Components"],
            tools: [
                <ListItem button key={0}>
                    <ListItemText primary="Highlight Containers" />
                </ListItem>,
                <ListItem button key={1}>
                    <ListItemText primary="Highlight Items" />
                </ListItem>
            ]
        },
        Item: {
            breadcrumb: ["Components", "Item"],
            tools: [
                <ListItem button key={0} onClick={() => handleClick('Grid', { isContainer: true })}>
                    <ListItemText primary="Add Container" />
                </ListItem>
            ]
        },
        Container: {
            breadcrumb: ["Components","Container"],
            tools: [
                <ListItem button key={1} onClick={() => handleClick('Grid', { isContainer: false, xs: 2 })}>
                    <ListItemText primary="Add Item" />
                </ListItem>
            ]
        },
    }

    return (
        <Drawer className={classes.drawer} classes={{paper: classes.drawerPaper}} anchor="right" open={props.toolsOpen} variant="persistent">
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleClose}>
                    <ChevronRightIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem>
                    <Breadcrumbs aria-label="breadcrumb">
                        {view[props.toolsView].breadcrumb.map((name, index) => {
                            let last = view[props.toolsView].breadcrumb.length == index + 1;
                            return  last ? (<Typography key={index} color="textPrimary">{name}</Typography>) : (
                                <Link key={index} color="inherit" onClick={handleView}>{name}</Link>
                            ) 
                        })}
                    </Breadcrumbs>            
                </ListItem>    
            </List>
            <Divider />
            <List>
                {view[props.toolsView].tools}
            </List>
        </Drawer>
    );
}


ToolsDrawer.propTypes = {
    toolsOpen: PropTypes.bool.isRequired,
    toolsView: PropTypes.string.isRequired,
    toggleTools: PropTypes.func.isRequired,
    toggleEditing: PropTypes.func.isRequired,
    insertComp: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    toolsOpen: state.navState.toolsOpen,
    toolsView: state.navState.toolsView,
    selected: state.contentState.selected
})


export default connect(mapStateToProps, {
    toggleTools: navActions.toggleTools,
    toggleEditing: contActions.toggleEditing,
    insertComp: contActions.insertComp,
})(ToolsDrawer);