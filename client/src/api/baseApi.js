import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clientId } from './clientId.js';

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/left/',
        prepareHeaders: headers => {
            headers.set('X-Client-Id', clientId);
            return headers;
        },
    }),
    tagTypes: ["Element"],
    endpoints: (builder) => ({
        getPage: builder.query({
            query: params => ({ url: '', params }),
            providesTags: ['Element'],
            keepUnusedDataFor: 0,
        }),

        addElement: builder.mutation({
            query: (element) => ({
                url: `/add`,
                method: "POST",
                body: element,
                responseHandler: 'text'
            }),
        }),

        fillElements: builder.mutation({
            query: () => ({
                url: '/fill',
                method: 'POST',
                responseHandler: 'text'
            }),
        }),

        moveElement: builder.mutation({
            query: (element) => ({
                url: `/move`,
                method: "POST",
                body: element,
                responseHandler: 'text'
            }),
        })
    }),
});

export const {
    useLazyGetPageQuery,
    useAddElementMutation,
    useFillElementsMutation,
    useMoveElementMutation,
} = baseApi
