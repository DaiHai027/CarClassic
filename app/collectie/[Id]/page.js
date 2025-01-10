"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Parallax } from "@/components/Parallax/Parallax";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";

import Banner from "@/components/Banner";
import placeholerImage from "@/public/car-placeholder.jpg";
import ArrowBackward from "../../../public/arrowBackward.svg";
import ArrowForward from "../../../public/arrowForward.svg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../styles/highlighter.scss";
import "../../../styles/collectionSingle.scss";
import "../../../styles/globals.scss";

import { fetchCollectionDetailsPageData } from "@/store/pages/action";
import {
  COLLECTION_LABELS_ID,
  DATA_BASE_CAR_ID,
  NOT_FOUND_PATH,
  PAGES_LINKS,
} from "@/constant";
import { formatNumbersInString } from "@/utils";
import Image from "next/image";

// Dynamically import heavy components
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const LightBox = dynamic(() => import("@/components/LightBox/LightBox"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function Page() {
  const params = useParams();
  const { freshLoad, showNav } = useSelector((state) => state.common) || {};
  const router = useRouter();
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const slider1 = useRef(null);
  const slider2 = useRef(null);

  useEffect(() => {
    dispatch(fetchCollectionDetailsPageData({ slug: params.Id }));
  }, [dispatch, params.Id]);

  const {
    carCategories,
    heroSection,
    featureSection,
    sliderSection,
    detailsSection,
    labelData,
  } = useSelector((state) => state?.pages?.collectionDetails) || {};
  const ctaSection = useSelector((state) => state?.common?.appDetails);
  const sliderData =
    sliderSection?.sliderItems
      ?.map(({ image, text, mobileImage }) => {
        return image
          ? {
              bgImage: image?.node?.mediaItemUrl,
              bgMobileImage: mobileImage?.node?.mediaItemUrl,
              text,
            }
          : null;
      })
      .filter((item) => item !== null) || [];
  const { translatedStrings = [] } = labelData || {};

  const formatText = (text) => {
    const hasNumber = /\d/.test(text);
    if (hasNumber) {
      return `€${text},-`;
    }
    return text;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        if (isVisible) return;
        const rect = sectionRef?.current?.getBoundingClientRect();
        if (rect?.top - sectionRef?.current?.offsetHeight < 0) {
          setIsVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible]);

  useEffect(() => {
    if (slider1.current && slider2.current) {
      setNav1(slider1.current);
      setNav2(slider2.current);
    }
  }, [slider1, slider2, sliderSection]);

  useEffect(() => {
    Cookies.remove(DATA_BASE_CAR_ID);
  }, []);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <button className={className} style={style} onClick={onClick}>
        {" "}
        <ArrowForward />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <button className={className} style={style} onClick={onClick}>
        <ArrowBackward />
      </button>
    );
  }

  const setting = {
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    arrows: true,
    speed: 400,
    infinite: true,
    fade: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: false,
          variableWidth: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const settingThumb = {
    slidesToScroll: 1,
    pauseOnHover: false,
    slidesToShow: 6,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    infinite: true,
    arrows: false,
    centermode: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          variableWidth: false,
          initialSlide: 1,
          slidesToShow: 4.5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Banner
        scale={false}
        clipPath={false}
        bgImage={heroSection?.bannerBgImage?.node?.mediaItemUrl}
        headingText={heroSection?.bannerText?.map((data) => data?.line) || []}
        className={"collectieSingleBanner"}
        id={params?.Id}
      />
      <section
        className={`${
          freshLoad ? "bannerSection" : ""
        } bannerEffect collectieSingleBannerMbl   banner`}
        style={{ minHeight: freshLoad ? "100vh" : "" }}
      >
        <div className="container">
          <div className="block">
            <h1>
              {heroSection?.bannerText?.map((data, index) => (
                <span key={index}>
                  <span>{data?.line}</span>
                </span>
              ))}
            </h1>
          </div>
        </div>
        <div className="imgWrapper">
          <Image
            src={
              heroSection?.bannerBgImage?.node?.mediaItemUrl ||
              placeholerImage.src
            }
            alt="image"
            width={1920}
            height={1080}
            priority
            loading="eager"
            sizes="100vw"
            quality={75}
          />
        </div>
      </section>
      {featureSection?.type ? (
        <section className="carInformation">
          <div className="container">
            <div className="infoContainer lgBlock">
              <div className="carInfoBlock topBlock flexWrapper">
                {featureSection?.length > 0 ? (
                  <div className="carInfoInnerBlock">
                    <span>
                      {
                        translatedStrings?.find(
                          (item) => item?.id === COLLECTION_LABELS_ID.TYPE
                        )?.translated
                      }
                    </span>
                    <p>{featureSection?.type}</p>
                  </div>
                ) : null}
                {featureSection?.motor ? (
                  <div className="carInfoInnerBlock">
                    <span>
                      {
                        translatedStrings?.find(
                          (item) => item?.id === COLLECTION_LABELS_ID.ENGINE
                        )?.translated
                      }
                    </span>
                    <p>{featureSection?.motor}</p>
                  </div>
                ) : null}
                {featureSection?.body ? (
                  <div className="carInfoInnerBlock">
                    <span>
                      {
                        translatedStrings?.find(
                          (item) => item?.id === COLLECTION_LABELS_ID.BODY
                        )?.translated
                      }
                    </span>
                    <p>{featureSection?.body}</p>
                  </div>
                ) : null}
                {featureSection?.constructionYear ? (
                  <div className="carInfoInnerBlock">
                    <span>
                      {
                        translatedStrings?.find(
                          (item) =>
                            item?.id === COLLECTION_LABELS_ID.CONSTRUCTION_YEAR
                        )?.translated
                      }
                    </span>
                    <p>{featureSection?.constructionYear}</p>
                  </div>
                ) : null}
                {featureSection?.kmStand ? (
                  <div className="carInfoInnerBlock">
                    <span>
                      {
                        translatedStrings?.find(
                          (item) => item?.id === COLLECTION_LABELS_ID.KM_STAND
                        )?.translated
                      }
                    </span>
                    <p>{formatNumbersInString(featureSection?.kmStand)}</p>
                  </div>
                ) : null}
                {featureSection?.colour ? (
                  <div className="carInfoInnerBlock">
                    <span>
                      {
                        translatedStrings?.find(
                          (item) => item?.id === COLLECTION_LABELS_ID.COLOR
                        )?.translated
                      }
                    </span>
                    <p>{featureSection?.colour}</p>
                  </div>
                ) : null}
                {featureSection?.status ? (
                  <div className="carInfoInnerBlock">
                    <span>
                      {
                        translatedStrings?.find(
                          (item) => item?.id === COLLECTION_LABELS_ID.STATUS
                        )?.translated
                      }
                    </span>
                    <p>{featureSection?.status}</p>
                  </div>
                ) : null}

                {carCategories?.nodes[0].databaseId == 30 ||
                carCategories?.nodes[0].databaseId == 38 ? (
                  <>
                    {featureSection?.price ? (
                      <div className="carInfoInnerBlock">
                        <span>
                          {
                            translatedStrings?.find(
                              (item) => item?.id === COLLECTION_LABELS_ID.PRICE
                            )?.translated
                          }
                        </span>
                        {featureSection?.price ? (
                          <p>{formatText(featureSection?.price)}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    {featureSection?.price ? (
                      <div className="carInfoInnerBlock">
                        <span>
                          {
                            translatedStrings?.find(
                              (item) => item?.id === COLLECTION_LABELS_ID.PRICE
                            )?.translated
                          }
                        </span>
                        {<p>{carCategories?.nodes[0].name}</p>}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {sliderData?.length === 0 ? null : (
        <section className="SinglePageSlider" ref={sectionRef}>
          <div className="slidesImageBlock">
            <div className="container">
              <Slider
                beforeChange={(oldIndex, newIndex) => setActiveSlide(newIndex)}
                {...setting}
                asNavFor={nav2}
                ref={slider1}
              >
                {sliderData?.map((item, index) => {
                  return (
                    <div key={index} className="sliderBlock">
                      <picture>
                        <source
                          media={"(max-width:767px)"}
                          srcSet={item.bgImage}
                        />
                        <Image
                          src={item.bgImage}
                          alt="slider"
                          width={1920}
                          height={1080}
                          priority
                          loading="eager"
                          sizes="100vw"
                          quality={75}
                        />
                      </picture>
                    </div>
                  );
                })}
              </Slider>
            </div>
            <div className="container">
              <div className="sliderContent">
                <p
                  dangerouslySetInnerHTML={{ __html: sliderData?.[0]?.text }}
                />
              </div>
            </div>
          </div>
          <div className="ThumbsBlock slickThumbs" id="unique">
            <Slider
              {...settingThumb}
              asNavFor={nav1}
              ref={slider2}
            >
              {sliderData.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`sliderThumbsBlock img-box ${
                      activeSlide === i ? "active" : ""
                    }`}
                    data-link={item.bgImage}
                  >
                    <picture>
                      <source media="(max-width:767px)" srcSet={item.bgImage} />
                      <Image
                        src={item.bgImage}
                        alt="slider"
                        width={1920}
                        height={1080}
                        loading="lazy"
                        sizes="100vw"
                        quality={75}
                      />
                    </picture>
                  </div>
                );
              })}
            </Slider>
          </div>
        </section>
      )}
      {sliderData?.length || detailsSection?.description ? (
        <section
          className="carDescription"
          style={
            detailsSection?.description
              ? {}
              : { padding: "23rem 0rem 0rem 0rem" }
          }
        >
          {detailsSection?.description ? (
            <div className="container">
              <div className="infoContainer">
                <div className="descriptionBlock flexWrapper">
                  <div className="descriptionHeading">
                    <h2>{detailsSection?.descriptionTitle}</h2>
                  </div>
                  <div
                    className="descriptionContent"
                    dangerouslySetInnerHTML={{
                      __html: detailsSection?.description,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      {detailsSection?.motorHighlights ? (
        <section className="carHighLight">
          <div className="container">
            <div className="infoContainer">
              <div className="carHighLightBlock  carHighLightTop flexWrapper">
                {detailsSection?.motorHighlights?.length ? (
                  <div className="CarHighLightInnerBlock">
                    <h2>
                      {detailsSection?.motorHighHeading}{" "}
                      <span>{detailsSection?.highlightsTitle}</span>
                    </h2>
                    <ul>
                      {detailsSection?.motorHighlights?.map(
                        ({ points }, index) => (
                          <li key={index}>{points}</li>
                        )
                      )}
                    </ul>
                  </div>
                ) : null}
                {detailsSection?.exteriorHighlights?.length ? (
                  <div className="CarHighLightInnerBlock">
                    <h2>
                      {detailsSection?.exteriorHighheading}
                      <span> {detailsSection?.highlightsTitle}</span>
                    </h2>
                    <ul>
                      {detailsSection?.exteriorHighlights?.map(
                        ({ points }, index) => (
                          <li key={index}>{points}</li>
                        )
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>
              <div className="carHighLightBlock carHighLightbottom flexWrapper">
                {detailsSection?.interiorhighlights?.length ? (
                  <div className="CarHighLightInnerBlock">
                    <h2>
                      {detailsSection?.interiorHighHeading}{" "}
                      <span>{detailsSection?.highlightsTitle}</span>
                    </h2>
                    <ul>
                      {detailsSection?.interiorhighlights?.map(
                        ({ points }, index) => (
                          <li key={index}>{points}</li>
                        )
                      )}
                    </ul>
                  </div>
                ) : null}
                {detailsSection?.exteriorHighlights?.length ? (
                  <div className="CarHighLightInnerBlock">
                    <h2>
                      {detailsSection?.exteriorHighheading}{" "}
                      <span>{detailsSection?.highlightsTitle}</span>
                    </h2>
                    <ul>
                      {detailsSection?.exteriorHighlights?.map(
                        ({ points }, index) => (
                          <li key={index}>{points}</li>
                        )
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {ctaSection?.auto_cta_image_mobile || ctaSection?.auto_cta_image ? (
        <section className="zoomImageContainer">
          <Parallax speed={1} aspectRatio className="zoomImageHome">
            <picture>
              <source
                media={"(max-width:575px)"}
                srcSet={ctaSection?.auto_cta_image_mobile}
              />
                <Image
                src={ctaSection?.auto_cta_image}
                alt="slider"
                width={1920}
                height={1080}
                quality={75}
                sizes="100vw"
                priority={false}
                />
            </picture>
          </Parallax>
        </section>
      ) : null}
      {ctaSection ? (
        <section className="highlighter light alt adviseAlt">
          <div className="container">
            <div className="flexWrapper">
              <h2>{ctaSection?.auto_cta_heading}</h2>
              <div className="content">
                <p>{ctaSection?.auto_cta_text}</p>
                <div className="btn_wrapper">
                  <div className="btnWrapper">
                    <Link href={PAGES_LINKS.CONTACT} className="btn">
                      {ctaSection?.auto_cta_button1}
                    </Link>
                  </div>
                  <div className="btnWrapper">
                    <Link
                      href={PAGES_LINKS.CONTACT_SELLING_CAR}
                      className="btn"
                    >
                      {ctaSection?.auto_cta_buton2}
                    </Link>
                  </div>
                </div>
                {ctaSection?.auto_signature_image ? (
                  <Image
                    src={ctaSection?.auto_signature_image}
                    alt="peter signature" 
                    width={292}
                    height={72}
                    loading="lazy"
                    quality={60}
                    sizes="(max-width: 292px) 100vw, 292px"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <LightBox data={sliderData} activeSlide={activeSlide} />
    </>
  );
}