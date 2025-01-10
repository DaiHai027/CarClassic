export const LOCAL_STORAGE = {
    LANGUAGE_KEY: 'language',
    MENUS_KEY: 'headerMenus'
}
export const LANGAUGE = {
    DEFAULT_LANGUAGE_CODE: 'nl',
}

export const PAGES_KEY = {
    HOME: "home",
    CONTACT: "contact",
    ABOUT_US: "about",
    ADVISE: "advise",
    SPEED: "speed",
    COLLECTIVE: 'collective',
    NOT_FOUND: "notFound"
};

export const PAGE_DEFAULT_ID = {
    [PAGES_KEY.HOME]: 175,
    [PAGES_KEY.ABOUT_US]: 238,
    [PAGES_KEY.ADVISE]: 248,
    [PAGES_KEY.SPEED]: 255,
    [PAGES_KEY.COLLECTIVE]: 258,
    [PAGES_KEY.CONTACT]: 261,
    [PAGES_KEY.NOT_FOUND]: 262
};

export const CONTACT_FORM_ID = 'contact-form'

export const PAGES_LINKS = {
    HOME: "/",
    ABOUT_US: "/over-ons",
    COLLECTION: "/collectie",
    CONTACT: "/contact",
    CONTACT_WITH_ID: `/contact?form=1/#${CONTACT_FORM_ID}`,
    CONTACT_SELLING_CAR: `/contact?form=2/#${CONTACT_FORM_ID}`,
    ADVISE: "/restauratie",
    SPEED: "/speed",
    getCarDetailsPath: (id) => `/collectie/${id}`

}

export const NOT_FOUND_PATH = "/not-found"

export const DATA_BASE_CAR_ID = 'DATA_BASE_CAR_ID'

export const COLLECTION_LABELS_ID = {
    CONSTRUCTION_YEAR: "602",
    KM_STAND: "608",
    PRICE: "609",
    TYPE: "610",
    ENGINE: "611",
    BODY: "612",
    COLOR: "613",
    STATUS: "614"
}

export const DEFAULT_FUTURE_CAR_ID = 49