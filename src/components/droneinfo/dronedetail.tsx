import React, { useState } from "react";

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { DetailInfo } from "./../../pages/home/reducer";
import { ConnectionSignal32 } from "@carbon/icons-react";
import { DroneDetailModal } from "./DroneDetailModal";
import { clearDroneStatsAndImage } from "../../drone_connector/droneController"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      margin: "2% 0",
      display: "grid",
      gridTemplateAreas: `"left mid mid right"
       "left mid mid right"`,
      gridTemplateColumns: "30% repeat(3,1fr)",
      padding: "5px",
      overflowY: "scroll",
      gap: "0 2%",
    },
    detail: {
      gridArea: "mid",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      "& table": {
        "& tr td:first-child": {
          fontWeight: "bolder",
          fontSize: "10px",
          width: "20%",
          //whiteSpace: "nowrap",
          //paddingLeft:"25px"
        },
        "& tr td:last-child": {
          maxWidth: "80px",
          textOverflow : "ellipsis"
        }
      },
    },
    avatar: {
      gridArea: "left",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    connectBtn: {
      gridArea: "right",
      justifyContent: "center",
      margin: "10% 0",
      padding:'3px',
      fontSize: "10px",
      fontWeight: "bolder",
    },
    warning: {
      color: "red",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "8px",
    },
    text: { fontSize: "8px", fontWeight: "bold", color: "green" },
    detailFriendName: {
      fontSize: "12px",
      fontWeight: "bolder",
      whiteSpace: "nowrap",
    },
    closeButton: {
      width: "50%",
      margin: "0 0 10% 0",
    },
    dialog: {
      "& > div": {
        "& > div": {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxHeight:"100vh",
          maxWidth: "100vw",
          backgroundColor: "#e8e6e6"
        }
      }
    }
  })
);

const Detail = (detail: DetailInfo) => {
  const mdMatch = useMediaQuery("(max-width:1280px)");
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <Paper className={classes.layout}>
        <div className={classes.avatar}>
          {detail.dronePic && <Avatar src={detail.dronePic} />}
          <Typography>{"Status:"}</Typography>
          <Typography
            noWrap
            align="left"
            className={
              detail.connectStatus === "Not Available"
                ? classes.warning
                : classes.text
            }
          >
            {detail.connectStatus}
          </Typography>
        </div>
        <div className={classes.detail}>
          <span className={classes.detailFriendName}>
            {detail.friendly_name && detail.friendly_name}
            {!detail.friendly_name && (
              <span style={{ color: "red" }}>friendly name missing</span>
            )}
          </span>
          <table>
            <tbody >
              <tr>
                <td>Serial Number:</td>
                <td>
                  {detail.drone_serial_no && detail.drone_serial_no}
                  {!detail.drone_serial_no && (
                    <span style={{ color: "red" }}>drone serial number missing</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Model Type:</td>
                <td>{detail.model_type}</td>
              </tr>
            </tbody>
          </table>
          {detail.discSpace < 0.5 ? (
            <span className={classes.warning}>Low Disc Space⚠</span>
          ) : null}
        </div>
        <Button
          color="primary"
          variant="outlined"
          className={classes.connectBtn}
          onClick={() => {
            setOpen(!open);
            clearDroneStatsAndImage()
          }}
          disabled={detail.connectStatus !== "Available"}
        >
          {mdMatch && <ConnectionSignal32 />}
          {!mdMatch && "Connect"}
        </Button>
      </Paper>
      <Dialog className={classes.dialog} open={open}>
        <DroneDetailModal drone_id={detail.drone_id || ""} pilot={detail.pilot || ""} serial_number={detail.drone_serial_no || ""} friendly_name={detail.friendly_name || ""} closeModal={() => {setOpen(false)}}/>
      </Dialog>
    </React.Fragment>
  );
};

export default Detail;
