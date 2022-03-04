import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import tip from "d3-tip";
import SimpleCard from "./../shared/centeredSimpleCard";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import styled from "styled-components";

const Layout = styled.div`
  g.dotted {
    .tick line {
      opacity: 0.2;
      stroke-dasharray: 5, 5;
    }
  }
`;
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
  })
);
const AnalyticsUsage = (props) => {
  const classes = useStyles(props);
  const barchartRef = useRef();
  const renderChart = () => {
    const rect = barchartRef.current.getBoundingClientRect();
    // set the dimensions and margins of the graph
    const margin = {
      top: 10,
      right: 30,
      bottom: 20,
      left: 150,
    };
    const width = rect.width - margin.left - margin.right;
    const height = rect.height - margin.top - margin.bottom;
    const tips = tip()
      .attr("class", "flight-op-tip")
      .offset([100, 0])
      .html((d) => {
        return `<div style="border-radius:10px;border:1px solid black;background-color:white;box-shadow:2px 2px 2px 2px #ccc;padding:8px">${d.key}:${d.value}</div>`;
      });
    // append the svg object to the body of the page
    const svg = d3
      .select(barchartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const data = [
      {
        group: "Last Month",
        "Visual Analytics": 30,
        "Geothermal Analytics": 5,
      },
      {
        group: "This Month",
        "Visual Analytics": 80,
        "Geothermal Analytics": 20,
      },
    ];
    // List of subgroups = header of the csv files = soil condition here
    const subgroups = ["Geothermal Analytics", "Visual Analytics"];

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = d3
      .map(data, function (d) {
        return d.group;
      })
      .keys();

    // Add X axis
    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y).tickSize(-width))
      .attr("class", "dotted");

    // Another scale for subgroup position?
    const xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    // color palette = one color per subgroup
    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#8C5383", "#9DACFF"]);
    // Show the bars

    const svgWithData = svg
      .append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .enter();

    svgWithData
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d.group) + ",0)";
      })
      .selectAll("rect")
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xSubgroup(d.key);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .attr("fill", function (d) {
        return color(d.key);
      })
      .call(tips)
      .on("mouseover", tips.show)
      .on("mouseout", tips.hide);

    svgWithData
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("transform", (d) => {
        return `translate(${-140},${data.indexOf(d) * 20})`;
      })
      .attr("fill", (d, i) => {
        return color(subgroups[i]);
      });
    svgWithData
      .append("text")
      .text((d, i) => {
        return subgroups[i];
      })
      .attr("transform", (d) => {
        return `translate(${-120},${data.indexOf(d) * 20 + 12})`;
      })
      .attr("font-size", "10");
  };
  const [timeoutId, setTimeOutId] = useState(0);
  useEffect(() => {
    renderChart();

    window.addEventListener("resize", () => {
      clearTimeout(timeoutId);
      setTimeOutId(
        setTimeout(() => {
          barchartRef.current.innerHTML = "";
          renderChart();
        }, 500)
      );
    });
  }, []);
  return (
    <SimpleCard gridArea={props.gridArea} title="Analytics Usage(%)">
      <Layout
        className={classes.layout}
        style={{ width: "100%", height: "80%" }}
        ref={barchartRef}
      ></Layout>
    </SimpleCard>
  );
};
export default AnalyticsUsage;
