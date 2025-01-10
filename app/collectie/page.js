"use client";
import { Parallax } from "@/components/Parallax/Parallax";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "js-cookies";
import Link from "next/link";

import Banner from "@/components/Banner";

import placeholerImage from "@/public/car-placeholder.jpg";

import "../../styles/collectionpage.scss";
import "../../styles/highlighter.scss";
import CardDetails from "./component/CardDetails";

import {
  COLLECTION_LABELS_ID,
  DATA_BASE_CAR_ID,
  DEFAULT_FUTURE_CAR_ID,
  PAGES_LINKS,
} from "@/constant";
import { fetchFutureProjectsCategory } from "@/store/common/action";
import {
  ALL_CATEGORY,
  VIEW_COUNT,
  setActiveCategory,
  setIsViewMore,
  setLastPageSlug,
  setShowCount,
} from "@/store/common/commonReducer";
import { fetchCollectionPageData } from "@/store/pages/action";
import { fetchAndStoreData } from "@/utils";
import Image from "next/image";


export default function Collectie() {
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => state?.common?.activeCategory);

  const router = useRouter();
  // const handleRouteClick = (path) => {
  //     // window.scrollTo({ top: 0, behavior: 'smooth' });
  //     setTimeout(() => {
  //         router.push(path)
  //     }, 1000)
  // }

  const {
    collectionButtons,
    collectionCtaSection,
    collectionHeroSection,
    collectionContentSection,
  } = useSelector((state) => state?.pages?.collection?.page) || {};
  const { collectionCarsDataSection, collectionCarCategorySection } =
    useSelector((state) => state?.pages?.collection) || {};
  const { userLanguage } = useSelector((state) => state?.common) || {};
  const [carData, setCarData] = useState([]);
  const [categories, setCategories] = useState([]);
  const showCount = useSelector((state) => state?.common?.showCount);
  const futureCardCategoryData = useSelector(
    (state) => state?.common?.futureCarCategories
  );

  const futureCarCategoriesIds = useMemo(() => {
    return [
      ...futureCardCategoryData?.map((item) => item?.databaseId),
      DEFAULT_FUTURE_CAR_ID,
    ];
  }, [futureCardCategoryData]);

  const filteredData = useMemo(() => {
    return (
      collectionCarsDataSection?.nodes?.filter(
        (data) =>
          !data?.carCategories?.nodes?.find((item) =>
            futureCarCategoriesIds?.includes(item?.databaseId)
          )
      ) || []
    );
  }, [collectionCarsDataSection, futureCarCategoriesIds]);

  const handleTabs = (category) => {
    if (activeCategory === category) {
      return;
    }
    dispatch(setActiveCategory(category));
    dispatch(setShowCount(VIEW_COUNT));
    if (category === ALL_CATEGORY) {
      setCarData(filteredData || []);
    } else {
      const newData = collectionCarsDataSection?.nodes?.filter((data) => {
        return data?.carCategories?.nodes?.some(
          (item) => item.databaseId === category?.databaseId
        );
      });
      setCarData([...newData]);
    }
  };
  const handleViewmore = () => {
    dispatch(setShowCount(carData?.length || VIEW_COUNT));
    dispatch(setIsViewMore(true));
    sessionStorage.removeItem("cardId");
  };
  useEffect(() => {
    if (collectionCarCategorySection?.nodes) {
      setCategories(
        collectionCarCategorySection?.nodes?.filter(
          (item) => !futureCarCategoriesIds?.includes(item?.databaseId)
        )
      );
    }
  }, [collectionCarCategorySection?.nodes, futureCarCategoriesIds]);

  useEffect(() => {
    if (filteredData?.length) {
      setCarData(filteredData);
    }
  }, [
    collectionCarsDataSection?.nodes,
    collectionCarsDataSection,
    futureCarCategoriesIds,
    filteredData,
  ]);

  useEffect(() => {
    Cookies.removeItem(DATA_BASE_CAR_ID);
  }, []);

  useEffect(() => {
    dispatch(fetchCollectionPageData());
    dispatch(fetchFutureProjectsCategory());
  }, [userLanguage, dispatch]);

  let dataRender = 0;

  useEffect(() => {
    fetchAndStoreData();
  }, []);

  const [collectieData, setAboutData] = useState({});
  useEffect(() => {
    const getData = localStorage.getItem("bannerData");
    if (getData) {
      setAboutData(JSON.parse(getData));
    }
  }, []);

  //

  // Infinite Scroll Observer

  const [loading, setLoading] = useState(false); // State to manage loader
  const observerRef = useRef(null);
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          loadMoreData();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, carData]);

  const loadMoreData = () => {
    if (carData.length <= showCount) return;

    setLoading(true);

    // Simulate data loading
    setTimeout(() => {
      dispatch(setShowCount(showCount + 3)); // Increase the show count
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Banner
        className={"collectieBanner"}
        banner
        bgImage={
          collectionHeroSection?.bannerBgImage?.node?.mediaItemUrl ||
          collectieData?.collectie?.banner_bg_image?.url
        }
        headingText={
          collectionHeroSection?.bannerHeading?.map((data) => data?.line) ||
          collectieData?.collectie?.banner_heading?.map(
            (lineObject) => lineObject?.line
          )
        }
        descriptionText={
          collectionHeroSection?.bannerText ||
          collectieData?.collectie?.banner_text
        }
      />
      <section className="carCollectionFilter">
        <div className="container">
          <div className="topHeadingBlock flexWrapper">
            <div className="headingBlock">
              <h3>{collectionContentSection?.contentSubHeading}</h3>
              <h2>{collectionContentSection?.contentHeading}</h2>
            </div>
            <div className="contentBlock">
              <p>{collectionContentSection?.contentText}</p>
            </div>
          </div>
          {categories?.length > 0 && (
            <div className="filterBlock">
              <div className="filterTabs">
                <ul>
                  <li
                    key={1}
                    className={`${
                      activeCategory === ALL_CATEGORY ? "activeheading" : null
                    }`}
                    onClick={() => handleTabs(ALL_CATEGORY)}
                  >
                    {collectionButtons?.viewAll}{" "}
                    {filteredData?.length ? `(${filteredData?.length})` : null}
                  </li>
                  {categories?.map((category, index) => {
                    return (
                      <li
                        key={index}
                        className={`${
                          activeCategory?.databaseId === category?.databaseId
                            ? "activeheading"
                            : null
                        }`}
                        onClick={() => handleTabs(category)}
                      >
                        {category.name} ({category.count || 0})
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className={`filterResult activeTabs`}>
                {categories?.map((category, index) => {
                  if (dataRender >= showCount) return null;

                  if (category.count) {
                    return (
                      <React.Fragment key={index}>
                        {activeCategory === ALL_CATEGORY && (
                          <h3>
                            {category.name} ({category.count || 0})
                          </h3>
                        )}
                        {carData.map((data, carIndex) => {
                          if (dataRender >= showCount) return null;

                          if (
                            category.databaseId ===
                            data?.carCategories?.nodes?.[0]?.databaseId
                          ) {
                            dataRender++;
                            return (
                              <CardDetails
                                data={data}
                                key={carIndex}
                                btnTitle={collectionButtons?.vewModal}
                                categoryId={category.databaseId}
                                categoryName={category.name}
                              />
                            );
                          }

                          return null;
                        })}
                      </React.Fragment>
                    );
                  }

                  return null;
                })}

                {/* Infinite Scroll Sentinel */}
                <div ref={observerRef} style={{ height: "1px" }}></div>

                {/* Loading Spinner */}
                {loading && (
                  <div className="cus-car-loading">
                    <div class="cus-car-loader">
                      <svg
                        class="car"
                        width="102"
                        height="40"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          transform="translate(2 1)"
                          stroke="#fff"
                          fill="none"
                          fill-rule="evenodd"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            class="car__body"
                            d="M47.293 2.375C52.927.792 54.017.805 54.017.805c2.613-.445 6.838-.337 9.42.237l8.381 1.863c2.59.576 6.164 2.606 7.98 4.531l6.348 6.732 6.245 1.877c3.098.508 5.609 3.431 5.609 6.507v4.206c0 .29-2.536 4.189-5.687 4.189H36.808c-2.655 0-4.34-2.1-3.688-4.67 0 0 3.71-19.944 14.173-23.902zM36.5 15.5h54.01"
                            stroke-width="3"
                          />
                          <ellipse
                            class="car__wheel--left"
                            stroke-width="3.2"
                            fill="#FFF"
                            cx="83.493"
                            cy="30.25"
                            rx="6.922"
                            ry="6.808"
                          />
                          <ellipse
                            class="car__wheel--right"
                            stroke-width="3.2"
                            fill="#FFF"
                            cx="46.511"
                            cy="30.25"
                            rx="6.922"
                            ry="6.808"
                          />
                          <path
                            class="car__line car__line--top"
                            d="M22.5 16.5H2.475"
                            stroke-width="3"
                          />
                          <path
                            class="car__line car__line--middle"
                            d="M20.5 23.5H.4755"
                            stroke-width="3"
                          />
                          <path
                            class="car__line car__line--bottom"
                            d="M25.5 9.5h-19"
                            stroke-width="3"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              {/* {showCount < carData?.length && (
                <div className="viewMore">
                  <div className="btnWrapper">
                    <div className="btn" onClick={handleViewmore}>
                      {collectionButtons?.loadMore}
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          )}
        </div>
      </section>
      <section className="bg-white zoomImageContainer ">
        <Parallax speed={1} aspectRatio className="parallaxBgCollectie">
          <picture>
            <source
              media={"(max-width:575px)"}
              srcSet={
                collectionCtaSection?.ctaImageMobile?.node?.mediaItemUrl ||
                placeholerImage.src
              }
            />
            <img
              src={
                collectionCtaSection?.ctaImage?.node?.mediaItemUrl ||
                placeholerImage.src
              }
              alt="slider"
            />
          </picture>
        </Parallax>
      </section>

      <section className="highlighter light alt adviseAlt">
        <div className="container">
          <div className="flexWrapper">
            <h2>{collectionCtaSection?.ctaHeading}</h2>
            <div className="content">
              <p>{collectionCtaSection?.ctaText}</p>
              <div className="btn_wrapper">
                <div className="btnWrapper">
                  <Link href={PAGES_LINKS.CONTACT_SELLING_CAR} className="btn">
                    {collectionCtaSection?.ctaButton1}
                  </Link>
                </div>
              </div>
              {collectionCtaSection?.signatureImage?.node?.mediaItemUrl ? (
                <Image
                  src={collectionCtaSection?.signatureImage?.node?.mediaItemUrl}
                  alt="peter signature"
                  width={292}
                  height={72}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
