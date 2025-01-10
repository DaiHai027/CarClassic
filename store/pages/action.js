import { createAsyncThunk } from "@reduxjs/toolkit";

import { getAboutUsPageContentApi, getAdvisePageContentApi, getAutomationPageContentApi, getCarDetailsContentApi, getCollectiePageLabelApi, getCollectionPageContentApi, getContactPageContentApi, getFutureProjectsApi, getHomePageContentApi, getNotFoundPageContentApi, getSpeedPageContentApi } from "@/apiConfig/services";

import { setAboutUsPage, setAdvisePage, setCollectionDetailsPage, setCollectionPage, setContactPage, setHomePage, setNotFoundPage, setSpeedPage } from "./pagesReducer";
import { PAGE_DEFAULT_ID, LANGAUGE, LOCAL_STORAGE, PAGES_KEY, PAGES_LINKS, NOT_FOUND_PATH, DATA_BASE_CAR_ID, DEFAULT_FUTURE_CAR_ID } from "@/constant";
import Cookies from 'js-cookies'

// Cache menu data to avoid repeated localStorage access
let cachedMenu = null;
const getId = (pageKey) => {
    if (!cachedMenu) {
        cachedMenu = JSON.parse(localStorage.getItem(LOCAL_STORAGE.MENUS_KEY)) || [];
    }
    const page = cachedMenu?.filter(item => pageKey === item?.connectedObject?.pageKey?.key);
    return page?.[0]?.connectedObject?.databaseId || PAGE_DEFAULT_ID[pageKey];
}

// Helper to handle API errors consistently
const handleApiError = (error) => {
    console.error('API Error:', error);
    // Add any common error handling here
}

export const fecthHomePageData = createAsyncThunk(
    "fecthHomePageData",
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        try {
            const { data } = await getHomePageContentApi(getId(PAGES_KEY.HOME)) || {};
            data?.page && dispatch(setHomePage(data.page));
        } catch (error) {
            handleApiError(error);
        }
    }
);

export const fecthAboutUsPageData = createAsyncThunk(
    "fecthHomePageData", 
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        try {
            const { data } = await getAboutUsPageContentApi(getId(PAGES_KEY.ABOUT_US)) || {};
            data?.page && dispatch(setAboutUsPage(data.page));
        } catch (error) {
            handleApiError(error);
        }
    }
);

export const fecthAdvisePageData = createAsyncThunk(
    "fecthAdvisePageData",
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        try {
            const { data } = await getAdvisePageContentApi(getId(PAGES_KEY.ADVISE)) || {};
            data?.page && dispatch(setAdvisePage(data.page));
        } catch (error) {
            handleApiError(error);
        }
    }
);

export const fetchCollectionPageData = createAsyncThunk(
    "fetchCollectionPageData",
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const language = localStorage.getItem(LOCAL_STORAGE.LANGUAGE_KEY) || LANGAUGE.DEFAULT_LANGUAGE_CODE;
        
        try {
            // Parallel API calls for better performance
            const [collectionResponse, carDetailsResponse, labelResponse] = await Promise.all([
                getCollectionPageContentApi(getId(PAGES_KEY.COLLECTIVE)),
                getCarDetailsContentApi(language),
                getCollectiePageLabelApi(language)
            ]);

            dispatch(setCollectionPage({ 
                ...collectionResponse.data, 
                ...carDetailsResponse.data, 
                labelData: labelResponse.data 
            }));
        } catch (error) {
            handleApiError(error);
        }
    }
);

export const fetchSpeedPageData = createAsyncThunk(
    "fetchSpeedPageData",
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        try {
            // Parallel API calls
            const [speedResponse, futureProjectsResponse] = await Promise.all([
                getSpeedPageContentApi(getId(PAGES_KEY.SPEED)),
                getFutureProjectsApi(DEFAULT_FUTURE_CAR_ID)
            ]);

            dispatch(setSpeedPage({
                ...speedResponse.data?.page,
                futureProjectsSection: futureProjectsResponse.data?.cars?.nodes
            }));
        } catch (error) {
            handleApiError(error);
        }
    }
);

export const fetchContactPageData = createAsyncThunk(
    "fetchContactPageData",
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        try {
            const { data } = await getContactPageContentApi(getId(PAGES_KEY.CONTACT)) || {};
            data?.page && dispatch(setContactPage(data.page));
        } catch (error) {
            handleApiError(error);
        }
    }
);

export const fetchCollectionDetailsPageData = createAsyncThunk(
    "fetchCollectionDetailsPageData",
    async (payload, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const language = localStorage.getItem(LOCAL_STORAGE.LANGUAGE_KEY) || LANGAUGE.DEFAULT_LANGUAGE_CODE;
        const { slug } = payload;

        dispatch(setCollectionDetailsPage(null));

        try {
            // Parallel API calls
            const [automationResponse, labelResponse] = await Promise.all([
                getAutomationPageContentApi(slug),
                getCollectiePageLabelApi(language)
            ]);

            if (automationResponse.data?.car) {
                const details = automationResponse.data.car;
                const translations = details.translations;
                const newData = translations?.find(item => item?.languageCode === language) || details;
                delete details.translations;
                
                dispatch(setCollectionDetailsPage({
                    ...newData,
                    labelData: labelResponse.data,
                    translations: [...translations, details]
                }));
            } else {
                window.location.href = NOT_FOUND_PATH;
            }
        } catch (error) {
            handleApiError(error);
            window.location.href = NOT_FOUND_PATH;
        }
    }
);

export const fetchNotFoundPageData = createAsyncThunk(
    "fetchNotFounfPageData",
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        try {
            const language = localStorage.getItem(LOCAL_STORAGE.LANGUAGE_KEY) || LANGAUGE.DEFAULT_LANGUAGE_CODE;
            const id = LANGAUGE.DEFAULT_LANGUAGE_CODE === language ? 1356 : 1373;
            
            const { data } = await getNotFoundPageContentApi(id);
            data?.page && dispatch(setNotFoundPage(data.page));
        } catch (error) {
            handleApiError(error);
        }
    }
);
