"use client"
import SelectTopic from '@/app/dashboard/create-new/_components/SlelectTopic';
import {useContext, useEffect, useState} from 'react';
import SelectStyle from '@/app/dashboard/create-new/_components/SelectStyle';
import SelectDuration from '@/app/dashboard/create-new/_components/SelectDuration';
import {Button} from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from '@/app/dashboard/create-new/_components/CustomLoading';
import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import {VideoDataContext} from '@/app/_context/VideoDataContext'
import {Users, VideoData} from '@/configs/schema';
import {db} from '@/configs/db';
import {useUser} from '@clerk/nextjs';
import PlayerDialog from '@/app/dashboard/_components/PlayerDialog';
import {UserDetailContext} from '@/app/_context/UserDetailContext';
import {toast} from 'sonner';
import {eq} from 'drizzle-orm';


function CreateNew() {

  const [formData, setFormData]=useState([]);
  const [loading,setLoading] = useState(false);
  const [videoScript,setVideoScript] = useState();
  const [audioFileUrl,setAudioFileUrl] = useState();
  const [captions,setCaptions] = useState();
  const [imageList,setImageList] = useState();
  const [playVideo,setPlayVideo]=useState(false);
  const [videoId,setVideoId]=useState();
  const {videoData, setVideoData}=useContext(VideoDataContext);
  const {userDetail,setUserDetail}=useContext(UserDetailContext)
  const {user}=useUser();

  const onHandleInputChange =(fieldName, fieldValue) => {
  console.log(fieldName, fieldValue);

    setFormData(prev=>({
    ...prev,
    [fieldName]: fieldValue
  }))
  }

  const onCreateClickHandler=()=>{
    if(userDetail?.credits<=0){
     toast("You don't have enough credits.")
      return ;
    }else {
      GetVideoScript();
    }

  }

  // Get video script
  const GetVideoScript=async()=>{
    setLoading(true)
    const prompt='Write a script to generate '+formData.duration+' video on topic: '+formData.topic+' along with Al image prompt in '+formData.imageStyle+' format for each scene and give me result in JSON format with imagePrompt and ContentText as field'
     console.log(prompt)

  const resp=await axios.post('/api/get-video-script',{
    prompt:prompt
  });
    if(resp.data.result){
      setVideoData(prev=>({
        ...prev,
        'videoScript':resp.data.result
      }))
      setVideoScript(resp.data.result);
      await GenerateAudioFile(resp.data.result);
    }
  }


  //Generate audio file and save to firebase storage
  const GenerateAudioFile = async (videoScriptData) => {
    try {
      // Check if videoScriptData and scenes exist
      if (!videoScriptData || !videoScriptData.scenes || !Array.isArray(videoScriptData.scenes)) {
        console.error('Invalid video script data:', videoScriptData);
        return;
      }

      const id=uuidv4();
      let script = videoScriptData.scenes
      .map(scene => scene.contentText || '')
      .filter(text => text)
      .join(' ');

      console.log("Combined script:", script);

      const resp= await axios.post('/api/generate-audio', {
        text:script,
        id:id,
      });
      setVideoData(prev=>({
        ...prev,
        'audioFileUrl':resp.data.result
      }))
      setAudioFileUrl(resp.data.result);//get file URL
      resp.data.result&& await GenerateAudioCaption(resp.data.result,videoScriptData)

    } catch (error) {
      console.error('Error generating audio file:', error);
      return '';
    }
  }

  //Generate captions from audio file
  const GenerateAudioCaption=async (fileUrl, videoScriptData) => {
    setLoading(true);
    console.log("FF:" + fileUrl)
    const resp= await axios.post('/api/generate-caption',{
      audioFileUrl:fileUrl
    })
      setCaptions(resp?.data?.result);
      setVideoData(prev=>({
      ...prev,
      'captions':resp.data.result
     }))
      resp.data.result&& await GenerateImage(videoScriptData);
  }


  // use to generate AI images
  const GenerateImage= async (videoScriptData)=>{
    let images=[];

    for(const element of videoScriptData.scenes){
      try {

        const resp = await axios.post('/api/generate-image',{
          prompt:element.imagePrompt
        })
        console.log(resp.data.result);
        images.push(resp.data.result);
      }catch (e) {
        console.log('error:'+ e)
      }
    }
    setVideoData(prev=>({
      ...prev,
      'imageList':images
    }))
    setImageList(images);
    setLoading(false);
  }

  useEffect(()=>{
    try{
      if(Object.keys(videoData).length == 4){
        SaveVideoData(videoData);
      }
    }catch (e) {
      console.error("Error processing videoData:", e);
    }
  },[videoData])

  const SaveVideoData=async (videoData)=>{
    setLoading(true);
    const result=await db.insert(VideoData).values({
      script:videoData?.videoScript,
      audioFileUrl:videoData?.audioFileUrl,
      captions:videoData?.captions,
      imageList:videoData?.imageList,
      createdBy:user?.primaryEmailAddress?.emailAddress
    }).returning({id:VideoData?.id})
    await UpdateUserCredits();
    setVideoId(result[0].id);
    setPlayVideo(true);
    console.log(result);
    setLoading(false);

  }

// Used to update user credits
  const UpdateUserCredits=async ()=>{
    const result=await db.update(Users).set({
      credits:userDetail?.credits-10
    }).where(eq(Users?.email,user?.primaryEmailAddress?.emailAddress))
    console.log("LL:"+ userDetail?.credits);
    setUserDetail(prev=>({
      ...prev,
      "credits":userDetail?.credits-10
    }))
    setVideoData(null);
  }

  return (
      <div className='md:px-20'>
        <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>
        <div className='mt-10 shadow-md p-10'>

          {/* Select topic*/}
          <SelectTopic onUserSelect={onHandleInputChange}/>

          {/* Select style */}
          <SelectStyle onUserSelect={onHandleInputChange}/>

          {/* Select duration*/}
          <SelectDuration onUserSelect={onHandleInputChange}/>

          {/* create button*/}
            <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create a short video</Button>
        </div>

        <CustomLoading loading={loading}/>
        <PlayerDialog playVideo={playVideo} videoId={videoId}/>
      </div>
  );
}

 export default CreateNew