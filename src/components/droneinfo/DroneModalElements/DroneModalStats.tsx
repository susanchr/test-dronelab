import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import { TemperatureHot32, TemperatureFrigid32, Time32 } from '@carbon/icons-react';

import { Chart } from "react-google-charts";
import ReactSpeedometer from "react-d3-speedometer";

import { useDroneStatus } from "../../../drone_connector/droneController";

import { DroneStatsElementProps, DroneStatBatteryProps, DroneStatGChartProps, DroneStatMiniRadialChartProps, DroneStatsElementTempProps } from "../../../pages/home/reducer";

import ReactDOM from "react-dom";
import { color } from "d3-color";
import { interpolateRgb } from "d3-interpolate";

const LiquidFillGauge = require('react-liquid-gauge');

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        stats_wrapper:{
            width:"100%",
            height:"100%",
            display: "grid",
            gridTemplate:"auto 1fr / auto",
        },
        statsTitle:{
            display: "block",
            width: "100%",
            textAlign: "center",
            backgroundColor: "#3A3838",
            color: "white",
            padding: "5px",
            fontSize: "1.15rem"
        },
        stats:{
            backgroundColor:"white",
            display:"flex",
            flexWrap: "wrap",
            width:"100%",
            "& > .break": {
                flexBasis: '100%',
                height: '0',
            },
            "& > .drone_stats_ele":{
                backgroundColor:"#f2f2f2",
                margin:".25rem",
                padding:".5rem",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
            },
            "& > .drone_stats_ele_big":{
                margin:".25rem",
                padding:"2rem",
                display: "flex",
                flexDirection:"column",
                alignItems:"center",
            },
            "& > .drone_stats_ele_temp": {
                borderRadius: "2rem",
                margin:".25rem",
                padding:".5rem",
                display: "flex",
                flexDirection:"column",
                alignItems: "center",
                justifyContent: "center",
            },
            "& > .drone_stats_ele_clear":{
                margin: ".25rem",
                display: "flex",
                padding: ".25rem",
                alignItems: "center",
                flexDirection: "column"
            },
            "& .drone_double_stats_ele":{
                backgroundColor:"#f2f2f2",
                margin:".25rem",
                display:"grid",
                gridTemplate:"auto 1fr / auto",

                "& > .double_title":{
                    padding:".25rem",
                    textAlign:"center"
                },
                "& > .double_content":{
                    padding:".25rem",
                    display:"flex",
                    justifyContent:"space-around",
                    "& > .doubles_single_content":{
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"space-between",
                        alignItems:"center",
                        "& > .doubles_text":{
                            fontWeight:"bold",
                            fontSize:"2rem"
                        }
                    },
                    "& > div":{
                        padding:"0rem 3rem 0rem 3rem"
                    }
                }
            }
        },
    })
);

function DroneModalStats( props:{drone_id:string} ) {
    const classes = useStyles();
    const [should_make_call,setShouldMakeCall] = useState(true);
    const drone_data = useDroneStatus(props.drone_id, should_make_call);

    if( drone_data!==undefined && drone_data.out_of_data===true && should_make_call===true ){
        setShouldMakeCall(false);
    }

    const stat_elements = ((drone_data)=>{
        const to_return = [];
        
        if (drone_data !== undefined && drone_data.err !== undefined) {
            to_return.push(<div key={to_return.length}>No flight data</div>);
        } else if (drone_data !== undefined && drone_data.data !== undefined) {
            const drone_stats = drone_data.data;
            const locArray = drone_stats.location.split(",")
            to_return.push(
                <div key={to_return.length} style={{backgroundColor:"white"}}>
                        <div style={{"display":"flex", "flexWrap": "wrap"}}>
                            <DroneStatsElementBig text={formatFlightTime(drone_stats.time)} bottom_text="Total Flight Time"></DroneStatsElementBig>
                            <DroneStatGChart text={drone_stats.baro} title="Barometer" unit="mb"></DroneStatGChart>
                            <DroneStatGChart text={drone_stats.h} title="Height" unit="cm"></DroneStatGChart>
                            <DroneStatBattery text={drone_stats.bat}></DroneStatBattery>
                            <DroneStatsElementTemp icon="h" text={drone_stats.temph} bottom_text="Temp (High)" border="5px solid red"></DroneStatsElementTemp>
                            <DroneStatsElementTemp icon="l" text={drone_stats.templ} bottom_text="Temp (Low)" border="5px solid blue"></DroneStatsElementTemp>
                        </div>
                
                        <div style={{"display":"flex", "flexWrap": "wrap"}}>

                            <DroneStatMiniRadialChart start_color="purple" end_color="blue" text={drone_stats.vgx} title="Speed X" unit="cm/s"></DroneStatMiniRadialChart>
                            <DroneStatMiniRadialChart start_color="purple" end_color="blue"  text={drone_stats.vgy} title="Speed Y" unit="cm/s"></DroneStatMiniRadialChart> 
                            <DroneStatMiniRadialChart start_color="green" end_color="blue"  text={drone_stats.agx} title="Acceleration X" unit="cm/s/s"></DroneStatMiniRadialChart>
                            <DroneStatMiniRadialChart start_color="green" end_color="blue"  text={drone_stats.agy} title="Acceleration Y" unit="cm/s/s"></DroneStatMiniRadialChart>
                        </div>
                    
                        <div style={{"display":"flex", "justifyContent":"space-around"}}>
                            <DroneStatsElement text={drone_stats.pitch} bottom_text="Pitch (°)"></DroneStatsElement>
                            <DroneStatsElement text={drone_stats.roll} bottom_text="Roll (°)"></DroneStatsElement> 
                            <DroneStatsElement text={drone_stats.yaw} bottom_text="Yaw (°)"></DroneStatsElement> 
                            <DroneStatsElement text={locArray[0]} bottom_text="Latitude"></DroneStatsElement>
                            <DroneStatsElement text={locArray[1]} bottom_text="Longitude"></DroneStatsElement>
                        </div>

                    </div>
            )
        }else{
            to_return.push(<div key={to_return.length} style={{display:"flex", width:"100%",alignItems:"center", justifyContent:"center"}}>Connecting...</div>);
        }

        return to_return;
    })(drone_data);

    const out_of_data_text = should_make_call===false ? " (flight ended)" : "";
    
    return (
        <div className={classes.stats_wrapper}>
            <div className={classes.statsTitle}>Telemetry <span style={{"color":"#f44"}}>{out_of_data_text}</span></div>
                {/* {JSON.stringify(drone_data,null,2)} */}
                <div>
                    {stat_elements}
                </div>
        </div>
    );
}

 
interface BatteryProps { 
        height: number,
        width: number,
        value: number,
        percent: string,
        textSize: number,
        textOffsetX: number,
        textOffsetY: number,
    }

function DroneStatBattery(props: DroneStatBatteryProps) {
    let startColor = "#dc143c"; // cornflowerblue 
    let endColor = "#6495ed"; // crimson
        
    const radius = 60;
    const interpolate = interpolateRgb(startColor, endColor);
    const fillColor = interpolate(parseFloat(props.text) / 100);
    const gradientStops = [
      {
        key: "0%",
        stopColor: fillColor,
        stopOpacity: 1,
        offset: "0%"
      },
      {
        key: "50%",
        stopColor: fillColor,
        stopOpacity: 0.75,
        offset: "50%"
      },
      {
        key: "100%",
        stopColor: fillColor,
        stopOpacity: 0.5,
        offset: "100%"
      }
    ];
  
    let to_return = [];
        
    to_return.push(<div key={to_return.length}>{
        <div style={{display : "flex", alignItems : "center"}}>
        <LiquidFillGauge
          style={{ margin: "0 auto" }}
          width={radius * 2}
          height={radius * 2}
          value={parseFloat(props.text)}
          percent="%"
          textSize={1}
          textOffsetX={0}
          textOffsetY={0}
          textRenderer={(props: BatteryProps) => {
            const value = Math.round(props.value);
            const radius = Math.min(props.height / 2, props.width / 2);
            const textPixels = (props.textSize * radius) / 2;
            const valueStyle = {
                fontSize: textPixels * 0.8
            };
            const percentStyle = {
              fontSize: textPixels * 0.5
            };
            const titleStyle = {
              display: "block"
            };  

              return (
                  <tspan x="0" y="-10">
                      <tspan x="0" dy="1em">
                <tspan className="value" style={valueStyle}>
                  {value}
                </tspan>
                    <tspan style={percentStyle}>{props.percent}</tspan>
                  </tspan >
                      <tspan x="0" dy="1em" style={titleStyle}>Battery</tspan>
              </tspan>        
            );
          }}
          riseAnimation
          waveAnimation
          waveFrequency={2}
          waveAmplitude={1}
          gradient
          gradientStops={gradientStops}
          circleStyle={{
            fill: fillColor
          }}
          waveStyle={{
            fill: fillColor
          }}
          textStyle={{
            fill: "#444",
            fontFamily: "Arial"
          }}
          waveTextStyle={{
            fill: "#fff",
            fontFamily: "Arial"
          }}
        />
      </div>}</div>);
  
      
  
      return (
        <div className="drone_stats_ele_clear" style={{"margin":"auto"}}>
              {to_return}
        </div>
    );
}

interface RadialProps { 
        height: number,
        width: number,
        value: number,
        percent: string,
        textSize: number,
        textOffsetX: number,
        textOffsetY: number,
    }

function DroneStatRadialChart(props: DroneStatGChartProps) { 
    const styles = {
  title: {
      fontSize: "1em",
      color: "#000"
  }
    };

  let to_return = [];

    let key_count = 0;
        
    to_return.push(<div key={to_return.length}>{
        <div style={{
            width: "300px",
            height: "150px",
        }}>
            <ReactSpeedometer
            fluidWidth={true}  
                maxValue={500}
                minValue={-50}
                value={parseFloat(props.text)}
                currentValueText={props.title + ": ${value} cm"}
                needleTransition="easeQuadIn"
                needleTransitionDuration={1000}
                needleColor="red"
                startColor="green"
                endColor="blue"
                segments={5555}
                maxSegmentLabels={0}
      />
    </div>}</div>);
  
      
  
      return (
        <div className="drone_stats_ele_clear">
              {to_return}
        </div>
    );
}

function DroneStatMiniRadialChart(props: DroneStatMiniRadialChartProps) { 
    const styles = {
  title: {
      fontSize: "1em",
      color: "#000"
  }
    };

  let to_return = [];

    let key_count = 0;
        
    to_return.push(<div key={to_return.length}>{
        <div style={{
            width: "200px",
            height: "140px",
        }}>
            <ReactSpeedometer
            fluidWidth={true}   
            maxValue={150}
            minValue={-150}
            textColor="black"
            value={parseFloat(props.text)}
            currentValueText={props.title + ": ${value} " + props.unit}
            needleTransition="easeQuadIn"
            needleTransitionDuration={1000}
                needleColor="black"
                startColor={props.start_color}
            segments={5555}
            maxSegmentLabels={0}
            endColor={props.end_color}
            />
    </div>}</div>);
  
      
  
      return (
        <div className="drone_stats_ele_clear" style={{"margin" : "auto", overflow:"hiddne"}}>
              {to_return}
        </div>
    );
}

/*
interface TempProps { 
       theme: string,
        value: number,
        max: number,
        steps: number,
        format: string,
        size: string,
    height: number
}
*/


function DroneStatTempChart(props: DroneStatGChartProps) { 
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            text: {
            color: "black"
        },
        container: {
            width: "200px",
            height: "200px",
            position: "relative",
            display: "inline-block",
            verticalAlign: "top",
            backgroundClip: "content-box",
            borderLeft: "10px solid black",
        },
        fade: {
            width: "100%",
            height: "100%",
            position: "absolute",
            bottom: "0",
            backgroundClip: "content-box",
        },
        show: {
            width: "100%",
            height: "0%",
            position: "absolute",
            bottom: "0",
            backgroundClip: "content-box",
        },
        bar: {
            width: "100%",
            height: "0%",
            position: "absolute",
            bottom: "0",
            borderTop: "1px dashed black",
            "& > div": {
                position: "absolute",
                lineHeight: "20px",
                width: "100px",
                top: "-10px",
                right: "-105px",
                fontFamily: "Arial, sans-serif",
                fontSize: "16px",
                textAlign: "center",
                color: "#565656",
                "& > span": {
                    lineHeight: "30px",
                    fontSize: "34px",
                    color: "black"
                }
            }
        }    
    })
    );


    const classesH = useStyles();    



  let to_return = [];

    let key_count = 0;
        
    to_return.push(<div key={to_return.length}>{
        <div>
           
        </div>}</div>);
  
      return (
        <div className="drone_stats_ele_clear">
              {to_return}
        </div>
    );
}





function DroneStatGChart(props: DroneStatGChartProps) {

    const styles = {
        dial: {
            width: `125px`,
            height: `150px`,
            color: "#000",
            //padding: "2px",
            display : "flex", 
            alignItems : "center",
            flexDirection : "column" as "column", // If you don't do this it won't work
            
        },
        title: {
            fontSize: "0.8em",
            color: "#000"
        }
    };
  
    let to_return = [];

    let key_count = 0;
        
    to_return.push(<div key={to_return.length}>{
        <div>
            <div style={styles.dial}>
      <Chart
        height={125}
        width={125}
        chartType="Gauge"
        loader={<div></div>}
        data={[
          ["Label", "Value"],
          [props.title , Number(props.text)]
        ]}
        options={{
          /*redFrom: 90,
          redTo: 200,
          yellowFrom: 50,
          yellowTo: 90,*/
          minorTicks: 5,
          min: -500,
          max: 500
        }}
                />
        <div style={{"textAlign" : "center", whiteSpace:"nowrap" }}>{props.title} : {props.text} {props.unit} </div>

                </div>
        </div>}</div>);
  
      
  
      return (
        <div className="drone_stats_ele_clear" style={{width : "15%", "margin" : "auto"}}>
              {to_return}
        </div>
    );
}

function DroneStatBattery2(props: DroneStatBatteryProps) {
  
    let to_return = [];

    let key_count = 0;
    let temp = 60;
        
    to_return.push(<div key={to_return.length}>{
        <div>
           
            </div>}</div>);
  
      
  
      return (
        <div className="drone_stats_ele">
              {to_return}
            <div className="drone_stats_ele_title"></div>   
        </div>
    );
}

function DroneStatsElement(props:DroneStatsElementProps){

    let to_return = [];

    for( let k in props){

        if( k==="top_text" ){
            to_return.push(<div key={to_return.length}>{props[k]}</div>);
        }
        if( k==="text" ){
            to_return.push(<div key={to_return.length} style={{fontSize:"200%", fontWeight:"bold"}}>{props[k]}</div>);
        }
        if( k==="bottom_text" ){
            to_return.push(<div key={to_return.length} style={{fontSize:"1rem"}}>{props[k]}</div>);
        }
    }

    const style = {
        backgroundColor:"",
        display:"flex",
        flexDirection:"column" as "column",
        alignItems:"center",
    };

    if( props.backgroundColor!==undefined ){
        style.backgroundColor = props.backgroundColor;
    }

    return (
        <div style={style} className="drone_stats_ele">
            {to_return}
        </div>
    );
}

function DroneStatsElementTemp(props:DroneStatsElementTempProps){

    let to_return = [];

    for (let k in props) {
        
        if (k === "icon") { 
            if (props[k] === 'h') {
                to_return.push(<TemperatureHot32 key={to_return.length} />);
            }
            else if (props[k] === 'l') {
                to_return.push(<TemperatureFrigid32 key={to_return.length} />);
            }

            else { 

            }
        }

        if( k==="top_text" ){
            to_return.push(<div key={to_return.length}>{props[k]}</div>);
        }
        if( k==="text" ){
            to_return.push(<div key={to_return.length} style={{ fontSize: "100%", fontWeight: "bold", border: props.border, height: "75px", width: "100%", textAlign: "center", lineHeight: "4.1rem", borderRadius: "75px"}}>{props[k]}<span style={{fontSize: "1rem", fontWeight: "normal", marginTop: "0.7rem"}}>°C</span></div>);
        }
       
    }

    const style = {
        backgroundColor: "",
        margin:"auto",
        display:"flex", alignItems:"center", flexDirection:"column" as "column"
    };

    if( props.backgroundColor!==undefined ){
        style.backgroundColor = props.backgroundColor;
    }

    return (
        <div style={style} className="drone_stats_ele_temp">   
                {to_return}
                <div>{props.bottom_text}</div>
        </div>
    );
}


function DroneStatsElementBig(props:DroneStatsElementProps){

    let to_return = [];

    for( let k in props){

        if( k==="top_text" ){
            to_return.push(<div key={to_return.length}>{props[k]}</div>);
        }
        if( k==="text" ){
            to_return.push(<div key={to_return.length} style={{fontSize:"2rem", fontWeight:"bold"}}>{props[k]}</div>);
        }
        if( k==="bottom_text" ){
            to_return.push(<div key={to_return.length} style={{fontSize:"1rem"}}>{props[k]}</div>);
        }
    }

    const style = {
        backgroundColor:"",
        margin:"auto"
    };
    if( props.backgroundColor!==undefined ){
        style.backgroundColor = props.backgroundColor;
    }

    return (
        <div style={style} className="drone_stats_ele_big">
            <Time32 />    
            {to_return}
        </div>
    );
}

function DroneDoubleStatsElement(props:DroneStatsElementProps){

    return (
        <div className="drone_double_stats_ele">
            <div className="double_title" style={{height:"1.5rem",backgroundColor:"#e0ebf6"}}>{props.top_text}</div>
            <div className="double_content">
                <div className="doubles_single_content">
                    <div className="doubles_text">{props.left_text}</div>
                    <div>{props.bottom_left_text}</div>
                </div>
                <div className="doubles_single_content">
                    <div className="doubles_text">{props.right_text}</div>
                    <div>{props.bottom_right_text}</div>
                </div>
            </div>
        </div>
    );
}


export { DroneModalStats };

function formatFlightTime(t_sec_str:string):string{

    const one_min = 60;
    const one_hr = one_min*60;

    let t_sec = parseInt(t_sec_str);

    const hrs = Math.floor(t_sec / one_hr);
    t_sec = t_sec - (hrs*one_hr);

    const min = Math.floor(t_sec / one_min);
    t_sec = t_sec - (one_min*min);
    // t_sec = t_sec-(hrs*one_hr);


    return `${padZero(hrs)}:${padZero(min)}:${padZero(t_sec)}`

    function padZero(n:number):string{
        if(n<10){
            return `0${n}`;
        }else{
            return `${n}`;
        }
    }
}

