import { useState, useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import Draggable from 'gsap/Draggable';
import styles from './MyComponent.module.css'; // Example CSS module import

gsap.registerPlugin(Draggable);

const MyComponent = ({ data, language }) => {
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
                    y: 10 + (0.3 * height + 10) * (totalSlides - 1 - index),
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
        <section ref={containerRef} className={`${styles.container} hero-container`}>
            {/* Gesture for interaction */}
            <div ref={gestureRef} className={styles.heroGesture}>
                <img src="/static/images/hand.svg" alt="Gesture" />
            </div>
            
            {/* Slider numbers */}
            <div style={{ opacity: !isEnabled ? 1 : 0 }} className={`${styles.sliderNumbers} slider-numbers`}>
                <div className={styles.sliderNumbersScroll}>
                    <div ref={numbersRef} className={styles.sliderNumbersInner}>
                        {Array.from({ length: totalSlides }).map((_, index) => {
                            const displayIndex = index + 1 >= 10 ? index + 1 : `0${index + 1}`;
                            return (
                                <span key={index} className={styles.sliderNumbersItem}>
                                    {displayIndex}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.sliderNumbersLength}>.{totalLength}</div>
            </div>

            {/* Slider controls */}
            <div className={`${styles.selectorSlider} selector-slider`}>
                {/* Previous button */}
                <div
                    style={{ opacity: currentIndex > 1 ? 1 : 0 }}
                    onClick={slideBackward}
                    className={styles.selectorSliderPrev}
                >
                    <span
                        style={{ opacity: !isEnabled ? 1 : 0 }}
                        className={styles.selectorSliderButton}
                    >
                        <img src="/static/images/arrow-prev.svg" alt="Previous" />
                    </span>
                </div>
                
                {/* Toggle mode button */}
                <div onClick={toggleMode} className={styles.selectorSliderMode}>
                    <div className={`${isEnabled ? styles.selectorModeActive : ''}  ${styles.selectorSliderButton}`}>
                        <span className={styles.selectorSliderTopLeft}></span>
                        <span className={styles.selectorSliderTopRight}></span>
                        <span className={styles.selectorSliderSeparator}></span>
                        <span className={styles.selectorSliderBottomLeft}></span>
                        <span className={styles.selectorSliderBottomRight}></span>
                    </div>
                </div>
                
                {/* Next button */}
                <div
                    style={{ opacity: currentIndex >= totalSlides ? 0 : 1 }}
                    onClick={slideForward}
                    className={styles.selectorSliderNext}
                >
                    <span
                        style={{ opacity: !isEnabled ? 1 : 0 }}
                        className={`${styles.selectorSliderButton}`}
                    >
                        <img src="/static/images/arrow-next.svg" alt="Next" />
                    </span>
                </div>
            </div>
            
            {/* Extra sections or components */}
            {/* Other custom components or JSX */}
            
            {/* Scroll label */}
            <p
                style={{ opacity: !isEnabled ? 1 : 0 }}
                onClick={() => gsap.to(window, { duration: 0.3, scrollTo: 300 })}
                className={styles.scrollLabel}
            >
                {language === 'it-it' ? 'Scrolla per visualizzare' : 'Scroll to explore'}
                <img src="/static/images/arrow.svg" alt="Scroll" />
            </p>
        </section>
    );
};

export default MyComponent;
