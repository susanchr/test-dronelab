import React, { useState } from "react";

import {Alert} from "./AlertElement";
import AlertElementDetailsImgPopup from "./AlertElementDetailsImgPopup"

export default function AlertElementDetails(props:{selected_alert:Alert|undefined}) {

    const [show_img_modal,setShowImgModal] = useState(false);
    const {selected_alert} = props;

    if(selected_alert===undefined){
        return <div className="alerts_description">Click an alert.</div>;
    }

    return (
        <div className="alerts_description">
            <div className="alerts_content">
                <div className="alert_img" onClick={()=>{setShowImgModal(true)}}>
                    <img style={{ "maxHeight": "100%", maxWidth: "100%" }} src={selected_alert.thumbnail}></img>
                </div>
                <AlertElementDetailsImgPopup open={show_img_modal} setClosed={()=>{setShowImgModal(false)}} img={selected_alert.thumbnail} title={""}></AlertElementDetailsImgPopup>

                <div className="description">
                    {selected_alert.description}
                </div>
            </div>
        </div>
    );
}