import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({ baseUrl: '/left/',}),
    tagTypes: ["Element"],
    endpoints: (builder) => ({
        getAll: builder.query({
            query: () => ({
                url: '',
                method: "GET",
            }),
            providesTags: ["Element"],
        }),

        addElement: builder.mutation({
            query: (element) => ({
                url: `/add`,
                method: "POST",
                body: element,
                responseHandler: 'text'
            }),
            invalidatesTags: ["Element"],
        }),

        moveElement: builder.mutation({
            query: (element) => ({
                url: `/move`,
                method: "POST",
                body: element,
                responseHandler: 'text'
            }),
            invalidatesTags: ["Element"],
        })
    }),
});

export const {
    useGetAllQuery,
    useAddElementMutation,
    useMoveElementMutation,
} = baseApi
