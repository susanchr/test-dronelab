import React, {useState, useEffect} from 'react';

import { useDroneImage } from "./droneController";

function DroneImage(props:{drone_id:string, height:string, setOutOfData:()=>void}){

    const {drone_id, height, setOutOfData} = props;
    const [should_make_call,setShouldMakeCall] = useState(true);

    let drone_img_obj = useDroneImage(drone_id, should_make_call);

    if( drone_img_obj===undefined ){
        return null;
    }

    if( drone_img_obj.err===true && should_make_call===true ){
        setShouldMakeCall(false);
        setOutOfData();
    }

    const style={
        "maxWidth":"100%",
        "maxHeight":"100%"
    };

    return (
        <div style={{display:"flex",alignItems:"center", alignContent:"center", maxHeight:"100%", maxWidth:"100%", height}}>
            <img style={style} src={drone_img_obj.img_url} alt="Connecting..."></img>
        </div>
    );
}


export default DroneImage;