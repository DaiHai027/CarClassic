"use client"
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './zoomImage.scss'
import Image from 'next/image';
import { useLayoutEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function ZoomImage({ contentImage, className, textContent }) {
    const component = useRef();
    let pinned = useRef();
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const pinnedImages = document.querySelectorAll('.pinned');
            pinnedImages.forEach(pinnedImage => {
                const tl = gsap.timeline(
                    {
                        paused: true,
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: pinnedImage,
                            start: "top top",
                            pin: true,
                            scrub: true
                        }
                    });
                tl.to(pinned.current,
                    {
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    },
                    0);
            });
        }, component);
        return () => (ctx.revert());
    }, []);

    return (
        <>
            <section ref={component} className={`zoomImageContainer ${className ? className : ''}`}>
                <div ref={pinned} className='pinned dark-bg' >
                    <div className="pinnedImageContainer">
                        <div className="pinnedImage">
                            <img src={contentImage} alt='Image 2' width={2880} height={1758} />
                        </div>
                        {
                            textContent &&
                            <div className="content">
                                <h2>{textContent}</h2>
                            </div>
                        }
                    </div>
                </div>
            </section>
        </>
    )
}
