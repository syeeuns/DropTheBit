import React, { useState, makeStyle, useLayoutEffect, useEffect } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import {
    IconButton,
    Button,
    Box,
    TextField,
    Grid,
    Paper,
    makeStyles,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// const dummyTable = [
//     { price: 1000, vol: 100 },
//     { price: 1000, vol: 100 },
//     { price: 1000, vol: 100 },
//     { price: 1000, vol: 100 },
//     { price: 1000, vol: 100 },
// ];

const greenTheme = createMuiTheme({
    palette: {
        primary: green,
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.primary,
    },
    score: {},
}));

function MakeTableEntity(props) {
    const classes = useStyles(greenTheme);

    return (
        <Paper style={{ height: '9.8vh' }} className={classes.paper}>
            <Grid container direction="row" alignItems="center">
                <Grid style={{ width: '50%', height: '5vh' }} className="price">
                    {props.price}
                </Grid>
                <Grid style={{ width: '50%', height: '5vh' }} className="vol">
                    {props.vol}
                </Grid>
            </Grid>
        </Paper>
    );
}

export default function AskTable(props) {
    const classes = useStyles(greenTheme);
    const testXs = 12;
    const [AskTable, setTable] = useState([]);
    const [isInit, setInit] = useState(false);
    if (!isInit) setInit(true);

    useLayoutEffect(() => {
        let reqJson = {
            socketID: props.socket.id,
            roomID: props.roomID,
        };
        props.socket.emit('askTable_Req', reqJson);

        if (props.socket == null) {
            props.requestSocket('makeTableEntity', props.socket);
            setInit(true);
        } else {
            props.socket.on('askTable_Res', (askTable) => {
                setTable(askTable);
            });
        }
    }, [isInit]);

    // for debugging

    // useEffect(() => {
    //     let reqJson = {
    //         socketID: props.socket.id,
    //         roomID: props.roomID,
    //     };

    //     props.socket.emit('askTable_Req', reqJson);
    // }, [props]);

    return (
        <Grid
            wrap="wrap"
            container
            direction="column"
            justify="center"
            alignItems="stretch"
            spacing={2}
        >
            {AskTable.map((askTable) => {
                return (
                    <Grid item xs={testXs}>
                        <TableContainer>
                            <Table
                                className={classes.table}
                                size="small"
                                aria-label="a dense table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            매도 가격
                                        </TableCell>
                                        <TableCell align="center">
                                            매도 수량
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                        <Paper
                            style={{ height: '4vh' }}
                            className={classes.paper}
                        >
                            <Grid container direction="row" alignItems="center">
                                <Grid
                                    style={{ width: '50%', height: '4vh' }}
                                    className="price"
                                >
                                    {askTable.price}
                                </Grid>
                                <Grid
                                    style={{ width: '50%', height: '4vh' }}
                                    className="vol"
                                >
                                    {askTable.vol}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                );
            })}
        </Grid>
    );
}