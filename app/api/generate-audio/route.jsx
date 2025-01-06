import * as textToSpeech from '@google-cloud/text-to-speech';
import {NextResponse} from 'next/server';
const fs = require('fs');
const util = require('util');
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {storage} from '@/configs/FirebaseConfig';


const client = new textToSpeech.TextToSpeechClient({
 apiKey: process.env.GOOGLE_API_KEY
});


export async function POST(req){

  const {text, id}=await req.json();
  const storageRef=ref(storage, 'ai-short-video-files/'+id+'.mp3')
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

  const audioBuffer =Buffer.from(response.audioContent, 'binary')

  await uploadBytes(storageRef, audioBuffer,{contentType: 'audio/mp3'})

  const downloadUrl= await getDownloadURL(storageRef);

  console.log("GEN:" + downloadUrl)

  return NextResponse.json({result:downloadUrl});

}