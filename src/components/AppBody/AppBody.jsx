import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Transition } from "react-transition-group";
import { Grid, Backdrop, CircularProgress, Fade } from "@material-ui/core";
import { contActions, authActions } from "../../actions";
import * as comp from "../visage";
import { ModalLogin } from "../Login";

const useStyles = makeStyles((theme) => {
	const { toolbar, drawer } = theme.mixins;
	const smBreakpoint = theme.breakpoints.up("sm");
	const xsBreakpoint = theme.breakpoints.up("xs");
	const mdBreakpoint = theme.breakpoints.up("md");

	return {
		defaultBody: {
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "center",
			paddingLeft: "0",
			transition: `padding-left ${theme.transitions.duration.standard}ms cubic-bezier(.6,.01,.51,1.01)`,
			paddingTop: "1rem",
			minHeight: `calc(100vh - ${toolbar.minHeight}px)`,
			[`${xsBreakpoint} and (orientation: landscape)`]: {
				minHeight: `calc(100vh - ${
					toolbar[`${xsBreakpoint} and (orientation: landscape)`].minHeight
				}px)`,
			},
			[mdBreakpoint]: {
				flexWrap: "nowrap",
			},
			[smBreakpoint]: {
				minHeight: `calc(100vh - ${toolbar[smBreakpoint].minHeight}px)`,
			},
		},
		enteringBody: {
			[xsBreakpoint]: {
				width: "0",
			},
			[mdBreakpoint]: {
				width: `calc(${drawer[mdBreakpoint].width})`,
			},
		},
		enteredBody: {
			[xsBreakpoint]: {
				width: "0",
			},
			[mdBreakpoint]: {
				width: `calc(${drawer[mdBreakpoint].width})`,
			},
		},
		exitingBody: {
			width: "0",
		},
		exitedBody: {
			width: "0",
		},
		grow: {
			flexShrink: 0,
			transition: `width ${theme.transitions.duration.standard}ms cubic-bezier(.6,.01,.51,1.01)`,
		},
		leftItem: {
			flexShrink: 1,
			overflowX: "hidden",
		},
		middleItem: {
			height: "100%",
			flexShrink: 0,
		},
		rightItem: {
			flexShrink: 1,
			overflowX: "hidden",
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: theme.palette.primary.light,
			backgroundColor: "rgba(0,0,0,0)",
		},
	};
});

const LoadingBackdrop = (props) => {
	const theme = useTheme();
	const classes = useStyles();

	return (
		<Backdrop
			className={classes.backdrop}
			open={props.loading}
			transitionDuration={{
				enter: theme.transitions.duration.enteringScreen,
				exit: theme.transitions.duration.leavingScreen,
			}}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
};

LoadingBackdrop.propTypes = {
	loading: PropTypes.bool.isRequired,
};

const Visage = connect((state) => ({
	rootComp: state.contentState.contentComp[state.contentState.rootId],
}))((props) => (
	<div>
		{React.createElement(comp[props.rootComp.comp] || props.rootComp.comp, {
			id: props.rootComp._id,
		})}
	</div>
));

Visage.propTypes = {
	rootComp: PropTypes.object,
};

function AppBody(props) {
	const theme = useTheme();
	const classes = useStyles();

	React.useEffect(() => {
		props.getBody();
	}, [props.loggedIn]);

	React.useEffect(() => {
		if (props.tokenExpired) {
			props.resetUser();
		}
	}, [props.tokenExpired]);

	return (
		<>
			<Transition
				in={props.toolsOpen}
				timeout={theme.transitions.duration.standard}
			>
				{(state) => (
					<Grid container className={clsx(classes.defaultBody)}>
						<Grid
							item
							className={clsx(classes.grow, classes[`${state}Body`])}
						/>
						<Grid item className={classes.leftItem} md={2} xs={12} />
						<Grid item className={classes.middleItem} md={8} xs={12}>
							<Fade
								in={!props.loading}
								timeout={theme.transitions.duration.standard}
							>
								<Visage />
							</Fade>
						</Grid>
						<Grid item className={classes.rightItem} md={2} xs={12} />
					</Grid>
				)}
			</Transition>
			<ModalLogin />
			<LoadingBackdrop loading={props.loading} />
		</>
	);
}

AppBody.propTypes = {
	getBody: PropTypes.func.isRequired,
	resetUser: PropTypes.func.isRequired,
	toolsOpen: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	loggedIn: PropTypes.bool.isRequired,
	tokenExpired: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	toolsOpen: state.navState.toolsOpen,
	loading: state.contentState.loading,
	loggedIn: Boolean(state.authState.token),
	tokenExpired: state.contentState.error === "TokenExpiredError",
});

export default connect(mapStateToProps, {
	getBody: contActions.getBody,
	resetUser: authActions.resetUser,
})(AppBody);
