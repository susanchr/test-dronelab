import React, { useContext, useState, useEffect } from "react";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import "./scrollbar.css";
import Detail from "./dronedetail";
import {
  DetailInfo,
  HomeStateContext,
  actionCreator,
  UserConfig,
  defaultUserConfig,
} from "./../../pages/home/reducer";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardStyle: {
      height: "100%",
      width: "100%",
      backgroundColor: "#44546a",
      display: "flex",
      flexDirection: "column",
    },
    cardHeaderStyle: {
      textAlign: "center",
      margin: "5%",
      borderRadius: "10px",
      backgroundColor: "#d0d4da",
      height: "25%",
    },
    cardContent: {
      height: "70%",
      overflowY: "scroll",
      padding: "0 5%",
      "& *": {
        overflow: "hidden",
      },
    },
    modal: {
      padding: "5%",
      backgroundColor: "white",
      borderRadius: "10px",
      display: "flex",
      fontSize: "1.5em",
      textAlign: "center",
      whiteSpace: "nowrap",
    },
  })
);
const DroneInfo = () => {
  const classes = useStyles();
  const { dispatch, state } = useContext(HomeStateContext);
  const [DroneData, setDroneData] = useState<DetailInfo[]>(
    state.userConfig.UserDrones
  );
  const [errData, setErrData] = useState<string[]>([]);
  const checkProperty = (propName: string, index: number) => {
    return (
      state.userConfig &&
      state.userConfig.UserDrones &&
      state.userConfig.UserDrones.length > 0 &&
      Object.prototype.hasOwnProperty.call(
        state.userConfig.UserDrones[index % state.userConfig.UserDrones.length],
        propName
      )
    );
  };
  useEffect(() => {
    // setDroneData(
    //   state.previousFlight.flightList[state.previousFlight.currentId]
    //     .droneLocations
    // );
    setDroneData(state.userConfig.UserDrones);
  }, [state.userConfig, state.previousFlight.flightList]);

  return (
    <Card className={classes.cardStyle}>
      <CardHeader
        className={classes.cardHeaderStyle}
        title="Available Drones"
      ></CardHeader>
      <CardContent className={classes.cardContent}>
        {DroneData.map((d, index) => {
          // const friendlyName = checkProperty("friendly_name", index)
          //   ? state.userConfig.UserDrones[
          //       index % state.userConfig.UserDrones.length
          //     ].friendly_name
          //   : "";
          // const serialNo = checkProperty("drone_serial_no", index)
          //   ? state.userConfig.UserDrones[
          //       index % state.userConfig.UserDrones.length
          //     ].drone_serial_no
          //   : "";
          const originalData =
            state.previousFlight.flightList[state.previousFlight.currentId]
              .droneLocations;
          console.log(originalData);
          const currentDrone =
            originalData[
              state.userConfig.UserDrones.length > originalData.length
                ? index % originalData.length
                : index
            ];
          return (
            <Detail
              key={index}
              pilot={d.pilot||""}
              connectStatus={currentDrone.connectStatus}
              discSpace={currentDrone.discSpace}
              model_type={currentDrone.model_type}
              drone_id={d.drone_id}
              drone_serial_no={d.drone_serial_no||""}
              dronePic={currentDrone.dronePic}
              friendly_name={d.friendly_name||""}
            >
              <div className={classes.modal}>
                {"And away, we, go"}
              </div>
            </Detail>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DroneInfo;
