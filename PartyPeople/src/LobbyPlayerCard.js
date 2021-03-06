import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Grid } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-human-sprites';

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       main: purple[500],
//     },
//     secondary: {
//       main: '#f44336',
//     },
//   },
// });
let size = 30;
const useStyles = makeStyles((cnt) => ({
    root: {
        width: '100%',
        height: '100%',
        margin: '0 2vh 2vh 2vh',
        padding:'0.5vh 0.5vw 0.5vh 0.5vw',
        border: 'solid #777777',
        color: '#CDD7E0',
        opacity: 1,
        backgroundColor: '#0C151C',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
        color: '#ffffff',
    },
    pos: {
        marginBottom: 12,
    },
}));

export default function LobbyPlayerCard(props) {
    const classes = useStyles(props.playerCount);
    const playerCount = props.playerCount;
    let index = 1;
    for (let interval = 4; ; interval += 2, index++) {
        const comp = Math.pow(2, interval);
        if (comp >= playerCount) break;
    }
    const ratio = Math.pow(2, index); // playerCount ~2^1일때 1, ~16 2^3일때 2, ~64 2^5일때 4, ~256 2^7일때, 8
    const isLeader = props.roomLeader === props.socketID ? '👑 방장' : '손님';
    let options = null;
    if(ratio > 8) {
      options = 
      {
          w: 10 / ratio * 3 + 'vw',
          h: 10 / ratio * 3 + 'vw',
          // m: 3 / ratio + 'vh ' + 3 / ratio + 'vw',
      };
    }
    else {
      options = 
      {
          w: 10 / ratio + 'vw',
          h: 10 / ratio + 'vw',
          m: 3 / ratio + 'vh ' + 3 / ratio + 'vw',
      };
    }
    let avatars = new Avatars(sprites, options);
    let svg = avatars.create(props.playerID);
    const compFontSize = 3 / ratio ;
    let playerInfo = null;
    if(ratio > 4){
      playerInfo = (<>        <Grid item style={{ fontSize: 2 * compFontSize + 'vw', height:'30%', padding: 2/ratio+'vh '+ 5/ratio + 'vw' }}>
      {props.roomLeader === props.socketID ? '👑' : '🥋'}
  </Grid></>)
    }
    else {
      playerInfo = (
        <>
        <Grid item style={{ fontSize: compFontSize + 'vw', height:'30%', padding: 2/ratio+'vh '+ 2/ratio + 'vw' }}>
        {isLeader}
    </Grid>
    <Grid item style={{ fontSize:  compFontSize + 'vw', height:'70%' , padding: 3/ratio+'vh '+ 2/ratio + 'vw', color:'white' }}>
        {props.playerID}
    </Grid>
    </>
      )
    }
    

    return (
        <Grid
            item
            style={{
                width: 50 / ratio + '%',
                height: 50 / ratio + '%',
                padding: 1 / ratio + 'vh ' + 1 / ratio + 'vw',
            }}
        >
            <Card className={classes.root}>
                <CardContent
                    style={{ padding: 1 / ratio + 'vh ' + 1 / ratio + 'vw', }}
                >
                    <Grid container item direction={'row'}>
                        <Grid container item xs={4}>
                            <div
                                style={{ width: '100%', height: '100%' }}
                                dangerouslySetInnerHTML={{ __html: svg }}
                            />
                        </Grid>
                        <Grid
                            container
                            item
                            xs={8}
                            direction={'column'}
                            justify={'center'}
                            alignItems={'flex-start'}
                        >
                            {playerInfo}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}
