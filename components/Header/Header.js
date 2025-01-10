"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import "./header.scss";
import nl from "../../public/nl.png";
import VenDenBergLogo from "../../public/Ven-Den-Berg-Logo.svg";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Menu from "./menu/menu";
import { usePathname } from "next/navigation";
import { PAGES_KEY, PAGES_LINKS } from "@/constant";
import { useSelector } from 'react-redux'

const options = [
  { value: 'NL', label: <div className='langFlag'><img src={nl.src} height="30px" width="20px" />NL</div> },
  { value: 'GM', label: <div className='langFlag'><img src={nl.src} height="30px" width="20px" />GM</div> },
  { value: 'US', label: <div className='langFlag'><img src={nl.src} height="30px" width="20px" />US</div> },
];

export const navigationData = [
  {
    title: "Home",
    key: PAGES_KEY.HOME,
    url: PAGES_LINKS.HOME,
    buttonName: "homeButton", // Optional: Used for tracking or identifying the button
    buttonCategory: "mainMenu", // Optional: Category of the button
    buttonType: "link", // Optional: Type of the button (link, button, etc.)
  },
  {
    title: "Over Ons",
    url: PAGES_LINKS.ABOUT_US,
    key: PAGES_KEY.ABOUT_US,
    buttonName: "OverOnsButton",
    buttonCategory: "mainMenu",
    buttonType: "link",
  },
  {
    title: "Restauratie",
    url: "/advies",
    buttonName: "restauratieButton",
    url: PAGES_LINKS.ADVISE,
    key: PAGES_KEY.ADVISE,
    buttonName: "AdviesButton",
    buttonCategory: "mainMenu",
    buttonType: "link",
  },
  {
    title: "Speed",
    url: PAGES_LINKS.SPEED,
    key: PAGES_KEY.SPEED,
    buttonName: "speedButton",
    buttonCategory: "mainMenu",
    buttonType: "link",
  },
  {
    title: "Collectie",
    url: PAGES_LINKS.COLLECTION,
    key: PAGES_KEY.COLLECTIVE,
    buttonName: "collectieButton",
    buttonCategory: "mainMenu",
    buttonType: "link",
  },
  {
    title: "Contact",
    url: PAGES_LINKS.CONTACT,
    key: PAGES_KEY.CONTACT,
    buttonName: "contactButton",
    buttonCategory: "mainMenu",
    buttonType: "link",
  },
];

gsap.registerPlugin(ScrollTrigger);
export default function Header({ setIsNavLinkCliked, setFirstLoad }) {
  const [logoAnimation, setLogoAnimation] = useState(false);
  const languages = useSelector(state => state?.common?.languages) || [];
  const activeMenu = useSelector(state => state?.common?.activeMenu) || [];
  const appDetails = useSelector(state => state?.common?.appDetails) || {}
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);

  const menuData = navigationData.map((link) => {
    const currentLink = activeMenu?.filter((data) => {
      return data?.connectedObject?.pageKey?.key === link.key
    });
    if (currentLink.length) {
      link.title = currentLink[0]?.label
    }
    return link
  })
  const languageFlags = languages.map((language) => {
    return {
      value: language?.language_code,
      label: <div className='langFlag'>
        <Image priority src={language?.language_code === 'nl' ? nl.src : language?.country_flag_url || nl?.src} height={30} width={20} alt="NL" />
        {/* <Image src={nl?.src} height={30} width={20} alt="NL" /> */}
        {language?.language_code?.toLocaleUpperCase()}
      </div>
    }
  })

  const handleLogoAnimation = (val) => {
    setLogoAnimation(val)
  }
  // useEffect(() => {
  //   document.querySelectorAll("img").forEach(img => {
  //     if (img.complete) {
  //       ScrollTrigger.refresh();
  //     } else {
  //       img.addEventListener('load', imgLoaded => ScrollTrigger.refresh());
  //     }
  //   });
  // });
  return (
    <header className="header-wrapper" >
      <div className="container">
        <div className="flexWrapper headerBlock">
          <div className='mobileMenuHeader'>
            <div className={`logo ${logoAnimation ? 'active' : ""}`}>
              <Link href="/">
                <VenDenBergLogo />
              </Link>
            </div>
          </div>
          <Menu flags={languageFlags}
            navigationData={menuData}
            setIsNavLinkCliked={setIsNavLinkCliked}
            handleLogoAnimation={handleLogoAnimation}
            setShowNav={setShowNav}
            showNav={showNav}
            setFirstLoad={setFirstLoad}
          />
          {/* <NavContextProvider> */}
          {/* <Menu flags={languageFlags} navigationData={menuData} handleLogoAnimation={handleLogoAnimation} /> */}
          {/* <OverlayMenu navigationData={menuData} /> */}
          {/* </NavContextProvider> */}
        </div >
      </div >
    </header >
  );
}

