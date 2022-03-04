import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { getVAEventObj } from "../getVAEventObj";
import AlertElement, {Alert} from "./AlertElement"
import AlertElementDetails from "./AlertElementDetails"
import useVideoTime from "../../../helper/useVideoTime";
import LightBulbGuide from "../../../helper/LightBulbGuide";

import {alerts as alerts_helper} from "../../../helper/LightBulbGuide.json";

const vid1 = "http://drone-lab-2020-media-lab-4-admin.dronelabs-ed9112eb83c761afd4c566b0882eaa3e-0000.us-south.containers.appdomain.cloud/input-video.mp4";
const vid2 = "http://drone-lab-2020-media-lab-4-admin.dronelabs-ed9112eb83c761afd4c566b0882eaa3e-0000.us-south.containers.appdomain.cloud/output-video.mp4";

const stats_assumed_height = "500px";

const useStyles = makeStyles((theme: Theme) =>
 createStyles({
  stormoperations_alerts: {
   "&": {
    display: "grid",
    gridTemplate: "auto 1fr / auto",
    backgroundColor: "white",
    gridArea: "1 / 2 / 2 / 4",
   },
   "& > .alert_title": {
    // display: "block",
    width: "100%",
    textAlign: "center",
    backgroundColor: "#3A3838",
    color: "white",
    padding: "5px",
    fontSize: "1.15rem",
    display:"flex",
    justifyContent:"space-between",
    "& > .lightbulb":{
      height:"1.5rem",
      width:"1.5rem",
      alignSelf:"flex-end"
    },
    "& > .flex_spacer":{
      width:"1.5rem",
      height:"0px"
    }
   },
   "& > .alert_content": {
    display: "inline-block",
    width: "100%",
    height:"35vh",
    "& > .alerts_description": {
     display: "inline-block",
     width: "50%",
     textAlign: "center",
     backgroundColor: "#f2f2f2",
     color: "gray",
     padding: "5px",
     fontSize: "0.8rem",
     height: "100%",
     verticalAlign: "top"
    },
    "& > .alerts_description > .alerts_content":{
       backgroundColor:"#757171",
       color: "#fff",
       height:"calc(100% - 10px)",
       width:"calc(100% - 10px)",
       margin:"5px",
       display:"flex",
       flexDirection:"column",
       alignItems:"center",
       justifyContent:"space-around",
    },
    "& > .alerts_description > .alerts_content > .alert_img":{
        maxHeight:"60%",
        maxWidth:"90%",
    },
    "& > .alerts_description > .alerts_content > .description":{},
    "& > .alerts_list": {
     display: "inline-block",
     width: "50%",
     textAlign: "center",
     backgroundColor: "#fff",
     color: "white",
     padding: "5px",
     fontSize: "1.15rem",
     "& .alert_holder":{
         "height":"31vh",
         "overflow-y":"scroll",
         "overflow-x":"hidden"
     },
     "& .alert, & > .alerts_headers": {
        display: "grid",
        gridTemplate:"1fr / 55px 66px 80px auto",
        padding:"0px 10px 0px 10px",
        "& > *":{
            alignSelf:'center',
            justifySelf:'center',
            display:"flex",
        },
     },
     "& > .alerts_headers": {
         color:'black',
     },
     "& .alert": {
        backgroundColor: "#e7e6e6",
        color: "#000",
        padding: "5px",
        fontSize: "0.8rem",
        margin: "5px",
        "& > *":{
            padding:"0rem .2rem 0rem .2rem",
        },
        "& > .severity":{
            padding:"0rem .2rem 0rem .2rem",
            "& > .circle":{
                width:"1.5rem",
                height:"1.5rem",
                borderRadius:".75rem",
                "&.HIGH":{
                    backgroundColor:"red",
                },
                "&.MEDIUM":{
                    backgroundColor:"orange",
                },
                "&.LOW":{
                    backgroundColor:"yellow",
                },
            }
        },
        "& > .type":{
            padding:"0rem .2rem 0rem .2rem",
            borderColor: "black",
            borderWidth: "3px",
            borderRadius: ".5rem",
            height:"1.5rem",
            display: "flex",
            alignItems:"center",
            justifyContent:"center",
            width:"5rem",
            "&":{
                backgroundColor:"#daca91",
            },
            "&.Drone":{
                backgroundColor:"#daca91",
            },
            "&.Sensor":{
                backgroundColor:"#daca91",
            },
            "&.Video":{
                backgroundColor:"#daca91",
            },
            "&.Weather":{
                backgroundColor:"#daca91",
            },
        },
        "& > .title":{
            padding:"0rem .2rem 0rem .2rem",
            // backgroundColor:"pink"
        }
     },
     "& .alert:hover": {
      backgroundColor: "#757171",
      color: "#fff"
     },
     "& .alert.selected": {
      backgroundColor: "#757171",
      color: "#fff"
     },
    },
   },
  },
 })
);

function StormOperationsModalAlerts() {
 const classes = useStyles();

 const [should_make_call,setShouldMakeCall] = useState(true);
 const [selected_alert,_setSelectedAlert] = useState<Alert>();

 console.log('StormOperationsModalAlerts render (selected) '+JSON.stringify(selected_alert))

function setSelectedAlert(alert:Alert){
    console.log("setting selected alert "+JSON.stringify(alert));
    _setSelectedAlert(alert);
}

function setOutOfData() {
    setShouldMakeCall(false);
}

const out_of_data_text = should_make_call === false ? " (flight ended)" : "";
const [alert_element_list,setAlertElementList] = useState<Array<JSX.Element>>([]);
const video_time = useVideoTime("#video2");

useEffect(()=>{
    
    const current_alerts = getCurrentAlerts(video_time);
    
    const arr:Array<JSX.Element>=[];

    current_alerts.forEach((cur)=>{
        // arr.push(<div key={arr.length} className="alert">{cur.title}</div>);
        const is_selected = JSON.stringify(cur)===JSON.stringify(selected_alert);
        console.log({cur,selected_alert,is_selected})
        arr.push(<AlertElement key={arr.length} alert_element={cur} is_selected={is_selected} setSelectedAlert={setSelectedAlert}></AlertElement>);
    });

    setAlertElementList(arr);

},[video_time, selected_alert]);

return (
    <div className={classes.stormoperations_alerts}>
        <div className="alert_title">
            <img className="flex_spacer" src="/lightbulb.png"></img>
            <div>Alerts</div>
            <LightBulbGuide text={alerts_helper.text} title={alerts_helper.title}></LightBulbGuide>
        </div>
        <div className="alert_content">
            <div className="alerts_list">
                <div className="alerts_headers">
                    <div className={`tile`}>Time</div>
                    <div className={`severity`}>Severity</div>
                    <div className={`type`}>Type</div>
                    <div className="title">Title</div>
                </div>
                <div className="alert_holder">{alert_element_list}</div>
            </div>
            <AlertElementDetails selected_alert={selected_alert}></AlertElementDetails>
        </div>
    </div>
);
}

function getCurrentAlerts(video_time:Number){

    const event_obj = getVAEventObj();
    
    const to_return = event_obj.alerts.reduce(( acc:Array<Alert>, cur:Alert )=>{
        if( cur.start<=video_time && (cur.end>=video_time || cur.end<0) ){
            acc.push(cur);
        }
        return acc;
    },[]).sort((a,b)=>{
        if(a.start > b.start){
            return -1;
        }else if( a.start < b.start ){
            return 1;
        }
        return 0;
    });

    console.log({to_return});

    return to_return;
}

export { StormOperationsModalAlerts };