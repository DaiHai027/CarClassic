"use client";
import { Lenis, ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function SmoothScroll({ children }) {
  const lenisRef = useRef();
  const isLightBoxOpen=useSelector(state=>state.common.isLightBoxOpen)
  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
  
    gsap.ticker.add(update)
  
    return () => {
      gsap.ticker.remove(update)
    }
  })
  return (
    <ReactLenis root options={{ lerp: .05, smoothTouch: true }} autoRaf={!isLightBoxOpen}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScroll;