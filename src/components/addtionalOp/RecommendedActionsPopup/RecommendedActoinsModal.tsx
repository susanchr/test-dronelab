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
        recommended_actions_modal: {
            width: "90vw",
            height: "90vh",
            backgroundColor: "#e8e6e6",
            overflowX:"hidden",
            padding:"1rem",
            display:"flex",
            flexDirection:'column',
            justifyContent:"space-around",
            alignItems:"center",
            borderRadius: "75px",
        },
        top_bar: {
            display:"flex",
            fontSize:"2rem",
            justifyContent:"space-between",
            width:"100%",
            color:"#476999",
        },
        img: {
            maxHeight:"85%",
            maxWidth:"90%",
        },
        ok: {
            backgroundColor:"#465467",
            borderRadius: "5px",
            color:"white",
            fontSize:"1.5rem",
            height:"2.5rem",
            width:"8rem",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
        },
        content: {
            display: 'grid',
            gridTemplate:"1fr 1fr / 1fr 1fr 1fr",
            padding:"0rem 1rem 1rem 1rem",
            colmunGap:".5rem",
            gridGap: ".5rem",
            height: "100%"
        },
        instructions: {
            padding: "10px",
            backgroundColor: "#f8ff58",
            borderRadius: "10px",
            margin: "10px",
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
function RecommendedActionsModal(props:{open:boolean,setClosed:()=>any,img:string,title:string}) { // TODO change from any
    const classes = useStyles();

    return (<Dialog className={classes.dialog} open={props.open}>
        <div id="recommended_actions_modal" className={`${classes.recommended_actions_modal} recommended_actions_modal`}>
            <TopBar closeFunct={()=>{props.setClosed();}} title={props.title}></TopBar>
            <img src={props.img} className={classes.img}></img>
            <div className={classes.ok} onClick={()=>{props.setClosed();}}>OK</div>
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

export {RecommendedActionsModal};