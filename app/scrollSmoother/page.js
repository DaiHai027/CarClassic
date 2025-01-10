'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';

import styles from './css.scss'; // Example CSS module import
import { useRouter } from 'next/navigation';

gsap.registerPlugin(Draggable, ScrollToPlugin);

const Thumbnails = ({ data, index, mode }) => {
    const thumbnailsRef = useRef();
  
    useEffect(() => {
      // Any additional side effects or logic can be added here
    }, []);
  
    useEffect(() => {
      const yOffset = mode ? 170 : 0;
      const elements = thumbnailsRef.current.querySelectorAll('div');
      gsap.to(thumbnailsRef.current, {
        duration: 0.6,
        y: `${thumbnailsRef.current.scrollHeight - 150 - 100 * index + yOffset}px`,
        ease: 'circle',
      });
      gsap.to(elements[index - 1], {
        autoAlpha: 0,
        duration: 0.6,
        ease: 'circle',
      });
      gsap.to(elements[index], {
        autoAlpha: 1,
        duration: 0.6,
        ease: 'circle',
      });
    }, [index, mode]);
  
    const thumbnails = data.map((item, idx) => (
      <div key={idx} className='Hero_thumbnail'>
        <img
          src={item.url}
          alt={item.alt}
        />
      </div>
    ));
  
    return (
      <div
        ref={thumbnailsRef}
        className={`Hero_slider__thumbnails slider-thumbnails`}
      >
        {thumbnails.reverse()}
      </div>
    );
  };
  const SlideTitle = ({ single }) => {
    const titleRef = useRef();
  
    useEffect(() => {
      // Any additional side effects or logic can be added here
    }, []);
  
    return (
      <h3
        ref={titleRef}
        style={{
          color: single?.data?.color_text_slider,
        }}
        className={`${styles.slideTitle} slide-title`}
        dangerouslySetInnerHTML={{ __html: single?.data?.title }}
      />
    );
  };
  
  const HeroSlides = ({ data, mode }) => {
    const router = useRouter();
  
    const handleMouseMove = (e) => {
      gsap.to('.mouse', {
        x: e.pageX - 35,
        y: e.pageY + window.scrollY - 35,
        scale: 1,
        autoAlpha: 1,
        duration: 1.4,
        ease: 'power4.out',
      });
    };
  
    const handleMouseLeave = () => {
      gsap.to('.mouse', {
        scale: 0,
        autoAlpha: 0,
        duration: 1.4,
        ease: 'power4.out',
      });
    };
  
    const handleSlideClick = (e, url) => {
      e.preventDefault();
      router.push(url);
    };
  
    const slides = data.map((item, index) => {
      const { url } = item;
  
      return (
        <div
          key={index}
          className={`Hero_slide hero-slide`}
          onMouseMove={mode ? handleMouseMove : null}
          onMouseLeave={mode ? handleMouseLeave : null}
          onClick={(e) => (mode ? handleSlideClick(e, url) : null)}
        >
          <div className={`Hero_slide__inner hero-slide__inner`}>
            <img
              src={item.url}
              alt={item.alt}
              className={` Hero_slide__img hero-slide__img`}
            />
            {/*<div className={styles.slideInfoContainer}>
              <div
                className={`${styles.slideColumns} ${styles.slideColumnsA}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => (!mode ? handleSlideClick(e, url) : null)}
              >
                <SlideTitle single={item} />
              </div>
               <div
                className={`${styles.slideColumns} ${styles.slideColumnsB} slide-extra-info`}
              >
                <div className={styles.slideExtra}>
                  <ul className={styles.slideExtraUl}>
                    {item.data.environment.map((envItem, idx) => (
                      <li key={idx} className={styles.slideExtraLi}>
                        {envItem.icon.url && (
                          <span>
                            <img src={envItem.icon.url} alt="icon" />
                          </span>
                        )}
                        <span
                          style={{
                            color: item.data.color_text_slider,
                          }}
                        >
                          {envItem.text_env}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      );
    });
  
    return (
      <section
        className={`Hero_slider__container slider-container ${
          mode ? 'slider-container-mode-mini' : ''
        }`}
      >
        {slides}
      </section>
    );
  };
   
export default function HeroPage() {

    const data = [{url:"https://images.prismic.io/nava/ZfBnykmNsf2sHhjk_lamborghini.jpg?auto=format,compress",alt:"alt"},
                 {url:"https://images.prismic.io/nava/ZfBnAkmNsf2sHhjC_dior.jpg?auto=format,compress",alt:"alt"},
                {url:"https://images.prismic.io/nava/ZfBnoUmNsf2sHhje_prada.jpg?auto=format,compress",alt:"alt"}, 
                {url:"https://images.prismic.io/nava/ZfBmbEmNsf2sHhi5_cabana.jpg?auto=format,compress",alt:"alt"}]

    const [currentIndex, setCurrentIndex] = useState(1);
    const [isEnabled, setIsEnabled] = useState(false);
    const [totalSlides, setTotalSlides] = useState(null);
    const [totalLength, setTotalLength] = useState(null);
    
    const containerRef = useRef();
    const gestureRef = useRef();
    const numbersRef = useRef();

    const slideForward = useCallback(() => {
        // Slide forward logic with GSAP
        const slides = document.querySelectorAll('.hero-slide');
        const slideInners = document.querySelectorAll('.hero-slide__inner');
        const total = slides.length;
        if (currentIndex >= total) return;

        const currentSlide = slideInners[total - currentIndex];
        const currentSlideElement = slides[total - currentIndex];
        const nextSlide = slideInners[total - currentIndex - 1];
        const nextSlideImg = nextSlide.querySelector('.hero-slide__img');
        
        const timeline = gsap.timeline();
        
        timeline.to(currentSlide, {
            duration: 0.6,
            ease: 'circle',
            '--clip': '0%',
        }, 0).to(currentSlide, {
            duration: 0.6,
            ease: 'circle',
            '--clip2': '0%',
        }, 0.2).set(currentSlideElement, {
            userSelect: 'none',
            visibility: 'hidden',
        }, 0.8);

        timeline.from(nextSlideImg, {
            duration: 0.6,
            scale: 1.3,
            y: 20,
            ease: 'circle',
        }, 0);

        setCurrentIndex((prevIndex) => prevIndex + 1);
    }, [currentIndex]);

    const slideBackward = useCallback(() => {
        // Slide backward logic with GSAP
        const slides = document.querySelectorAll('.hero-slide');
        const slideInners = document.querySelectorAll('.hero-slide__inner');
        const total = slides.length;
        if (currentIndex === 1) return;

        const prevSlide = slideInners[total - currentIndex + 1];
        const prevSlideElement = slides[total - currentIndex + 1];
        const prevSlideImg = prevSlide.querySelector('.hero-slide__img');
        
        const timeline = gsap.timeline();
        
        timeline.set(prevSlideElement, {
            userSelect: 'inherit',
            visibility: 'visible',
        }).to(prevSlide, {
            duration: 0.6,
            ease: 'circle',
            '--clip': '100%',
        }, 0.1).to(prevSlide, {
            duration: 0.6,
            ease: 'circle',
            '--clip2': '100%',
        }, 0.2).from(prevSlideImg, {
            duration: 0.6,
            scale: 1.3,
            y: -20,
            ease: 'circle',
        }, 0.1);

        setCurrentIndex((prevIndex) => prevIndex - 1);
    }, [currentIndex]);

    const toggleMode = useCallback(() => {
        setIsEnabled((prev) => !prev);
        setCurrentIndex(1);
        
        gsap.set('.hero-slide__inner', {
            userSelect: 'inherit',
            visibility: 'visible',
        });
        
        gsap.to('.hero-slide__inner', {
            duration: 0.6,
            ease: 'circle',
            '--clip': '100%',
            '--clip2': '100%',
        });

        const slides = document.querySelectorAll('.hero-slide');
        const { width, height } = slides[0].getBoundingClientRect();
        const totalSlides = slides.length * (0.3 * height + 15) - window.innerHeight;
        
        const timeline = gsap.timeline();
        const draggableInstance = Draggable.create('.slider-container', {
            type: 'y',
            inertia: true,
            bounds: {
                minY: -totalSlides,
                maxY: 0,
            },
            onDragStart: () => {
                gsap.to(gestureRef.current, {
                    autoAlpha: 0,
                    duration: 1,
                    ease: 'power4.out',
                });
            },
        });

        if (!isEnabled) {
            draggableInstance[0].enable();
            document.querySelector('html').classList.add('scroll-disabled');
            
            slides.forEach((slide, index) => {
                gsap.to(slide, {
                    duration: 1.4,
                    scale: 0.3,
                    y: 10 + (0.3 * height + 10) * (slides.length - 1 - index),
                    transformOrigin: 'top center',
                    ease: 'circle',
                });
            });

            timeline.to(gestureRef.current, {
                autoAlpha: 1,
                duration: 0.6,
                ease: 'power4.out',
            }, 1).from(gestureRef.current, {
                y: -40,
                duration: 1,
                ease: 'power4.out',
            }, 1);

            gsap.fromTo(
                gestureRef.current.querySelector('img'), {
                    y: 20,
                }, {
                    y: -20,
                    duration: 1,
                    repeat: -1,
                    yoyo: true,
                    ease: 'linear',
                }
            );
        } else {
            document.querySelector('html').classList.remove('scroll-disabled');
            
            draggableInstance[0].disable();
            draggableInstance[0].kill();

            gsap.to('.slider-container', {
                duration: 1,
                y: 0,
                zIndex: 0,
                ease: 'circle',
            });

            slides.forEach((slide) => {
                gsap.to(slide, {
                    duration: 1,
                    scale: 1,
                    y: 0,
                    transformOrigin: 'top center',
                    ease: 'circle',
                });
            });
        }
    }, [isEnabled]);

    // Adjust state for total slides
    useEffect(() => {
        const total = document.querySelectorAll('.hero-slide').length;
        setTotalSlides(total);
        setTotalLength(total < 10 ? `0${total}` : total.toString());
    }, []);

    // Update the number indicator based on the current index
    useEffect(() => {
        gsap.to(numbersRef.current, {
            duration: 0.4,
            y: `-${16 * (currentIndex - 1)}px`,
        });
    }, [currentIndex]);

    return (
        <>
            <section class="Hero_container hero-container" ref={containerRef} >
                <div class="Hero_hero__gesture__wJRSQ" ref={gestureRef}>
                    <img src="https://navapress.com/static/images/hand.svg" /></div>
                <div class="Hero_slider__numbers__NjzkM slider-numbers" ref={numbersRef} >
                    <div class="Hero_slider__numbers__scroll__If0xP">
                        <div>
                            <span class="Hero_slider__numbers">01</span>
                            <span class="Hero_slider__numbers">02</span>
                            <span class="Hero_slider__numbers">03</span>
                            <span class="Hero_slider__numbers">04</span>
                            <span class="Hero_slider__numbers">05</span>
                            <span class="Hero_slider__numbers">06</span>
                        </div>
                    </div>
                    <div class="Hero_slider__numbers__length">.06</div>
                </div>
                <div class="Hero_selector__slider selector-slider">
                    <div 
                        style={{ opacity: currentIndex > 1 ? 1 : 0 }}
                        onClick={slideBackward} 
                    class="Hero_selector__slider__prev">
                        <span style={{ opacity: !isEnabled ? 1 : 0 }} class="Hero_selector__slider__btn">
                            <img src="https://navapress.com/static/images/arrow-prev.svg" alt="nava" /></span>
                    </div>
                    <div class="Hero_selector__slider__mode"  onClick={toggleMode}>
                        <div class="  Hero_selector__slider__btn">
                            <span class="Hero_selector__sliderTopLeft"></span>
                            <span class="Hero_selector__sliderTopRight"></span>
                            <span class="Hero_selector__sliderSeparator"></span>
                            <span class="Hero_selector__sliderBottomLeft"></span>
                            <span class="Hero_selector__sliderBottomRight"></span>
                        </div>
                    </div>
                    <div 
                    style={{ opacity: currentIndex >= totalSlides ? 0 : 1 }}
                    onClick={slideForward}
                     class="Hero_selector__slider__next">
                        <span style={{ opacity: !isEnabled ? 1 : 0 }} class="Hero_selector__slider__btn">
                            <img src="https://navapress.com/static/images/arrow-next.svg" alt="nava" /></span>
                    </div>
                </div>
                
                    <HeroSlides data={data} mode={isEnabled} />
                   
                
                <Thumbnails data={data} index = {currentIndex} mode={isEnabled} /> 
        
                    <p style={{opacity: 1, visibility: 'inherit'}} class="Hero_scrollLabel__QotR6 scroll-label">Scrolla per visualizzare<img src="/static/images/arrow.svg" alt="nava" /></p>
            </section>
        </>
    );
}
