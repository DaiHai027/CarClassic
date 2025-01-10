"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import Banner from "@/components/Banner";
import { Parallax } from "@/components/Parallax/Parallax";

import "../../styles/highlighter.scss";
import "./overons.scss";

import placeholerImage from "@/public/car-placeholder.jpg";

import { PAGES_LINKS } from "@/constant";
import { fecthAboutUsPageData } from "@/store/pages/action";
import { useDispatch, useSelector } from "react-redux";
import { fetchAndStoreData } from "@/utils";
import Image from "next/image";

export default function Overons() {
  const dispatch = useDispatch();
  const {
    aboutHoreSection,
    mainContentSection,
    imageAndtextSection,
    textSecondSection,
    imageAndtextSecondSection,
    footerCtaSection,
  } = useSelector((state) => state?.pages?.about) || {};
  const { userLanguage } = useSelector((state) => state?.common) || {};

  useEffect(() => {
    dispatch(fecthAboutUsPageData());
  }, [dispatch, userLanguage]);

  //

  useEffect(() => {
    fetchAndStoreData();
  }, []);

  const [aboutData, setAboutData] = useState({});
  useEffect(() => {
    const getData = localStorage.getItem("bannerData");
    if (getData) {
      setAboutData(JSON.parse(getData));
    }
  }, []);

  return (
    <>
      <Banner
        //  bgImage={aboutHoreSection?.bannerBgImage?.node?.mediaItemUrl}
        bgImage={
          aboutHoreSection?.bannerBgImage?.node?.mediaItemUrl ||
          aboutData?.about?.banner_bg_image?.url
        }
        className={`obannerbg`}
        banner
        headingText={
          aboutHoreSection?.banerHeading?.map(
            (lineObject) => lineObject?.line
          ) ||
          aboutData?.about?.baner_heading?.map((lineObject) => lineObject?.line)
        }
        descriptionText={
          aboutHoreSection?.bannerText || aboutData?.about?.banner_text
        }
      />
      <section className="highlighter light overOnsHigh">
        <div className="wrapper">
          <div className="container">
            <div className="maxContent">
              <h3>{mainContentSection?.mainContentHeading}</h3>
            </div>
            <div
              className="maxContent"
              dangerouslySetInnerHTML={{
                __html: mainContentSection?.mainContentText,
              }}
            />
          </div>
        </div>
      </section>
      <section className="overZoomOut bgImg dark bgOne">
        <div className="imgWrapper">
          <img
            src={
              mainContentSection?.mainContentImage?.node?.mediaItemUrl ||
              placeholerImage.src
            }
            alt="Peter"
            width={1440}
            height={680}
          />
        </div>
        <div className="content">
          <h2>{mainContentSection?.imageText}</h2>
        </div>
      </section>
      <section className="highlighter dark overOnsHigh">
        <div className="wrapper">
          <div className="container">
            <div className="maxContent">
              <h3>{imageAndtextSection?.content2Heading}</h3>
            </div>
            <div
              className="maxContent"
              dangerouslySetInnerHTML={{
                __html: imageAndtextSection?.content2Text,
              }}
            />
          </div>
        </div>
      </section>
      <Parallax speed={1} aspectRatio className="parallax2sec">
        <section className="overZoomOut bgImg dark alt overonsZoomSection">
          <div className="imgWrapper">
            <picture>
              <source
                media={"(max-width:575px)"}
                srcSet={
                  imageAndtextSection?.content2ImageMobile?.node
                    ?.mediaItemUrl || placeholerImage.src
                }
              />
              <img
                src={
                  imageAndtextSection?.content2image?.node?.mediaItemUrl ||
                  placeholerImage.src
                }
                alt="slider"
              />
            </picture>
          </div>
          <div className="content">
            <h2>{imageAndtextSection?.content2imageText}</h2>
          </div>
        </section>
      </Parallax>
      <section className="highlighter dark overOnsHigh">
        <div className="wrapper">
          <div className="container">
            <div className="maxContent">
              <h3>{imageAndtextSecondSection?.content3Heading}</h3>
            </div>
            <div
              className="maxContent"
              dangerouslySetInnerHTML={{
                __html: imageAndtextSecondSection?.content3Text,
              }}
            />
          </div>
        </div>
      </section>
      <Parallax speed={1} aspectRatio className="parallax3sec">
        <section className="overZoomOut bgTwo">
          <div className="imgWrapper">
            <picture>
              <source
                media={"(max-width:575px)"}
                srcset={
                  imageAndtextSecondSection?.content3ImageMobile?.node
                    ?.mediaItemUrl || placeholerImage.src
                }
              />
              <img
                src={
                  imageAndtextSecondSection?.content3Image?.node
                    ?.mediaItemUrl || placeholerImage.src
                }
                alt="slider"
              />
            </picture>
          </div>
          <div className="content">
            <h2>{imageAndtextSecondSection?.content3ImageText}</h2>
          </div>
        </section>
      </Parallax>
      <section className="highlighter light overOnsHigh">
        <div className="wrapper">
          <div className="container">
            <div className="maxContent">
              <h3>{textSecondSection?.content4Heading}</h3>
              <div
                className="maxContent"
                dangerouslySetInnerHTML={{
                  __html: textSecondSection?.content4Text,
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <Parallax speed={1} aspectRatio>
        <section className="overZoomOut bgImg dark alt bgThree">
          <div className="imgWrapper">
            <picture>
              <source
                media={"(max-width:575px)"}
                srcset={
                  footerCtaSection?.ctaImageMobile?.node?.mediaItemUrl ||
                  placeholerImage.src
                }
              />
              <img
                src={
                  footerCtaSection?.ctaImage?.node?.mediaItemUrl ||
                  placeholerImage.src
                }
                alt="slider"
              />
            </picture>
          </div>
          {/* <div className="content">
            <h2>{footerCtaSection?.ctaImageText}</h2>
          </div> */}
        </section>
      </Parallax>
      <section className="highlighter light alt overOnsHigh">
        <div className="container">
          <div className="flexWrapper">
            <h2>{footerCtaSection?.ctaHeading}</h2>
            <div className="content">
              <p>{footerCtaSection?.ctaText}</p>
              <div className="btn_wrapper">
                <div className="btnWrapper">
                  <Link href={PAGES_LINKS.CONTACT} className="btn">
                    {footerCtaSection?.ctaButton}
                  </Link>
                </div>
              </div>
              <Image
                src={footerCtaSection?.signatureImage?.node?.mediaItemUrl}
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
