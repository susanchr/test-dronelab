import React, { useState, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import styled from "styled-components";

import HighlightElement from "../../helper/HighlightElement"

//TODO remove
import { StormOperationsModal } from "../droneinfo/StormOperationsModal";

const Wrapper = styled.div`
  transform: ${(props) => {
    return "translate(" + props.bias + "px,0)";
  }};
  display: grid;
  grid-template-columns: 30% 65%;
  gap: 0 5%;
  padding: 3px;
  height: 100%;
  width: 20vw;
  margin-right: 5px;
  background-color: white;
  border-radius: 5px;
  transition: all 1s;
  & *:hover {
    cursor: pointer;
    transform: scale(1.04);
  }
`;
const useStyles = makeStyles((theme) =>
  createStyles({
    layout: {
      display: "grid",
      gridTemplateColumns: "30% 65%",
      gap: "0 5%",
      padding: "3px",
      height: "100%",
      width: "20vw",
      marginRight: "5px",
    },
    detailPic: {
      objectFit: "fill",
      height: "100%",
      width: "100%",
    },
    title: {
      textAlign: "center",
      fontSize: "1em",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dialog: {
      "& > div": {
        "& > div": {
          // display: "flex",
          // flexDirection: "column",
          alignItems: "center",
          maxHeight:"100vh",
          maxWidth: "100vw",
          backgroundColor: "#e8e6e6"
        }
      }
    },
    closeButton: {
      width: "50%",
      margin: "0 0 10% 0",
    },
  })
);

const OpDetail = (props) => {
  const highlight_ref = useRef(null);
  const classes = useStyles(props);
  // const [open, setOpen] = useState(props.clickActionEvent==="SHOW_STORM_MODAL");// TODO change back
  const [open, setOpen] = useState(false);

  const clickModalEle = (() => {
    if (props.clickActionEvent === "SHOW_STORM_MODAL") {
      return (<Dialog className={classes.dialog} open={open}>
        <StormOperationsModal 
          // drone_id={detail.drone_id || ""} 
          // pilot={detail.pilot || ""} 
          // serial_number={detail.drone_serial_no || ""} 
          // friendly_name={detail.friendly_name || ""} 
          closeModal={() => { setOpen(false) }} 
        />
      </Dialog>)
    } else {
      return (
        <Dialog className={classes.dialog} open={open}>
          {props.children}
          <Button
            className={classes.closeButton}
            variant={"outlined"}
            onClick={() => {
              setOpen(false);
            }}
          >
            {"Close"}
          </Button>
        </Dialog>
      );
    }
  })();

  const HighlightElementInstance = (()=>{
    if(props.clickActionEvent==="SHOW_STORM_MODAL"){
      return (<HighlightElement show={false} highlight_ref={highlight_ref} highlight_query_param={"hlsom"}></HighlightElement>);
    }else{
      return null;
    }
  })();

  return (
    <React.Fragment>
      {HighlightElementInstance}
      <Wrapper
        ref={highlight_ref}
        onClick={() => {
          setOpen(true);
        }}
        bias={props.bias}
      >
        <img
          className={classes.detailPic}
          src={props.img}
          alt="additional op pic"
        />
        <span className={classes.title}>{props.title}</span>
      </Wrapper>
      {clickModalEle}
    </React.Fragment>
  );
};

export default OpDetail;
