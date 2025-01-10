import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import './slider.scss';

export default function ResponsiveCarousel({silderData,contentImage,contentText, className}) {
    const handleSliderProgress = () => {
       const element = document.getElementById('bar');
        element.classList.remove('makeInProgress');
        setTimeout(() => {
            element.classList.add('makeInProgress');
        }, 100)
    }
    var settings = {
        dots: false,
        infinite: true,
        autoplaySpeed:4000,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: false,
        arrows: false,
        beforeChange: (current, next) => {next ? handleSliderProgress() : current ? handleSliderProgress() : () => {}}

      };
    return (
        <>
         <section className={`responsiveCarousel dark ${className}`}>
                <div id="container">
                    <Slider {...settings}>
                        {
                            silderData?.length > 0 && silderData.map((item, index ) => (
                                <div key={index} className="block">
                                    <picture>
                                    <source media={"(max-width:575px)"} srcSet={item?.bgImageMbl?.src} />
                                    <img src={item?.bgImage?.src} alt="slider" />
                                    </picture>

                                </div>
                            ))
                        }
                    </Slider>
                    <div className="content">
                    { contentImage? contentImage: null} 
                    {
                      contentText &&  <div dangerouslySetInnerHTML={{ __html: contentText }}></div>   
                    }
                    </div>
                    <div className="progressWrapper">
                        <div className="progressBar">
                            <div className="innerBar makeInProgress" id="bar"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
