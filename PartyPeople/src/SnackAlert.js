import React from 'react';
import { useSnackbar } from 'notistack';
import './ShiningButton.css';
//@ 5 params
//? ------- props -----------------------------
//? {
//?     onAlert = 조건문.
//?     severity = [error, warning, info, success]
//?     message = "스낵메세지"
//?     label = "버튼라벨"
//?     class = ex "btn btn-warning"
//?     onClick = ...
//? }
//? -------------------------------------------

// 효과음
import Error_Sound from './audios/effect/Error.mp3';

export function SnackAlertBtn(props) {
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant) => () => {
        props.onClick();
        // variant could be success, error, warning, info, or default
        if (props.onAlert) {
            enqueueSnackbar(props.message, {
                variant,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 1500,
            });
        }
    };
    return (
        <>
            <button
                class={props.class}
                // style={{padding:'1.2vh', margin:'0.5vw', width: '4vw'}} //height: '5vh'
                style={{ fontSize: '1.2vw', margin:'0vw',padding: '1vh 1.5vw', width:props.width,  height:props.height,  margin:props.margin, padding:props.padding, border: '0.3vw solid',}}
                onClick={handleClickVariant(props.severity)}
            >
                {props.label}
            </button>
        </>
    );
}

//@ 2 params
//? ------- props -----------------------------
//? {
//?     severity = [error, warning, info, success]
//?     message = "스낵메세지"
//? }
//? -------------------------------------------
let index = 0;
export function SnackAlertFunc(props) {
    const { enqueueSnackbar } = useSnackbar();
    // variant could be success, error, warning, info, or default
    const parseMsg = props.message.split(')')[1];

    if (props.severity === 'warning') {
        let tmpAudio = new Audio(Error_Sound);
        tmpAudio.play();
        tmpAudio.remove();
    }

    const callback = () => {
        enqueueSnackbar(props.message, {
            variant: props.severity,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            autoHideDuration: 1500,
            preventDuplicate: true,
        });
    };
    callback();
    return <></>;
}
