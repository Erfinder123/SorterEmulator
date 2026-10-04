import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({ baseUrl: '/left/',}),
    tagTypes: ["Element"],
    endpoints: (builder) => ({
        getAll: builder.infiniteQuery({
            infiniteQueryOptions: {
                initialPageParam: 0,
                getNextPageParam: (lastPage, allPages, lastPageParam) =>
                    lastPage.length === 20
                        ? lastPageParam + 20
                        : undefined,
            },
            query: ({ pageParam }) => ({
                url: '',
                method: "GET",
                params: { offset: pageParam },
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
    useGetAllInfiniteQuery,
    useAddElementMutation,
    useMoveElementMutation,
} = baseApi
