import React, { useEffect, useState } from "react";
import getFormattedTime from "../../../helper/getFormattedTime"

export type Alert = {
    "id": number
    "severity": string,
    "type": string,
    "start": number,
    "end": number,
    "title": string,
    "thumbnail": string,
    "description": string
};

export default function AlertElement(props:{alert_element:Alert,setSelectedAlert:(alert_id:Alert)=>void,is_selected:boolean}) {
    const {alert_element,setSelectedAlert,is_selected} = props;
    const {title,severity,type} = alert_element;

    const class_list = ["alert"];

    if( is_selected===true ){
        class_list.push("selected");
    }

    return (
        <div className={class_list.join(" ")} onClick={()=>{setSelectedAlert(alert_element)}}>
            <div className={`time`}>{getFormattedTime(alert_element.start)}</div>
            <div className={`severity`}><div className={`circle ${severity.toUpperCase()}`}></div></div>
            <div className={`type ${type}`}>{type.toUpperCase()}</div>
            <div className="title">{title}</div>
        </div>
    );
}
