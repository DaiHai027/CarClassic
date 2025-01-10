import { getAutomationPageContentApi } from "@/apiConfig/services";

// Cache revalidation set to 1 hour to improve performance
export const revalidate = 3600;

export async function generateMetadata({ params }, parent) {
    try {
        // Add caching headers
        const response = await getAutomationPageContentApi(params.Id, {
            next: {
                revalidate: 3600 // Cache for 1 hour
            }
        }) || {};
        const { data } = response;

        return {
            title: data?.car?.seo?.title,
            description: data?.car?.seo?.metaDesc,
            robots: data?.car?.seo ? `${data?.car?.seo?.metaRobotsNoindex}, ${data?.car?.seo?.metaRobotsNofollow}` : "",
        }
    } catch (error) {
        // Return minimal metadata on error
        return {
            title: 'Car Details',
            description: ''
        }
    }
}

// Simplified layout component
const Layout = ({ children }) => children;

export default Layout;
