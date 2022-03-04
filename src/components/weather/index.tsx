import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import { PartlyCloudy32, CarbonIconType } from "@carbon/icons-react";
export interface WeatherInfo {
  location: {
    name: string;
    coordinate: string;
  };
  flightCondition: string;
  WeatherIcon: CarbonIconType;
  wind: {
    speed: number;
    direction: string;
  };
  temperature: number;
  visiability: number;
}

export const weather: WeatherInfo = {
  flightCondition: "Clear",
  location: {
    coordinate: "39°09'24.6''S 175°37'55.8''E.",
    name: "Coppell, TX",
  },
  temperature: 77,
  visiability: 10.0,
  wind: { direction: "SW", speed: 10 },
  WeatherIcon: PartlyCloudy32,
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      padding: "5px",
      display: "grid",
      gap: "15px",
      width: "100%",
      height: "100%",
      gridTemplateColumns: "repeat(3,1fr)",
      gridTemplateAreas: `
        "date date date"
        "loc loc loc"
        "cond cond cond"
        "wind temp vis"
        `,
    },
    date: {
      gridArea: "date",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    location: {
      gridArea: "loc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    condition: {
      gridArea: "cond",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    wind: {
      gridArea: "wind",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    temp: {
      gridArea: "temp",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    vision: {
      gridArea: "vis",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    iconfill: { fill: "#ACDFE3" },
    boldNum: { fontWeight: "bolder", fontSize: "1.5em" },
  })
);
const WeatherWidget = (info: WeatherInfo) => {
  const classes = useStyles();
  return (
    <div className={classes.layout}>
      <Paper className={classes.date}>
        <span>{new Date().toDateString()}</span>
        <span>{new Date().toTimeString()}</span>
      </Paper>
      <Paper className={classes.location}>
        <span style={{ color: "#436a8e" }}>Current Location</span>
        <span>{info.location.name}</span>
        <span>{info.location.coordinate}</span>
      </Paper>
      <Paper className={classes.condition}>
        <span>Flight Conditions</span>
        <span className={classes.boldNum} style={{ color: "#47c278" }}>
          {info.flightCondition}
        </span>
      </Paper>
      <Paper className={classes.wind}>
        <span>Wind</span>
        <span className={classes.boldNum}>{info.wind.speed}</span>
        <span>{`mph ${info.wind.direction}`}</span>
      </Paper>
      <Paper className={classes.temp}>
        {<info.WeatherIcon className={classes.iconfill} />}
        <span className={classes.boldNum}>{`${info.temperature}ºF/${(
          (info.temperature - 32) /
          1.8
        ).toFixed(0)}ºC`}</span>
      </Paper>
      <Paper className={classes.vision}>
        <span>Visibility</span>
        <span className={classes.boldNum}>{info.visiability.toFixed(1)}</span>
        <span>
          {info.visiability >= 8 && "Good"}
          {info.visiability > 5 && info.visiability < 8 && "Medium"}
        </span>
      </Paper>
    </div>
  );
};

export default WeatherWidget;
