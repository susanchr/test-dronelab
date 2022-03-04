export function loadGeoJSONImage(
    map:any,
    layerName:string,
    controlBoxElem: HTMLDivElement|null,
    ) {

    const filterWord = "Image";
    let layer_selector = layerName + filterWord;

    const lat_min = -97.507323;
    const lat_max = -96.513747;

    const center=32.9422315
    const h_w_ratio = (841/1091)
    const offset=((lat_max-lat_min) * h_w_ratio / 2);

    const lon_min= center-offset;
    const lon_max = center+offset;

    map.on('load', function () {

        map.addSource("myImageSource", {
            "type": "image",
            "url": "weather.png",
            "coordinates": [
                [lat_min, lon_max],
                [lat_max, lon_max],
                [lat_max, lon_min],
                [lat_min, lon_min],
            ],
        });

        map.addLayer({
            "id": layer_selector,
            "source": "myImageSource",
            "type": "raster",
            "paint": {
                "raster-opacity": 0.85
            }
        });

        map.setLayoutProperty(layer_selector, "visibility", "none");

        const labelWithCheckbox = document.createElement("label");
        labelWithCheckbox.textContent = layerName;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = false;
        labelWithCheckbox.appendChild(checkbox);  
        if (controlBoxElem) controlBoxElem.appendChild(labelWithCheckbox);      

        if (controlBoxElem) {
            checkbox.onchange = (event) => {
                const checkbox = event.target as HTMLInputElement;

                if (checkbox && event.target) {
                    const currentLayer = map.getLayer(layer_selector);
                    map.setLayoutProperty(
                        layer_selector,
                        "visibility",
                        checkbox.checked ? "visible" : "none"
                    );
                }
            };
        }

    }); // nothing should be after this 
}