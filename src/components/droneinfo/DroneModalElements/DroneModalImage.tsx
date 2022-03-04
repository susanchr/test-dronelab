import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import DroneImage from "../../../drone_connector/DroneImage"

const stats_assumed_height = "353px";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drone_image:{
        "&":{
          display: "grid",
          gridTemplate: "auto 1fr / auto",
          backgroundColor:"white",
        },
        "& > .image_title": {
            display: "block",
            width: "100%",
            textAlign: "center",
            backgroundColor: "#3A3838",
            color: "white",
            padding: "5px",
            fontSize: "1.15rem"
        },
          "& > .image_holder":{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            // maxHeight: stats_assumed_height,
            height: stats_assumed_height,
          }
    }
  })
);

function DroneModalImage(props:{drone_id:string}) {
    const classes = useStyles();
    const {drone_id} = props;

    const [should_make_call, setShouldMakeCall] = useState(true);

    function setOutOfData(){
      setShouldMakeCall(false);
    }

    const out_of_data_text = should_make_call===false ? " (flight ended)" : "";

    return (
        <div className={classes.drone_image}>
            <div className="image_title">Drone Viewer<span style={{"color":"#f44"}}>{out_of_data_text}</span></div>
            <div className="image_holder" style={{height:stats_assumed_height}} ><DroneImage drone_id={drone_id} height={stats_assumed_height} setOutOfData={setOutOfData}/></div>
        </div>

    );
}

export {DroneModalImage};