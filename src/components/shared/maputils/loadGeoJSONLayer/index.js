import mapbox from "mapbox-gl";

export const loadGeoJSONLayer = (
  map,
  layerName,
  jsonData,
  layerType,
  controlBoxElem,
  imageName,
  imageData
) => {
  map.on("load", () => {
    map.addSource(layerName, {
      type: "geojson",
      data: jsonData,
    });
    // console.log(map.getSource(layerName))
    let whiteIcon;
    if (!map.hasImage(imageName)) {
      whiteIcon = new Image(30, 30);
      whiteIcon.onload = () => map.addImage(imageName, whiteIcon);
      whiteIcon.src = imageData;
    }
    const layerList = [];

    const labelWithCheckbox = document.createElement("label");
    labelWithCheckbox.textContent = layerName;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = false;
    labelWithCheckbox.appendChild(checkbox);
    if (controlBoxElem) controlBoxElem.appendChild(labelWithCheckbox);
    layerType.forEach((type) => {
      let filterWord;
      let options;
      let popup;
      switch (type) {
        case "symbol":
        case "circle":
          filterWord = "Point";
          options = {
            layout: {
              "icon-image": imageName,
              "icon-allow-overlap": true,
            },
          };
          popup = (e) => {
            const descLines = e.features[0].properties.description.split("\n");
          
            const descCont = descLines.reduce((accum, x) => {
                console.log(`findthislog ${x}`)
                return accum + `<p>${x}</p>`
            },"")
            return `<div style="font-weight:bold">${e.features[0].properties.name}</div> 
             <div>${descCont}</div>`
          };
          break;
        case "fill":
          filterWord = "Polygon";
          options = {
            paint: {
              "fill-color": "#888888",
              "fill-opacity": 0.4,
            },
          };
          popup = (e) => {
            const descLines = e.features[0].properties.description.split("\n");
            console.log(descLines)
            const descCont = descLines.map(x => {
              console.log(`findthislog ${x}`)
              return `<p>${x}</p>`

          }
            )

            return `<div style="overflow-y:scroll">${e.features[0].properties.name}</div> 
            </br> <div style="overflow-y:scroll">${descCont}</div>`
          };
          break;
        default:
          filterWord = undefined;
          break;
      }
      layerList.push(layerName + filterWord);
      if (filterWord) {
        map.addLayer({
          ...options,
          id: layerName + filterWord,
          type: type,
          source: layerName,
          filter: ["==", "$type", filterWord],
        });
        map.setLayoutProperty(layerName + filterWord, "visibility", "none");
        map.on("click", layerName + filterWord, function (e) {
          try{
            new mapbox.Popup()
              .setLngLat(e.lngLat)
              .setHTML(
                popup(e)
              )
              .addTo(map);
          }catch(e){}// just don't want to crash 
        });
      }
      if (controlBoxElem) {
        checkbox.onchange = (event) => {
          const checkbox = event.target;

          if (checkbox && event.target) {
            layerList.forEach((layer) => {
              const currentLayer = map.getLayer(layer);
              map.setLayoutProperty(
                layer,
                "visibility",
                checkbox.checked ? "visible" : "none"
              );
            });
          }
        };
      }
    });
  });
};
