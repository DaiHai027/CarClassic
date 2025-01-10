import React, { useEffect, useRef, useState } from 'react'
import '../LightBox/LightBox.scss'

import PrevLightBox from '../../public/PrevLight.svg'
import NextLightBox from '../../public/NextLight.svg'

import CloseBtn from '../../public/closeBtn.svg'
import { useDispatch } from 'react-redux'
import { setIsLighBoxOpen } from '@/store/common/commonReducer'


export default function LightBox({ data = [], activeSlide }) {

    const [currentIndex,setCurrentIndex] = useState();
    const dispatch = useDispatch();
    const modelImgRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const thumbRef=useRef(null);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;
    const totalSlides = data.length;

    useEffect(() => {
        setCurrentIndex(activeSlide);
    }, [activeSlide]);

    function applyTranslateNextX() {
        modelImgRef.current.style.transform = 'translateX(80px)';
        modelImgRef.current.style.opacity = 0;
        modelImgRef.current.style.transition = 'all 0ms ease-in-out';
        setTimeout(() => {
            modelImgRef.current.style.transform = 'translateX(0px)';
            modelImgRef.current.style.opacity = 1;
            modelImgRef.current.style.transition = 'all 300ms ease-in-out';
        }, 100);
    }

    function applyTranslatePrevX() {
        modelImgRef.current.style.transform = 'translateX(-80px)';
        modelImgRef.current.style.opacity = 0;
        modelImgRef.current.style.transition = 'all 0ms ease-in-out';
        setTimeout(() => {
            modelImgRef.current.style.transform = 'translateX(0px)';
            modelImgRef.current.style.opacity = 1;
            modelImgRef.current.style.transition = 'all 300ms ease-in-out';
        }, 100);
    }
    function LightBoxClose() {
       const rootWrapper = document.getElementById('rootWrapper');
        const rootWrapperBlock = rootWrapper?.classList;
        const lightBox = document.getElementById("light-box");
        const remove=  rootWrapperBlock.remove("hasLightBox");
        rootWrapper.style.overflow = "";
        document.body.classList.remove('hidden-scroll');

        let lightBoxAddClass = lightBox?.classList;
        lightBoxAddClass.remove("show");
        dispatch(setIsLighBoxOpen(false))        
    }
      function LightBoxOpen() {
        const rootWrapper = document.getElementById('rootWrapper');
        const rootWrapperBlock = rootWrapper?.classList;
        const lightBox = document.getElementById("light-box");
        const lightBoxAddClass = lightBox?.classList;
        rootWrapperBlock.add("hasLightBox");
        rootWrapper.style.overflow = "hidden";
        document.body.classList.add('hidden-scroll');
        lightBoxAddClass?.add("show");
      
        dispatch(setIsLighBoxOpen(true))
      }
    const onClickNext=()=>{
        if(currentIndex<data.length-1){
            setCurrentIndex(currentIndex+1)
             applyTranslateNextX()
        }
    }
    const onClickPrev=()=>{
        if(currentIndex>0){
        setCurrentIndex(currentIndex-1)
          applyTranslatePrevX()
        }
    }
    const OnClickSlider=(index)=>{
        if(currentIndex===index){
            return
        }
        setCurrentIndex(index);

        if(currentIndex<index){
            applyTranslateNextX()
        }else{ 
          applyTranslatePrevX()
        }
    }
    useEffect(() => {
        const target = document.getElementsByClassName("img-box");
        for (let i = 0; i < target.length; i++) {
            target[i].addEventListener("click", () => {
                LightBoxOpen();
            });
        }
    }, [data]);

    useEffect(() => {
        if (thumbRef.current) {
            thumbRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
          }
    if (currentIndex === 0) {
        prevRef.current?.classList.add('arrowDisable');
    } else {
        prevRef.current?.classList.remove('arrowDisable');
    }

    if (currentIndex === totalSlides - 1) {
      nextRef.current?.classList.add('arrowDisable');
    } else {
        nextRef.current?.classList.remove('arrowDisable');
    }
    }, [currentIndex , totalSlides]);


  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) onClickNext();
    if (isRightSwipe) onClickPrev();
  };
    return (
        <>
            <div id="light-box">
                <div class="model-img" >
                    <div class="img-wrapper" ref={modelImgRef} 
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    >
                        <img src={data?.[currentIndex]?.bgImage} id="image-back" alt="" onClick={onClickNext}/>
                    </div>
                </div>
                    <div className='thumbnailLightBoxWrapper desktopthumbnailLightBox'>
                            <div className="ThumbsBlockLightBox">
                            {
                                data?.map((item, i) => {
                                    return (
                                        <div key={i} className={`sliderThumbsBlock  ${currentIndex === i ? 'active' : ''}`} data-link={item.bgImage} onClick={()=>OnClickSlider(i)}>
                                            <picture>
                                                <source media={"(max-width:767px)"} srcSet={item.bgImage} />
                                                <img src={item.bgImage} alt="slider" />
                                            </picture>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                <button id="btn-close-img" onClick={LightBoxClose}>
                      <CloseBtn />
                </button>
                <div  ref={prevRef} id="Prev" onClick={onClickPrev}>
                    <PrevLightBox />
                    
                </div>
                <div ref={nextRef} id="next" onClick={onClickNext}>
                    <NextLightBox />
                </div>
                <div className='thumbnailLightBoxWrapper mblthumbnailLightBox'>
                            <div className="ThumbsBlockLightBox">
                            {
                                data?.map((item, i) => {
                                    return (
                                        <div key={i} className={`sliderThumbsBlock  ${currentIndex === i ? 'active' : ''}`} data-link={item.bgImage} onClick={()=>OnClickSlider(i)} ref={currentIndex === i?thumbRef:null}>
                                            <picture>
                                                <source media={"(max-width:767px)"} srcSet={item.bgImage} />
                                                <img src={item.bgImage} alt="slider" />
                                            </picture>
                                        </div>
                                    )
                                })
                            }
                        </div>
                </div>
            </div>
        </>

    )
}
