"use client";
import Link from "next/link";
import { useEffect } from "react";

import "../styles/highlighter.scss";

import Banner from "@/components/Banner";
import HorizontalScroll from "@/components/HorizontalScroll/HorizontalScroll";
import { Parallax } from "@/components/Parallax/Parallax";
import SwiperParallax from "@/components/SwiperParallex/SwiperParallex";

import placeholerImage from "../public/car-placeholder.jpg";
import SvgImage from "../public/signature.svg";
import signatureBig from "../public/signatureBig.png";

import { fecthHomePageData } from "@/store/pages/action";
import { useDispatch, useSelector } from "react-redux";

import { PAGE_DEFAULT_ID, PAGES_KEY, PAGES_LINKS } from "@/constant";
import { fetchAndStoreData } from "@/utils";
import Image from "next/image";

export default function Page() {
  const dispatch = useDispatch();

  const {
    homeHeroSection,
    contentSection,
    carSliderSection,
    carDetailsSliderSection,
    footerCtaSection,
  } = useSelector((state) => state?.pages?.home) || {};
  const { userLanguage } = useSelector((state) => state?.common) || {};

  const sliderData = carSliderSection?.carSlider?.map(
    ({ image, mobileImg, text }) => {
      return {
        bgImage: image?.node?.mediaItemUrl,
        bgImageMbl: mobileImg?.node?.mediaItemUrl,
        content: `<p>${text}</p>`,
      };
    }
  );
  const contentSlider = carDetailsSliderSection?.contentSlider?.map((item) => {
    return {
      ...item,
      button: {
        name: item.button,
        href: item?.buttonUrl?.startsWith(PAGES_LINKS.CONTACT)
          ? PAGES_LINKS.CONTACT_SELLING_CAR
          : item.buttonUrl || "#",
      },
    };
  });

  useEffect(() => {
    dispatch(fecthHomePageData());
  }, [dispatch, userLanguage]);

  useEffect(() => {
    fetchAndStoreData();
  }, []);
  return (
    <>
      <Banner
        className={"home"}
        bgImage={homeHeroSection?.bgImage?.node?.mediaItemUrl}
        headingText={homeHeroSection?.heroHeading?.map((data) => data.line)}
        descriptionText={homeHeroSection?.heroText}
      />
      <section className="highlighter light">
        <div className="wrapper">
          <div className="container">
            <div className="flexWrapper">
              <h2>{contentSection?.contentHeading}</h2>
              <div className="content">
                <p>{contentSection?.contentText}</p>
                <div className="btn_wrapper">
                  <div className="btnWrapper">
                    <Link href={PAGES_LINKS.COLLECTION} className="btn">
                      {contentSection?.contentButton1}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {sliderData?.length && (
        <SwiperParallax
          silderData={sliderData}
          contentImage={<SvgImage />}
          contentData={[sliderData?.[0]] || []}
        />
      )}
      {contentSlider?.length && <HorizontalScroll data={contentSlider} />}
      <section className="zoomImageContainer">
        <Parallax speed={1} aspectRatio className="zoomImageHome">
          <picture>
            <source
              media={"(max-width:575px)"}
              srcSet={
                footerCtaSection?.ctaImageMobile?.node?.mediaItemUrl ||
                placeholerImage.src
              }
            />
            <img
              src={
                footerCtaSection?.fctaImage?.node?.mediaItemUrl ||
                placeholerImage.src
              }
              alt="slider"
            />
          </picture>
        </Parallax>
      </section>
      <section className="highlighter light homeAlt alt">
        <div className="wrapper">
          <div className="container">
            <div className="flexWrapper">
              <h2>{footerCtaSection?.fctaHeading}</h2>
              <div className="content">
                <p>{footerCtaSection?.fctaText}</p>
                <div className="btn_wrapper">
                  <div className="btnWrapper">
                    <Link
                      href={PAGES_LINKS.CONTACT_SELLING_CAR}
                      className="btn"
                    >
                      {footerCtaSection?.fctaButton}
                    </Link>
                  </div>
                </div>
                <Image
                  src={
                    footerCtaSection?.ctaSignatureImage?.node?.mediaItemUrl ||
                    signatureBig.src
                  }
                  alt="peter signature"
                  width={292}
                  height={72}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
