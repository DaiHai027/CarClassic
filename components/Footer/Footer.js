"use client"
import React,{ useState, useRef, useLayoutEffect,useEffect } from 'react'
import Link from "next/link";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import VenDenBergLogo from "../../public/Ven-Den-Berg-Logo.svg";
import './footer.scss'

import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux'
import { navigationData } from '../Header/Header';
import { useRouter } from 'next/navigation';
export default function Footer({ loading, setFirstLoad }) {
    const [showMenu, setShowMenu] = useState({});
    const [windowHeight, setWindowHeight] = useState(0);
    const { appDetails, activeMenu } = useSelector(state => state?.common) || {}
    const pathname = usePathname()
    const router = useRouter()


    const menuData = navigationData?.map((link) => {
        const currentLink = activeMenu?.filter((data) => {
            return data?.connectedObject?.pageKey?.key === link.key
        });
        if (currentLink.length) {
            link.title = currentLink[0]?.label?.toLowerCase()
        }
        return link
    })
    const toggleFooterMenu = (name) => {
        setShowMenu({ [name]: !showMenu?.[name] });
    };
    gsap.registerPlugin(ScrollTrigger);
    const component = useRef();
    const emptyDivRef = useRef(null);
    const st = useRef();
    const componentWrapper = useRef(null);
    useEffect(() => {
        if (componentWrapper.current) {
            setWindowHeight(componentWrapper.current.offsetHeight - 5)
        }
    }, [])


    const inViewport = (elem) => {
        let allElements = document.getElementsByClassName(elem);
        let windowHeight = window.innerHeight;
        const elems = () => {
            for (let i = 0; i < allElements.length; i++) {
                let viewportOffset = allElements[i].getBoundingClientRect();
                let top = viewportOffset.top;
                if (top < windowHeight) {
                    allElements[i].classList.add('in-viewport');
                } else {
                    allElements[i].classList.remove('in-viewport');
                }
            }
        }
        elems();
        window.addEventListener('scroll', elems);
    }
    useEffect(() => {
        if (loading === false) {
            emptyDivRef?.current?.classList?.remove('in-viewport')
        }
    }, [loading, emptyDivRef.current])

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const footerBlock = document.querySelectorAll('.footerBlock');
            footerBlock.forEach(pinnedFooter => {
                const container = pinnedFooter.querySelector('.footerWrapper');
                const textContainer = pinnedFooter.querySelector('.footerContent');
                gsap.set(component.current, { opacity: 0, scale: 1.1, y: 250, ease: 'none' })
                const tl = gsap.timeline({ paused: true });
                tl.to(component.current, { opacity: 1, scale: 1, y: 0, zIndex: 3, position: 'relative' });
                if (window.matchMedia('(max-width: 991px)')) {
                    tl.to(component.current, { opacity: 1, scale: 1, y: -60 });
                }
                st.current = ScrollTrigger.create({
                    animation: tl,
                    trigger: emptyDivRef.current,
                    start: 'top bottom',
                    end: "bottom",
                    scrub: true,
                    onEnter: () => inViewport('footerHidden'),
                })
            });
        }, component);
        return () => (ctx.revert(), st.current.kill());
    });
    const handleMenuClick = (url) => {
        setFirstLoad(false)
        pathname !== url && router.push(url)
    }
    const handleLogoClick = () => {
        window.scrollTo(0, 0)
        router.push('/');
      }

    return (
        <>
            <section ref={emptyDivRef} className='footerHidden' style={{ height: windowHeight }}></section>
            <footer className="dark footerBlock" ref={componentWrapper}>
                <div className='footerWrapper' ref={component}>
                    <div className="container footerContent">
                        <div className='flexWrapper'>
                            <div className='block  alt'>
                                <div onClick={handleLogoClick} className='footerLogo'>
                                    {/* <Footerlogo/> */}
                                    <VenDenBergLogo />
                                </div>
                                <p>{appDetails?.logo_text}</p>
                                <div className='socialMob'>
                                    <ul>
                                        <li><Link target='_blank' href={appDetails?.fb_url || '#'}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="24" viewBox="0 0 13 24" fill="none"><path d="M8.64301 22.5187V12.5795H12.064L12.5762 8.70601H8.64291V6.23294C8.64291 5.11147 8.96221 4.34725 10.6114 4.34725L12.7146 4.34629V0.881861C12.3509 0.834741 11.1023 0.729248 9.64982 0.729248C6.61725 0.729248 4.5411 2.53436 4.5411 5.84944V8.70601H1.11133V12.5795H4.5411V22.5186H8.64301V22.5187Z" fill="white" /></svg></Link></li>
                                        <li><Link target='_blank' href={appDetails?.instagram_url || '#'}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none"><path d="M17.3766 0.75116H6.62295C2.97106 0.75116 0 3.72236 0 7.37425V18.1279C0 21.78 2.97106 24.751 6.62295 24.751H17.3766C21.0288 24.751 23.9999 21.7798 23.9999 18.1279V7.37425C24 3.72236 21.0288 0.75116 17.3766 0.75116ZM21.8706 18.1279C21.8706 20.6058 19.8547 22.6216 17.3768 22.6216H6.62295C4.1452 22.6218 2.12938 20.6058 2.12938 18.1279V7.37425C2.12938 4.8965 4.1452 2.88054 6.62295 2.88054H17.3766C19.8545 2.88054 21.8705 4.8965 21.8705 7.37425L21.8706 18.1279Z" fill="white" /><path d="M11.9999 6.5672C8.58993 6.5672 5.81577 9.34136 5.81577 12.7514C5.81577 16.1612 8.58993 18.9352 11.9999 18.9352C15.4099 18.9352 18.1841 16.1612 18.1841 12.7514C18.1841 9.34136 15.4099 6.5672 11.9999 6.5672ZM11.9999 16.8057C9.76422 16.8057 7.94516 14.9869 7.94516 12.7512C7.94516 10.5154 9.76408 8.69644 11.9999 8.69644C14.2358 8.69644 16.0547 10.5154 16.0547 12.7512C16.0547 14.9869 14.2356 16.8057 11.9999 16.8057Z" fill="white" /><path d="M18.4434 4.76166C18.0332 4.76166 17.6302 4.92775 17.3404 5.21877C17.0493 5.50836 16.8819 5.91153 16.8819 6.32321C16.8819 6.73361 17.0494 7.13663 17.3404 7.42765C17.63 7.71724 18.0332 7.88475 18.4434 7.88475C18.8551 7.88475 19.2569 7.71724 19.5479 7.42765C19.8389 7.13663 20.005 6.73347 20.005 6.32321C20.005 5.91153 19.8389 5.50836 19.5479 5.21877C19.2583 4.92775 18.8551 4.76166 18.4434 4.76166Z" fill="white" /></svg></Link></li>
                                        <li><Link  target='_blank'href={appDetails?.tiktok_url || 'javascript:void(0)'}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none"><path d="M17.0733 5.31274C16.9215 5.23424 16.7736 5.1482 16.6304 5.05492C16.2138 4.77951 15.8318 4.45499 15.4927 4.08836C14.6443 3.11758 14.3274 2.13274 14.2107 1.44321H14.2154C14.1179 0.870862 14.1582 0.500549 14.1643 0.500549H10.2999V15.4434C10.2999 15.644 10.2999 15.8423 10.2915 16.0382C10.2915 16.0626 10.2891 16.0851 10.2877 16.1113C10.2877 16.1221 10.2877 16.1334 10.2854 16.1446C10.2854 16.1474 10.2854 16.1502 10.2854 16.153C10.2446 16.6892 10.0728 17.2071 9.78489 17.6612C9.49701 18.1154 9.10194 18.4918 8.63443 18.7574C8.14718 19.0346 7.5961 19.18 7.03552 19.1793C5.23505 19.1793 3.77583 17.7112 3.77583 15.898C3.77583 14.0849 5.23505 12.6168 7.03552 12.6168C7.37634 12.6165 7.71506 12.6701 8.03911 12.7757L8.0438 8.84102C7.06007 8.71395 6.06067 8.79213 5.10866 9.07063C4.15666 9.34913 3.2727 9.82191 2.51255 10.4591C1.84649 11.0379 1.28653 11.7284 0.857865 12.4996C0.69474 12.7809 0.0792712 13.911 0.00473994 15.7452C-0.0421351 16.7863 0.270521 17.8649 0.419584 18.3107V18.3201C0.513334 18.5826 0.876615 19.4784 1.46865 20.2335C1.94604 20.8393 2.51006 21.3714 3.14255 21.8127V21.8034L3.15193 21.8127C5.02271 23.084 7.09693 23.0005 7.09693 23.0005C7.45599 22.986 8.6588 23.0005 10.0247 22.3532C11.5397 21.6355 12.4022 20.5663 12.4022 20.5663C12.9532 19.9275 13.3914 19.1994 13.6979 18.4134C14.0476 17.4941 14.1643 16.3916 14.1643 15.951V8.02352C14.2111 8.05164 14.8355 8.46461 14.8355 8.46461C14.8355 8.46461 15.7351 9.04117 17.1385 9.41664C18.1454 9.68383 19.5019 9.74008 19.5019 9.74008V5.90383C19.0266 5.95539 18.0615 5.80539 17.0733 5.31274Z" fill="white" /></svg></Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className='linkBlock flexWrapper'>
                                <div className='block'>
                                    <p onClick={() => toggleFooterMenu("link")}>{appDetails?.menu_heading} <svg className={showMenu?.["link"] ? "active" : ""} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7.88384 10.662L7.8625 10.6833L7.8625 10.6531L7.8625 0.0125003L6.1375 0.0125003L6.1375 10.6531L6.1375 10.6833L6.11616 10.662L1.22508 5.77088L0.0175995 6.99992L7 13.9823L13.9824 6.99992L12.7749 5.77088L7.88384 10.662Z" fill="white" stroke="white" strokeWidth="0.025" /></svg></p>
                                    <ul className={`footerMenuLink ${showMenu?.["link"] ? "active" : ""}`}>
                                        {menuData?.map(({ url, title, key }) => {
                                            return <li key={key} ><a onClick={() => handleMenuClick(url)}>{title}</a></li>
                                        })}
                                    </ul>
                                </div>
                                <div className='block'>
                                    <p onClick={() => toggleFooterMenu("address")}>{appDetails?.address_heading} <svg className={showMenu?.["address"] ? "active" : ""} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7.88384 10.662L7.8625 10.6833L7.8625 10.6531L7.8625 0.0125003L6.1375 0.0125003L6.1375 10.6531L6.1375 10.6833L6.11616 10.662L1.22508 5.77088L0.0175995 6.99992L7 13.9823L13.9824 6.99992L12.7749 5.77088L7.88384 10.662Z" fill="white" stroke="white" strokeWidth="0.025" /></svg></p>
                                    <ul className={showMenu?.["address"] ? "active" : ""}>
                                        <li><Link target='_blank' href={appDetails?.address_url || "#"}>{appDetails?.address}</Link></li>
                                        <li><Link href={`tel:${appDetails?.phone_number}`}>T. {appDetails?.phone_number}</Link></li>
                                        <li><Link href={`mailto:${appDetails?.email}`}>E. {appDetails?.email}</Link></li>
                                    </ul>
                                </div>
                                <div className='block'>
                                    <p onClick={() => toggleFooterMenu("opening")}>{appDetails?.opening_hour_heading} <svg className={showMenu?.["opening"] ? "active" : ""} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7.88384 10.662L7.8625 10.6833L7.8625 10.6531L7.8625 0.0125003L6.1375 0.0125003L6.1375 10.6531L6.1375 10.6833L6.11616 10.662L1.22508 5.77088L0.0175995 6.99992L7 13.9823L13.9824 6.99992L12.7749 5.77088L7.88384 10.662Z" fill="white" stroke="white" strokeWidth="0.025" /></svg></p>
                                    <ul className={showMenu?.["opening"] ? "active" : ""}>
                                        <li><a>{appDetails?.opening_hours_text}</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className='socialMob'>
                                <ul>
                                    <li><Link target='_blank' href={appDetails?.fb_url || '#'}><svg xmlns="http://www.w3.org/2000/svg" width="13" height="24" viewBox="0 0 13 24" fill="none"><path d="M8.64301 22.5187V12.5795H12.064L12.5762 8.70601H8.64291V6.23294C8.64291 5.11147 8.96221 4.34725 10.6114 4.34725L12.7146 4.34629V0.881861C12.3509 0.834741 11.1023 0.729248 9.64982 0.729248C6.61725 0.729248 4.5411 2.53436 4.5411 5.84944V8.70601H1.11133V12.5795H4.5411V22.5186H8.64301V22.5187Z" fill="white" /></svg></Link></li>
                                    <li><Link target='_blank' href={appDetails?.instagram_url || '#'}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none"><path d="M17.3766 0.75116H6.62295C2.97106 0.75116 0 3.72236 0 7.37425V18.1279C0 21.78 2.97106 24.751 6.62295 24.751H17.3766C21.0288 24.751 23.9999 21.7798 23.9999 18.1279V7.37425C24 3.72236 21.0288 0.75116 17.3766 0.75116ZM21.8706 18.1279C21.8706 20.6058 19.8547 22.6216 17.3768 22.6216H6.62295C4.1452 22.6218 2.12938 20.6058 2.12938 18.1279V7.37425C2.12938 4.8965 4.1452 2.88054 6.62295 2.88054H17.3766C19.8545 2.88054 21.8705 4.8965 21.8705 7.37425L21.8706 18.1279Z" fill="white" /><path d="M11.9999 6.5672C8.58993 6.5672 5.81577 9.34136 5.81577 12.7514C5.81577 16.1612 8.58993 18.9352 11.9999 18.9352C15.4099 18.9352 18.1841 16.1612 18.1841 12.7514C18.1841 9.34136 15.4099 6.5672 11.9999 6.5672ZM11.9999 16.8057C9.76422 16.8057 7.94516 14.9869 7.94516 12.7512C7.94516 10.5154 9.76408 8.69644 11.9999 8.69644C14.2358 8.69644 16.0547 10.5154 16.0547 12.7512C16.0547 14.9869 14.2356 16.8057 11.9999 16.8057Z" fill="white" /><path d="M18.4434 4.76166C18.0332 4.76166 17.6302 4.92775 17.3404 5.21877C17.0493 5.50836 16.8819 5.91153 16.8819 6.32321C16.8819 6.73361 17.0494 7.13663 17.3404 7.42765C17.63 7.71724 18.0332 7.88475 18.4434 7.88475C18.8551 7.88475 19.2569 7.71724 19.5479 7.42765C19.8389 7.13663 20.005 6.73347 20.005 6.32321C20.005 5.91153 19.8389 5.50836 19.5479 5.21877C19.2583 4.92775 18.8551 4.76166 18.4434 4.76166Z" fill="white" /></svg></Link></li>
                                    <li><Link  target='_blank'href={appDetails?.tiktok_url || 'javascript:void(0)'}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none"><path d="M17.0733 5.31274C16.9215 5.23424 16.7736 5.1482 16.6304 5.05492C16.2138 4.77951 15.8318 4.45499 15.4927 4.08836C14.6443 3.11758 14.3274 2.13274 14.2107 1.44321H14.2154C14.1179 0.870862 14.1582 0.500549 14.1643 0.500549H10.2999V15.4434C10.2999 15.644 10.2999 15.8423 10.2915 16.0382C10.2915 16.0626 10.2891 16.0851 10.2877 16.1113C10.2877 16.1221 10.2877 16.1334 10.2854 16.1446C10.2854 16.1474 10.2854 16.1502 10.2854 16.153C10.2446 16.6892 10.0728 17.2071 9.78489 17.6612C9.49701 18.1154 9.10194 18.4918 8.63443 18.7574C8.14718 19.0346 7.5961 19.18 7.03552 19.1793C5.23505 19.1793 3.77583 17.7112 3.77583 15.898C3.77583 14.0849 5.23505 12.6168 7.03552 12.6168C7.37634 12.6165 7.71506 12.6701 8.03911 12.7757L8.0438 8.84102C7.06007 8.71395 6.06067 8.79213 5.10866 9.07063C4.15666 9.34913 3.2727 9.82191 2.51255 10.4591C1.84649 11.0379 1.28653 11.7284 0.857865 12.4996C0.69474 12.7809 0.0792712 13.911 0.00473994 15.7452C-0.0421351 16.7863 0.270521 17.8649 0.419584 18.3107V18.3201C0.513334 18.5826 0.876615 19.4784 1.46865 20.2335C1.94604 20.8393 2.51006 21.3714 3.14255 21.8127V21.8034L3.15193 21.8127C5.02271 23.084 7.09693 23.0005 7.09693 23.0005C7.45599 22.986 8.6588 23.0005 10.0247 22.3532C11.5397 21.6355 12.4022 20.5663 12.4022 20.5663C12.9532 19.9275 13.3914 19.1994 13.6979 18.4134C14.0476 17.4941 14.1643 16.3916 14.1643 15.951V8.02352C14.2111 8.05164 14.8355 8.46461 14.8355 8.46461C14.8355 8.46461 15.7351 9.04117 17.1385 9.41664C18.1454 9.68383 19.5019 9.74008 19.5019 9.74008V5.90383C19.0266 5.95539 18.0615 5.80539 17.0733 5.31274Z" fill="white" /></svg></Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className='bottomFooter flexWrapper'>
                            <p>{appDetails?.copyright_text}</p>
                            <p>{appDetails?.website_owner_text} <span className="btnWrapper"><Link target="_blank"href={appDetails?.owner_website || '#'}>{appDetails?.website_owner}</Link></span></p>
                        </div>
                    </div>
                </div >
            </footer >
        </>
    )
}
