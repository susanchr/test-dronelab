import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import controlsImg from "./controlpad.png";

import { Warning32 } from '@carbon/icons-react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        controls:{
            "&":{
                display:"grid",
                "grid-template":"auto auto 1fr / 1fr",
            },
            "& > .controlsTitle": {
                display: "block",
                width: "100%",
                textAlign: "center",
                backgroundColor: "#3A3838",
                color: "white",
                padding: "5px",
                fontSize: "1.15rem"
            },
             "& > .controlPad": {
                display: "flex",
                "align-items":"center",
                width: "100%",
                textAlign: "center",
                 backgroundColor: "gray",
                 padding: "5px 0px",
                "& > .controlsImg": {
                    maxWidth:"100%",
                    display: "block",
                    margin: "0 auto",
                    opacity: "0.4" /* lower opacity if controls are unavailable */
                },
            },
            "& > .status": {
                backgroundColor: "#f4f4f4",
                borderRadius: "5px",
                color: "black",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                height: "32px",
                justifyContent: "center",
                "& > .item": {
                    margin: "0px 2px"
                },
                "& > .red": {
                    color: "#da1e28"
                }
            }, 
        }
    })
);

function DroneModalControls() {
    const classes = useStyles();
    return (
        <div className={classes.controls}>
            <div className="controlsTitle">Drone Control Pad</div>
            <div className="status">
                <Warning32 className="item" />
                <span className="item">Control pad is</span>
                <strong className="item red">unavailable</strong>
                <span className="item">in <strong>Observation Only</strong> Mode</span>
            </div>
            <div className="controlPad"><img src={controlsImg} className="controlsImg" alt="Drone Controls" /></div>
        </div>
    );
}

export { DroneModalControls };