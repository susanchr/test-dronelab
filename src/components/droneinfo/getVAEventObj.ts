// \[(-?[0-9]+.[0-9]+), (-?[0-9]+.[0-9]+)\]
// [$2, $1]
function getVAEventObj() {
  const event_obj = {
    "alerts": [
      {
        "id": 0,
        "severity": "Low",
        "type": "Weather",
        "start": 0,
        "end": -1,
        "title": "Severe Thunderstorms 8-10am, with potential for flash flooding ",
        "thumbnail": "event_img/NOAA_Weather.png",
        "description": "NOAA Alert: FLASH FLOOD WATCH REMAINS IN EFFECT THROUGH MORNING...The Flash Flood Watch continues for portions of north central Texas and northeast Texas.  [City of Coppell Emergency Mgmt Agency]",
        "coordinates": [-96.99761427823594, 32.934616614385426]
      },
      {
        "id": 1,
        "severity": "Medium",
        "type": "Sensor",
        "start": 10,
        "end": -1,
        "title": "Rising Water Level 1.5 ft below road near Denton Tap Rd. ",
        "thumbnail": "event_img/StreamElevation.png",
        "description": "Multiple recent sensor readings detect rising water approaching street level at Denton Tap Rd ",
        "coordinates": [-97.00067626847235, 32.94814809628301]
      },
      {
        "id": 2,
        "severity": "Medium",
        "type": "Sensor",
        "start": 55,
        "end": -1,
        "title": "Flow rate increase above threshold at Northlake at Olympus, Coppell",
        "thumbnail": "event_img/FlowVolume.png",
        "description": "Multiple recent sensor readings in Grapevine Creek detect Flow Rate near roadways in Coppell [Freeport Pkwy, Southwestern Blvd, Bethel Rd, Olympus]",
        "coordinates": [-96.98335662050503, 32.93605163579494]
      },
      {
        "id": 3,
        "severity": "Medium",
        "type": "Video",
        "start": 25,
        "end": -1,
        "title": "Video Analytic:  Camera near Southwestern Blvd detected dangerous water level.",
        "thumbnail": "event_img/WaterLevelVideo.png",
        "description": "Video Analytic at Southwestern Blvd crossing over Grapevine Creek detected dangerous water level.",
        "coordinates": [-97.00262616260578, 32.947089321044885]
      },
      {
        "id": 4,
        "severity": "High",
        "type": "Sensor",
        "start": 35,
        "end": -1,
        "title": "Coppell, TX Rainfall rate >= 0.5 inches/30 minutes",
        "thumbnail": "event_img/RainFallRate.png",
        "description": "Multiple recent sensor readings (from Micro Weather Stations and Connected Sensors) in and around Coppell, TX report increasing rainfall rate over recent intervals.",
        "coordinates": [-96.99310609100286, 32.9374955973011]
      },
      {
        "id": 5,
        "severity": "Medium",
        "type": "Weather",
        "start": 75,
        "end": -1,
        "title": "Wind Velocity Sensors report sustained wind and gusts above threshold",
        "thumbnail": "event_img/WindVelocity.png",
        "description": "Multiple recent sensor readings near roadways in Coppell, TX report increasing wind velocity and high speed gusts above alert thresholds.",
        "coordinates": [-96.99160557997266, 32.94602751606665]
      },
      {
        "id": 6,
        "severity": "High",
        "type": "Drone1",
        "start": 84,
        "end": -1,
        "title": "Drone1: Heavy Traffic in area that is sensitive to flooding",
        "thumbnail": "event_img/Drone_Traffic1.png",
        "description": "[Drone1: GSC Government Team] Video Analytics - Drone footage identification of vehicular activity in/near a dangerous geospatial area or location [flash flood risk]",
        "coordinates": [-96.98834449934449, 32.935027706255774]
      },
      {
        "id": 7,
        "severity": "Medium",
        "type": "Video",
        "start": 190,
        "end": -1,
        "title": "Video Analytic:  Camera near Olympus Blvd detected vehicles driving over water in street.",
        "thumbnail": "event_img/CarsFlooding.png",
        "description": "Video Analytic:  An alert was generated indicative of car tires and water level/splashing.",
        "coordinates": [-96.98551446863893, 32.9412497089154]
      },
      {
        "id": 8,
        "severity": "High",
        "type": "Sensor",
        "start": 170,
        "end": -1,
        "title": "Rising Water Level .5 ft below road near 635 Frontage",
        "thumbnail": "event_img/StreamElevation.png",
        "description": "Multiple recent sensor readings detect rising water approaching street level at 635 Frontage",
        "coordinates": [-97.01152210798769, 32.94102282343933]
      },
      {
        "id": 9,
        "severity": "Low",
        "type": "Sensor",
        "start": 235,
        "end": -1,
        "title": "Sudden/Rapid Temperature Decrease Detected",
        "thumbnail": "event_img/AirTemp.png",
        "description": "Sensor at Wrangler Dr, in Coppell Detected Sudden/Rapid Temperature Decrease, indicative of storm in some conditions",
        "coordinates": [-96.99717953457528, 32.939974312673776]
      },
      {
        "id": 10,
        "severity": "Low",
        "type": "Drone1",
        "start": 392,
        "end": -1,
        "title": "Drone1: Vehicles detected in area near flowing water",
        "thumbnail": "event_img/Drone_Truck1.png",
        "description": "[Drone1: GSC Government Team] Video Analytics - Drone footage identification of vehicles in area near flowing water",
        "coordinates": [-96.98464934978516, 32.949780180470405]
      },
      {
        "id": 11,
        "severity": "Low",
        "type": "Drone1",
        "start": 413,
        "end": -1,
        "title": "Drone1: Vehicles detected in area near possible flood",
        "thumbnail": "event_img/Drone_FloodCar2.png",
        "description": "[Drone1: GSC Government Team] Video Analytics - Drone footage identification of vehicles in area near possible flood",
        "coordinates": [-96.98031080345086, 32.951708149517515]
      },
      {
        "id": 12,
        "severity": "High",
        "type": "Drone1",
        "start": 460,
        "end": -1,
        "title": "Drone1: Pedestrians detected in Water/Flood Area",
        "thumbnail": "event_img/Drone_PeopleWater.png",
        "description": "[Drone1: GSC Government Team] Video Analytics - Drone footage identification of pedestrian(s) in area with water/flood",
        "coordinates": [-96.98179772665488, 32.938254425751424]
      },
      {
        "id": 13,
        "severity": "High",
        "type": "Video",
        "start": 300,
        "end": -1,
        "title": "Video Analytic: Dangerous Water Level detected.",
        "thumbnail": "event_img/videowater2.png",
        "description": "Video Analytic at Olympus Blvd detected dangerous water level.",
        "coordinates": [-96.97739102686316, 32.93274075712639]
      },
      {
        "id": 14,
        "severity": "High",
        "type": "Drone1",
        "start": 447,
        "end": -1,
        "title": "Drone1:  Vehicles Detected in Water/Flood Area",
        "thumbnail": "event_img/Drone_FloodCar3.png",
        "description": "[Drone1: GSC Government Team] Video Analytics - Drone footage identification of vehicles in area near possible flood",
        "coordinates": [-96.97198403325368, 32.94830520870082]
      },
      {
        "id": 15,
        "severity": "Low",
        "type": "Weather",
        "start": 255,
        "end": -1,
        "title": "Wind Velocity Sensors report sustained wind and gusts above threshold",
        "thumbnail": "event_img/WindVelocity2.png",
        "description": "Multiple recent sensor readings near roadways in Coppell, TX report increasing wind velocity and high speed gusts above alert thresholds.",
        "coordinates": [-96.97378426527085, 32.943042723833415]
      }
      ,
      {
        "id": 16,
        "severity": "High",
        "type": "REPORTED",
        "start": 220,
        "end": -1,
        "title": "Citizen Report: Street Flooding",
        "thumbnail": "event_img/CitizenUpload.png",
        "description": "Citizen Portal Upload: Report of street-level flooding near Dynamo Drive/North Lake. Included Image",
        "coordinates": [-96.98232841626206, 32.93887199892999]
      }
    ]
  };
  return event_obj;
}

export { getVAEventObj }