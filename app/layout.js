import "../styles/globals.scss";
import Route from "@/components/Route";
import Head from "next/head";
import localFont from 'next/font/local'
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import StoreProvider from "@/components/StoreProvider";
import { cookies } from "next/headers";
import { LOCAL_STORAGE, PAGES_KEY } from "@/constant";
import { getPageId } from "@/utils";
import { getHomePageContentApi } from "@/apiConfig/services";
const Avenir = localFont({ src: '../styles/fonts/AvenirLTStd-Roman.otf' })

export async function generateMetadata({ params, searchParams }, parent) {

  try {
    const menuCookie = cookies().get(LOCAL_STORAGE.MENUS_KEY);
    const id = getPageId(PAGES_KEY.HOME, menuCookie?.value);
    const { data } = await getHomePageContentApi(id) || {};
    return {
      title: data?.page?.seo?.title,
      description: data?.page?.seo?.metaDesc,
      robots: data?.page?.seo ? `${data?.page?.seo?.metaRobotsNoindex}, ${data?.page?.seo?.metaRobotsNofollow}` : "",
    }
  } catch (error) {
  }
}
export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <Head>
        <title>Vandenberg</title>
        <meta name="description" content="Classic car" />
        

      </Head>
      <body className={Avenir.className}>
        <>
          <StoreProvider>
            <SmoothScroll>
              <Route>{children}</Route>
            </SmoothScroll>
          </StoreProvider>
        </>
      </body>
    </html>
  );
}
