import React, { useState, forwardRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar, SnackbarContent } from 'notistack';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            minWidth: '344px !important',
        },
    },
    card: {
        backgroundColor: '#e53935',
        width: '100%',
    },
    typography: {
        textAlign:'center',
        fontFamily: 'NEXON Lv1 Gothic OTF',
        fontSize: '1.5vw',
        color: '#ffffff'
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        justifyContent: 'space-between',
    },
    icons: {
        marginLeft: 'auto',
    },
    expand: {
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    collapse: {
        padding: 16,
    },
    checkIcon: {
        fontSize: 20,
        color: '#b3b3b3',
        paddingRight: 4,
    },
    button: {
        padding: 0,
        textTransform: 'none',
    },
}));

const AlertRed = forwardRef((props, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = useCallback(() => {
        setExpanded((oldExpanded) => !oldExpanded);
    }, []);

    const handleDismiss = useCallback(() => {
        closeSnackbar(props.id);
    }, [props.id, closeSnackbar]);

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card className={classes.card}>
                <CardActions classes={{ root: classes.actionRoot }}>
                    <Typography variant="subtitle2" className={classes.typography}>{props.message}</Typography>
                </CardActions>
            </Card>
        </SnackbarContent>
    );
});

export default AlertRed;