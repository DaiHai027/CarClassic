import { configureStore } from '@reduxjs/toolkit'
import pages from './pages/pagesReducer'
import common from './common/commonReducer';
import { createLogger } from "redux-logger";
import { combineReducers } from 'redux'
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore';
// import { createWrapper, HYDRATE } from 'next-redux-wrapper';

const logger = createLogger({
  collapsed: true,
});

const rootReducer = combineReducers({
  pages,
  common,
});

const persistConfig = {
  key: "CLASSIC_CAR",
  storage,
  whitelist: ['pages', 'common']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(process.env.NODE_ENV === "development" ? logger :[]),
    devTools: process.env.NODE_ENV === "development",
  });

  const persistor = persistStore(store);
  store.__persistor = persistor; // N.B. attach the persistor to the store object

  return store;
};

// export const wrapper = createWrapper(makeStore, { debug: true });

export default makeStore;
