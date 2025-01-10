"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Cookies from "js-cookies";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Banner from "@/components/Banner";
import { Parallax } from "@/components/Parallax/Parallax";
import SwiperParallax from "@/components/SwiperParallex/SwiperParallex";

import placeholerImage from "@/public/car-placeholder.jpg";

import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import "../../styles/highlighter.scss";
import "../../styles/speed.scss";

import ArrowBackward from "../../public/arrowBackward.svg";
import ArrowForward from "../../public/arrowForward.svg";

import {
  DATA_BASE_CAR_ID,
  DEFAULT_FUTURE_CAR_ID,
  PAGES_LINKS,
} from "@/constant";
import {
  fetchFutureProjectsCategory,
  fetchFutureProjectsData,
} from "@/store/common/action";
import { fetchSpeedPageData } from "@/store/pages/action";
import { fetchAndStoreData } from "@/utils";

const getTopPosition = (index) => {
  const isMobile = window.innerWidth <= 768;
  return isMobile ? 90 + index * 5 : 160 + index * 5; // Adjust the values as needed
};
const SpeedGalleryCard = ({ index, image, subTitle, title }) => {
  return (
    <>
      <div
        className="speedPinnedInnerBlock pinned1"
        style={{ top: getTopPosition(index) }}
      >
        <div className="imgWrapper">
          <img src={image?.node?.mediaItemUrl || placeholerImage.src} alt="" />
        </div>
        <div className="content">
          <h3>{subTitle}</h3>
          <p>{title}</p>
        </div>
      </div>
    </>
  );
};
const ProjectionCard = ({ title, image, subTitle, data }) => {
  return (
    <Link
      href={PAGES_LINKS.getCarDetailsPath(data?.slug)}
      onClick={() => Cookies.setItem(DATA_BASE_CAR_ID, data?.databaseId)}
    >
      <div className="futureProjectInnerBlock">
        <div className="imgWrapper">
          <img
            src={
              data?.carData?.bannerBgImage?.node?.mediaItemUrl ||
              placeholerImage.src
            }
            alt=""
          />
        </div>
        <div className="content">
          <h3>{data?.carCategories?.nodes?.[0]?.name}</h3>
          <p>{data?.title}</p>
        </div>
      </div>
    </Link>
  );
};

const SHOW_FUTUR_CAR_COUNT = 4;

export default function Page() {
  gsap.registerPlugin(ScrollTrigger);
  const component = useRef();
  const st = useRef();
  const exclusiveProjectsRef = useRef(null);
  const dispatch = useDispatch();
  const {
    speedHeroSection,
    speedContentSection,
    speedSliderSection,
    speedCtaSection,
    speedSliderContentSection,
    speedProjectCardSection,
    speedGallerySectionn,
  } = useSelector((state) => state?.pages?.speed) || {};
  const futureCarCategoryData =
    useSelector((state) => state?.common?.futureCarCategories) || [];
  const futureProjectsSection =
    useSelector((state) => state?.common?.futureCarData) || [];
  const { userLanguage } = useSelector((state) => state?.common) || {};
  const [isWait, setIsWait] = useState(true);
  const [showCount, setShowCount] = useState(SHOW_FUTUR_CAR_COUNT);

  const futureCarCategoryId =
    futureCarCategoryData?.find(
      (option) => option?.languageCode === userLanguage
    )?.databaseId || DEFAULT_FUTURE_CAR_ID;

  useEffect(() => {
    if (speedGallerySectionn) {
      setTimeout(() => {
        setIsWait(false);
      }, 1500);
    }
  }, [speedGallerySectionn]);

  const sliderData = speedSliderSection?.sliderItems?.map(
    ({ image, mobileImage }) => {
      return {
        bgImage: image?.node?.mediaItemUrl,
        bgImageMbl: mobileImage?.node?.mediaItemUrl,
      };
    }
  );

  useEffect(() => {
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");
    const sections = document.querySelectorAll(
      ".speedPinnedInnerBlock .imgWrapper"
    );

    let posX = 0,
      posY = 0,
      mouseX = 0,
      mouseY = 0;
    let currentSection = null;

    // Animation loop for the follower with a delay effect
    function animateCursor() {
      posX += (mouseX - posX) / 9;
      posY += (mouseY - posY) / 9;
      gsap.set(follower, {
        css: {
          left: posX,
          top: posY,
        },
      });
      gsap.set(cursor, {
        css: {
          left: mouseX,
          top: mouseY,
        },
      });
      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Update mouseX and mouseY on mouse move
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (currentSection) {
        const rect = currentSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left + rect.left;
        mouseY = e.clientY - rect.top + rect.top;
      }
    });

    // Add event listeners for entering and leaving the sections
    sections.forEach((section) => {
      section.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
        follower.classList.add("active");
        currentSection = section;
      });
      section.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
        follower.classList.remove("active");
        currentSection = null;
      });
    });
  }, [speedGallerySectionn]);
  useEffect(() => {
    if (!isWait) {
      let ctx = gsap.context(() => {
        const cards = gsap.utils.toArray(".speedPinnedInnerBlock");
        let completedAnimations = 0;
        const isMobile = window.innerWidth <= 767;
        const isTab = window.innerWidth <= 991;
        cards.forEach((card, index) => {
          if (index === cards.length - 1) return;

          let stickDistance = 0;
          let firstCardST = ScrollTrigger.create({
            trigger: cards[0],
            start: "top 50%",
          });
          let lastCardST = ScrollTrigger.create({
            trigger: cards[cards.length - 1],
            start: isMobile ? "bottom 50%" : "center center",
          });
          const scale =
            1 -
            (cards.length - index) * (window.innerWidth <= 768 ? 0.05 : 0.028);
          let scaleDown = gsap.to(card, {
            scale: scale,
            transformOrigin: "50% " + (stickDistance + 100) + "px", // Adjust 100px as needed
          });
          st.current = ScrollTrigger.create({
            trigger: isMobile ? "" : card,
            start: isMobile ? "50% 40%" : isTab ? "45% 40%" : "46% 50%",
            end: () => lastCardST.start + stickDistance,
            pin: true,
            pinSpacing: false,
            scrub: true,
            ease: "none",
            animation: scaleDown,
          });
        });
      }, component);
      return () => (ctx.revert(), st.current?.kill());
    }
  }, [component, speedGallerySectionn, isWait]);

  function SampleNextArrow(props) {
    const { className, style, onClick, currentSlide, slideCount } = props;
    const isNextSlideAvailable = currentSlide < slideCount - 1;
    return (
      <button
        className={`${className} ${isNextSlideAvailable ? "active" : ""}`}
        style={style}
        onClick={onClick}
      >
        {" "}
        <ArrowForward />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick, currentSlide } = props;
    const isPrevSlideAvailable = currentSlide > 0;
    return (
      <button
        className={`${className} ${isPrevSlideAvailable ? "active" : ""}`}
        style={style}
        onClick={onClick}
      >
        <ArrowBackward />
      </button>
    );
  }
  const settings = {
    infinite: true,
    slidesToShow: 2,
    rows: 2,
    arrows: false,
    draggable: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
          draggable: true,
          rows: 1,
          slidesPerRow: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrows: true,
          rows: 1,
          slidesPerRow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    dispatch(fetchSpeedPageData());
    dispatch(fetchFutureProjectsCategory());
    dispatch(fetchFutureProjectsData(futureCarCategoryId));
  }, [dispatch, userLanguage, futureCarCategoryId]);

  useEffect(() => {
    Cookies.removeItem(DATA_BASE_CAR_ID);
  }, []);

  useEffect(() => {
    fetchAndStoreData();
  }, []);

  const [speedData, setSpeedData] = useState({});
  useEffect(() => {
    const getData = localStorage.getItem("bannerData");
    if (getData) {
      setSpeedData(JSON.parse(getData));
    }
  }, []);

  return (
    <>
      <Banner
        className={"speedBanner"}
        banner
        bgImage={
          speedHeroSection?.bannerBgImage?.node?.mediaItemUrl ||
          speedData?.speed?.bannerBgImage?.url
        }
        mainHeading={
          speedHeroSection?.bannerHeading || speedData?.speed?.bannerHeading
        }
        headingText={
          speedHeroSection?.bannerSubHeading?.map((data) => data?.line) ||
          speedData?.speed?.bannerSubHeading?.map((data) => data?.line)
        }
        descriptionText={
          speedHeroSection?.bannerText || speedData?.speed?.bannerText
        }
      />

      <section className="highlighter light alt speedAlt">
        <div className="container">
          <div className="flexWrapper">
            <h2>{speedContentSection?.contentHeading}</h2>
            <div className="content">
              <p>{speedContentSection?.contentText}</p>
            </div>
          </div>
        </div>
      </section>
      <SwiperParallax
        silderData={sliderData}
        contentData={
          speedSliderSection?.sliderTitle
            ? [
                {
                  content: `<p>${speedSliderSection?.sliderTitle}<span>${speedSliderSection?.slidersubtitle}</span></p>`,
                },
              ]
            : []
        }
        className={"speedpageSlider"}
      />
      <section className="ourExclusiveProjects" ref={exclusiveProjectsRef}>
        <div className="container">
          <div className="topContentBlock flexWrapper">
            <div className="headingBlock">
              <h3>{speedSliderContentSection?.content2SubHeading}</h3>
              <h2>{speedSliderContentSection?.content2Heading}</h2>
            </div>
            <div className="contentBlock">
              <p>{speedSliderContentSection?.content2Text}</p>
            </div>
          </div>
          <div className="speedPinnedAnimation">
            <p className="projectsCompleted">
              {speedSliderContentSection?.galleryHeading}
            </p>
            <div className="speedPinnedBlock" ref={component}>
              <div class="relative z-10">
                <div class="cursor"></div>
                <div class="cursor-follower"></div>
              </div>
              {speedGallerySectionn?.galleryItems?.map((data, index) => {
                return <SpeedGalleryCard {...data} key={index} index={index} />;
              })}
            </div>
          </div>
        </div>
      </section>

      {futureProjectsSection?.length ? (
        <section className="futureProject">
          <div className="container">
            <h2>{speedProjectCardSection?.projectHeading}</h2>

            <div className="futureProjectBlock  lgBlock">
              {futureProjectsSection?.map((data, index) => {
                if (index >= showCount) return;
                return <ProjectionCard data={data} key={index} index={index} />;
              })}
              {showCount < futureProjectsSection?.length ? (
                <div
                  className="loadMore"
                  onClick={() => setShowCount(showCount + SHOW_FUTUR_CAR_COUNT)}
                >
                  {/* <Link href="#">
                                {speedProjectCardSection?.loadMore}
                            </Link> */}

                  <div className="btnWrapper">
                    <div className="btn">
                      {speedProjectCardSection?.loadMore}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="futureProjectBlock smBlock">
              <Slider {...settings}>
                {futureProjectsSection?.map((data, index) => {
                  return (
                    <ProjectionCard data={data} key={index} index={index} />
                  );
                })}
              </Slider>
            </div>
          </div>
        </section>
      ) : null}
      <Parallax speed={1} aspectRatio className="speedBottomParallax">
        <section className="bg-white">
          <div className="imgWrapper">
            <picture>
              <source
                media={"(max-width:575px)"}
                srcSet={
                  speedCtaSection?.ctaImageMobile?.node?.mediaItemUrl ||
                  placeholerImage.src
                }
              />
              <img
                src={
                  speedCtaSection?.ctaImage?.node?.mediaItemUrl ||
                  placeholerImage.src
                }
                alt="slider"
              />
            </picture>
          </div>
        </section>
      </Parallax>
      <section className="highlighter light alt speedAlt">
        <div className="container">
          <div className="flexWrapper">
            <h2>{speedCtaSection?.ctaHeading}</h2>
            <div className="content">
              <p>{speedCtaSection?.ctatext}</p>
              <div className="btn_wrapper">
                <Link href={PAGES_LINKS.CONTACT} class="btn">
                  {speedCtaSection?.ctaButton}
                </Link>
              </div>
              <img
                height={72}
                width={292}
                alt="peter signature"
                src={speedCtaSection?.signatureImage?.node?.mediaItemUrl}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
