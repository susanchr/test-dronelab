import React, { useState, createRef, RefObject, useEffect  } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import useVideoTime from "../../../helper/useVideoTime";
import LightBulbGuide from "../../../helper/LightBulbGuide"
import getFormattedTime from "../../../helper/getFormattedTime"

import {video as video_helper} from "../../../helper/LightBulbGuide.json";

const vid1 = "http://drone-lab-2020-media-lab-4-admin.dronelabs-ed9112eb83c761afd4c566b0882eaa3e-0000.us-south.containers.appdomain.cloud/input-video.mp4";
const vid2 = "http://drone-lab-2020-media-lab-4-admin.dronelabs-ed9112eb83c761afd4c566b0882eaa3e-0000.us-south.containers.appdomain.cloud/output-video.mp4";

const stats_assumed_height = "500px";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drone_image: {
      "&": {
        display: "grid",
        gridTemplate: "auto 1fr / auto",
        backgroundColor: "white",
        gridArea: "1 / 1 / 3 / 2", 
      },
      "& > .image_title": {
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
      "& > .image_holder": {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        // maxHeight: stats_assumed_height,
        // height: stats_assumed_height,
        flexDirection: "column",
        "& > .vid": {
          // height: "425px",
          width: "400px",
          margin:".5rem 0rem .5rem 0rem"
        },
         "& > .instructions": {
            padding: "10px",
            backgroundColor: "#f8ff58",
            borderRadius: "10px",
            margin: "10px",
        }
      }
    }
  })
);

function StormOperationsModalVideo() {
  const classes = useStyles();

  const video1:RefObject<HTMLVideoElement> = createRef();
  const video2:RefObject<HTMLVideoElement> = createRef();

  const [should_make_call, setShouldMakeCall] = useState(true);

  function setOutOfData() {
    setShouldMakeCall(false);
  }

  return (
    <div className={classes.drone_image}>
      <div className="image_title">
        <img className="flex_spacer" src="/lightbulb.png"></img>
        <div>Location Video + Analytics</div>
        <LightBulbGuide title={video_helper.title} text={video_helper.text}></LightBulbGuide>
      </div>
      <div className="image_holder">
        <select name="cars" id="cars">
          <option>Drone1: GSC Government Team</option>
          <option disabled={true} >Drone2: GSC Industrial Team</option>
          <option disabled={true}>Traffic Cam: Beltline/Airline Dr</option>
          <option disabled={true}>Traffic Cam: Beltline/Wrangler Dr</option>
          <option disabled={true}>Stream Cam: Grpvn Creek @ Southwestern Blvd</option>
          <option disabled={true}>Stream Cam: Northlake @ Olympus Dr</option>
          <option disabled={true}>Steam Cam: Grpvn Creek @ 635 Frontage</option>
          <option disabled={true}>Traffic Cam: Olympus/Beltline Rd</option>
          <option disabled={true}>Citizen Upload user928234</option>
        </select>
        <video id="video1" ref={video1} preload="auto" className="vid">
          <source src={vid1} type="video/mp4" />
        </video>
        <video id="video2" ref={video2} preload="auto" className="vid">
          <source src={vid2} type="video/mp4" />
        </video>
        <VideoControlElement video1={video1} video2={video2} ></VideoControlElement>
        {/* <div className="instructions">Click <b>Pause</b> when a new alert appears to read it. Continue until the video is over.</div> */}
        <div className="instructions">
          <div><b>Hints</b></div>
          <div>• Control the Location Video with Play/Pause button or the time slider above.</div>
          <div>• Interact with Alerts, Location, or Actions to see additional detail.</div>
          <div>• Notice that Alerts, Location, and Actions update based on the time/activity within the video.</div>
          <div>• Use the lightbulb icon to learn about each section</div>
        </div>
      </div>
     
    </div>

  );
}

function VideoControlElement(props:{video1:RefObject<HTMLVideoElement>,video2:RefObject<HTMLVideoElement>}) {

  let [is_playing,setIsPlaying] = useState(false);
  const video_time = useVideoTime("#video2");
  
  const video1=props.video1;
  const video2=props.video2;

  useEffect(()=>{
    if(video2?.current && video2.current.currentTime===video2.current.duration && is_playing===true){
      setIsPlaying(false);
    }
  },[video_time])

  function playPauseVideo() {
    if( video1.current===null || video2.current===null ){
      return;
    }
    if (is_playing === false) {
      video1.current.play();
      video2.current.play();
      if( video2?.current && video2.current.currentTime===video2.current.duration ){
        video1.current.currentTime=0;
        video2.current.currentTime=0;
      }
    } else {
      video1.current.pause();
      video2.current.pause();
    }
    setIsPlaying(!is_playing);
  }

  const play_pause_text=(is_playing===true)?"Pause":"Play";

  return (
    <div style={{display:"flex",width:"100%",justifyContent:"space-around"}}>
      <VideoScrubber video1={video1} video2={video2}></VideoScrubber>
      <input id="vidplaypause" value={play_pause_text} type="button" onClick={playPauseVideo} />
      <div>{getFormattedTime(video_time)}</div>
    </div>
  );
}

function VideoScrubber(props:{video1:RefObject<HTMLVideoElement>,video2:RefObject<HTMLVideoElement>}){

  let [scrub_value,setScrubValue]=useState(0);
  const {video1,video2} = props;
  const video_time = useVideoTime("#video2");

  useEffect(()=>{
    if(video2?.current?.duration){
      setScrubValue(video_time/video2?.current?.duration*100);
    }
  },[video_time]);

  function seekVideoPlayback(e:any){
    
    setScrubValue(e.target.value);

    if( video1.current===null || video2.current===null ){
      console.log('video is null;returning')
      return;
    }

    video1.current.currentTime = video1.current.duration*e.target.value/100;
    video2.current.currentTime = video2.current.duration*e.target.value/100;
  }

  return (
    <input style={{width:"70%"}} type="range" value={scrub_value} step="any" onChange={seekVideoPlayback} />
  );
}

export { StormOperationsModalVideo };