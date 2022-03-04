import React, { useRef, useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Paper from "@material-ui/core/Paper";
import { PlayFilledAlt32 } from "@carbon/icons-react";
import OpDetail from "./detailCard.js";
import image1 from "./../../assets/img/additionalOps/rescue_coordination.png";
import image2 from "./../../assets/img/additionalOps/stormwater_operations.png";
import image3 from "./../../assets/img/additionalOps/workplace_safety.png";
import image4 from "./../../assets/img/additionalOps/Damage_inspection.png";
import image5 from "./../../assets/img/additionalOps/Thermal_Imaging.png";


import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      padding: "5px",
      display: "grid",
      width: "100%",
      height: "100%",
      gridTemplateRows: "2em 1fr",
      gridTemplateColumns: "3em repeat(4,1fr) 3em",
      gridTemplateAreas: `
      "title title title title title title"
      " leftArrow cnt cnt cnt cnt rightArrow"
      `,
      backgroundColor: "#d9d9d9",
      gridArea: (props: any) => props.gridArea,
    },
    title: {
      gridArea: "title",
      fontSize: "1.5em",
      fontWeight: "bold",
      textAlign: "center",
    },
    content: {
      display: "grid",
      gridAutoFlow: "column dense",
      gridArea: "cnt",
      overflow: "hidden"
    },
    leftArrow: {
      gridArea: "leftArrow",
      fill: "white",
      transform: "rotate(180deg)",
      alignSelf: "center",
    },
    rightArrow: {
      gridArea: "rightArrow",
      fill: "white",
      justifySelf: "end",
      alignSelf: "center",
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
const data = [
  {
    name:"Rescue Coordination",
    clickActionEvent:"NOT_HERE",
  },
  {
    name:"Stormwater Operations Monitor",
    clickActionEvent:"SHOW_STORM_MODAL",
  },
  {
    name:"Safety Analysis",
    clickActionEvent:"NOT_HERE",
  },
  {
    name:"Damage Inspection",
    clickActionEvent:"NOT_HERE",
  },
  {
    name:"Geothermal Monitor",
    clickActionEvent:"NOT_HERE",
  }
];
const images = [image1, image2, image3, image4, image5];
const Carousel = (props: any) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(0);
  const classes = useStyles(props);

  const [open, setOpen] = useState(false);
  const [bias, setBias] = useState(0);
  // let boundingRect: ClientRect;
  useEffect(() => {
    if (contentRef && contentRef.current) {
      widthRef.current = contentRef.current.getBoundingClientRect().width;
    }
  }, []);
  const scrollLeft = () => {
    if (bias < 0) setBias(bias + widthRef.current);
  };
  const scrollRight = () => {
    if (bias >= 0) setBias(bias - widthRef.current);
  };

  /*    TODO-S: if (d === 'Stormwater Operations Monitor"                <StormOperationsModal closeModal={() => { setOpen(false) }} />
*/
  return (
    <Paper className={classes.layout}>
      <div className={classes.title}>Addtional Operations</div>
      <PlayFilledAlt32 onClick={scrollLeft} className={classes.leftArrow} />
      <div ref={contentRef} className={classes.content}>
        {data.map((d, i) => {
          return (
            <OpDetail clickActionEvent={d.clickActionEvent} bias={bias} title={d.name} key={i} img={images[i]}>
              <div className={classes.modal}>
                {"These operations will be enabled in a future lab"}
                
              </div>
            </OpDetail>
          );
        })}
      </div>
      <PlayFilledAlt32 onClick={scrollRight} className={classes.rightArrow} />
    </Paper>
  );
};

export default Carousel;
