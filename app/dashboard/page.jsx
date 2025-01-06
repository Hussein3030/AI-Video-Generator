"use client"
import {Button} from '@/components/ui/button';
import {useContext, useEffect, useState} from 'react';
import EmptyState from '@/app/dashboard/_components/EmptyState';
import Link from 'next/link'
import {db} from '@/configs/db';
import {VideoData} from '@/configs/schema';
import {eq} from 'drizzle-orm';
import {useUser} from '@clerk/nextjs';
import VideoList from '@/app/dashboard/_components/VideoList';


function Dashboard() {

  const [videoList, setVideoList]=useState([]);
  const {user} = useUser();

  useEffect(()=>{
  user&&GetVideoList();
  },[user])

  //get user video
  const GetVideoList =async ()=>{
    const result=await db.select().from(VideoData).where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress));
    console.log(result);
    setVideoList(result);
  }
  return (
      <div>
        <div className='flex- justify-between items-center'>
          <h2 className='font-bold text-2xl text-primary'>Dashboard</h2>
          <Link href={"/dashboard/create-new"}>
            {/*<Button>+ Create new </Button>*/}
          </Link>
        </div>
        {/* Empty state */}
        {videoList?.length==0&&<div>
          <EmptyState/>
        </div>}
        {/*List of videos*/}
        <VideoList videoList={videoList}/>
      </div>
  );
}

export default Dashboard