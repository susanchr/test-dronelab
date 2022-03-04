import { LetterFf16 } from '@carbon/icons-react';
import React, {CSSProperties, useEffect, useState} from 'react';
import "./highlight_animation.css"

export default function HighlightElement(props: { show:boolean, highlight_ref:any, highlight_query_param:string }) { // TODO change from any 
    
    const highlight_ref = props.highlight_ref;
    const [highlight_style,setHighlightStyle] = useState({left:0,top:0,width:0,height:0});

    useEffect(()=>{
        setHighlightStyle(getEleBounds());
        window.addEventListener('resize',event);
        return ()=>{
            window.removeEventListener('resize',event);
        }
        function getEleBounds(){
            const {left,top,height,width} = highlight_ref.current.getBoundingClientRect();
            const padding=5;
            return {
                left:left-padding,
                top:top-padding,
                width:width+2*padding,
                height:height+2*padding
            };
        }
        function event(){
            setHighlightStyle(getEleBounds());
        }
    },[]);

    if(highlight_ref===null || highlight_ref.current===null || getQuery(props.highlight_query_param)!=='true'){
        return null;
    }

    const style: CSSProperties = {
        position: "absolute",
        backgroundColor:"rgba(255,255,0,.5)",
        zIndex:1,
        animation:'blinker .75s linear 0s 5',
        opacity:0,
        pointerEvents:'none',
        borderRadius:"5px",
        ...highlight_style,
    };

    return (<div style={style}></div>);
} 

function getQuery(ref:string){
    return new URLSearchParams(window.location.search).get(ref);
  }