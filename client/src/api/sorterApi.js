import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sorterApi = createApi({
    reducerPath: "sorterApi",
    baseQuery: fetchBaseQuery({ baseUrl: '/right/',}),
    tagTypes: ["Element"],
    endpoints: (builder) => ({
        getAll: builder.query({
            query: ({ pageParam }) => ({
                infiniteQueryOptions: {
                    initialPageParam: 0,
                    getNextPageParam: (lastPage, allPages, lastPageParam) =>
                        lastPage.length === 20
                            ? lastPageParam + 20
                            : undefined,
                },
                url: '',
                method: "GET",
                params: { offset: pageParam },
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
        }),

        sortElements: builder.mutation({
            query: ({ id, lastOneId }) => ({
                url: `/sort/`,
                params: { id },
                method: "PATCH",
                body: { id: lastOneId },
                responseHandler: 'text'
            }),
            invalidatesTags: ["Element"],
        })
    }),
});

export const {
    useGetAllInfiniteQuery,
    useMoveElementMutation,
    useSortElementsMutation,
} = sorterApi