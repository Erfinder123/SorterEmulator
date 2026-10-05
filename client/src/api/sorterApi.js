import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sorterApi = createApi({
    reducerPath: "sorterApi",
    baseQuery: fetchBaseQuery({ baseUrl: '/right/',}),
    tagTypes: ["Element"],
    endpoints: (builder) => ({
        getPage: builder.query({
            query: params => ({ url: '', params }),
            providesTags: ['Element'],
            keepUnusedDataFor: 0,
        }),

        moveElement: builder.mutation({
            query: (element) => ({
                url: `/move`,
                method: "POST",
                body: element,
                responseHandler: 'text'
            }),
        }),

        sortElements: builder.mutation({
            query: ({ id, lastOneId }) => ({
                url: `/sort/`,
                params: { id },
                method: "PATCH",
                body: { id: lastOneId },
                responseHandler: 'text'
            }),
        })
    }),
});

export const {
    useLazyGetPageQuery,
    useMoveElementMutation,
    useSortElementsMutation,
} = sorterApi