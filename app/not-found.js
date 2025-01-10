import Link from "next/link";

import Image from "next/image";
import "../styles/highlighter.scss";
import "../styles/pageNotFound.scss";
import signatureBig from "../public/signatureBig.png";
import backgroundImage from "../public/newHero.webp";
import { getPageId } from "@/utils";
import { cookies } from "next/headers";
import { getNotFoundPageContentApi } from "@/apiConfig/services";
import { LANGAUGE, LOCAL_STORAGE, PAGES_KEY } from "@/constant";
import NotFoundComponent from "@/components/NotFound/NotFound";

export async function generateMetadata({ params, searchParams }, parent) {
  try {
    const language =
      cookies()?.get(LOCAL_STORAGE.LANGUAGE_KEY)?.value ||
      LANGAUGE.DEFAULT_LANGUAGE_CODE;

    const id = LANGAUGE.DEFAULT_LANGUAGE_CODE === language ? 1356 : 1373;

    const { data } = (await getNotFoundPageContentApi(id)) || {};
    return {
      title: data?.page?.seo?.title || 404,
      description: data?.page?.seo?.metaDesc,
      robots: data?.page?.seo
        ? `${data?.page?.seo?.metaRobotsNoindex}, ${data?.page?.seo?.metaRobotsNofollow}`
        : "",
    };
  } catch (error) {}
}
export default function NotFound() {
  return (
    <>
      <NotFoundComponent />
    </>
  );
}
