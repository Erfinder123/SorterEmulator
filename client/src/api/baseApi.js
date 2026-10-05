import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({ baseUrl: '/left/',}),
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
    useMoveElementMutation,
} = baseApi
