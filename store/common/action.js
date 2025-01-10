import { getAppDetailsApi, getFutureProjectCatergoryTrancelations, getFutureProjectsApi, getHeaderMenuApi, getLanguagesApi } from "@/apiConfig/services";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setActiveMenu, setAppDetails, setFutueCarData, setFutureCarCategories, setHaderMenus, setLanguages, setUserLanguage } from "./commonReducer";
import Cookies from "js-cookies";
import store from "../store";
import { DEFAULT_FUTURE_CAR_ID, LANGAUGE, LOCAL_STORAGE, PAGES_LINKS } from "@/constant";

export const fecthLanguageData = createAsyncThunk(
    "fecthLanguagePageData",
    async (payload, thunkAPI) => {
        const { dispatch } = thunkAPI;
        try {
            const { data } = await getLanguagesApi()
            if (data) {
                dispatch(setLanguages(data));
            }
        } catch (error) {
        }
    }
);
export const fetchHeaderMenusData = createAsyncThunk(
    "fetchHeaderMenusData",
    async (payload, thunkAPI) => {
        const { dispatch } = thunkAPI
        try {
            const { data } = await getHeaderMenuApi()
            if (data) {
                const headerMenus = data?.menus?.nodes
                dispatch(setHaderMenus(headerMenus))
            }
        } catch (error) {

        }
    }
)
export const fetchActiveMenu = createAsyncThunk(
    "fetchActiveMenu",
    async (payload, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;

        const saveMenuToStorage = (menu) => {
            const menuString = JSON.stringify(menu);
            localStorage.setItem(LOCAL_STORAGE.MENUS_KEY, menuString);
            Cookies.setItem(LOCAL_STORAGE.MENUS_KEY, menuString, { path: PAGES_LINKS.HOME });
        };

        try {
            const language = localStorage.getItem(LOCAL_STORAGE.LANGUAGE_KEY) || LANGAUGE.DEFAULT_LANGUAGE_CODE;
            const menuString = localStorage.getItem(LOCAL_STORAGE.MENUS_KEY) || "[]";
            const storedMenu = JSON.parse(menuString);

            const menusData = getState().common.headerMenus || [];

            let activeMenu;

            if (menusData.length) {
                const matchedMenu = menusData.find(menu => menu?.name?.toLocaleLowerCase() === language?.toLocaleLowerCase());
                activeMenu = matchedMenu?.menuItems?.nodes || [];
                if (matchedMenu) {
                    activeMenu = matchedMenu?.menuItems?.nodes || [];
                } else {
                    activeMenu = storedMenu;
                }
            } else {
                activeMenu = storedMenu;
            }

            saveMenuToStorage(activeMenu);
            dispatch(setActiveMenu(activeMenu));

        } catch (error) {
            console.error('Error fetching active menu:', error);
        }
    }
);




export const fetchAppDetails = createAsyncThunk(
    "fetchActiveMenu",
    async (payload, thunkAPI) => {
        const { dispatch } = thunkAPI
        try {
            const language = localStorage?.getItem(LOCAL_STORAGE.LANGUAGE_KEY) || LANGAUGE.DEFAULT_LANGUAGE_CODE
            const { data } = await getAppDetailsApi(language);
            dispatch(setAppDetails(data))
        } catch (error) {
        }
    }
)

export const setUserLanguageAction = createAsyncThunk(
    "setUserLanguageAction",
    async (payload, thunkAPI) => {
        const language = payload || LANGAUGE.DEFAULT_LANGUAGE_CODE
        localStorage.setItem(LOCAL_STORAGE.LANGUAGE_KEY, language);
        Cookies.setItem(LOCAL_STORAGE.LANGUAGE_KEY, language);
        thunkAPI.dispatch(fetchAppDetails())
        thunkAPI.dispatch(setUserLanguage(language))
    }
)

export const fetchFutureProjectsCategory = createAsyncThunk(
    "fetchFutureProjectsCategory",
    async (payload, thunkAPI) => {
        const { dispatch } = thunkAPI
        try {
            const { data } = await getFutureProjectCatergoryTrancelations(DEFAULT_FUTURE_CAR_ID);
            dispatch(setFutureCarCategories(data?.carCategory?.translations))
        } catch (error) {
        }
    }
)
export const fetchFutureProjectsData = createAsyncThunk(
    "fetchFutureProjectsData",
    async (payload, thunkAPI) => {
        const { dispatch } = thunkAPI
        try {
            const { data } = await getFutureProjectsApi(payload || DEFAULT_FUTURE_CAR_ID);
            dispatch(setFutueCarData(data?.cars?.nodes))
        } catch (error) {
        }
    }
)