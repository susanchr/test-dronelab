import React, { useEffect, useRef, useContext, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import mapbox, { MapMouseEvent } from "mapbox-gl";
import {DetailInfo, HomeStateContext} from "./../../pages/home/reducer";
import {
  animationInitialization,
  animate,
  resetAnimation,
} from "./../shared/maputils/routeAnimation";
import { addMarkersLayer } from "../shared/maputils/addMarkerLayer";
import { loadGeoJSONLayer } from "./../shared/maputils/loadGeoJSONLayer";
import { loadGeoJSONImage } from "./../shared/maputils/loadGeoJSONImage";
import incident from "./../../assets/data/KMLs/Incidents.json";
import forecast from "./../../assets/data/KMLs/Coppell_Forecast.json";
import police from "./../../assets/data/KMLs/police.json";
import fire from "./../../assets/data/KMLs/fire.json";
import ibm_gsc from "./../../assets/data/KMLs/IBM_GSC.json";
import errorSVG from "./../../assets/img/error.svg";
import alertPng from "./../../assets/img/alert.png";
import companySVG from "./../../assets/img/company.svg";
import pinSVG from "./../../assets/img/pin.svg";
import policePNG from "./../../assets/img/police.png";
import sensorSVG from "./../../assets/img/sensor.svg";
import firePNG from "./../../assets/img/fire.png";
import * as turf from "@turf/turf";
import acquireSensorLocation from "../../drone_connector/sensors";
import { useDroneStatus } from "../../drone_connector/droneController";
import {getVAEventObj} from "../droneinfo/getVAEventObj";

// TODO move this to another file 
function getAlertsMapPoints(  ){
  // throw "actually do this";

  const event_obj = getVAEventObj();

  // {
  //   "id": 0,
  //   "status": "In Progress",
  //   "start": 0,
  //   "end": -1,
  //   "title": "Monitor storm impact",
  //   "containsPopup": true,
  //   "popupDetails": "action_img/WeatherMonitor.png"
  // }

  const features = event_obj.alerts.map((cur) => {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [...cur.coordinates,0]
      },
      "properties": {
        "name": cur.title,
        "styleUrl": "#icon-1899-0288D1",
        "styleHash": "-21fe3a8d",
        "styleMapHash": {
          "normal": "#icon-1899-0288D1-normal",
          "highlight": "#icon-1899-0288D1-highlight"
        },
        "icon": "https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png",
        "description": ``
      }
    };
  });

  const to_return = {
    "type": "FeatureCollection",
    "features": features
  }

  return to_return;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      width: "100%",
      height: "100%",
      position: "relative",
    },
    resetButton: {
      position: "absolute",
      top: "10px",
      left: "10px",
      zIndex: 1,
      backgroundColor: "grey",
    },
    controlBox: {
      "&:hover": {
        opacity: 1,
      },
      opacity: "0.4",
      backgroundColor: "white",
      width: "auto",
      height: "auto",
      padding: "5px",
      borderRadius: "5px",
      position: "absolute",
      left: "10px",
      top: "10px",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
  })
);

// Added props startingZoomLevel and target serial
// Starting zoom level should be set higher when its part of drone specific map
// Serial number needed when using it for drone specific map
const MapWidget = ({ isInteractive, startingZoomLevel, target_serial, drone_data}: { isInteractive: boolean, startingZoomLevel?:number, target_serial?: string, drone_data?: any}) => {
  const {dispatch, state } = useContext(HomeStateContext);
  const mapRef = useRef(null);
  const layerControlRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapbox.Map | null>(null); // Using some kind of library called mapbox?
  const [should_make_call,setShouldMakeCall] = useState(true);
  // TODO : Implement this
  /*
      const [should_make_sensor_call,setShouldMakeSensorCall] = useState(true);
      let sensor_data : any = useSensorStatus()
      if  (drone_data!==undefined && drone_data.out_of_data===true && should_make_call===true)  {
          setShouldMakeCall(false);
      }
  */

  if (map.current !== null && drone_data !== undefined) {
    const arr = drone_data?.data.location.split(",")
    map.current.jumpTo({
      center: [arr[1],arr[0]],
    });
  }

  // Container for holding drones that were filtered by the serial numbers
  let filteredDrone : DetailInfo[] = []
  // Collect drones that match the serial number
  target_serial && target_serial !== "" ? filteredDrone = state.map.droneLocations.filter((detail : DetailInfo) => detail.drone_serial_no === target_serial) : filteredDrone = []
  // if (filteredDrone.length > 0) filteredDrone[0].coordinate = [32.942690, -96.994845];
  if (filteredDrone.length > 0) filteredDrone[0].coordinate = drone_data?.data.location.split(",") || [32.870376,-96.9374359];
  useEffect(() => {
    mapbox.accessToken =
      "pk.eyJ1IjoiaGxsMTY4MjAwMyIsImEiOiJjang1b25pZ3YwMjB4NDRxdGZkOGZzYXdpIn0.g8cs_ODLiwQQ7qXEn_gJ7A";
    map.current = new mapbox.Map({
      container: mapRef.current || "", // container id
      style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
      center: state.map.center, // starting position [lng, lat]
      zoom: 13, // starting zoom
      interactive: isInteractive,
    });
    if (!isInteractive)
      animationInitialization(map.current, state.map.flyRoute || null);
  }, []);

  useEffect(() => {
    let checkable = true;
    if (target_serial && target_serial !== "") {
      checkable = false
      if (filteredDrone.length > 0) {
        if (drone_data !== undefined && drone_data.data !== undefined && map.current) {
          const coords_str: Array<string> = drone_data.data.location.split(",")
          const lat = parseFloat(coords_str[0])
          const long = parseFloat(coords_str[1])
        filteredDrone[0].coordinate = [lat, long]
        }
      }
    }
    // map that has fly route animation is not interactive
    if (map.current) {
      addMarkersLayer(
        map.current,
        state.map.location,
        "droneicon",
        // If there is at least 1 match of drone serial number, display them. Otherwise, display all drones instead
        filteredDrone.length !== 0 ? filteredDrone : state.map.droneLocations,
        layerControlRef.current,
        checkable,
      );
    }
  }, []);

  useEffect(() => {
    if (target_serial && target_serial !== "") {
        if (drone_data !== undefined && drone_data.data !== undefined && map.current) {
          const coords_str: Array<string> = drone_data.data.location.split(",")
          const lat = parseFloat(coords_str[0])
          const long = parseFloat(coords_str[1])
          if (map.current) {
            const source : any = map.current.getSource(state.map.location)
            if (source && source._data.features) {
                  // console.log([lat, long])
                  source._data.features[0].geometry.coordinates = [long, lat];
                  source.setData(source._data)               
            }
          }
      }
    }
  }, [drone_data])

  useEffect(() => {
    const sensors = acquireSensorLocation()
    sensors.then(s_data => {
      if (map.current) {
        loadGeoJSONLayer(
            map.current,
            "Sensors",
            s_data,
            ["symbol"],
            layerControlRef.current,
            "sensor",
            sensorSVG
        );
        /*
        addMarkersLayer(
            map.current,
            state.map.location,
            "droneicon",
            loc_data,
            layerControlRef.current)

         */
      }
    })
  }, [])

  useEffect(() => {
    loadGeoJSONLayer(
      map.current,
      "Incidents",
      incident,
      ["symbol"],
      layerControlRef.current,
      "error",
      errorSVG
    );
    loadGeoJSONLayer(
      map.current,
      "Alerts",
      getAlertsMapPoints(),
      ["symbol"],
      layerControlRef.current,
      "alert",
      alertPng
    );
    loadGeoJSONImage(
      map.current,
      "Forecast",
      layerControlRef.current,
    );

    loadGeoJSONLayer(
      map.current,
      "Police",
      police,
      ["symbol"],
      layerControlRef.current,
      "police",
      policePNG
    );
    loadGeoJSONLayer(
      map.current,
      "Fire",
      fire,
      ["symbol"],
      layerControlRef.current,
      "fire",
      firePNG
    );
    loadGeoJSONLayer(
      map.current,
      "IBM GSC",
      ibm_gsc,
      ["symbol"],
      layerControlRef.current,
      "company",
      companySVG
    );
  }, []);

  useEffect(() => {
    if (map.current !== undefined && map.current !== null) {
      map.current.on("click", state.map.location, (e: MapMouseEvent) => {
        console.log(e);
        if (map.current !== null)
          new mapbox.Popup()
            .setLngLat(e.lngLat)
            .setHTML(target_serial ? target_serial !== "" ? target_serial : "drone" : "drone")
            .addTo(map.current);
      });
    }
  }, []);
  useEffect(() => {
    const loc_hold = []
    // If there is a match in id and we have a filtered drone, use that drone's coords
    // Reverse lat and long
    if (filteredDrone.length !== 0 && filteredDrone[0].coordinate) {
      loc_hold[0] = filteredDrone[0].coordinate[1]
      loc_hold[1] = filteredDrone[0].coordinate[0]
    }
    if (map.current) {
      if (isInteractive) {
        map.current.flyTo({
          // If there is a serial match, use that drone as a center
          center: loc_hold.length !== 0 ? loc_hold : state.map.center,
          zoom: startingZoomLevel ? startingZoomLevel : 12, // If zoom level is provided use that
        });
      } else {
        // only invoke animation when current flight contains animation data

        if (!isInteractive) {
          if (
            Object.prototype.hasOwnProperty.call(state.map, "flyRoute") &&
            Object.prototype.hasOwnProperty.call(state.map, "flyCenter")
          ) {
            resetAnimation(map.current, state.map.flyRoute);

            const boundingBox = turf.bbox(
              turf.featureCollection(
                state.map.flyRoute.map((pt: number[]) => {
                  return turf.point(pt);
                })
              )
            );
            map.current.fitBounds(
              [
                [boundingBox[0], boundingBox[1]],
                [boundingBox[2], boundingBox[3]],
              ],
              { padding: 30, animate: false }
            );
          } else {
            map.current.jumpTo({ center: state.map.center });
          }
        }
      }
    }
  }, [state.map]);
  const classes = useStyles();
  return (
    <React.Fragment>
      <link
        href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
        rel="stylesheet"
      />
      <Paper className={classes.layout} variant="outlined">
        {!isInteractive && state.map.flyRoute && state.map.flyCenter && (
          <Button
            onClick={() => {
              animate(0, 0);
            }}
            className={classes.resetButton}
          >
            Replay
          </Button>
        )}
        <div className={classes.layout} ref={mapRef}>
          {isInteractive && (
            <div className={classes.controlBox} ref={layerControlRef}/>
          )}
        </div>
      </Paper>
    </React.Fragment>
  );
};
export default MapWidget;
