import mapbox from "mapbox-gl";
import * as turf from "@turf/turf"
import droneImg from "./../../../../assets/technology.svg"

export const toggleLayerVisibility = (map: mapbox.Map, layerName: string, isLayerVisible: boolean) => {
    const layer: mapbox.Layer = map.getLayer(layerName);
    if (layer) {
        map.setLayoutProperty(layerName, "visibility", isLayerVisible ? "visible" : "none")
    }
}
export const addMarkersLayer = (map: mapbox.Map, layerName: string, markerName: string, locations: any, controlBoxElem: HTMLDivElement | null, checkable : boolean): Function | void => {
    const layer: mapbox.Layer = map.getLayer(layerName);
    if (!layer) {
        map.on("load", async () => {
            const curLayer: mapbox.Layer = map.getLayer(layerName);
            if (!curLayer) {
                map.addSource(layerName, {
                    "type": "geojson", data: turf.featureCollection(
                        locations.map((loc: any) => turf.point([loc.coordinate[1], loc.coordinate[0]]))
                    ) as any
                })
                let droneIcon: HTMLImageElement;
                if (!map.hasImage(markerName)) {
                    droneIcon = new Image(30, 30);
                    droneIcon.onload = () => map.addImage(markerName, droneIcon);
                    droneIcon.src = droneImg
                }

                if (!map.getLayer(layerName)) {
                    map.addLayer({
                        'id': layerName,
                        'type': 'symbol',
                        'source': layerName,
                        'layout': {
                            'icon-image': markerName,
                            'icon-allow-overlap': true
                        }
                    })
                }
                /*
                if (target_serial !== "") {
                    map.on("click", layerName, function(e) {
                        new mapbox.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(
                            `<div style="overflow-y:scroll">${target_serial}</div>`
                        )
                        .addTo(map);
                    })
                }
                */
            }
        })
    }
    if (controlBoxElem && controlBoxElem.firstChild)
        controlBoxElem.removeChild(controlBoxElem.firstChild);
    const currentLayerName = layerName
    const labelWithCheckbox = document.createElement("label");
    if (checkable) {
        labelWithCheckbox.textContent = `Display drones in ${currentLayerName}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        labelWithCheckbox.appendChild(checkbox);
        checkbox.onchange = (event: Event): void => {
            const checkbox: HTMLInputElement | null = event.target as HTMLInputElement;
            const currentLayer = map.getLayer(currentLayerName);
            console.log(currentLayer)
            if (checkbox && event.target && currentLayer)
                map.setLayoutProperty(
                    currentLayerName,
                    'visibility',
                    checkbox.checked ? 'visible' : 'none'
                );
        }
    }
    else {
    }
    controlBoxElem?.insertBefore(labelWithCheckbox, controlBoxElem.firstChild);
}
export const loadGeoJSONLayer = (map: mapbox.Map, layerName: string, jsonData: any, layerType: any) => {
    map.on("load", async () => {
        map.addSource(layerName, { "type": "geojson", data: jsonData })
        // console.log(map.getSource(layerName))
        map.addLayer({ id: layerName, "type": layerType, source: layerName, layout: { "text-field": ['get', 'name'] } })
        console.log(map.getLayer(layerName))
    })

}