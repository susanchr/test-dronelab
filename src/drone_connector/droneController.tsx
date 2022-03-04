import {useState, useEffect} from 'react';

const Events = {
    TIME_CHANGED:"TIME_CHANGED",
};

const LOOP_TIME = 1000; // time in ms
const DATA_UPDATE_TIME = 3; // time in sec

let clearDataFunctions:Array<()=>any> = [];
function clearDroneStatsAndImage(){
    clearDataFunctions.forEach((f)=>{
        f();
    });
}
// start time loop
const {subscribe:time_subscribe} = (()=>{

    console.log("setting up time loop event");

    const timeEmitter = new EventTarget();
    let subscribed_count = 0;

    let start_date = new Date().getTime();
    let timeout_id:any = -1;

    function timeBump(){
        timeout_id = setTimeout(()=>{
            // console.log(`time looped ${new Date()}`);
            // console.log(`subscribed_count is ${subscribed_count}`);
            if( subscribed_count>0 ){
                const e = new Event(Events.TIME_CHANGED);
                timeEmitter.dispatchEvent( e );
                timeBump();
            }
        }, LOOP_TIME);
    }

    function subscribe(funct:Function){

        let is_subscribed = false;

        if(subscribed_count <= 0){
            start_date = new Date().getTime();
            timeBump();
        }

        function doIt(){

            const now_date = new Date().getTime();
            const time_passed = now_date-start_date;
            
            const should_call_network = (()=>{
                const time = parseInt((time_passed/1000)+""); // adding some strings for type issues 
                const to_return = time%DATA_UPDATE_TIME===0;
                return to_return;
            })();
            

            if( is_subscribed ){
                funct( time_passed, should_call_network );
            }
        }

        is_subscribed = true;
        timeEmitter.addEventListener(Events.TIME_CHANGED, doIt);
        subscribed_count++;
        
        return ()=>{
            is_subscribed = false;
            timeEmitter.removeEventListener(Events.TIME_CHANGED, doIt);
            subscribed_count--;
            if(subscribed_count===0 && timeout_id>-1){
                clearInterval(timeout_id);
                timeout_id=-1;
            }
        };
    }

    return {subscribe};

})();

interface DroneImgObj {
    img_url:string,
    err:boolean,
}

const useDroneImage = (()=>{

    clearDataFunctions.push(()=>{
        current_img_obj = {
            img_url:"",
            err:false
        };
    });

    let current_img_obj:DroneImgObj;
    
    // TODO rethink this; it needs to have drone id, but that is hard to get at this time, but we want to preload some data 
    getImageFromTime(0, "drone1").then((new_img_obj)=>{
        current_img_obj = new_img_obj;
    });

    return function useDroneImage(drone_id:string, should_make_call:boolean):DroneImgObj|undefined{

        const [drone_img_obj, setImgObjStatus] = useState<DroneImgObj>(current_img_obj);
        
        // TODO this will be set up for each call... It would be better to not fetch in this function 
        useEffect(()=>{
            async function handleTimeChange(ms:number, should_call_network:boolean){

                if( should_make_call===false || (should_call_network===false && current_img_obj.img_url!=="" ) ){
                    return;
                }

                const local_current_img_obj = await getImageFromTime(ms, drone_id);
                setImgObjStatus(local_current_img_obj);
                current_img_obj = local_current_img_obj;
            }
            return time_subscribe(handleTimeChange);
        });
    
        return drone_img_obj;

    }

    async function getImageFromTime(ms:number, drone_id:string):Promise<DroneImgObj>{

        let data;
        
        console.log(`ms ${ms}`);

        const src_url = `/api/last_image?drone_id=${drone_id}&test=true&time_stamp=${ms}`
        data = await fetch(src_url)
        .then(async (r)=>{

            if( current_img_obj!==undefined ){
                URL.revokeObjectURL(current_img_obj.img_url)
            }

            const img_blob = await r.blob();
            let blob_url = URL.createObjectURL(img_blob);

            return {
                img_url:blob_url,
                err: r.status!==200,
                url: src_url,
            };
        });
        
        // assume that if there is an error, it is because the BE could not get the data
        if( data.err===true ){ 
            current_img_obj = (typeof current_img_obj==='undefined') ? {err:true,img_url:""} : current_img_obj;
        }else{
            current_img_obj = data;
        }

        return current_img_obj;
    }
})();

interface DroneStatus {
    data: {
        pitch:string,
        roll:string,
        yaw:string,
        vgx:string,
        vgy:string,
        vgz:string,
        templ:string,
        temph:string,
        tof:string,
        h:string,
        bat:string,
        baro:string,
        time:string,
        agx:string,
        agy:string,
        agz:string,
        location:string,
    },
    err:undefined,
    out_of_data?:boolean,
    drone_id:string
}
interface DroneStatsErr{
    err:boolean,
    out_of_data?:boolean,
    data:undefined,
}

const useDroneStatus = (()=>{

    clearDataFunctions.push(()=>{
        current_status = undefined;
    });

    let current_status:DroneStatus|undefined|DroneStatsErr; // TODO put this inside a function's scope 
    // TODO rethink this; it needs to have drone id, but that is hard to get at
    getDroneStatsFromTime(0, "drone1").then((new_status)=>{
        current_status = new_status;
    });

    return function useDroneStatus(drone_id:string, should_make_call:boolean):DroneStatus|undefined|DroneStatsErr{
        const [drone_status, setDroneStatus] = useState<DroneStatus|undefined|DroneStatsErr>(current_status);
        
        if(drone_status!==undefined && drone_status.data!==undefined){
            // console.log("drone_status.data.time is "+drone_status.data.time);
        }
        // TODO this will be set up for each call... It would be better to not fetch in this function 
        useEffect(()=>{
            if (drone_id === "") {
                return
            }
            async function handleTimeChange(ms:number, should_call_network:boolean){

                let new_status;

                // don't update anything, including time, out of data 
                if( should_make_call===false ){
                    return;
                }

                if(drone_status!==undefined && drone_status.data!==undefined){
                    const obj_clone = JSON.parse(JSON.stringify(drone_status));
                    obj_clone.data.time = parseInt((ms/1000)+"")+""; // adding some strings for type issues 
                    setDroneStatus(obj_clone);
                    current_status = obj_clone;
                }

                // don't do network call if it is not time 
                if( should_call_network===false && current_status!==undefined ){
                    return;
                }

                // get the last time. we want to make sure not to update the time from this request. it will be updated at the top of this async function 
                let last_time;
                if( current_status && current_status.data ){
                    last_time = current_status.data.time;
                }
                new_status = await getDroneStatsFromTime(ms, drone_id); 
                if( new_status!==undefined && new_status.data!==undefined && last_time!==undefined ){
                    new_status.data.time = last_time;
                }
                current_status = new_status;
                setDroneStatus(current_status);
            }
            return time_subscribe(handleTimeChange);
        },[drone_id,should_make_call]);
    
        return drone_status;
    }

    async function getDroneStatsFromTime(ms:number, drone_id:string):Promise<DroneStatus|DroneStatsErr>{
        
        console.log(`ms ${ms}`);

        let resp_data = await fetch(`/api/status?drone_id=${drone_id}&time_stamp=${ms}`).then(r=>r.json());
        let data = resp_data;
        
        // assume that if there is an error, it is because the BE could not get the data
        if( data!==undefined && data.err===true ){ 
            // should_make_call = false;
            data = current_status; // revert to old data if new data is not valid 
            if( data!==undefined ){
                data.out_of_data = true;
            }
        }

        return data;
    }
})();


const useSensorStatus = () => {
    
}

export {
    useDroneStatus,
    useDroneImage,
    clearDroneStatsAndImage
};