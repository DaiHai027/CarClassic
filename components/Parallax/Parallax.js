import { useEffect, useRef } from "react";
import { useWindowSize } from "@studio-freight/hamo";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import styles from './parallax.module.scss';

export function Parallax({ className = "", children, speed = 1, horizontal = false, id = "parallax", aspectRatio = false }) {
    const trigger = useRef();
    const target = useRef();
    const timeline = useRef();
    const { width: windowWidth } = useWindowSize();

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const y = windowWidth * speed * 0.1;
        const x = windowWidth * speed * 0.1;

        timeline.current = gsap.timeline({
            scrollTrigger: {
                id: id,
                trigger: trigger.current,
                scrub: true,
                start: "top bottom", 
                end: "bottom top",
            },
        })

        const animConfig = horizontal ? {
            fromVars: { x: -x, scale: 1 },
            toVars: { x: x, scale: 1, ease: "none" }
        } : {
            fromVars: { y: -y, scale: 1 },
            toVars: { y: y, scale: 1, ease: "none" }
        };

        timeline.current.fromTo(target.current, 
            animConfig.fromVars,
            animConfig.toVars
        );

        return () => {
            timeline?.current?.kill();
        };
    }, [id, speed, windowWidth, horizontal]);

    return (
        <div className="parallax-container">
            <div className={`${aspectRatio ? styles.aspectRatio : ''} ${className} ${styles.parallax}`}>
                <div ref={trigger}>
                    <div ref={target}>{children}</div>
                </div>
            </div>
        </div>
    );
}