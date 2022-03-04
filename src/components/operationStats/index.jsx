import React, { useRef, useEffect, useState } from "react";
import SimpleCard from "./../shared/centeredSimpleCard";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import CardActions from '@material-ui/core/CardActions';
import * as d3 from "d3";
import tip from "d3-tip";
const useStyles = makeStyles((theme) =>
  createStyles({
    layout: {
      display: "grid",
      gridAutoFlow: "row",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      fontWeight: "bold",
    },
    itemTitle: {
      color: "gray",
      fontSize: "0.8em",
    },
    cardFooter: {
      position: "absolute",
      width: "100%",
      bottom: "0",
      color: "#01B0EF",
      display: "flex",
      justifyContent: "center",
    },
    barchart: {
      height: "70%",
      "& text": { fontSize: "8px" },
    },
  })
);

const data = [
  {
    title: "Aerial Surveillance and Security",
    percentage: 35,
    color: "#5e803e",
  },
  {
    title: "Aerial Inspection of Infrastructure (roof,pipes,utilities,etc.)",
    percentage: 25,
    color: "#b1ce94",
  },
  {
    title:
      "Emergency response coordination (flooding, crowd control, fire, etc.)",
    percentage: 40,
    color: "#3e562a",
  },
  {
    title: "Aerial Surveillance and Mapping",
    percentage: 20,
    color: "#c9deb7",
  },
  { title: "Geothermal Exploration", percentage: 10, color: "#e4efda" },
];

const OperationStat = (props) => {
  const classes = useStyles(props);
  const barchartRef = useRef(null);
  const [timeoutId, setTimeOutId] = useState(0);
  const barchartInitialization = (container) => {
    // set the dimensions and margins of the graph
    let box;
    if (container) {
      box = container.current.getBoundingClientRect();
      const margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40,
      };
      const width = box.width - margin.left - margin.right;
      const height = box.height - margin.top - margin.bottom;

      // set the ranges
      const y = d3.scaleBand().range([height, 0]).padding(0.3);

      const x = d3.scaleLinear().range([0, width*0.5]);

      // append the svg object to the body of the page
      // append a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      const svg = d3
        .select(container.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + 180+ "," + margin.top + ")"
        );
      const tips = tip()
        .attr("class", "flight-op-tip")
        .offset([-8, 0])
        .html((d) => {
          return `<div style="border-radius:10px;border:1px solid black;background-color:white;box-shadow:2px 2px 2px 2px #ccc;padding:8px">${d.title}: <span style="color:${d.color};font-weight:bold">${d.percentage}%</span></div>`;
        });
      svg.call(tips);
      // format the data
      data.forEach(function (d) {
        d.percentage = +d.percentage;
      });

      // Scale the range of the data in the domains
      x.domain([0, d3.max(data, (d) => d.percentage)]);
      y.domain(
        data.map(function (d) {
          return d.title;
        })
      );
      //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

      // append the rectangles for the bar chart
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", function (d) {
          return x(d.percentage);
        })
        .attr("y", function (d) {
          return y(d.title);
        })
        .attr("height", y.bandwidth())
        .attr("fill", (d) => d.color)
        .on("mouseover", tips.show)
        .on("mouseout", tips.hide);
      // add the x Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      // add the y Axis
      const addedY = svg
        .append("g")
        .call(d3.axisLeft(y).tickFormat("").tickSize(0));
      addedY
        .selectAll("text")
        .selectAll("tspan")
        .data((d) => {
          // return d.length > 25 ? [d.substring(0, 25), d.substring(25)] : [d];
          const arr = d.split("(");
          if (arr.length > 1) arr[1] = "(" + arr[1];
          else {
            arr[0] = "{single}" + arr[0];
          }
          return arr;
        })
        .enter()
        .append("tspan")
        .attr("x", 0)
        .attr("y", "1em")
        .attr("dy", (d, i) => {
          if (/^\{single\}/.test(d)) {
            return "-0.6em";
          } else {
            if (i === 0) return "-1.1em";
            else return "0em";
          }
        })
        .attr("dx", "-1em")
        .text((d) => {
          if (/^\{single\}/.test(d)) {
            return String(d).substring(8);
          } else return String(d);
        })
        .attr("font-weight", "bolder")
        .attr("font-size", "1.2em");
    } else {
      console.log(container, "no container");
    }
  };
  useEffect(() => {
    if (barchartRef.current) barchartInitialization(barchartRef);
    if (window) {
      window.addEventListener("resize", () => {
        clearTimeout(timeoutId);
        setTimeOutId(
          setTimeout(() => {
            barchartRef.current.innerHTML = "";
            barchartInitialization(barchartRef);
          }, 500)
        );
      });
    }
  }, []);
  return (
    <SimpleCard gridArea={props.gridArea} title="Operations Statistics">
      {/* <div className={classes.layout}>
        <div className={classes.item}>
          <span className={classes.itemTitle}>Critical Visuals Analyzed</span>
          <span>33</span>
        </div>
        <div className={classes.item}>
          <span className={classes.itemTitle}>Coordinated Rescues</span>
          <span>3</span>
        </div>
      </div> */}
      <div className={classes.barchart} ref={barchartRef}></div>
      {/* <CardActions className={classes.cardFooter}>View More</CardActions> */}
    </SimpleCard>
  );
};
export default OperationStat;
