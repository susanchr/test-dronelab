import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Dialog from "@material-ui/core/Dialog";

import { ArrowLeft32 } from '@carbon/icons-react';
import { Close32 } from '@carbon/icons-react';
import { View16 } from '@carbon/icons-react';
import { RadioButtonChecked16 } from '@carbon/icons-react';
import { Rewind_516 } from '@carbon/icons-react';
import { title } from "process";


const useStyles = makeStyles((theme: Theme) => {

    // return createStyles({});
    // TODO remove this comment
    return createStyles({
        light_bulb_action_modal: {
            width: "40vw",
            // height: "50vh",
            backgroundColor: "#e8e6e6",
            overflowX:"hidden",
            padding:"1rem",
            display:"grid",
            gridTemplate:"auto 1fr / 1fr",
            alignItems:"center",
        },
        top_bar: {
            display:"flex",
            fontSize:"2rem",
            justifyContent:"space-between",
            width:"100%",
            color:"#476999",
            height:"auto",
        },
        content: {
            display: 'grid',
            gridTemplate:"50% 50% / 1fr 1fr 1fr",
            padding:"0rem 1rem 1rem 1rem",
            colmunGap:".5rem",
            gridGap: ".5rem",
            height: "100%",
            flexGrow:1,
        },
        dialog: {
          "& > div": {
            "& > div": {
              // display: "flex",
              // flexDirection: "column",
              alignItems: "center",
              maxHeight:"100vh",
              maxWidth: "100vw",
              backgroundColor: "#e8e6e6"
            }
          }
        },
    })
});

// Prop added to pass down serial number
function LightBulbGuidePopup(props:{open:boolean,setOpen:(v:boolean)=>any,popup_text:string,title:string}) { // TODO change from any
    const classes = useStyles();

    return (<Dialog className={classes.dialog} open={props.open}>
        <div id="light_bulb_action_modal" className={`${classes.light_bulb_action_modal} light_bulb_action_modal`}>
            <TopBar closeFunct={()=>{props.setOpen(false);}} title={props.title}></TopBar>
            <div>{props.popup_text}</div>
        </div>
    </Dialog>)
}

function TopBar(props:{title:string,closeFunct:()=>void}){
    const {top_bar: styles} = useStyles();
    return (
        <div className={styles}>
            <div>{props.title}</div>
            <div className="close_arrow right" onClick={props.closeFunct}><Close32 /></div>
        </div>
    );
}

export default LightBulbGuidePopup;