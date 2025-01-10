import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { COLLECTION_LABELS_ID, PAGES_LINKS } from "@/constant";
import { setLastPageSlug } from "@/store/common/commonReducer";
import { useEffect, memo, useMemo, forwardRef } from "react";
import placeholerImage from "@/public/car-placeholder.jpg";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Optimized thumbnail component with lower quality and size
const ThumbnailImage = forwardRef(({ src, alt }, ref) => (
  <Image
    ref={ref}
    src={src}
    alt={alt}
    height={400}
    width={400}
    quality={60}
  />
));

ThumbnailImage.displayName = 'ThumbnailImage';

// Optimized main image component
const MainImage = forwardRef(({ src, alt }, ref) => (
  <Image
    ref={ref}
    priority
    src={src}
    alt={alt}
    height={800}
    width={800}
    quality={75}
  />
));

MainImage.displayName = 'MainImage';

const CardDetails = forwardRef(({ data, btnTitle, categoryId, categoryName }, ref) => {
  const dispatch = useDispatch();
  const { carData = {} } = data || {};
  const { translatedStrings = [] } = useSelector((state) => state?.pages?.collection?.labelData) || {};

  const formatText = useMemo(() => (
    (text) => /\d/.test(text) ? `€${text},-` : text
  ), []);

  const router = useRouter();

  // Prefetch only when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          router.prefetch(PAGES_LINKS.getCarDetailsPath(data?.slug));
        }
      });
    });
    
    if (ref?.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [data?.slug, router, ref]);

  const handleCardClick = () => {
    sessionStorage.setItem("cardId", data?.slug);
  };

  // Run scroll into view only once on mount
  useEffect(() => {
    const cardId = sessionStorage.getItem("cardId");
    if (cardId) {
      dispatch(setLastPageSlug(cardId));
      requestAnimationFrame(() => {
        const element = document.getElementById(cardId);
        element?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      });
    }
  }, []);

  const thumbnails = useMemo(() => {
    const maxThumbnails = 3;
    const thumbnailCount = carData?.galleryImages?.length ? 
      carData.galleryImages.slice(1, maxThumbnails + 1).map(({ image }, index) => (
        <div className="thumbnail-item" key={index}>
          <ThumbnailImage
            src={image?.node?.mediaItemUrl || placeholerImage.src}
            alt="Car thumbnail"
          />
        </div>
      )) :
      Array(maxThumbnails).fill().map((_, index) => (
        <div className="thumbnail-item" key={index}>
          <ThumbnailImage
            src={placeholerImage.src}
            alt="Placeholder"
          />
        </div>
      ));
    return thumbnailCount;
  }, [carData?.galleryImages]);

  const getTranslatedLabel = useMemo(() => (
    (labelId) => translatedStrings?.find((item) => item?.id === labelId)?.translated
  ), [translatedStrings]);

  const mainCarImage = useMemo(() => (
    carData?.galleryImages?.[0]?.image?.node?.mediaItemUrl || placeholerImage.src
  ), [carData?.galleryImages]);

  return (
    <div className="filteredBlock flexWrapper" id={data.slug} ref={ref}>
      <Link href={PAGES_LINKS.getCarDetailsPath(data?.slug)} scroll={false} onClick={handleCardClick}>
        <div className="imgWrapper">
          <MainImage
            src={mainCarImage}
            alt={data?.title || "Car image"}
          />
        </div>
      </Link>
      <div className="discriptionBlock">
        <div className="thumbnails">{thumbnails}</div>
        <div className="carInfo">
          <h2>{data?.title}</h2>
          <ul className="aboutCar">
            {carData?.constructionYear && (
              <li>
                <span>{getTranslatedLabel(COLLECTION_LABELS_ID.CONSTRUCTION_YEAR)}</span>
                <p>{carData.constructionYear}</p>
              </li>
            )}
            {carData?.kmStand && (
              <li>
                <span>{getTranslatedLabel(COLLECTION_LABELS_ID.KM_STAND)}</span>
                <p>{carData.kmStand}</p>
              </li>
            )}
            <li>
              <span>{getTranslatedLabel(COLLECTION_LABELS_ID.PRICE)}</span>
              {(categoryId === 30 || categoryId === 38) ? (
                carData?.price && <p>{formatText(carData.price)}</p>
              ) : (
                <p>{categoryName}</p>
              )}
            </li>
          </ul>

          <div className="redirectWrapper">
            <div className="btnWrapper">
              <Link href={PAGES_LINKS.getCarDetailsPath(data.slug)} scroll={false} onClick={handleCardClick}>
                <div className="btn">{btnTitle}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CardDetails.displayName = 'CardDetails';

export default CardDetails;
