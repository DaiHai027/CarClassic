// "use client";
// import { Parallax } from "@/components/Parallax/Parallax";
// import { usePathname, useRouter } from "next/navigation";
// import React, { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import Cookies from "js-cookies";
// import Link from "next/link";

// import Banner from "@/components/Banner";

// import placeholerImage from "@/public/car-placeholder.jpg";

// import "../../styles/collectionpage.scss";
// import "../../styles/highlighter.scss";

// import {
//   COLLECTION_LABELS_ID,
//   DATA_BASE_CAR_ID,
//   DEFAULT_FUTURE_CAR_ID,
//   PAGES_LINKS,
// } from "@/constant";
// import { fetchFutureProjectsCategory } from "@/store/common/action";
// import {
//   ALL_CATEGORY,
//   VIEW_COUNT,
//   setActiveCategory,
//   setIsViewMore,
//   setLastPageSlug,
//   setShowCount,
// } from "@/store/common/commonReducer";
// import { fetchCollectionPageData } from "@/store/pages/action";
// import Image from "next/image";
// import { fetchAndStoreData } from "@/utils";

// const CardDetails = ({ data, btnTitle, categoryId, categoryName }) => {
//   const pathname = usePathname();
//   const dispatch = useDispatch();
//   const { carData = {} } = data || {};
//   const router = useRouter();
//   const { translatedStrings = [] } =
//     useSelector((state) => state?.pages?.collection?.labelData) || {};

//   const formatText = (text) => {
//     const hasNumber = /\d/.test(text);
//     if (hasNumber) {
//       return `€${text},-`;
//     }
//     return text;
//   };
//   useEffect(() => {
//     const cardId = sessionStorage.getItem("cardId");
//     dispatch(setLastPageSlug(cardId));
//     if (cardId) {
//       const element = document.getElementById(cardId);
//       if (element) {
//         window.scrollTo(0, 0);
//         element.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//           inline: "nearest",
//         });
//       }
//     }
//   }, []);
//   return (
//     <div className="filteredBlock flexWrapper" id={data.slug}>
//       <Link
//         href={PAGES_LINKS.getCarDetailsPath(data?.slug)}
//         className="imgWrapper"
//         onClick={() => sessionStorage.setItem("cardId", data?.slug)}
//       >
//         <Image
//           priority
//           src={
//             carData?.galleryImages?.[0]?.image?.node?.mediaItemUrl ||
//             placeholerImage.src
//           }
//           alt=""
//           height={1000}
//           width={1000}
//         />
//       </Link>
//       <div className="discriptionBlock">
//         <div className="thumbnails">
//           {carData?.galleryImages?.length
//             ? carData?.galleryImages?.map(({ image }, index) => {
//                 if (index > 3 || index === 0) {
//                   return;
//                 }
//                 return (
//                   <div className="thumbnail-item" key={index}>
//                     <Image
//                       priority
//                       src={image?.node?.mediaItemUrl || placeholerImage.src}
//                       alt=""
//                       height={1000}
//                       width={1000}
//                     />
//                   </div>
//                 );
//               })
//             : [1, 2, 3].map((item, index) => {
//                 return (
//                   <div className="thumbnail-item" key={index}>
//                     <Image
//                       priority
//                       src={placeholerImage.src}
//                       alt=""
//                       height={1000}
//                       width={1000}
//                     />
//                   </div>
//                 );
//               })}
//         </div>
//         <div className="carInfo">
//           <h2>{data?.title}</h2>
//           <ul className="aboutCar">
//             {carData?.constructionYear ? (
//               <li>
//                 <span>
//                   {
//                     translatedStrings?.find(
//                       (item) =>
//                         item?.id === COLLECTION_LABELS_ID.CONSTRUCTION_YEAR
//                     )?.translated
//                   }
//                 </span>
//                 <p>{carData?.constructionYear}</p>
//               </li>
//             ) : null}
//             {carData?.kmStand ? (
//               <li>
//                 <span>
//                   {
//                     translatedStrings?.find(
//                       (item) => item?.id === COLLECTION_LABELS_ID.KM_STAND
//                     )?.translated
//                   }
//                 </span>
//                 <p>{carData?.kmStand}</p>
//               </li>
//             ) : null}
//             {/* <li>
//                             <span>{translatedStrings?.find((item) => item?.id === COLLECTION_LABELS_ID.PRICE)?.translated}</span>
//                             {carData?.price ? <p>{formatText(carData?.price)}</p> : null}
//                         </li> */}
//             <li>
//               <span>
//                 {
//                   translatedStrings?.find(
//                     (item) => item?.id === COLLECTION_LABELS_ID.PRICE
//                   )?.translated
//                 }
//               </span>
//               {categoryId === 30 || categoryId === 38 ? (
//                 carData?.price ? (
//                   <p>{formatText(carData?.price)}</p>
//                 ) : null
//               ) : (
//                 <p>{categoryName}</p>
//               )}
//             </li>
//           </ul>

//           <div className="redirectWrapper">
//             <div className="btnWrapper">
//               <Link
//                 href={PAGES_LINKS.getCarDetailsPath(data?.slug)}
//                 onClick={() => sessionStorage.setItem("cardId", data?.slug)}
//                 className="btn"
//               >
//                 {btnTitle}
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function Collectie() {
//   const dispatch = useDispatch();
//   const activeCategory = useSelector((state) => state?.common?.activeCategory);

//   const router = useRouter();
//   // const handleRouteClick = (path) => {
//   //     // window.scrollTo({ top: 0, behavior: 'smooth' });
//   //     setTimeout(() => {
//   //         router.push(path)
//   //     }, 1000)
//   // }

//   const {
//     collectionButtons,
//     collectionCtaSection,
//     collectionHeroSection,
//     collectionContentSection,
//   } = useSelector((state) => state?.pages?.collection?.page) || {};
//   const { collectionCarsDataSection, collectionCarCategorySection } =
//     useSelector((state) => state?.pages?.collection) || {};
//   const { userLanguage } = useSelector((state) => state?.common) || {};
//   const [carData, setCarData] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const showCount = useSelector((state) => state?.common?.showCount);
//   const futureCardCategoryData = useSelector(
//     (state) => state?.common?.futureCarCategories
//   );

//   const futureCarCategoriesIds = useMemo(() => {
//     return [
//       ...futureCardCategoryData?.map((item) => item?.databaseId),
//       DEFAULT_FUTURE_CAR_ID,
//     ];
//   }, [futureCardCategoryData]);

//   const filteredData = useMemo(() => {
//     return (
//       collectionCarsDataSection?.nodes?.filter(
//         (data) =>
//           !data?.carCategories?.nodes?.find((item) =>
//             futureCarCategoriesIds?.includes(item?.databaseId)
//           )
//       ) || []
//     );
//   }, [collectionCarsDataSection, futureCarCategoriesIds]);

//   const handleTabs = (category) => {
//     if (activeCategory === category) {
//       return;
//     }
//     dispatch(setActiveCategory(category));
//     dispatch(setShowCount(VIEW_COUNT));
//     if (category === ALL_CATEGORY) {
//       setCarData(filteredData || []);
//     } else {
//       const newData = collectionCarsDataSection?.nodes?.filter((data) => {
//         return data?.carCategories?.nodes?.some(
//           (item) => item.databaseId === category?.databaseId
//         );
//       });
//       setCarData([...newData]);
//     }
//   };
//   const handleViewmore = () => {
//     dispatch(setShowCount(carData?.length || VIEW_COUNT));
//     dispatch(setIsViewMore(true));
//     sessionStorage.removeItem("cardId");
//   };
//   useEffect(() => {
//     if (collectionCarCategorySection?.nodes) {
//       setCategories(
//         collectionCarCategorySection?.nodes?.filter(
//           (item) => !futureCarCategoriesIds?.includes(item?.databaseId)
//         )
//       );
//     }
//   }, [collectionCarCategorySection?.nodes, futureCarCategoriesIds]);

//   useEffect(() => {
//     if (filteredData?.length) {
//       setCarData(filteredData);
//     }
//   }, [
//     collectionCarsDataSection?.nodes,
//     collectionCarsDataSection,
//     futureCarCategoriesIds,
//     filteredData,
//   ]);

//   useEffect(() => {
//     Cookies.removeItem(DATA_BASE_CAR_ID);
//   }, []);

//   useEffect(() => {
//     dispatch(fetchCollectionPageData());
//     dispatch(fetchFutureProjectsCategory());
//   }, [userLanguage, dispatch]);

//   let dataRender = 0;

//   useEffect(() => {
//     fetchAndStoreData();
//   }, []);

//   const [collectieData, setAboutData] = useState({});
//   useEffect(() => {
//     const getData = localStorage.getItem("bannerData");
//     if (getData) {
//       setAboutData(JSON.parse(getData));
//     }
//   }, []);

//   return (
//     <>
//       <Banner
//         className={"collectieBanner"}
//         banner
//         bgImage={
//           collectionHeroSection?.bannerBgImage?.node?.mediaItemUrl ||
//           collectieData?.collectie?.banner_bg_image?.url
//         }
//         headingText={
//           collectionHeroSection?.bannerHeading?.map((data) => data?.line) ||
//           collectieData?.collectie?.banner_heading?.map(
//             (lineObject) => lineObject?.line
//           )
//         }
//         descriptionText={
//           collectionHeroSection?.bannerText ||
//           collectieData?.collectie?.banner_text
//         }
//       />
//       <section className="carCollectionFilter">
//         <div className="container">
//           <div className="topHeadingBlock flexWrapper">
//             <div className="headingBlock">
//               <h3>{collectionContentSection?.contentSubHeading}</h3>
//               <h2>{collectionContentSection?.contentHeading}</h2>
//             </div>
//             <div className="contentBlock">
//               <p>{collectionContentSection?.contentText}</p>
//             </div>
//           </div>
//           {categories?.length > 0 && (
//             <div className="filterBlock">
//               <div className="filterTabs">
//                 <ul>
//                   <li
//                     key={1}
//                     className={`${
//                       activeCategory === ALL_CATEGORY ? "activeheading" : null
//                     }`}
//                     onClick={() => handleTabs(ALL_CATEGORY)}
//                   >
//                     {collectionButtons?.viewAll}{" "}
//                     {filteredData?.length ? `(${filteredData?.length})` : null}
//                   </li>
//                   {categories?.map((category, index) => {
//                     return (
//                       <li
//                         key={index}
//                         className={`${
//                           activeCategory?.databaseId === category?.databaseId
//                             ? "activeheading"
//                             : null
//                         }`}
//                         onClick={() => handleTabs(category)}
//                       >
//                         {category.name} ({category.count || 0})
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//               <div className={`filterResult activeTabs`}>
//                 {categories?.map((category, index) => {
//                   if (dataRender >= showCount) return null;

//                   if (category.count) {
//                     return (
//                       <React.Fragment key={index}>
//                         {activeCategory === ALL_CATEGORY && (
//                           <h3>
//                             {category.name} ({category.count || 0})
//                           </h3>
//                         )}
//                         {carData.map((data, carIndex) => {
//                           if (dataRender >= showCount) return null;

//                           if (
//                             category.databaseId ===
//                             data?.carCategories?.nodes?.[0]?.databaseId
//                           ) {
//                             dataRender++;
//                             return (
//                               <CardDetails
//                                 data={data}
//                                 key={carIndex}
//                                 btnTitle={collectionButtons?.vewModal}
//                                 categoryId={category.databaseId}
//                                 categoryName={category.name}
//                               />
//                             );
//                           }

//                           return null;
//                         })}
//                       </React.Fragment>
//                     );
//                   }

//                   return null;
//                 })}
//               </div>
//               {showCount < carData?.length && (
//                 <div className="viewMore">
//                   <div className="btnWrapper">
//                     <div className="btn" onClick={handleViewmore}>
//                       {collectionButtons?.loadMore}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>
//       <section className="bg-white zoomImageContainer ">
//         <Parallax speed={1} aspectRatio className="parallaxBgCollectie">
//           <picture>
//             <source
//               media={"(max-width:575px)"}
//               srcSet={
//                 collectionCtaSection?.ctaImageMobile?.node?.mediaItemUrl ||
//                 placeholerImage.src
//               }
//             />
//             <img
//               src={
//                 collectionCtaSection?.ctaImage?.node?.mediaItemUrl ||
//                 placeholerImage.src
//               }
//               alt="slider"
//             />
//           </picture>
//         </Parallax>
//       </section>

//       <section className="highlighter light alt adviseAlt">
//         <div className="container">
//           <div className="flexWrapper">
//             <h2>{collectionCtaSection?.ctaHeading}</h2>
//             <div className="content">
//               <p>{collectionCtaSection?.ctaText}</p>
//               <div className="btn_wrapper">
//                 <div className="btnWrapper">
//                   <Link href={PAGES_LINKS.CONTACT_SELLING_CAR} className="btn">
//                     {collectionCtaSection?.ctaButton1}
//                   </Link>
//                 </div>
//               </div>
//               {collectionCtaSection?.signatureImage?.node?.mediaItemUrl ? (
//                 <Image
//                   src={collectionCtaSection?.signatureImage?.node?.mediaItemUrl}
//                   alt="peter signature"
//                   width={292}
//                   height={72}
//                 />
//               ) : null}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
