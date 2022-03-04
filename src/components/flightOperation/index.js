import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import * as d3 from "d3";
import tip from "d3-tip";
import SimpleCard from "./../shared/centeredSimpleCard";
import { HomeStateContext } from "./../../pages/home/reducer";
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
const DonutChart = (props) => {
  const { state } = useContext(HomeStateContext);
  const donutRef = useRef();
  const renderChartMemoized = useCallback(() => {
    // set the dimensions and margins of the graph
    const dimension = donutRef.current.getBoundingClientRect();
    const width = dimension.width;
    const height = dimension.height;
    const margin = 20;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = (Math.min(width, height) / 2) * 0.6 - margin;
    donutRef.current.innerHTML = "";
    // append the svg object to the div called 'my_dataviz'
    var svg = d3
      .select(donutRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    let data = state.userConfig.DroneOperations;
    if ((Array.isArray(data) && data.length < 1) || !Array.isArray(data)) {
      data = [
        "Rescue Coordination",
        "Damage Inspection",
        "Safety Analysis",
        "Stormwater Operations Monitor",
        "Geothermal Monitor",
      ];
    }
    data = data.reduce((prev, cur) => {
      prev[cur] = Math.round(Math.random() * 70 + 1);
      return prev;
    }, {});
    // set the color scale
    const color = d3
      .scaleOrdinal()
      .domain(data)
      .range(Object.keys(data).map(() => getRandomColor()));

    // Compute the position of each group on the pie:
    var pie = d3.pie().value(function (d) {
      return d.value;
    });
    var data_ready = pie(d3.entries(data));
    const tips = tip()
      .attr("class", "flight-op-tip")
      .offset([100, 0])
      .html((d) => {
        return `<div style="border-radius:10px;border:1px solid black;background-color:white;box-shadow:2px 2px 2px 2px #ccc;padding:8px">${d.data.key}: ${d.data.value}</div>`;
      });
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    const svgWithData = svg.selectAll("whatever").data(data_ready).enter();
    svg.call(tips);
    svgWithData
      .append("path")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(radius - 20) // This is the size of the donut hole
          .outerRadius(radius)
      )
      .attr("fill", function (d) {
        return color(d["data"]["key"]);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .attr("transform", `translate(0,${height * 0.1})`)
      .on("mouseover", function (d, i) {
        tips.show(d, this);
        d3.select(this)
          .transition()
          .attr("transform", `translate(0,${height * 0.1}) scale(1.2)`);
      })
      .on("mouseout", function (d, i) {
        tips.hide(this);
        d3.select(this)
          .transition()
          .attr("transform", `translate(0,${height * 0.1}) scale(1)`);
      });
    svgWithData
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr(
        "transform",
        (d) =>
          `translate(${-width * 0.4},${
            data_ready.indexOf(d) * 20 - height * 0.5
          })`
      )
      .attr("fill", (d) => color(d.data.key));
    svgWithData
      .append("text")
      .text((d) => d.data.key)
      .attr(
        "transform",
        (d) =>
          `translate(${-width * 0.3},${
            data_ready.indexOf(d) * 20 - height * 0.5 + 10
          })`
      )
      .attr("font-size", "10")
      .attr("font-weight", "bolder");
  }, [state.userConfig.DroneOperations]);
  // const renderChart = () => {
  //   // set the dimensions and margins of the graph
  //   const dimension = donutRef.current.getBoundingClientRect();
  //   const width = dimension.width;
  //   const height = dimension.height;
  //   const margin = 20;

  //   // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  //   var radius = (Math.min(width, height) / 2) * 0.6 - margin;

  //   // append the svg object to the div called 'my_dataviz'
  //   var svg = d3
  //     .select(donutRef.current)
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .append("g")
  //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  //   // Create dummy data
  //   const data = state.userConfig.DroneOperations
  //     ? state.userConfig.DroneOperations.reduce((prev, cur) => {
  //         prev[cur] = Math.round(Math.random() * 70 + 1);
  //         return prev;
  //       }, {})
  //     : {
  //         "Safety Analysis": 9,
  //         "Damage Inspection": 20,
  //         "Stormwater Operations Monitor": 30,
  //       };
  //   // set the color scale
  //   var color = d3
  //     .scaleOrdinal()
  //     .domain(data)
  //     .range(
  //       state.userConfig.DroneOperations
  //         ? state.userConfig.DroneOperations.map(() => getRandomColor())
  //         : ["#fb8af0", "#27d2ff", "#ff3483"]
  //     );

  //   // Compute the position of each group on the pie:
  //   var pie = d3.pie().value(function (d) {
  //     return d.value;
  //   });
  //   var data_ready = pie(d3.entries(data));
  //   const tips = tip()
  //     .attr("class", "flight-op-tip")
  //     .offset([100, 0])
  //     .html((d) => {
  //       return `<div style="border-radius:10px;border:1px solid black;background-color:white;box-shadow:2px 2px 2px 2px #ccc;padding:8px">${d.data.key}: ${d.data.value}</div>`;
  //     });
  //   // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  //   const svgWithData = svg.selectAll("whatever").data(data_ready).enter();
  //   svg.call(tips);
  //   svgWithData
  //     .append("path")
  //     .attr(
  //       "d",
  //       d3
  //         .arc()
  //         .innerRadius(radius - 20) // This is the size of the donut hole
  //         .outerRadius(radius)
  //     )
  //     .attr("fill", function (d) {
  //       return color(d["data"]["key"]);
  //     })
  //     .attr("stroke", "black")
  //     .style("stroke-width", "2px")
  //     .style("opacity", 0.7)
  //     .attr("transform", `translate(0,${height * 0.1})`)
  //     .on("mouseover", function (d, i) {
  //       tips.show(d, this);
  //       d3.select(this)
  //         .transition()
  //         .attr("transform", `translate(0,${height * 0.1}) scale(1.2)`);
  //     })
  //     .on("mouseout", function (d, i) {
  //       tips.hide(this);
  //       d3.select(this)
  //         .transition()
  //         .attr("transform", `translate(0,${height * 0.1}) scale(1)`);
  //     });
  //   svgWithData
  //     .append("rect")
  //     .attr("width", 15)
  //     .attr("height", 15)
  //     .attr(
  //       "transform",
  //       (d) =>
  //         `translate(${-width * 0.4},${
  //           data_ready.indexOf(d) * 20 - height * 0.5
  //         })`
  //     )
  //     .attr("fill", (d) => color(d.data.key));
  //   svgWithData
  //     .append("text")
  //     .text((d) => d.data.key)
  //     .attr(
  //       "transform",
  //       (d) =>
  //         `translate(${-width * 0.3},${
  //           data_ready.indexOf(d) * 20 - height * 0.5 + 10
  //         })`
  //     )
  //     .attr("font-size", "10")
  //     .attr("font-weight", "bolder");
  // };
  useEffect(() => {});
  const [timeoutId, setTimeOutId] = useState(0);
  useEffect(() => {
    renderChartMemoized();
    if (window) {
      window.addEventListener("resize", () => {
        clearTimeout(timeoutId);
        setTimeOutId(
          setTimeout(() => {
            renderChartMemoized();
          }, 500)
        );
      });
    }
  }, [timeoutId, renderChartMemoized, state.userConfig]);

  return (
    <SimpleCard gridArea={props.gridArea} title="Flight Operations">
      <div style={{ width: "100%", height: "80%" }} ref={donutRef}></div>
    </SimpleCard>
  );
};
export default DonutChart;
