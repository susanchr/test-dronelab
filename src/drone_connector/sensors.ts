//import sensordata from "/src/assets/data/sensordata.json"

export interface SensorInterface {
    type : string,
    features : Array<
        FeatureInterface>
}

interface FeatureInterface {
    type : string,
    geometry : {
        type : string,
        coordinates : [
            number,
            number,
            number
        ]
    },
    properties: {
        name : string,
        styleUrl : string,
        styleHash : string,
        styleMapHash : {
            normal : string,
            highlight : string
        }
        icon : string,
        description : string,
    }
}


export default async function acquireSensorLocation () : Promise<any> {
    const j = require("../assets/data/sensordata.json")
    const j_s = j.getNearBySensors[0].response;

    const features = JSON.parse(j_s).rows.map((x : any) =>
        {
            const f : FeatureInterface = {
                type : "Feature",
                geometry : x.geometry,
                properties: {
                    name : x.doc.properties.sensor,
                    styleUrl: "#icon-1899-0288D1",
                    styleHash: "-21fe3a8d",
                    styleMapHash: {
                        "normal": "#icon-1899-0288D1-normal",
                        "highlight": "#icon-1899-0288D1-highlight"
                    },
                    icon: "https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png",
                    description: "(" + x.doc.properties.name + ")\n" 
                    + '<span style="color:blue">'+x.doc.properties.last_value + x.doc.properties.unit+"</span>"
                    ,
                    //html: x.doc.properties.reading_html
                }
            }
            return f
        }
        //x.geometry.coordinates
    )
    return {
        type: "FeatureCollection",
        features: features,
    }
}
