import * as turf from "@turf/turf";
const route = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    },
  ],
};

// A single point that animates along the route.
// Coordinates are initially set to origin.
export const point = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [],
      },
    },
  ],
};
// resource id for route
export const routeId = "route";
export const pointId = "point";
const steps = 500;
let globalMap;
let lineDistance;
let arc = [];
const dataChangeHandler = (map, lineCoordinates) => {
  route.features[0].geometry.coordinates = lineCoordinates;
  point.features[0].geometry.coordinates = [
    route.features[0].geometry.coordinates[0][1],
    route.features[0].geometry.coordinates[0][0],
  ];
  if (map && map.getSource(pointId) && map.getSource(routeId)) {
    map.getSource(pointId).setData(point);
    map.getSource(routeId).setData(route);
  }
};

export const animate = (featureIdx, cntr) => {
  // Number of steps to use in the arc and animation, more steps means
  // a smoother arc and animation, but too many steps will result in a
  // low frame rate

  // Update point geometry to a new position based on counter denoting
  // the index to access the arc.
  if (cntr >= route.features[featureIdx].geometry.coordinates.length - 1) {
    return;
  }
  point.features[featureIdx].geometry.coordinates =
    route.features[featureIdx].geometry.coordinates[cntr];

  point.features[featureIdx].properties.bearing = turf.bearing(
    turf.point(
      route.features[featureIdx].geometry.coordinates[
        cntr >= steps ? cntr - 1 : cntr
      ]
    ),
    turf.point(
      route.features[featureIdx].geometry.coordinates[
        cntr >= steps ? cntr : cntr + 1
      ]
    )
  );

  // Update the source with this new data.
  if (globalMap.getSource(pointId)) {
    globalMap.getSource(pointId).setData(point);

    // Request the next frame of animation so long the end has not been reached.
    if (cntr < steps) {
      requestAnimationFrame(function () {
        animate(featureIdx, cntr + 1);
      });
    } else {
      point.features[featureIdx].geometry.coordinates = arc[0];
      globalMap.getSource(pointId).setData(point);
    }
  }
};
export const animationInitialization = (map, lineCoordinates) => {
  if (lineCoordinates) {
    dataChangeHandler(null, lineCoordinates);
  }
  if (!globalMap) {
    globalMap = map;
    map.on("load", function () {
      // Add a source and layer displaying a point which will be animated in a circle.
      map.addSource(routeId, {
        type: "geojson",
        data: route,
      });

      map.addSource(pointId, {
        type: "geojson",
        data: point,
      });

      map.addLayer({
        id: routeId,
        source: routeId,
        type: "line",
        paint: {
          "line-width": 2,
          "line-color": "#00B0F0",
        },
      });

      map.addLayer({
        id: pointId,
        source: pointId,
        type: "symbol",
        layout: {
          "icon-image": "airport-15",
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });
      animate(0, 0);
    });
  }
};
export const resetAnimation = (map, lineCoordinates) => {
  dataChangeHandler(map, lineCoordinates);
  lineDistance = turf.lineDistance(route.features[0], {
    units: "meters",
  });
  arc = [];
  // Draw an arc between the `origin` & `destination` of the two points
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i, { units: "meters" });
    arc.push(segment.geometry.coordinates);
  }
  // Update the route with calculated arc coordinates
  route.features[0].geometry.coordinates = arc;
  animate(0, 0);
};

