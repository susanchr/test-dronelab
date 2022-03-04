import React, { useState } from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import MapWidget from "../../map";
import { useDroneStatus } from "../../../drone_connector/droneController";
import useVideoTime from "../../../helper/useVideoTime";
import LightBulbGuide from "../../../helper/LightBulbGuide";

import {location as location_helper} from "../../../helper/LightBulbGuide.json"

import {start_lat,start_lon,end_lat,end_lon} from "../../../helper/drone_trip.json";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        map:{
            backgroundColor: "#dcdcdc",
            "& > .mapTitle": {
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
            "& > .mapArea": {
                height:"90%"
            }
        }
    })
);
// Added a prop that takes in serial number of the drone
interface DroneModalMapProps {
    serial_number : string
    drone_id : string
}

function DroneModalMapVideo(props : DroneModalMapProps) {
    console.log("serial", props.serial_number)
    const classes = useStyles();
    const video_time = useVideoTime("#video2");

    let drone_data : any = getDroneDataFromVideoTime(video_time, "#video2");

    return (
        <div className={classes.map}>
            <div className="mapTitle">
                <img className="flex_spacer" src="/lightbulb.png"></img>
                <div>Location</div>
                <LightBulbGuide title={location_helper.title} text={location_helper.text}></LightBulbGuide>
            </div>
            <div className="mapArea">
                <MapWidget isInteractive={true} startingZoomLevel={13.1} target_serial={props.serial_number} drone_data={drone_data}/>
            </div>
        </div>
    );
}

export { DroneModalMapVideo };

function getDroneDataFromVideoTime(video_time:number, video_selector:string) {
    console.log('getDroneDataFromVideoTime video_time='+video_time);

    const video_ele = document.querySelector(video_selector) as HTMLVideoElement;

    let vid_duration = (()=>{
        if(video_ele!==null && !Number.isNaN(video_ele.duration)){
            return video_ele.duration;
        }
        return video_time > 0 ? video_time : 1;
    })();

    const video_percent = video_time/vid_duration;

    const resulting_lat = getResultingCoordinate(start_lat,end_lat,video_percent);
    const resulting_lon = getResultingCoordinate(start_lon,end_lon,video_percent);

    const to_return = {
        "_id": "0684dbf46f773eca3379da8500090e55",
        "_rev": "15-7508f0acb95188bc5f97a2c4ca12b6de",
        "date": 1597107492819,
        "data": {
            "pitch": "-5",
            "roll": "0",
            "yaw": "-24",
            "vgx": "13",
            "vgy": "-3",
            "vgz": "-1",
            "templ": "69",
            "temph": "71",
            "tof": "474",
            "h": "380",
            "bat": "84",
            "baro": "175.74",
            "time": "24",
            "agx": "-89.00",
            "agy": "-33.00",
            "agz": "-963.00",
            "location": "32.9426941,-96.994820"
        },
        "type": "toy",
        "drone_id": "drone1"
    };

    to_return.data.location = `${resulting_lat},${resulting_lon}`;

    return to_return;
}

function getResultingCoordinate(start:number,end:number,percent:number){
    let adjusted_percent = percent <= .5 ? 2 * percent : -2 * percent + 2; // turn around half way
    return Math.abs(start-end)*adjusted_percent+start;
}