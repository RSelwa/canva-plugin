import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "./../../utils/db";

export const flimApi = createApi({
  reducerPath: "flimApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      headers.set("Feature-Flag", "blockVisitors");

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBoardList: builder.query<
      {
        boards: any[];
        user: any;
        readerBoards: any[];
        writerBoards: any[];
      },
      null
    >({
      query: () => {
        const uid = auth.currentUser?.uid;
        return `/user/${uid}/boards`;
      },
    }),
  }),
});

export const { useGetBoardListQuery } = flimApi;
