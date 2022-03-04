import React, { useReducer, Dispatch, FunctionComponent } from "react";
import data from "./../../assets/data/dronedata.json";
// import json from "./../../assets/data/config.json";
interface Flight {
  center: [number, number];
  style: string;
  zoom: number;
  usage?: string;
  date?: string;
  duration?: string;
  flightTime?: string;
  location?: string;
  weather?: string;
  altitude?: string;
  droneLocations?: DetailInfo[];
  flyRoute?: number[][];
  flyCenter?: number[];
}

export interface UserConfig {
  ConsoleDisplayName?: string;
  UserDrones?: { friendly_name: string; drone_serial_no: string | null }[];
  DroneOperations?: string[];
  readError: boolean;
}

export interface DetailInfo {
  drone_id?: string;
  dronePic?: string;
  connectStatus: string;
  friendly_name?: string;
  drone_serial_no: string | null;
  pilot: string | null;
  model_type: string | null;
  discSpace: number;
  coordinate?: number[];
  children?: any | null;
}

export interface DroneStatsElementProps{
  top_text?: string,
  
  text?: string,
  left_text?: string,
  right_text?: string,

  bottom_text?: string,
  bottom_left_text?: string,
  bottom_right_text?: string,

  backgroundColor?:string,
}

export interface DroneStatsElementTempProps{
  top_text?: string,
  
  text?: string,
  left_text?: string,
  right_text?: string,

  bottom_text?: string,
  bottom_left_text?: string,
  bottom_right_text?: string,
  border?: string,

  icon?: string,
  


  backgroundColor?:string,
}


export interface DroneStatBatteryProps{
  text: string,
  fillColor?: string,
  color?: string
}

export interface DroneStatGChartProps{
  text: string,
  title: string,
  unit?: string,
}

export interface DroneStatMiniRadialChartProps{
  text: string,
  title: string,
  unit: string,
  start_color?: string,
  end_color?: string,
}

export interface DroneDetailModalInterface {
  // Adding serial number so it can be passed down to map
  drone_id : string,
  serial_number : string,
  friendly_name: string,
  pilot : string,
  closeModal: () => void,
}

export interface StormOperationsModalInterface {
  closeModal: () => void,
}

// // patching data from config.json into data from dronedata.json
// if (data && data[0] && data[0].droneLocations) {
//   data[0].droneLocations.forEach((loc, index, arr) => {
//     arr[index].friendly_name = json.UserDrones[index].friendly_name;
//     arr[index].drone_serial_no = json.UserDrones[index].drone_serial_no;
//   });
// }
export const defaultUserConfig: UserConfig = {
  ConsoleDisplayName: "",
  DroneOperations: [],
  UserDrones: [],
  readError: false,
};
const previousFlight: { currentId: number; flightList: Flight[] } = {
  currentId: 0,
  flightList: data as Flight[],
};
const map: Flight = previousFlight.flightList[0];
interface InitState {
  userConfig: UserConfig;
  previousFlight: { currentId: number; flightList: Flight[] };
  map: Flight;
  errInfo?: string[] | undefined;
}
const initState: InitState = {
  userConfig: defaultUserConfig,
  previousFlight,
  map,
  errInfo: [],
};
interface Action {
  type: string;
  payload: any;
}
export const types = {
  CHANGE_PREVIOUS_FLIGHT: "HOME/CHANGE_PREVIOUS_FLIGHT",
  CHANGE_FLIGHT_LIST: "HOME/CHANGE_FLIGHT_LIST",
  UPDATE_USER_CONFIG: "HOME/UPDATE_USER_CONFIG",
  ADD_ERROR_INFO: "HOME/ADD_ERROR_INFO",
};
export const actionCreator = {
  changePreviousFlight: (id: number) => ({
    type: types.CHANGE_PREVIOUS_FLIGHT,
    payload: id,
  }),
  updateUserConfig: (input: UserConfig) => ({
    type: types.UPDATE_USER_CONFIG,
    payload: input,
  }),
  addErrorInfo: (info: string|string[]) => ({
    type: types.ADD_ERROR_INFO,
    payload: info,
  }),
};
const reducer = (state = initState, action: Action): InitState => {
  switch (action.type) {
    case types.CHANGE_PREVIOUS_FLIGHT:
      if (!isNaN(action.payload)) {
        return {
          ...state,
          previousFlight: {
            ...state.previousFlight,
            currentId: action.payload,
          },
          map: state.previousFlight.flightList[action.payload],
        };
      } else {
        return state;
      }
      break;
    case types.CHANGE_FLIGHT_LIST:
      return {
        ...state,
        previousFlight: { ...state.previousFlight, flightList: action.payload },
      };
      break;
    case types.UPDATE_USER_CONFIG:
      return {
        ...state,
        userConfig: action.payload,
      };
      break;
    case types.ADD_ERROR_INFO:
      if (state && state.errInfo) {
        return Array.isArray(action.payload)
          ? { ...state, errInfo: [...state.errInfo, ...action.payload] }
          : { ...state, errInfo: [...state.errInfo, action.payload] };
      } else return state;
      break;
    default:
      return state;
  }
};
const HomeStateContext = React.createContext<any>({ state: initState });
const HomeProvider: FunctionComponent<any> = ({ children }) => {
  const [state, dispatch]: [any, Dispatch<Action>] = useReducer(
    reducer,
    initState
  );
  return (
    <HomeStateContext.Provider value={{ state, dispatch }}>
      {children}
    </HomeStateContext.Provider>
  );
};
export { HomeStateContext, HomeProvider };
