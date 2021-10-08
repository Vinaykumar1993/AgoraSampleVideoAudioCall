
import React,{useState,Fragment} from 'react';
import {View,TouchableHighlight,Text} from 'react-native';
import VideoCall from './components/AgoraComponent/VideoCall';
import SnapScrollView from './components/AgoraComponent/SnapScroll';
import RTMIntegration from './components/AgoraComponent/RTMIntegration';
const App =()=>{
    const [showvideo,setshowvideo]=useState(null);
    const [showaudio,setshowaudio]=useState(null);
    const [triggerCall,setTriggerCall]=useState(null);
    const triggerVideoCall=()=>{
        setTriggerCall(true);
        setshowaudio(false);
        setshowvideo(true);
    }
    const triggerAudioCall=()=>{
        setTriggerCall(true);
        setshowaudio(true);
        setshowvideo(false);
    }
    const endVideoCall=()=>{
        setshowaudio(false);
        setshowvideo(false);
        setTriggerCall(false);
    }
    return (
        <Fragment style={{padding:15}}>
        {(!triggerCall )&&
            <Fragment>
        <TouchableHighlight style={{backgroundColor:'red',padding:12,borderRadius:5}} onPress={()=>triggerVideoCall()}>
            <Text style={{fontWeight:'bold',color:'white'}}>Video Call</Text>
        </TouchableHighlight>
        </Fragment>
        }
        <RTMIntegration/>
        {showvideo&&
        <VideoCall endVideoCall={()=>endVideoCall()} app_id="2a152b3f32f846aeb15cfb04cc995aa5" channelName="channelb" token="0062a152b3f32f846aeb15cfb04cc995aa5IADrejowMOo5C0hzhZQdZW+0RzBXG+PachZMZOWjQnnWaETCpJkAAAAAEADSvifO5zBhYQEAAQDnMGFh"/>
    }
    </Fragment>
        )
}
export default App;