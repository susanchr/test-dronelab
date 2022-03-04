import React, { useContext, useEffect, useState } from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Box from '@material-ui/core/Box';

import {
  HomeStateContext,
  actionCreator,
  UserConfig,
  defaultUserConfig,
} from "./reducer";
import MapWidget from "../../components/map";
import DroneInfo from "../../components/droneinfo";
import Weather, { weather } from "./../../components/weather";
import PreviousFlight from "./../../components/previousFlight";
import YourFlight from "./../../components/yourFlight";
import FlightOperation from "./../../components/flightOperation";
import Carousel from "./../../components/addtionalOp";
import OpStat from "./../../components/operationStats/";
import Usage from "./../../components/analyticsUsage";
import { WarningFilled32 } from "@carbon/icons-react";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      backgroundColor: "#e7e6e6",
      padding: "10px",
      height: "100vh",
      width: "100vw",
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gridTemplateRows: "10vh 35vh 35vh 14vh",
      gap: "10px",
      gridTemplateAreas: `
        "title title title title title title title title"
        "map map map map info info weather weather"
        "prev prev status op stat stat usage usage"
        "carousel carousel carousel carousel carousel carousel carousel carousel"
        `,
    },
    header: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "20px",
      height: "10vh",
      width: "100%",
      gridArea: "title",
      textAlign: "center",
      fontSize: "2em",
      position: "relative",
    },
    warnSign: {
      position: "absolute",
      fill: "red",
      right: "0",
      top: "0",
      margin: "10px 10px 0 0",
      transition: "all 0.3s",
      "&:hover": {
        transform: "scale(1.2)",
        cursor: "pointer",
      },
    },
    errDialog: {
      margin: "10px",
    },
    mapWidget: {
      gridArea: "map",
      padding: "1px",
    },
    droneInfoWidget: {
      gridArea: "info",
    },
    weather: {
      gridArea: "weather",
      backgroundColor: "#5b9bd5",
    },
  })
);

const Home = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(HomeStateContext);
  const [config, setConfig] = useState<UserConfig>();
  const [errDialog, setErrDialog] = useState<boolean>(false);
  const fetchData = async (dispatch: any) => {
    try {
      const res = await fetch("/config.json");
      const data: UserConfig = await res.json();
      setConfig(data);
      dispatch(actionCreator.updateUserConfig(data));
    } catch (e) {
      defaultUserConfig.readError = true;
      dispatch(actionCreator.updateUserConfig(defaultUserConfig));
      dispatch(
        actionCreator.addErrorInfo(
          "There was some issue with the values in the config.json that caused an error, so default values were loaded into the associated fields in order to allow you to continue using the application interface. If curious as to what might have gone wrong, you can go back to your GitHub repository to review the config.json and revert back to a previous version if needed."
        )
      );
      setErrDialog(true);
    }
  };
  // console.log(state);
  useEffect(() => {
    fetchData(dispatch);
  }, []);
  return (
    <React.Fragment>
      <Dialog open={errDialog}>
        <div className={classes.errDialog}>
          {"Errors:"}
          <ul>
            {state.errInfo &&
              state.errInfo.map((err: string, i: number) => {
                return <li key={i}>{err}</li>;
              })}
          </ul>
        </div>
        <Button
          onClick={() => {
            setErrDialog(false);
          }}
        >
          {"close"}
        </Button>
      </Dialog>
      <Box className={classes.layout}>
        <Paper className={classes.header}>
          {state.errInfo.length === 0 &&
            state.userConfig.ConsoleDisplayName &&
            state.userConfig.ConsoleDisplayName}
          {state.errInfo.length !== 0 && "Remote Operations Console - ERROR"}
          {state.errInfo.length === 0 &&
            (!state.userConfig.ConsoleDisplayName ||
              state.userConfig.ConsoleDisplayName.length === 0) &&
            "Remote Operations Console - ERROR(title)"}
          {state.userConfig.readError && (
            <WarningFilled32
              className={classes.warnSign}
              onClick={() => {
                setErrDialog(true);
              }}
            />
          )}
        </Paper>
        <Paper className={classes.mapWidget}>
          <MapWidget isInteractive={true} />
        </Paper>
        <Paper className={classes.droneInfoWidget}>
          <DroneInfo />
        </Paper>
        <Paper className={classes.weather}>
          <Weather
            WeatherIcon={weather.WeatherIcon}
            flightCondition={weather.flightCondition}
            location={weather.location}
            temperature={weather.temperature}
            visiability={weather.visiability}
            wind={weather.wind}
          />
        </Paper>
        <PreviousFlight gridArea="prev" />
        <YourFlight gridArea="status" />
        <FlightOperation gridArea="op" />
        <OpStat gridArea="stat" />
        <Usage gridArea="usage" />
        <Carousel gridArea="carousel" />
      </Box>
    </React.Fragment>
  );
};
export default Home;
