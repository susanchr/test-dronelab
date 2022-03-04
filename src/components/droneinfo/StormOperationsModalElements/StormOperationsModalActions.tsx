import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import {getVAActionEventObj, Action} from "../getVAActionEventObj";
import useVideoTime from "../../../helper/useVideoTime";
import LightBulbGuide from "../../../helper/LightBulbGuide";
import { RecommendedActionsModal } from "../../addtionalOp/RecommendedActionsPopup/RecommendedActoinsModal";
import {actions as actions_helper} from "../../../helper/LightBulbGuide.json";

const vid1 = "http://drone-lab-2020-media-lab-4-admin.dronelabs-ed9112eb83c761afd4c566b0882eaa3e-0000.us-south.containers.appdomain.cloud/input-video.mp4";
const vid2 = "http://drone-lab-2020-media-lab-4-admin.dronelabs-ed9112eb83c761afd4c566b0882eaa3e-0000.us-south.containers.appdomain.cloud/output-video.mp4";

const stats_assumed_height = "500px";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stormoperations_alerts: {
      "&": {
        display: "grid",
        gridTemplate: "auto 1fr / auto",
       backgroundColor: "white",
        gridArea: "2 / 3 / 3 / 4",
      },
      "& > .alert_title": {
        width: "100%",
        textAlign: "center",
        backgroundColor: "#3A3838",
        color: "white",
        padding: "5px",
        fontSize: "1.15rem",
        display:"flex",
        justifyContent:"space-between",
        "& > .lightbulb":{
          height:"1.5rem",
          width:"1.5rem",
          alignSelf:"flex-end"
        },
        "& > .flex_spacer":{
          width:"1.5rem",
          height:"0px"
        }
     },
     "& > .alerts_list": {
        display: "block",
        width: "100%",
        textAlign: "center",
        backgroundColor: "#fff",
        color: "white",
        padding: "5px",
      fontSize: "1.15rem",
      "& .alert": {
        display: "flex",
       backgroundColor: "#fff",
        color: "#000",
        fontSize: "0.8rem",
        margin: "5px"
       },
      "& .alert > .alert_title, & .alert > .alert_status": {
       backgroundColor: "#fff",
        border: "1px solid gray",
        color: "#000",
        padding: "5px 7px 5px 7px",
        fontSize: "1rem",
        margin: "5px"
       },
       "& .alert > .alert_title": {
          flexGrow:1,
        },
       "& .alert > .review": {
          color: "#29bdf2",
          borderColor: "#29bdf2",
        },
       "& .alert > .alert_status.in_progress": {
          backgroundColor:"#70ad47",
        },
      "& .alert:hover .alert_title.review, & .alert:hover": {
        // color: "#0f62fe",
        backgroundColor:"#f3f1f1",
        // fontWeight: "700"
      }
      },
    }
  })
);

function StormOperationsModalActions() {
  const classes = useStyles();

  const [should_make_call, setShouldMakeCall] = useState(true);
  const [actions_elements,setActionsElements] = useState<Array<JSX.Element>>();
  const [actions_modal_state,setShowRecommenededActionsModalState] = useState({show:false,title:"",popupDetails:""});
  const video_time = useVideoTime("#video2");

  useEffect(()=>{
    const cur_actions_elements = getCurrentActions(video_time).map((cur:Action,i)=>{

      const status_class_list = ["alert_status"];

      if(cur.status==="In Progress"){
        status_class_list.push("in_progress");
      }
      
      return (<div className="alert" onClick={showModal} key={i}>
        <div className="alert_title review">{cur.title}</div>
        <div className={status_class_list.join(" ")}>{cur.status}</div>
      </div>);

      function showModal(){
        setShowRecommenededActionsModalState({show:true,title:cur.title,popupDetails:cur.popupDetails});
      }
    });

    // cur_actions_elements.push(
    // <div className="alert">
    //   <div className="alert_title review">Review recommended actions</div>
    //   {/* <div className="alert_status">{cur.status}</div> */}
    // </div>);

    setActionsElements(cur_actions_elements||[]);
  },[video_time]);

  function setOutOfData() {
    setShouldMakeCall(false);
  }

  const out_of_data_text = should_make_call === false ? " (flight ended)" : "";

  return (
    <div className={classes.stormoperations_alerts}>
      <div className="alert_title">
        <img className="flex_spacer" src="/lightbulb.png"></img>
        <div>Actions</div>
        <LightBulbGuide title={actions_helper.title} text={actions_helper.text}></LightBulbGuide>
      </div>
      <div className="alerts_list">{actions_elements}</div>
      <RecommendedActionsModal setClosed={()=>{setShowRecommenededActionsModalState({show:false,title:"",popupDetails:""})}} img={actions_modal_state.popupDetails} title={actions_modal_state.title} open={actions_modal_state.show}></RecommendedActionsModal>
    </div>
  );
}

function getCurrentActions(video_time:Number):Array<Action>{

  const event_obj = getVAActionEventObj();
  
  const to_return = event_obj.actions.reduce(( acc:Array<Action>, cur:Action )=>{
    if( cur.start<=video_time && (cur.end>=video_time || cur.end===-1) ){
      acc.push(cur);
    }
    return acc;
  },[]);
  return to_return;
}

export { StormOperationsModalActions };

/*     
<div className={classes.stormoperations_actions}>
        <div className="alert_title">Actions</div>
        <div className="alert_content">
            <div className="actions_list">
                {action_element_list}
            </div>
        </div>
    </div>
    */