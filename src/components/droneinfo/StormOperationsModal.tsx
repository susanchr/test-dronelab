import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import { StormOperationsModalInterface } from "./../../pages/home/reducer";
import { StormOperationsModalVideo } from "./StormOperationsModalElements/StormOperationsModalVideo";
import { StormOperationsModalAlerts } from "./StormOperationsModalElements/StormOperationsModalAlerts";
import { StormOperationsModalActions } from "./StormOperationsModalElements/StormOperationsModalActions";
import { DroneModalMapVideo } from "./DroneModalElements/DroneModalMapVideo";

import { ArrowLeft32 } from '@carbon/icons-react';
import { Close32 } from '@carbon/icons-react';
import { View16 } from '@carbon/icons-react';
import { RadioButtonChecked16 } from '@carbon/icons-react';
import { Rewind_516 } from '@carbon/icons-react';


const useStyles = makeStyles((theme: Theme) => {

    return createStyles({
        storm_operations_modal: {
            width: "95vw",
            height: "95vh",
            backgroundColor: "#e8e6e6",
            display: "grid",
            gridTemplate: "auto auto 1fr / auto",
            overflowX:"hidden",
        },
        top_bar: {
            backgroundColor: "#43556b",
            height: "3rem",
            alignItems: "center",
            display: "grid",
            gridTemplate: "auto / 1fr 10fr 1fr",
            "& > .close_arrow": {
                color: "white",
                "& > svg:hover": {
                    color: "#d0e2ff",
                    cursor: "pointer!important",
                },
            },
            "& > .center_text": {
                display: "flex",
                justifyContent: "center",
                color: "white",
                "& > .center_title": {
                     "& > .strong": {
                         fontWeight: "700",
                         lineHeight: "20px",
                         color: "#0043ce"
                    }, 
                },
                "& > .center_status": {
                     marginLeft: "10px",
                     "& > svg.connectedIcon": {
                         fill: "#24a148",
                         marginLeft: "5px" 
                    }, 
                },
                "& > .center_mode": {
                    marginLeft: "10px",
                    "& > .item": {
                        marginLeft: "5px"
                    },
                    "& > svg.viewingIcon": {
                        fill: "#24a148",
                        marginLeft: "5px" 
                    },
                },
                "& > .cbox": {
                    backgroundColor: "#f4f4f4",
                    borderRadius: "5px",
                    color: "black",
                    lineHeight: "20px",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    "& > .title": {
                        marginRight: "5px"
                    },
                    "& > .green": {
                        fontWeight: "700",
                        color: "#24a148"
                    }
                }
            },
            "& > .left": {
                textAlign: "left",
                marginLeft: "10px"    
            },
            "& > .right": {
                textAlign: "right",
                marginRight: "10px"    
            }
        },
        meta_data: {
            height: "4rem",
            display:"flex",
            alignItems:"center",
            "& > .metadata_holder":{
                backgroundColor: "white",
                borderRadius: "40px",
                height: "3rem",
                width:"100%",
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:"space-between",
                margin:"0rem 1rem 0rem 1rem",
                padding:"0rem 1rem 0rem 1rem",
                "& > .metadata_content": {
                    "& > .detail":{
                        fontWeight: "700",
                        marginLeft: "5px"
                    },
                    "& > .horizontal_spacer":{
                        margin: "0rem 0.5rem 0rem 0.5rem"
                    }
                },
                "& > .btn": {
                    backgroundColor: "#0043ce",
                    borderRadius: "5px",
                    color: "white",
                    lineHeight: "20px",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    height: "70%",
                    "& > svg.rewindBtn": {
                        marginRight: "5px"
                    }
                },
                "& > .btn:hover": {
                    backgroundColor: "#0f62fe",
                    cursor: "pointer"
                },
            }
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
        }
    })
});

// Prop added to pass down serial number
function StormOperationsModal(props: StormOperationsModalInterface) {
    const classes = useStyles();
    return (
        <div id="storm_operations_modal" className={`${classes.storm_operations_modal} storm_operations_modal`}>
            <TopBar friendly_name={'Stormwater Operations Monitor'} closeFunct={props.closeModal} />
            <div className={`${classes.instructions}`}><b>INSTRUCTIONS:</b> Start by clicking on the initial <b>Alerts</b> row to see details. Then click <b>Play</b> under the location videos to observe ongoing analytic detections. See <b>hints</b> on bottom left for guidance.</div>
            <Content/>
        </div>
    );
}

function TopBar(props:{friendly_name:string, closeFunct:()=>void}){
    const {top_bar: styles} = useStyles();
    return (
        <div className={styles} >
            <div className="close_arrow left" onClick={props.closeFunct}><ArrowLeft32 /></div>
            <div className="center_text">
                <div className="center_title cbox">
                    <span className="strong">{props.friendly_name}</span>
                </div>
            </div>
            <div className="close_arrow right" onClick={props.closeFunct}><Close32 /></div>
        </div>
    );
}

function MetaData(props : {friendly_name : string, pilot : string, serial_number : string}){
    const {meta_data: styles} = useStyles();

    return (
        <div className={styles}>
            <div className="metadata_holder">
                <div className="metadata_content">
                    <span>Drone:</span>
                    <span className="detail">{props.friendly_name}</span>
                    <span className="horizontal_spacer">|</span>
                    <span>Date:</span>
                    <span className="detail">{new Date().toLocaleDateString("en-US")}</span>
                    <span className="horizontal_spacer">|</span>
                    <span>Pilot:</span>
                    <span className="detail">{props.pilot}</span>
                    <span className="horizontal_spacer">|</span>
                    <span>Serial:</span>
                    <span className="detail">{props.serial_number}</span>
                </div>
            </div>
        </div>
    );
}

// Prop added to pass down serial number
function Content(){
    const {content: styles} = useStyles();
    // Prop added for DroneModalMap
    return (
        <div className={styles}>    
            <StormOperationsModalVideo /> 
            <StormOperationsModalAlerts /> 
            <DroneModalMapVideo serial_number={'DZXLIWCIXZYNST'} drone_id={'drone1'} />
            <StormOperationsModalActions /> 
        </div>
    );
}

export {StormOperationsModal};