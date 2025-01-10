"use client"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import "./menu.scss";
import { usePathname } from "next/navigation";


function OverlayMenu({ setIsSamePathName, navigationData, setAnimationPlaying, setIsNavLinkCliked, showNav, setShowNav, setOverlayClick, setFirstLoad }) {

  const overlayMenuRef = useRef(null);
  const overlayMenuWrapRef = useRef(null);
  const navListRef = useRef(null);
  const navItemsRefs = useRef([]);
  const pathname = usePathname()
  const tl = useRef();
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isClickable, setIsClickable] = useState(true);
  useEffect(() => {
    if (isMenuClicked) {
      setIsMenuClicked(false);
      document.documentElement.classList.remove("is-nav");
      // setShowNav(!showNav)
    }
  }, [isMenuClicked]);

  useEffect(() => {
    setShowNav(false);
    setAnimationPlaying(false);
  }, [pathname])

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true });
      tl.current.fromTo(
        overlayMenuRef.current,
        { yPercent: -100, visibility: 'hidden' },
        { yPercent: 0, visibility: 'visible', duration: 1.5, ease: "expo.inOut" }
      );
      tl.current.fromTo(
        overlayMenuWrapRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.5, ease: "expo.inOut" },
        "0"
      );
      if (navItemsRefs.current) {
        tl.current.fromTo(
          navItemsRefs.current,
          {
            opacity: 0,
            yPercent: 100
          },
          {
            opacity: 1,
            yPercent: 0,
            duration: 1.5,
            stagger: {
              from: "start",
              each: 0.1
            },
            ease: "expo.inOut"
          },
          "0"
        );
      }
    }, overlayMenuRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (showNav) {
      tl.current.play();
    } else {
      tl.current.reverse();
      document.documentElement.classList.remove("is-nav");
      setShowNav(false)
    }
    return () => {
      document.onkeyup = null;
    };
  }, [setShowNav, showNav]);

  const handleMenuClick = (url) => {
    sessionStorage.removeItem("carId");
    sessionStorage.clear();
    if (!isClickable) return;
    setTimeout(() => {
      document.getElementById("humburgerWrap").classList.remove("bgWhitehumburgerWrap");
    }, 1000)
    setIsNavLinkCliked(true)
    setIsMenuClicked(true)
    setFirstLoad(false)
    setIsClickable(false);
    setShowNav(false);
    setOverlayClick(true);
    setIsSamePathName(pathname === url)
    setTimeout(() => {
      setIsClickable(true);
    }, 2000);
  }
  return (
    <div className="overlay-menu" ref={overlayMenuRef} data-lenis-prevent>
      <div className="overlay-menu-wrapper" ref={overlayMenuWrapRef}>
        <div className="row">
          <nav>
            <ul
              ref={navListRef}
              className={`nav ${isHovering ? "isHover" : ""}`}
            >
              {navigationData.map((item, index, { length }) => {
                return (
                  <li key={index}>
                    <Link
                      href={item.url === "" ? item.url : `${item.url}`}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      onClick={() => handleMenuClick(item.url)}
                    >
                      <span ref={(el) => (navItemsRefs.current[index] = el)}>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default OverlayMenu;
