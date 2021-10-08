import React,{useState,useEffect,useRef} from 'react';
import {View,Text,TouchableOpacity,Animated,ScrollView,ActivityIndicator,Image} from 'react-native';
import RtcEngine, {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora'
import styles from '../../components/styles'
import requestCameraAndAudioPermission from '../../components/permission';
import videoicon from '../../images/video.png';
import endcallIcon from '../../images/endcall.png';
import muteaudio from '../../images/muteaudio.png';
import cameraswitch from '../../images/camerswitch.png';
import mute_video from '../../images/mute_video.png';
import mic from '../../images/mic.png';
const VideoCall=(props)=>{
	let RtcInstance=useRef(null);
	let animatedcontrol=useRef(new Animated.Value(0)).current;
	const [showVideo,setshowVideo] = useState(null);
	const [togglcontrol,settogglecontrol] = useState(0);
	const [peerIds,setpeerIds]=useState([]);
	const [loading,setloading]=useState(true);
	const [audiocallmute,setaudiocallmute]=useState(false);
	const [videocallmute,setvideocallmute]=useState(false);
	useEffect(()=>{
		if(props.app_id){
			initCall(props.app_id)
		}
		 return () => {
		 	console.log("removing listeners.........");
		 	if(RtcInstance.current){
			removeListeners(RtcInstance.current);
			}
  	};
	},[props.app_id])
	const initCall=async(app_id)=>{
		// RtcInstance.current="123"
		// console.log(RtcInstance.current);
		requestCameraAndAudioPermission().then(async()=>{
			RtcInstance.current=await RtcEngine.create(app_id);
			await RtcInstance.current.enableVideo();
			await startVideo();
			addListeners(RtcInstance.current);
		})
	}
	const startVideo=async()=>{
		await RtcInstance.current?RtcInstance.current.joinChannel(props.token, props.channelName, null, 0):null;
		// settogglecontrol(1);
		// setTimeout(()=>{		
		// Animated.spring(animatedcontrol,{
		// 	toValue:1,
		// 	duration:500
		// }).start();
		// },500)
	}
const handleUserJoined=(uid,elapsed)=>{
	console.log("user joined",uid)
	const peerIdsData=[...peerIds];
        if (peerIdsData.indexOf(uid) === -1) {
        	let countofPeers=[...peerIdsData, uid];
            setpeerIds(countofPeers);
            if(countofPeers.length>0){
            	setloading(false);
            }

        }
}
const handleError=(Error) => {
        console.log('Error', Error)
    }
    const handleUserOffline=(uid, reason) => {
        console.log('UserOffline', uid, reason)
        const peerIdsData=[...peerIds];
        setpeerIds(peerIdsData.filter(id => id !== uid));
        if(peerIdsData.filter(id => id !== uid).length==0){
        	endCall()
        }
    }
    const handleJoinChannel=(channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed)
        setshowVideo((data)=>{return true});
    }
const addListeners=(instance)=>{
	instance.addListener('UserJoined', handleUserJoined)
    instance.addListener('Error', handleError)
    // Listen for the UserOffline callback.
    instance.addListener('UserOffline', handleUserOffline)
    // Listen for the JoinChannelSuccess callback.
    instance.addListener('JoinChannelSuccess', handleJoinChannel)
}
const removeListeners=(instance)=>{
	instance.removeListener('UserJoined', handleUserJoined)
    instance.removeListener('Error', handleError)
    // Listen for the UserOffline callback.
    instance.removeListener('UserOffline', handleUserOffline)
    // Listen for the JoinChannelSuccess callback.
    instance.removeListener('JoinChannelSuccess', handleJoinChannel)
}
const endCall=async()=>{
	await RtcInstance.current.leaveChannel();
	setshowVideo(null);
	props.endVideoCall&&props.endVideoCall();
}
const switchCamera=async()=>{
	await RtcInstance.current.switchCamera();
}
const muteaudioCall=async()=>{
	await RtcInstance.current.muteLocalAudioStream(!audiocallmute)
	setaudiocallmute(!audiocallmute);
}
const mutevideoCall=async()=>{
	await RtcInstance.current.muteLocalVideoStream(!videocallmute)
	setvideocallmute(!videocallmute);
}
const renderVideoControls=()=>{
	let animatevideoStyles={height:100,width:'100%',backgroundColor:'rgba(0,0,0,0.5)',position:'absolute',bottom:animatedcontrol.interpolate({inputRange:[0,1],outputRange:[-100,0]}),flexDirection:'row',alignItems:'center',justifyContent:'center'}
	return(
	<Animated.View style={animatevideoStyles}>
	<TouchableOpacity onPress={()=>switchCamera()} style={{width:60,height:60,backgroundColor:'white',borderRadius:30,marginRight:12,alignItems:'center',justifyContent:'center'}}>
	<Image style={{width:35,height:35}}  resizeMode="contain" source={cameraswitch}/>
	</TouchableOpacity>
	<TouchableOpacity onPress={()=>muteaudioCall()} style={{width:60,height:60,backgroundColor:'white',borderRadius:30,marginRight:12,alignItems:'center',justifyContent:'center'}}>
	<Image style={{width:35,height:35}}  resizeMode="contain" source={audiocallmute?muteaudio:mic}/>
	</TouchableOpacity>
	<TouchableOpacity onPress={()=>endCall()} style={{width:60,height:60,backgroundColor:'white',borderRadius:30,marginRight:12,alignItems:'center',justifyContent:'center'}}>
	<Image style={{width:35,height:35}}  resizeMode="contain" source={endcallIcon}/>
	</TouchableOpacity>
	<TouchableOpacity onPress={()=>mutevideoCall()} style={{width:60,height:60,backgroundColor:'white',borderRadius:30,marginRight:12,alignItems:'center',justifyContent:'center'}}>
	<Image style={{width:35,height:35}}  resizeMode="contain" source={videocallmute?mute_video:videoicon}/>
	</TouchableOpacity>
	</Animated.View>
	)
}
_renderRemoteVideos = () => {
        return (
            <ScrollView
                style={styles.remoteContainer}
                contentContainerStyle={{paddingHorizontal: 2.5}}
                horizontal={true}>
                {peerIds.map((value, index, array) => {
                    return (
                        <RtcRemoteView.SurfaceView
                            style={styles.remote}
                            uid={value}
                            channelId={props.channelName}
                            renderMode={VideoRenderMode.Hidden}
                            zOrderMediaOverlay={true}/>
                    )
                })}
            </ScrollView>
        )
    }
const toggleControls=()=>{
	console.log("animatedcontrol",animatedcontrol)
	Animated.spring(animatedcontrol,{
			toValue:togglcontrol==1?0:1,
			duration:500
		}).start();
	settogglecontrol(togglcontrol==0?1:0);
}
const _renderLoading=()=>{
	return (
		<View style={[styles.fullView,{backgroundColor:'rgba(0,0,0,0.3)',position:'absolute',alignItems:'center',justifyContent:'center'}]}>
			<ActivityIndicator size="large" color="white"/>
			<Text style={{color:'white',fontSize:20,paddingTop:12}}>Connecting Please Wait....</Text>
		</View>
		)
}
console.log("showVideo",showVideo)
return (
	<View>
	<TouchableOpacity onPress={()=>toggleControls()}>
	{showVideo?
		<View style={styles.fullView}>
	 <RtcLocalView.SurfaceView
                    style={styles.max}
                    channelId={props.channelName}
                    renderMode={VideoRenderMode.Hidden}/>
	{loading&&
						_renderLoading()
					}
                    </View>
                    :null
	}
	</TouchableOpacity>
	{showVideo&&
		renderVideoControls()
	}
	{showVideo&&
		_renderRemoteVideos()
	}
	</View>
	)
}
export default VideoCall;