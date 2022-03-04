import React from "react";
import SimpleCard from "./../shared/centeredSimpleCard";
import DetailCard from "./detailCard";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);
const flightData = [
  {
    icon: require("./../../assets/img/timer.svg"),
    number: 5.2,
    title: "Avg flight speed",
    unit: "MPH",
  },
  {
    icon: require("./../../assets/img/track.svg"),
    number: 2.88,
    title: "Avg flight time",
    unit: "MIN",
  },
];
const YourFlight = (props: any) => {
  const classes = useStyles(props);
  return (
    <SimpleCard gridArea={props.gridArea} title="Your Flight Status">
      <div className={classes.layout}>
        {flightData.map((flight) => (
          <DetailCard
            icon={flight.icon}
            number={flight.number}
            title={flight.title}
            unit={flight.unit}
            key={flight.title + flight.unit}
          />
        ))}
      </div>
    </SimpleCard>
  );
};
export default YourFlight;
