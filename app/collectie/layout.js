import { getCollectionPageContentApi } from "@/apiConfig/services";
import { LOCAL_STORAGE, PAGES_KEY } from "@/constant";
import { getPageId } from "@/utils";
import { cookies } from "next/headers";

// Add caching to metadata generation
export async function generateMetadata({ params, searchParams }, parent) {
    try {
        // Cache the metadata for 1 hour (3600 seconds)
        const revalidate = 3600;
        
        const menuCookie = cookies().get(LOCAL_STORAGE.MENUS_KEY);
        const id = getPageId(PAGES_KEY.COLLECTIVE, menuCookie?.value);
        
        // Use Promise.race with a timeout to prevent long-running requests
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 5000);
        });
        
        const { data } = await Promise.race([
            getCollectionPageContentApi(id),
            timeoutPromise
        ]) || {};

        return {
            title: data?.page?.seo?.title,
            description: data?.page?.seo?.metaDesc,
            robots: data?.page?.seo ? `${data?.page?.seo?.metaRobotsNoindex}, ${data?.page?.seo?.metaRobotsNofollow}` : "",
        }
    } catch (error) {
        // Return default metadata if there's an error
        return {
            title: 'Collection',
            description: 'View our collection',
            robots: 'index, follow'
        }
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
