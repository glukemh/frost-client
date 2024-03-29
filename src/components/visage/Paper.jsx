import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Abstract from "./Abstract";

const useStyles = makeStyles((theme) => ({
	default: {
		maxWidth: "100%",
		padding: "10px",
		position: "relative",
		background: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText,
		width: "100%",
	},
	selected: {
		zIndex: theme.zIndex.appBar + 2,
	},
	typography: {
		overflow: "hidden",
	},
}));

function PaperComp(props) {
	const classes = useStyles();
	const ref = React.createRef();

	return (
		<Abstract nodeRef={ref} id={props.id}>
			{({ editHoverProps, selectedClass, editButton }) => (
				<Paper
					ref={ref}
					className={clsx(classes.default, selectedClass)}
					{...editHoverProps}
				>
					{editButton}
					{props.inner.map((paragraph, i) => (
						/* eslint-disable react/no-array-index-key */
						<Typography key={i} className={classes.typography} component="p">
							{paragraph || <br />}
						</Typography>
					))}
				</Paper>
			)}
		</Abstract>
	);
}

PaperComp.propTypes = {
	id: PropTypes.string.isRequired,
	parentId: PropTypes.string.isRequired,
	inner: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
	parentId: state.contentState.contentComp[ownProps.id].parentId,
	inner: state.contentState.contentComp[ownProps.id].inner.split("\n"),
});

export default connect(mapStateToProps, {})(PaperComp);
