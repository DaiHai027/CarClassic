import { getAboutUsPageContentApi } from "@/apiConfig/services";
import { LOCAL_STORAGE, PAGES_KEY } from "@/constant";
import { getPageId } from "@/utils";
import { cookies } from "next/headers";

export async function generateMetadata({ params, searchParams }, parent) {

    try {
        const menuCookie = cookies().get(LOCAL_STORAGE.MENUS_KEY);
        const id = getPageId(PAGES_KEY.ABOUT_US, menuCookie?.value);
        const { data } = await getAboutUsPageContentApi(id) || {};
        return {
            title: data?.page?.seo?.title,
            description: data?.page?.seo?.metaDesc,
            robots: data?.page?.seo ? `${data?.page?.seo?.metaRobotsNoindex}, ${data?.page?.seo?.metaRobotsNofollow}` : "",
        }
    } catch (error) {

    }
}

const Layout = ({ children }) => {

    return (
        <>
            {children}
        </>
    );
};

export default Layout;
