"use client"
import { useState } from "react"
import Footer from "./Footer/Footer"
import Header from "./Header/Header"
import Preloader from "./Preloader/Preloader"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect } from "react"
import { getCurrentBrowser } from "@/utils";


import { useDispatch, useSelector } from 'react-redux'
import {
    fetchAppDetails,
    fetchActiveMenu,
    fecthLanguageData,
    fetchHeaderMenusData
} from "@/store/common/action"
import { setFreshLoad, setIsAnimationComplete, setShowNav } from "@/store/common/commonReducer"
import { PAGES_LINKS } from "@/constant"
export const dynamic = 'force-dynamicfsd'
gsap.registerPlugin(useGSAP);

const Route = ({ children }) => {
    const { freshLoad, showNav } = useSelector((state) => state.common) || {};
    const { Id } = useParams();
    const Appcontainer = useRef();
    const dispatch = useDispatch()
    const tl = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [isNavLinkClicked, setIsNavLinkCliked] = useState(false);
    const [duration, setDuration] = useState(0);

    const pathname = usePathname();
    const pages = useSelector(state => state?.pages)
    const pagesData = Object.values(pages || {})
    const browser = getCurrentBrowser()
    const handleSetShowNav = (value) => {
        dispatch(setShowNav(value));
    };

    const handleSetFreshLoad = (value) => {
        dispatch(setFreshLoad(value));
    };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(true)
        }, duration)
    }, [])

    useEffect(() => {
        if (freshLoad) {
            setTimeout(() => {
                handleSetFreshLoad(false)
            }, 4500)
        }
    }, [freshLoad])
    const allHaveTwoOrFewerProperties = pagesData.every(page => Object.keys(page).length === 0);
    useGSAP(() => {
        const pageLink = Object.values(PAGES_LINKS).some((link) => typeof link === 'string' ? link === pathname : link?.(Id) === pathname);
        const isNotFoundBanner = !pageLink
        if (freshLoad) {
            const fromProperties = freshLoad
                ? { visibility: "hidden", y: 1500, scale: 2, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }
                : { opacity: 0, y: 0, scale: 1, visibility: 'visible' };
            const toProperties = freshLoad
                ? { duration: browser === 'safari' ? 3.8 : 3.1, zIndex: isNotFoundBanner ? 10 : 13, visibility: "visible", ease: "power2.inOut", scale: 1, y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }
                : { duration: 0, zIndex: isNotFoundBanner ? 10 : 13, opacity: 1, ease: "power2.inOut", scale: 1, y: 0, };
            tl.current = gsap.timeline()
                .to(".appWrapper", { backgroundColor: freshLoad ? 'transparent' : '#000' }, '-=1')
                .to("header", { visibility: freshLoad ? 'hidden' : 'visible' })
                .to(".footerBlock", { visibility: 'hidden', zIndex: -2, background: '#fff' })
                .to(".preloader-wrapper", { opacity: 1, zIndex: -1, duration: isNavLinkClicked ? 1.6 : 0 })
                .fromTo(isNotFoundBanner ? ".notFoundBanner" : ".bannerSection", fromProperties, toProperties, "-=1")
                .to("header", { visibility: 'visible' }, '+=1')
                .to(".preloader-wrapper", { opacity: 0, zIndex: -1, duration: 1 })
                .to(".footerBlock", { visibility: 'visible', background: '#000' }, '+=1')
        }
        else {
            const bannerAnimation = document.querySelector('.bannerEffect')
            tl.current = gsap.timeline()
                .to(".appWrapper", { backgroundColor: freshLoad ? 'transparent' : '#0F0F0F' }, '-=1')
                .to("header", { visibility: freshLoad ? 'hidden' : 'visible' })
                .to(".footerBlock", { visibility: 'hidden', zIndex: -2, background: '#fff' })
                .to(".preloader-wrapper", { opacity: 1, zIndex: -1, duration: isNavLinkClicked ? 1.6 : 0 })
                .fromTo(isNotFoundBanner ? ".notFoundBanner" : ".bannerEffect", { opacity: 0, y: 0, scale: 1, }, { duration: 0, zIndex: isNotFoundBanner ? 10 : 13, opacity: 1, ease: "power2.inOut", scale: 1, y: 0 })
                .to("header", { visibility: 'visible' }, '-=1')
                .to(".preloader-wrapper", { opacity: 0, zIndex: -1, duration: 2 })
                .to(".footerBlock", { visibility: 'visible', background: '#000' }, '+=1')
        }
    }, { dependencies: [pathname], scope: Appcontainer, revertOnUpdate: true });
    useEffect(() => {
        dispatch(fetchActiveMenu());
        dispatch(fecthLanguageData());
        dispatch(fetchHeaderMenusData());
        dispatch(fetchAppDetails())
    }, [dispatch])

    useEffect(() => {
        if (freshLoad && PAGES_LINKS.getCarDetailsPath(Id) === pathname) {
            if (Appcontainer.current) {
                Appcontainer.current.style.height = 'auto';
                Appcontainer.current.style.overflow = 'auto';
            }
            dispatch(setIsAnimationComplete(false))
        }
        else {
            if (freshLoad || allHaveTwoOrFewerProperties) {
                Appcontainer?.current?.scrollTo({ top: 0, behavior: 'smooth' })
                if (Appcontainer.current) {
                    Appcontainer.current.style.height = '100vh';
                    Appcontainer.current.style.overflow = 'hidden';
                }
            } else {
                setTimeout(() => {
                    if (Appcontainer.current) {
                        Appcontainer.current.style.height = 'auto';
                        Appcontainer.current.style.overflow = 'auto';
                    }
                }, 5000)
            }
        }
    }, [freshLoad, Appcontainer, allHaveTwoOrFewerProperties]);
    useEffect(() => {

        const lastPageSlug = sessionStorage.getItem('cardId')
        if (lastPageSlug) {
            if (Appcontainer.current) {
                Appcontainer.current.style.height = 'auto';
                Appcontainer.current.style.overflow = 'auto';
            }
            dispatch(setIsAnimationComplete(false))
        }
        else {
            if (pathname) {
                Appcontainer?.current?.scrollTo({ top: 0, behavior: 'smooth' })
                if (Appcontainer.current) {
                    Appcontainer.current.style.height = '100vh';
                    Appcontainer.current.style.overflow = 'hidden';
                }
                dispatch(setIsAnimationComplete(true))
            }
            const timeOut = setTimeout(() => {
                if (Appcontainer.current) {
                    Appcontainer.current.style.height = 'auto';
                    Appcontainer.current.style.overflow = 'auto';
                }
                dispatch(setIsAnimationComplete(false))
            }, 5000);
        }
    }, [pathname]);
    return (
        <>
            <main id="rootWrapper" ref={Appcontainer}>
                <div className="appWrapper">
                    <Header setIsNavLinkCliked={setIsNavLinkCliked} setFirstLoad={setFreshLoad} />
                    {
                        freshLoad &&
                        <div className={`preloader-wrapper`}>
                            <Preloader setDuration={setDuration} />
                        </div>
                    }
                    <>
                        {children}
                    </>
                    <Footer loading={isLoading} setFirstLoad={setFreshLoad} />
                    <div className="empty"></div>
                </div >
            </main >
        </>
    )
}
export default Route