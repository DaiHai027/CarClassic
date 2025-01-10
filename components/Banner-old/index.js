"use client"
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux'
import { getCurrentBrowser } from "@/utils";

import { Parallax } from '../Parallax/Parallax'

import './banner.scss'
import Image from 'next/image';
import { PAGES_LINKS } from '@/constant';
export default function Banner({ id, banner = false, mainHeading, bgImage, headingText, descriptionText, className, scale = true, clipPath = true }) {
    const pathname = usePathname();;
    const freshload = useSelector(state => state?.common?.freshLoad)
    const [changed, setChanged] = React.useState(!freshload);
    const browser = getCurrentBrowser();
    useEffect(() => {
        window.scrollTo({
            top: 0,
        })
    }, [pathname]);
    useEffect(() => {
        if (!freshload) {
            setChanged(true);
        }
    }, [pathname]);
    return (
        <>
            <Parallax speed={1}>
                <section
                    className={`bgImg dark ${className || ""} ${banner ? "banner" : ""} bannerSection ${changed ? "bannerAnimation" : ""} bannerEffect`}
                    style={{
                        ...(PAGES_LINKS.getCarDetailsPath(id) === pathname ? {} : { backgroundImage: `url(${bgImage})` }),
                        ...(browser === 'safari' ? { transition: 'all 0.5s ease-in-out' } : {})
                    }}
                >
                    {
                        PAGES_LINKS.getCarDetailsPath(id) === pathname &&
                        <div className={`imgWrapper ${className ? className : ""} ${banner ? "banner" : ""} ${changed ? "bannerAnimation" : ""} bannerEffect`} >
                            <Image src={bgImage} alt="" width={1000} height={1000} />
                        </div>
                    }
                    <div className={`container ${PAGES_LINKS.getCarDetailsPath(id) === pathname ? "absoluteWrapper" : ""}`}>

                        <div className="block flexWrapper">
                            <div className='headingBlock'>
                                {
                                    mainHeading &&
                                    <h3>{mainHeading}</h3>
                                }
                                <h1>{headingText?.map((item, index) => {
                                    return <span key={index}><span div dangerouslySetInnerHTML={{ __html: item }}></span></span>
                                })}</h1>
                            </div>
                            {
                                descriptionText &&
                                <p>{descriptionText}</p>
                            }
                        </div>
                    </div>
                </section>
            </Parallax>
        </>
    )
}
