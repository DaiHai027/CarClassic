const { LOCAL_STORAGE, LANGAUGE } = require("@/constant")
const { cookies } = require("next/headers");
const { getPageId } = require(".");

const useServerSideCookies = (pageKey) => {

    const menuString = cookies().get(LOCAL_STORAGE.MENUS_KEY)?.value;
    const languageCode = cookies().get(LOCAL_STORAGE.LANGUAGE_KEY)?.value || LANGAUGE.DEFAULT_LANGUAGE_CODE;
    const menu = menuString ? JSON.parse(menuString) : [];
    const id = getPageId(pageKey, menu);
    return { id, menu, languageCode };

}
export default useServerSideCookies