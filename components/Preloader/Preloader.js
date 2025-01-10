
import React from 'react'
import { useEffect } from 'react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function Preloader({ setDuration }) {
  const videoEl = useRef(null);
  useEffect(() => {
    if (videoEl?.current)
      setDuration(videoEl?.current?.duration * 1000)
  }, [videoEl, setDuration])
  return (
    <>
      <div className="preLoad">
        <video ref={videoEl} muted playsInline autoPlay={"autoplay"} preload="auto" src={`${process.env.API_BASE_URL}/wp-content/uploads/2024/05/Ven_Den_Berg_Text_WHiteBG_Final_FullHD_PreLoader.mp4`}>
          <source src={`${process.env.API_BASE_URL}/wp-content/uploads/2024/05/Ven_Den_Berg_Text_WHiteBG_Final_FullHD_PreLoader.mp4' type="video/mp4`} />
        </video>
      </div>
    </>
  )
}
