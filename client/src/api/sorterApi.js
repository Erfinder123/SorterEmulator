import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sorterApi = createApi({
    reducerPath: "sorterApi",
    baseQuery: fetchBaseQuery({ baseUrl: '/right/',}),
    tagTypes: ["Element"],
    endpoints: (builder) => ({
        getAll: builder.query({
            query: () => ({
                url: '',
                method: "GET",
            }),
            providesTags: ["Element"],
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
    useMoveElementMutation,
} = sorterApi