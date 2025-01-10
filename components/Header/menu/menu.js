"use client";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Select from "react-select";
import CustomDropdownIcon from "../../../public/chevron_left.svg";
import "./menu.scss";

import { changeLogo } from "@/utils";
import OverlayMenu from "./overlay-menu";
import { LANGAUGE, LOCAL_STORAGE, PAGES_LINKS } from "@/constant";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveMenu, setUserLanguageAction } from "@/store/common/action";
import { fetchCollectionDetailsPageData } from "@/store/pages/action";

gsap.registerPlugin(ScrollTrigger);

export default function Menu({
  flags,
  navigationData,
  handleLogoAnimation,
  setIsNavLinkCliked,
  showNav,
  setShowNav,
  setFirstLoad,
}) {
  const [selectedOption, setSelectedOption] = useState(
    LANGAUGE.DEFAULT_LANGUAGE_CODE
  );
  const isAnimationCompleted =
    useSelector((state) => state?.common?.isAnimationCompleted) || false;
  const pages = useSelector((state) => state?.pages);
  const lastPageSlug = useSelector((state) => state?.common?.lastPageSlug);
  const { translations = [] } =
    useSelector((state) => state?.pages?.collectionDetails) || {};
  const [overlayOpen, setoverlayOpen] = useState(false);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [toggleMainMenu, setToggleMainMenu] = useState(false);
  const [overLayClick, setOverlayClick] = useState(false);
  const [isSamePathName, setIsSamePathName] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { Id } = useParams();

  const navItemsRefs = useRef([]);
  const tl = useRef(null);
  const nav = useRef(null);
  let st = useRef();
  let logo;

  const CustomDropdownIndicator = (props) => {
    return (
      <div {...props}>
        <CustomDropdownIcon />
      </div>
    );
  };

  const dispatch = useDispatch();

  const onChangeLanguage = (data) => {
    dispatch(setUserLanguageAction(data.value));
    setSelectedOption(data.valu);
    if (pathname === PAGES_LINKS.getCarDetailsPath(Id)) {
      dispatch(fetchCollectionDetailsPageData({ slug: Id }));
    }
    dispatch(fetchActiveMenu());
  };
  function toggleMenu() {
    document.documentElement.classList.toggle("is-nav");
    setTimeout(() => {
      document
        .getElementById("humburgerWrap")
        .classList.toggle("bgWhitehumburgerWrap");
    }, 1000);
    setShowNav(!showNav);
    setoverlayOpen(!overlayOpen);
  }
  useEffect(() => {
    let ctx = gsap.context(() => {
      const sectionsExist = document.querySelectorAll("section").length > 0;
      if (!sectionsExist) return;
      const sections = gsap.utils.toArray("section");
      logo = document.getElementById("humburgerWrap");
      sections.forEach((section) => {
        st.current = ScrollTrigger.create({
          trigger: section,
          markers: false,
          start: "top 10",
          end: "bottom 10",
          onEnter: () => changeLogo(section, logo),
          onEnterBack: () => changeLogo(section, logo),
        });
      });
    });
    setToggleMainMenu(false);
    if (
      lastPageSlug &&
      pathname === "/collectie" &&
      sessionStorage.getItem("cardId")
    ) {
      setToggleMainMenu(true);
      setAnimationPlaying(true);
      document
        .getElementById("humburgerWrap")
        .classList.add("bgWhitehumburgerWrap");
    }
    return () => {
      ctx.revert(), st.current.kill();
    };
  }, [pathname, pages]);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      tl.current = gsap.timeline({
        paused: true,
      });
      tl.current.fromTo(
        navItemsRefs.current,
        {
          opacity: 1,
          yPercent: 0,
        },
        {
          opacity: 0,
          yPercent: -100,
          duration: 0.8,
          stagger: {
            from: "start",
            each: 0.1,
          },
          ease: "expo.inOut",
        },
        0
      );
      st.current = ScrollTrigger.create({
        trigger: document.body,
        start: "top -100px",
        invalidateOnRefresh: true,
        onToggle: function (toggle) {
          setToggleMainMenu(toggle.isActive || toggle.direction == 1);
        },
      });
    }, nav);
    return () => (ctx.revert(), st.current.kill());
  }, []);

  useEffect(() => {
    toggleMainMenu
      ? tl.current.play()
      : overLayClick
      ? null
      : isSamePathName
      ? null
      : tl.current.reverse();
    setAnimationPlaying(toggleMainMenu);
    handleLogoAnimation(toggleMainMenu);
    setIsNavLinkCliked(true);
  }, [toggleMainMenu, isSamePathName]);

  const handleMenuCLick = () => {
    setFirstLoad(false);
    sessionStorage.removeItem("carId");
    sessionStorage.clear();
  };

  useEffect(() => {
    const language =
      localStorage?.getItem(LOCAL_STORAGE.LANGUAGE_KEY) ||
      LANGAUGE.DEFAULT_LANGUAGE_CODE;
    setSelectedOption(language);
  }, [flags]);

  useEffect(() => {
    if (overLayClick) {
      if (isSamePathName) {
        setTimeout(() => {
          toggleMainMenu ? tl.current.play() : tl.current.play();
          setOverlayClick(false);
          setIsSamePathName(false);
        }, 1000);
      } else {
        setTimeout(() => {
          toggleMainMenu ? tl.current.reverse() : tl.current.play();
          setOverlayClick(false);
          setIsSamePathName(false);
        }, 2500);
      }
      setTimeout(() => {
        setAnimationPlaying(false);
      }, 1000);
    }
  }, [overLayClick]);

  return (
    <>
      <nav
        ref={nav}
        className={`navBar nav-menu desktopScreenNav ${
          animationPlaying ? "active" : ""
        }`}
      >
        <ul className="navBlock">
          {navigationData.map((item, index, { length }) => (
            <li
              key={index}
              ref={(element) => (navItemsRefs.current[index] = element)}
            >
              <Link
                style={
                  {
                    //  pointerEvents: !isAnimationCompleted ? "auto" : "none",
                  }
                }
                onClick={handleMenuCLick}
                href={item.url}
                className={pathname == item.url ? "active" : ""}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div
          className="interpreter"
          ref={(element) =>
            (navItemsRefs.current[navigationData.length] = element)
          }
        >
          <Select
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            className="multiLang"
            defaultValue={flags.find((flag) => flag.value === selectedOption)}
            value={flags.find((flag) => flag.value === selectedOption)}
            onChange={onChangeLanguage}
            options={flags}
          />
        </div>
        <button
          className={`ham-burger ${animationPlaying ? "active" : ""}`}
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          <div id="humburgerWrap" className="ham-burger-line-wrapper">
            <div className="ham-burger-line">
              <span></span>
            </div>
            <div className="ham-burger-line">
              <span></span>
            </div>
            <div className="ham-burger-line">
              <span></span>
            </div>
          </div>
        </button>
      </nav>
      <OverlayMenu
        navigationData={navigationData}
        setIsNavLinkCliked={setIsNavLinkCliked}
        showNav={showNav}
        setShowNav={setShowNav}
        setFirstLoad={setFirstLoad}
        setOverlayClick={setOverlayClick}
        setAnimationPlaying={setAnimationPlaying}
        setIsSamePathName={setIsSamePathName}
      />
    </>
  );
}
