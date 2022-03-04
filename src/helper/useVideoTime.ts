import {useState,useEffect} from "react";
import clock_subscribe from "./clock_subscribe"

export default function useVideoTime(video_selector:string){
    const [video_time,setVideoTime]=useState(0);

    useEffect(()=>{

        return clock_subscribe(()=>{
            const video_ele = document.querySelector(video_selector) as HTMLVideoElement;
            if(video_ele===null){throw new Error('video element not found; video_selector is '+video_selector);}
            const new_current_time = video_ele.currentTime;
            if( new_current_time!==video_time ){
                setVideoTime(new_current_time);
            }
        });
    },[video_time]);

    return video_time;
}
