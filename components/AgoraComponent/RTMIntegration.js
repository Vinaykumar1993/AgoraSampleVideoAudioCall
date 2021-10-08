import React,{useEffect} from 'react';
import {View,Text} from 'react-native';
import AgoraRTM from 'agora-rtm-sdk';
const RtmIntegration=()=>{
	useEffect(()=>{
		init()
	},[])
	const init=async()=>{
		try{
			// AgoraRTM.createInstance("121EiJvn8yd7oEsuCdwRWSVGrS3mS2BqDe");
		let instance=await AgoraRTM.createInstance("2a152b3f32f846aeb15cfb04cc995aa5");
		console.log(instance);
		return instance.login({"uid":"4238th34oingtriougn9q348y4ymriah0emr0i","token":"0062a152b3f32f846aeb15cfb04cc995aa5IAC6qhcpXjI/6iFM+slK+CxWzezkI6VCefs+sIJy0l2RKnc5ivEAAAAAEAAiUH9LU0dgYQEA6APjA19h"})
		// instance.on('')

		// let loggedin=await instance.login("0062a152b3f32f846aeb15cfb04cc995aa5IADWar/XsGa9msyLPk0+elrR9D5BSP8s9Aeol3W9P3W3AO5RUKMAAAAAEADSvifOKBxgYQEAAQAnHGBh",`Test12345`);
		// await instance.login(null,"1633599603571");
		}catch(err){
			console.log(err)
		}
	}
	return (
		<View><Text>RTM Integration</Text></View>
		)
}
export default RtmIntegration;