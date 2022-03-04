import React, { useState } from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import MapWidget from "../../map";
import { useDroneStatus } from "../../../drone_connector/droneController";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        map:{
            backgroundColor: "#dcdcdc",
            "& > .mapTitle": {
                display: "block",
                width: "100%",
                textAlign: "center",
                backgroundColor: "#3A3838",
                color: "white",
                padding: "5px",
                fontSize: "1.15rem"
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

function DroneModalMap(props : DroneModalMapProps) {
    console.log("serial", props.serial_number)
    const classes = useStyles();
    const [should_make_call,setShouldMakeCall] = useState(true);

    let drone_data : any = useDroneStatus(props.drone_id || "", should_make_call);

    if( drone_data!==undefined && drone_data.out_of_data===true && should_make_call===true ){
      setShouldMakeCall(false);
    }

    return (
        <div className={classes.map}>
            <div className="mapTitle">Location</div>
            <div className="mapArea">
                <MapWidget isInteractive={true} startingZoomLevel={13.1} target_serial={props.serial_number} drone_data={drone_data}/>
            </div>
        </div>
    );
}

export { DroneModalMap };

//