import React, { useState } from "react";
import LightBulbGuidePopup from "./LightBulbGuidePopup"

export default function(props:{text:string,title:string}){

    const {title,text} = props;
    const [popup_show,setPopupShow] = useState(false); 

    function lightClick(){
        console.log('drewlog lightclick '+text);
        setPopupShow(true);
    }

    return (
        <>
            <img className="lightbulb" onClick={lightClick} src="/lightbulb.png"></img>
            <LightBulbGuidePopup open={popup_show} setOpen={setPopupShow} popup_text={text} title={title}></LightBulbGuidePopup>
        </>
    );
}