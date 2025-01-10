import { LANGAUGE } from "@/constant";
import { createSlice } from "@reduxjs/toolkit";
export const ALL_CATEGORY = 'ALL';
export const VIEW_COUNT = 3

export const commonSlice = createSlice({
    name: "commonSlice",
    initialState: {
        languages: [],
        headerMenus: [],
        activeMenu: [],
        appDetails: {},
        userLanguage: LANGAUGE.DEFAULT_LANGUAGE_CODE || '',
        showNav: false,
        freshLoad: true,
        isLightBoxOpen: false,
        isAnimationCompleted: true,
        futureCarCategories: [],
        futureCarData: [],
        isViewMore: false,
        activeCategory: ALL_CATEGORY,
        showCount: VIEW_COUNT,
        lastPageSlug:""
    },    
    reducers: {
        setIsLighBoxOpen: (state, { payload }) => {
            state.isLightBoxOpen = payload || false
        },
        setShowNav: (state, action) => {
            state.showNav = action.payload;
        },
        setIsAnimationComplete: (state, action) => {
            state.isAnimationCompleted = action.payload;
        },
        setFreshLoad: (state, action) => {
            state.freshLoad = action.payload;
        },
        setLanguages: (state, action) => {
            state.languages = action.payload?.languages || []
        },
        setHaderMenus: (state, action) => {
            state.headerMenus = action.payload || []
        },
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload || []
        },
        setAppDetails: (state, action) => {
            state.appDetails = action.payload || {}
        },
        setUserLanguage: (state, action) => {
            state.userLanguage = action.payload
        },
        setFutureCarCategories: (state, action) => {
            state.futureCarCategories = action.payload || []
        },
        setFutueCarData: (state, action) => {
            state.futureCarData = action.payload || []
        },
        setIsViewMore: (state, action) => {
            state.isViewMore = action.payload || false
        },
        setActiveCategory: (state, action) => {
            state.activeCategory = action.payload || ALL_CATEGORY
        },
        setShowCount: (state, action) => {
            state.showCount = action.payload || VIEW_COUNT
        },
        setLastPageSlug: (state, action) => {
            state.lastPageSlug = action.payload || ""
        }

    },
});


// Action creators are generated for each case reducer function
export const { setShowCount, setActiveCategory, setIsViewMore, setFutueCarData, setFutureCarCategories, setIsAnimationComplete, setIsLighBoxOpen, setShowNav, setFreshLoad, setLanguages, setHaderMenus, setActiveMenu, setAppDetails, setUserLanguage,setLastPageSlug } = commonSlice.actions;

export default commonSlice.reducer;

export const selectFutureCarCategories = (state) => state?.common?.futureCarCategories
