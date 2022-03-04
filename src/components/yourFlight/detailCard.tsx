import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
const useStyles = makeStyles((theme) =>
  createStyles({
    layout: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      backgroundColor: "#f3f3f8",
      margin: "5px 3%",
      boxShadow: "-1px 3px 6px 1px #ccc",
      padding: "5px 1%",
      transition: "all 0.3s",
      "&:hover": {
        transform: "scale(1.1)",
        cursor: "pointer",
      },
    },
    numberContainer: {
      color: "#8fdede",
      position: "relative",
      fontWeight: "bolder",
      fontSize: "1.5em",
    },
    unit: {
      position: "absolute",
      right: "-50%",
      top: "-2px",
      fontSize: "0.4em",
    },
    icon: {
      width: "15%",
      objectFit: "contain",
    },
  })
);
const DetailCard = ({
  icon,
  number,
  unit,
  title,
}: {
  icon: string;
  number: number;
  unit: string;
  title: string;
}) => {
  const classes = useStyles();
  return (
    <div className={classes.layout}>
      <img className={classes.icon} src={icon} alt={"icon"} />
      <div className={classes.numberContainer}>
        {number.toFixed(2)}
        <div className={classes.unit}>{unit}</div>
      </div>
      <div>{title}</div>
    </div>
  );
};
export default DetailCard;
