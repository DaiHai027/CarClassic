"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Banner from "@/components/Banner";
import SwiperParallax from "@/components/SwiperParallex/SwiperParallex";

import styles from "./contact.module.scss";

import GeneralForm from "@/components/contact/generalForm";
import SellingForm from "@/components/contact/sellingForm";
import { CONTACT_FORM_ID } from "@/constant";
import { fetchContactPageData } from "@/store/pages/action";
import { fetchAndStoreData } from "@/utils";

export default function Contact({ searchParams }) {
  const { form } = searchParams;
  const id = parseInt(form) === 2 ? 2 : 1;
  const [active, setActive] = useState(id || 1);
  const dispatch = useDispatch();

  const {
    contactHeroSection,
    contactSection,
    contactUsFormSection,
    sellingFormSection,
    articlesSection,
    privacyPolicySection,
    contactSliderSection,
  } = useSelector((state) => state?.pages?.contact) || {};
  const { userLanguage } = useSelector((state) => state?.common) || {};

  const sliderData = useMemo(() => {
    return (
      contactSliderSection?.sliderItems?.map(({ image, mobileImg, text }) => {
        return {
          bgImage: image?.node?.mediaItemUrl,
          bgImageMbl: image?.node?.mediaItemUrl,
          content: `<p>${contactSliderSection?.sliderText}<span>${contactSliderSection?.sliderTitle}</span></p>`,
        };
      }) || []
    );
  }, [contactSliderSection]);

  const handleTabs = (id) => {
    setActive(id);
  };

  useEffect(() => {
    dispatch(fetchContactPageData());
  }, [userLanguage, dispatch]);

  const router = useRouter();

  useEffect(() => {
    const id = window.location.hash.substring(1);
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", top: -150 });
        }, 5000);
      }
    }
  }, [contactHeroSection]);

  useEffect(() => {
    fetchAndStoreData();
  }, []);

  const [contactData, setContactData] = useState({});
  useEffect(() => {
    const getData = localStorage.getItem("bannerData");
    if (getData) {
      setContactData(JSON.parse(getData));
    }
  }, []);

  return (
    <>
      <Banner
        className={`contactBanner`}
        banner
        bgImage={
          contactHeroSection?.bannerBgImage?.node?.mediaItemUrl ||
          contactData?.contact?.bannerBgImage?.url
        }
        headingText={
          contactHeroSection?.bannerHeading?.map((data) => data?.line) ||
          contactData?.contact?.bannerHeading.map((data) => data?.line)
        }
        descriptionText={
          contactHeroSection?.bannertext || contactData?.contact?.bannerText
        }
        searchParams={searchParams}
      />
      <section className={`${styles.contactSection} dark`}>
        <div className="container">
          <div className={`${styles.topHeadingBlock} flexWrapper`}>
            <div className={styles.headingBlock}>
              <h3>{contactSection?.contactSubHeading}</h3>
              <h2>{contactSection?.contactHeading}</h2>
            </div>
            <div className={styles.contentBlock}>
              <p>
                {contactSection?.detailsHeading}
                <span>{contactSection?.address}</span>
                <span>
                  {contactSection?.kvkNumberTitle} {contactSection?.kvkNumber}
                </span>
                <Link href={`telto:${contactSection?.phoneNumber}`}>
                  T. {contactSection?.phoneNumber}
                </Link>
                <Link href={`mailto:${contactSection?.email}`}>
                  E. {contactSection?.email}
                </Link>
              </p>
            </div>
          </div>
          <div className={styles.filterBlock} id={CONTACT_FORM_ID}>
            <div className={styles.filterTabs}>
              <ul>
                <li
                  key={1}
                  className={`${active === 1 ? `${styles.activeheading}` : ""}`}
                  onClick={() => handleTabs(1)}
                >
                  {contactUsFormSection?.contactFormTab}
                </li>
                <li
                  key={2}
                  className={`${active === 2 ? `${styles.activeheading}` : ""}`}
                  onClick={() => handleTabs(2)}
                >
                  {sellingFormSection?.sellingTabTitle}
                </li>
              </ul>
            </div>
            <GeneralForm
              className={`${styles.filterResult} ${
                active === 1 ? styles.activeTabs : null
              }`}
              data={contactUsFormSection}
              privacyPolicySection={privacyPolicySection}
            />
            <SellingForm
              className={`${styles.filterResult} ${
                active === 2 ? styles.activeTabs : null
              }`}
              data={sellingFormSection}
              privacyPolicySection={privacyPolicySection}
            />
          </div>
          <div className={`${styles.topHeadingBlock} flexWrapper`}>
            <div className={styles.headingBlock}>
              <h3>{articlesSection?.articleSubHeading}</h3>
              <h2>{articlesSection?.articleHeading}</h2>
              <div className={styles.block}>
                {articlesSection?.articles?.map(
                  ({ url, buttonText, title }, index) => {
                    return (
                      <div className={styles.content} key={index}>
                        <p>{title}</p>
                        <div className={styles["btn-wrapper"]}>
                          <Link
                            target="_blank"
                            href={url || "#"}
                            className={`${styles.btn} btn`}
                          >
                            {buttonText}
                          </Link>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <SwiperParallax
        silderData={sliderData}
        className={`contactSwiperParallax ${styles.contactParallax}`}
        contentData={[sliderData?.[0]] || []}
      />
    </>
  );
}
