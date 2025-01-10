"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Banner from "@/components/Banner";
import SwiperParallax from "@/components/SwiperParallex/SwiperParallex";

import "../../styles/highlighter.scss";
import "../../styles/ourRecommendations.scss";

import { PAGES_LINKS } from "@/constant";
import { fecthAdvisePageData } from "@/store/pages/action";
import { useDispatch, useSelector } from "react-redux";
import { fetchAndStoreData } from "@/utils";

export default function Advise() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentHeight = useRef();
  const contentHeight2 = useRef();
  const contentHeight3 = useRef();
  const dispatch = useDispatch();

  const {
    adviceHeroSection,
    adviceContentSection,
    adviceCarSliderSection,
    advicePropertiesSection,
    adviceFooterCtaSection,
  } = useSelector((state) => state?.pages?.advise) || {};
  const { userLanguage } = useSelector((state) => state?.common) || {};

  const sliderData = adviceCarSliderSection?.carslider?.map(
    ({ sliderImage, sliderMobileImage, carName, title }) => {
      return {
        bgImage: sliderImage?.node?.mediaItemUrl,
        bgImageMbl: sliderMobileImage?.node?.mediaItemUrl,
        content: `<p>${title}<span>${carName}</span></p>`,
      };
    }
  );

  const handleItemClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? 1 : index));
  };

  useEffect(() => {
    dispatch(fecthAdvisePageData());
  }, [dispatch, userLanguage]);

  useEffect(() => {
    fetchAndStoreData();
  }, []);

  const [restauratieData, setRestauratie] = useState({});
  useEffect(() => {
    const getData = localStorage.getItem("bannerData");
    if (getData) {
      setRestauratie(JSON.parse(getData));
    }
  }, []);

  return (
    <>
      <Banner
        className={"adviesBanner"}
        banner
        bgImage={
          adviceHeroSection?.bannerBgImage?.node?.mediaItemUrl ||
          restauratieData?.restauratie?.bg_image
        }
        headingText={
          adviceHeroSection?.bannerHeading?.map((data) => data.line) ||
          restauratieData?.restauratie?.banner_heading?.map((data) => data.line)
        }
        descriptionText={
          adviceHeroSection?.bannerText ||
          restauratieData?.restauratie?.banner_text
        }
      />
      <section className="highlighter light advise ">
        <div className="wrapper">
          <div className="container">
            <div className="flexWrapper">
              <h2>{adviceContentSection?.heading}</h2>
              <div className="content">
                <p>{adviceContentSection?.contentText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SwiperParallax
        className={"adviseSwiperParallax"}
        silderData={sliderData}
        contentData={sliderData}
      />
      <section className="ourRecommendations">
        <div className="container">
          <div className="topBlockContent">
            <div className="flexWrapper">
              <div className="headingBlock">
                <h3>{advicePropertiesSection?.propertiesSubHeading}</h3>
                <h2>{advicePropertiesSection?.propertiesHeading}</h2>
              </div>
              <div className="content">
                <p>{advicePropertiesSection?.propertiesText}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="accordionRecommendate">
          <div className="flexWrapper">
            <div className="accordionBlock">
              {advicePropertiesSection?.accordion?.map(
                ({ title, description }, index) => {
                  return (
                    <div className="innerBlock" key={index}>
                      <div
                        className={`heading ${
                          activeIndex === index ? "active" : ""
                        }`}
                        onClick={() => handleItemClick(index)}
                      >
                        <h2>{title}</h2>
                      </div>
                      <div
                        ref={index === activeIndex ? contentHeight : null}
                        className="content"
                        style={
                          activeIndex === index
                            ? { height: contentHeight?.current?.scrollHeight }
                            : { height: "0px" }
                        }
                      >
                        <p>{description}</p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <div className="accordionImgWrapper">
              {advicePropertiesSection?.accordion?.map(({ image }, index) => {
                return (
                  <div
                    className={`imgWrapper ${
                      activeIndex === index ? "active" : ""
                    }`}
                    key={index}
                  >
                    {/* <img src={image?.node?.mediaItemUrl} /> */}
                    <Image
                      priority
                      src={image?.node?.mediaItemUrl}
                      alt="image"
                      width={1056}
                      height={1401}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="highlighter light alt adviseAlt">
        <div className="container">
          <div className="flexWrapper">
            <h2>{adviceFooterCtaSection?.ctaHeading}</h2>
            <div className="content">
              <p>{adviceFooterCtaSection?.contentText}</p>
              <div className="btn_wrapper">
                <div className="btnWrapper">
                  <Link href={PAGES_LINKS.CONTACT_SELLING_CAR} className="btn">
                    {adviceFooterCtaSection?.ctaButton1}
                  </Link>
                </div>
              </div>
              <Image
                priority
                src={adviceFooterCtaSection?.signatureImage.node?.mediaItemUrl}
                alt="peter signature"
                width={292}
                height={72}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
