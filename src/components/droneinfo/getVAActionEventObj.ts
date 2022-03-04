export interface Action {
  "id": number;
  "containsPopup": boolean;
  "status": string;
  "start": number;
  "end": number;
  "title": string;
  "popupDetails": string;
};
interface EventObj {
    actions: Array<Action>;
}

function getVAActionEventObj():EventObj {

    const event_obj = {
        "actions": [
            {
              "id": 0,
              "status": "In Progress",
              "start": 0,
              "end": -1,
              "title": "Monitor storm impact",
              "containsPopup": true,
              "popupDetails": "action_img/WeatherMonitor.png"
            },
            {
              "id": 1,
              "status": "In Progress",
              "start": 25,
              "end": -1,
              "title": "Check predictive risk forecast",
              "containsPopup": true,
              "popupDetails": "action_img/Predict.png"
            },
            {
              "id": 2,
              "status": "Not Started",
              "start": 60,
              "end": -1,
              "title": "Dispatch stormwater crew",
              "containsPopup": true,
              "popupDetails": "action_img/Dispatch.png"
            },
            {
              "id": 3,
              "status": "Not Started",
              "start": 130,
              "end": -1,
              "title": "Review recommended action",
              "containsPopup": true,
              "popupDetails": "action_img/Recommend.png"
            },
            {
              "id": 4,
              "status": "Not Started",
              "start": 200,
              "end": -1,
              "title": "Coordinate with traffic operations",
              "containsPopup": true,
              "popupDetails": "action_img/Communicate.png"
            }
          ]
    };
    return event_obj;
}

// {
//     "id": number,
//     "containsPopup": boolean,
//     "status": string,
//     "start": 0,
//     "end": 60,
//     "title": "Monitor storm impact",
//     "popupDetails": ""
// }

export { getVAActionEventObj }