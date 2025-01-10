"use client"
import React, { useState, useEffect, useRef } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../styles/swiperParallex.scss';
import { useSelector } from 'react-redux';
import placeholerImage from '@/public/car-placeholder.jpg';

export default function SwiperParallax({ silderData, contentImage, contentData, className }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDisabled, setIsDisabled] = useState(false);
  const swiperRef = useRef(null);
  const swiperSectionRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const isMouseMovingTimeoutRef = useRef(null);
  const isMouseMovingRef = useRef(null);
  const clientXYRef = useRef({ x: 0, y: 0 })
  const { appDetails, activeMenu } = useSelector(state => state?.common) || {}
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseNextMove = (e) => {
    if (window.innerWidth >= 768) {
      const cursorOutside = isCursorOutside({ x: (e.clientX ? e.clientX : clientXYRef.current.x), y: e.clientY ? e.clientY : clientXYRef.current.y + 20 });
      if (!cursorOutside)
        setPosition({ x: (e.clientX ? e.clientX : clientXYRef.current.x) - 25, y: e.clientY ? e.clientY - 20 : clientXYRef.current.y });
      const nextBtn = document.querySelector('.nextBtn');
      const prevBtn = document.querySelector('.prevBtn');
      const swiperButtonNext = document.querySelector('.swiper-button-next');
      const rect = swiperButtonNext.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const fadeStartDistance = 5;
      const distanceFromTop = mouseY;
      const distanceFromBottom = rect.height - mouseY;
      const distanceFromLeft = mouseX;
      const distanceFromRight = rect.width - mouseX - 88;
      const opacityTop = (distanceFromTop <= fadeStartDistance) ? distanceFromTop / fadeStartDistance : 1;
      const opacityBottom = (distanceFromBottom <= fadeStartDistance) ? distanceFromBottom / fadeStartDistance : 1;
      const opacityLeft = (distanceFromLeft <= fadeStartDistance) ? distanceFromLeft / fadeStartDistance : 1;
      const opacityRight = (distanceFromRight <= fadeStartDistance) ? distanceFromRight / fadeStartDistance : 1;
      const opacity = Math.min(opacityTop, opacityBottom, opacityLeft, opacityRight);
      nextBtn.style.opacity = cursorOutside ? 0 : opacity;
      nextBtn.style.cursor = cursorOutside ? 'pointer' : 'none';
      setTimeout(() => {
        nextBtn.style.display = cursorOutside ? 'none' : 'block'
        prevBtn.style.display = cursorOutside ? 'none' : 'block'
      }, 1);
      prevBtn.style.opacity = 0;
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) {
      const swiperParallexBanner = document.querySelector('.swiperParallex');
      const prevBtn = document.querySelector('.prevBtn');
      const nextBtn = document.querySelector('.nextBtn');
      nextBtn.style.transition = 'opacity 0.2s ease-out';
      prevBtn.style.transition = 'opacity 0.2s ease-out';
      prevBtn.style.opacity = 0;
      nextBtn.style.opacity = 0;
    }
  }
  const handleMouseMove = (e) => {
    if (window.innerWidth >= 768) {
      const contentSlider = document.querySelector('.content-slider');
      const prevBtn = document.querySelector('.prevBtn');
      const nextBtn = document.querySelector('.nextBtn');
      nextBtn.style.transition = 'opacity 0.2s ease-out';
      prevBtn.style.transition = 'opacity 0.2s ease-out';
      prevBtn.style.opacity = 0;
      nextBtn.style.opacity = 0;
    }
  }
  const handleMouseprevMove = (e) => {
    if (window.innerWidth >= 768) {
      const cursorOutside = isCursorOutside({ x: e.clientX || clientXYRef.current.x, y: e.clientY || clientXYRef.current.y + 20 });
      if (!cursorOutside)
        setPosition({ x: e.clientX || clientXYRef.current.x, y: e.clientY ? e.clientY - 20 : clientXYRef.current.y });
      const prevBtn = document.querySelector('.prevBtn');
      const nextBtn = document.querySelector('.nextBtn');
      const swiperButtonPrev = document.querySelector('.swiper-button-prev');
      const rect = swiperButtonPrev.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const fadeStartDistance = 5;
      const distanceFromTop = mouseY;
      const distanceFromBottom = rect.height - mouseY;
      const distanceFromLeft = mouseX;
      const distanceFromRight = rect.width - mouseX;
      const opacityTop = (distanceFromTop <= fadeStartDistance) ? distanceFromTop / fadeStartDistance : 1;
      const opacityBottom = (distanceFromBottom <= fadeStartDistance) ? distanceFromBottom / fadeStartDistance : 1;
      const opacityLeft = (distanceFromLeft <= fadeStartDistance) ? distanceFromLeft / fadeStartDistance : 1;
      const opacityRight = (distanceFromRight <= fadeStartDistance) ? distanceFromRight / fadeStartDistance : 1;
      const opacity = Math.min(opacityTop, opacityBottom, opacityLeft, opacityRight);
      prevBtn.style.opacity = cursorOutside ? 0 : opacity;
      prevBtn.style.cursor = cursorOutside ? 'pointer' : 'none';
      setTimeout(() => {
        nextBtn.style.display = cursorOutside ? 'none' : 'block'
        prevBtn.style.display = cursorOutside ? 'none' : 'block'
      }, 1);
      nextBtn.style.opacity = 0;
    }
  };
  function isCursorOutside(e) {
    const rect = swiperSectionRef.current.getBoundingClientRect();
    return e.x < rect.left || e.x > rect.right
      || e.y < rect.top || e.y > rect.bottom;
  }
  useEffect(() => {
    const interleaveOffset = 0.5;
    swiperRef.current = new Swiper('.main-slider', {
      loop: true,
      speed: 1200,
      parallax: true,
      watchSlidesProgress: true,
      on: {
        setTransition(swiper, speed) {
          for (let i = 0; i < swiper.slides.length; i++) {
            swiper.slides[i].style.transition = `${speed}ms`;
            swiper.slides[i].querySelector('.slide-bgimg').style.transition = `${speed}ms`;
          }
        },
        slideChange() {
          const swiper = this;
          for (let i = 0; i < swiper.slides.length; i++) {
            const slideProgress = swiper.slides[i].progress;
            const innerOffset = swiper.width * interleaveOffset;
            const innerTranslate = slideProgress * innerOffset;
            if (swiper.slides[i].querySelector('.slide-bgimg')) {
              swiper.slides[i].querySelector('.slide-bgimg').style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          }
        },
      },
    });
  }, [silderData]);
  const handlePrevNext = (move) => {
    if (isDisabled) return;

    if (move === 'next') {
      swiperRef.current.slideNext();
    } else {
      swiperRef.current.slidePrev();
    }

    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 1300);
  };
  useEffect(() => {
    const handleScroll = (e) => {
      if (swiperSectionRef.current) {
        const swiperButton = document.getElementsByClassName('swiper-button-white');
        const rect = swiperSectionRef.current.getBoundingClientRect();
        const isOutside =
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom;
        const transition = isOutside ? "opacity 0.2s ease-in-out" : "opacity 0.2s ease-in-out";
        swiperButton[0].firstChild.style.transition = transition;
        swiperButton[1].firstChild.style.transition = transition;
      }
    };
    if (window.innerWidth >= 768) {
      window.addEventListener('wheel', handleScroll);
    }
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [swiperSectionRef]);
  useEffect(() => {
    const handleMouseMove1 = (event) => {
      const x = event.clientX;
      const y = event.clientY - 20
      clientXYRef.current = { x, y }
      isMouseMovingTimeoutRef.current && clearTimeout(isMouseMovingTimeoutRef.current);
      isMouseMovingRef.current = true

      isMouseMovingTimeoutRef.current = setTimeout(() => {
        isMouseMovingRef.current = false
        clearTimeout(isMouseMovingTimeoutRef.current)
      }, 200);
    };
    const handleScroll1 = (e) => {
      if (!isMouseMovingRef.current)
        onScrollMove(swiperSectionRef);
    };

    window.addEventListener('mousemove', handleMouseMove1);
    window.addEventListener('scroll', handleScroll1);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove1);
      window.removeEventListener('scroll', handleScroll1);
    };
  }, []);

  const onScrollMove = (ref) => {
    const target = ref.current;
    const windowWidth = window.innerWidth;
    const cursorSide = clientXYRef.current.x < windowWidth / 2 ? 'left' : 'right';
    if (target) {
      const rect = target.getBoundingClientRect();
      const targetHeight = target.offsetHeight;
      const top = rect.top;
      const x = rect.clientX;
      const y = rect.clientY - 20
      if (top <= targetHeight && top >= -targetHeight) {
        if (cursorSide === 'left') {
          handleMouseprevMove(ref);
        } else if (cursorSide === 'right') {
          handleMouseNextMove(ref);
        }
      }
    }
  };
  return (
    <>
      <section className={`swiperParallex ${className ? className : ''}`} onMouseLeave={handleMouseLeave} ref={swiperSectionRef}>

        <div className="swiper-container main-slider">
          <div className="swiper-wrapper">
            {
              silderData?.length > 0 && silderData.map((item, index) => (
                <div className="swiper-slide" key={index}>
                  <figure className="slide-bgimg" style={{ backgroundImage: `url(${item?.bgImage || placeholerImage?.src})` }} data-swiper-parallax-x="50%">
                    <img src={item?.bgImage || placeholerImage} className="entity-img" />
                  </figure>
                </div>
              ))
            }
          </div>

          <div ref={prevBtnRef} onClick={() => handlePrevNext('prev')} className="swiper-button-prev swiper-button-white" onMouseMove={handleMouseprevMove}>
            <div className="prevBtn" style={{ position: 'fixed', left: position.x + 5 + 'px', top: position.y + 20 + 'px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 8" fill="none" data-v-588d2908="" data-v-30ae6d4b=""><path d="M6 4L0 8L3.02841e-07 0L6 4Z" fill="white" data-v-588d2908=""></path></svg>
              <span>{appDetails?.slider_prev_text || 'vorige'}</span>
            </div>
          </div>
          <div ref={nextBtnRef} onClick={() => handlePrevNext('next')} className="swiper-button-next swiper-button-white" onMouseMove={handleMouseNextMove}>
            <div className="nextBtn" style={{ position: 'fixed', left: position.x + 20 + 'px', top: position.y + 20 + 'px' }}>
              <span>{appDetails?.slider_next_text || 'volgende'}</span>

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 8" fill="none" data-v-588d2908="" data-v-30ae6d4b=""><path d="M6 4L0 8L3.02841e-07 0L6 4Z" fill="white" data-v-588d2908=""></path></svg>
            </div>
          </div>
        </div>

        <div className="swiper-container content-slider" onMouseMove={(e) => handleMouseMove(e)}>
          {contentImage &&
            <div className="imageWrapper">
              {contentImage}
            </div>
          }
          <div className="swiper-wrapper">
            {contentData && contentData?.length > 0 && contentData.map((item, index) => (
              <div className="swiper-slide" key={index}>
                <div className="content">
                  {/* <span> <label > {' vorige x='+position.x}</label> <label > {'y='+position.y}</label> </span>
                                <span> <label > {'volgende x='+ position.x}</label> <label > {'y='+position.y}</label> </span> */}

                  {<div dangerouslySetInnerHTML={{ __html: item?.content }}></div>}
                </div>
              </div>
            ))
            }
          </div>
          <div className="swiper-button-prev swiper-button-white"></div>
          <div className="swiper-button-next swiper-button-white"></div>
        </div>
      </section >
    </>
  )
}
