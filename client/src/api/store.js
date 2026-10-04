import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi.js';
import { sorterApi } from './sorterApi.js';

export { Provider } from 'react-redux';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [sorterApi.reducerPath]: sorterApi.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(baseApi.middleware, sorterApi.middleware),
});
