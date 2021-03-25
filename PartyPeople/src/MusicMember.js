// import React, { useEffect } from 'react';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import {
//   Button,
//   Fab,
//   Grid,
//   Paper,
//   makeStyles,
//   TextField,
// } from '@material-ui/core';


// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& .MuiTextField-root': {
//       margin: theme.spacing(1),
//       width: '25ch',
//     },
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));

// export default function MusicMember(props) {
//   const classes = useStyles();
//   // 방장인데 선택X / 방장인데 선택O / 팀원인데 선택X / 팀원인데 선택 O
//   /* ''  => 선택  /  roomInfo에 music 정보가 있으면 받아오고 없으면 '' */
//   var tmp_music =  props.music ? 'Not Selected' : props.roomInfo['music'];
//   var tmp_time =  !props.roomInfo['gameTime'] ? 0 : props.roomInfo['gameTime'];
//   const [music, setMusic] = React.useState(tmp_music);
//   const [strTime, strSetTime] = React.useState('');


//   function MusicInput() {

//       return (
//           <div>
//           <FormControl className={classes.formControl} disabled>
//             <InputLabel id="demo-simple-select-label">{music}</InputLabel>
//             <Select
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//             >
//               <MenuItem value={'King_Conga.mp3'}>King_Conga.mp3</MenuItem>
//               <MenuItem value={'Mausoleum_Mash.mp3'}>Mausoleum_Mash.mp3</MenuItem>
//               <MenuItem value={'Deja_Vu.mp3'}>Deja_Vu.mp3</MenuItem>
//             </Select>
//           </FormControl>
//           </div>
//         );
//   }
    
    
//   function ShowMusic() {
//       var minute  = parseInt(tmp_time / 60);
//       var second = tmp_time % 60;
      
//       strSetTime(String(minute)+' : '+String(second));
//       useEffect(() => {
//         props.socket.on('settingsUpdate_Res', (data) => {
//           const musicName = data.musicName;
//           const musicTime = data.musicTime;
//           if (data) {
//             props.setTime(musicTime);
//             console.log(musicTime);
//             var minute  = parseInt(musicTime / 60);
//             var second = musicTime % 60;
//             // console.log(minute);
//             // console.log(second);
//             var tmp_roomInfo = props.roomInfo; 
//             tmp_roomInfo['music'] = musicName;
//             props.SetRoomIdAndInfo({roomID: props.roomID, roomInfo: tmp_roomInfo});
//             strSetTime(String(minute)+' : '+String(second));
//             }
//         });
//     }, []);
      
//     return (
//           <form className={classes.root} noValidate autoComplete="off">
//           <div>
//               <TextField
//               label="Play Time"
//               defaultValue={strTime}
//               InputProps={{
//                   readOnly: true,
//               }}
//               />
//           </div>
//           </form>
//       );
//   }

  
//   return(
//     <>
//         <Grid>
//             <MusicInput />
//         </Grid>
//         <Grid>
//             <ShowMusic/>
//         </Grid>
//         <Button variant="contained" color="primary" disabled> StartGame </Button> 
//     </>
//   );

// }
import React, { useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {
  Button,
  Fab,
  Grid,
  Paper,
  makeStyles,
  TextField,
} from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
export default function MusicMember(props) {
  const classes = useStyles();
  // 방장인데 선택X / 방장인데 선택O / 팀원인데 선택X / 팀원인데 선택 O
  /* ''  => 선택  /  roomInfo에 music 정보가 있으면 받아오고 없으면 '' */
  var tmp_music =  props.music ? 'Not Selected' : props.roomInfo['music'];
  var tmp_time =  !props.roomInfo['gameTime'] ? 0 : props.roomInfo['gameTime'];

  var minute  = parseInt(tmp_time / 60);
  var second = tmp_time % 60;
  minute = minute >= 10 ? String(minute) : '0'+String(minute);
  second = second >= 10 ? String(second) : '0'+String(second);

  const [music, setMusic] = React.useState(tmp_music);
  const [strTime, strSetTime] = React.useState(minute+' : '+second);

  function MusicInput() {
      return (
          <div>
          <FormControl className={classes.formControl} disabled>
            <InputLabel id="demo-simple-select-label">{music}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
            >
              <MenuItem value={'King_Conga.mp3'}>King_Conga.mp3</MenuItem>
              <MenuItem value={'Mausoleum_Mash.mp3'}>Mausoleum_Mash.mp3</MenuItem>
              <MenuItem value={'Deja_Vu.mp3'}>Deja_Vu.mp3</MenuItem>
            </Select>
          </FormControl>
          </div>
        );
  }
  // function ShowMusic() {
  //     var minute  = parseInt(tmp_time / 60);
  //     var second = tmp_time % 60;
  //     strSetTime(String(minute)+' : '+String(second));
  //     useEffect(() => {
  //       props.socket.on('settingsUpdate_Res', (data) => {
  //         const musicName = data.musicName;
  //         const musicTime = data.musicTime;
  //         if (data) {
  //           props.setTime(musicTime);
  //           console.log(musicTime);
  //           var minute  = parseInt(musicTime / 60);
  //           var second = musicTime % 60;
  //           // console.log(minute);
  //           // console.log(second);
  //           var tmp_roomInfo = props.roomInfo; 
  //           tmp_roomInfo['music'] = musicName;
  //           props.SetRoomIdAndInfo({roomID: props.roomID, roomInfo: tmp_roomInfo});
  //           strSetTime(String(minute)+' : '+String(second));
  //           }
  //       });
  //   }, []);
  function ShowMusic() {
    // {musicName : musicName, musicTime : musicTime}
    // if (props.roomInfo) {
        useEffect(() => {
            props.socket.once('settingsUpdate_Res', (data) => {
              const musicName = data.musicName;
              const musicTime = data.musicTime;
              setMusic(musicName);
              if (props.roomInfo) {
                props.setTime(musicTime);
                console.log(musicTime);
                var minute  = parseInt(musicTime / 60);
                var second = musicTime % 60;
                console.log(props.roomInfo);
                var tmp_roomInfo = props.roomInfo; 
                tmp_roomInfo['music'] = musicName;
                props.SetRoomIdAndInfo({roomID: props.roomID, roomInfo: tmp_roomInfo});
                strSetTime(String(minute)+' : '+String(second));
                // MusicInput(musicName);  
              }
            });
        }, []);
    return (
          <form className={classes.root} noValidate autoComplete="off">
          <div>
              <TextField
              label={strTime}
              defaultValue={strTime}
              InputProps={{
                  readOnly: true,
              }}
              />
          </div>
          </form>
      );
  }
    useEffect(() => {
      props.socket.once('startGame_Res', (gameTime) => {
        // if (props.roomInfo) {
          // ? props.setTime(gameTime);  // 이미 저번 통신으로 저장한 정보임
          props.history.push('/game');
          // var minute  = parseInt(gameTime / 60);
          // var second = gameTime % 60;
          // var tmp_roomInfo = props.roomInfo; 
          // tmp_roomInfo['music'] = musicName;
          // props.SetRoomIdAndInfo({roomID: props.roomID, roomInfo: tmp_roomInfo});
          // strSetTime(String(minute)+' : '+String(second));
      });
  }, []);
  return(
    <>
        <Grid>
            <MusicInput />
        </Grid>
        <Grid>
            <ShowMusic/>
        </Grid>
        <Button variant="contained" color="primary" disabled> StartGame </Button> 
    </>
  );
}
