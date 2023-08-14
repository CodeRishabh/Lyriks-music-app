import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

  export const shazamCoreApi = createApi({
    reducerPath: 'shazamCoreApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "https://shazam.p.rapidapi.com",
        prepareHeaders: (headers) => {
            headers.set("X-RapidAPI-Key", import.meta.env.VITE_SHAZAM_CORE_RAPID_API_KEY)
            headers.set("X-RapidAPI-Host", "shazam.p.rapidapi.com")

            return headers;
        }
    }),
    endpoints: (builder) => ({
        getTopCharts: builder.query({ query: () => '/charts/track' }),
        getCountryList: builder.query({ query: () => '/charts/list' }),
        getCountryTopSongs: builder.query({ query: (listId) => `/charts/track?listId=${listId}` }),
        getSongsBySearch: builder.query({ query: (searchTerm) => `/search?term=${searchTerm}` }),
        getArtistDetails: builder.query({ query: ({artistId}) => `/artists/get-summary?id=${artistId}` }),
        getSongDetails: builder.query({ query: ({ songid }) => `/songs/get-details?key=${songid}` }),
        getSongId: builder.query({ query: ({ songid }) => `/songs/get-count?key=${songid}` }),
        getSongRelated: builder.query({ query: ({ songIdForDetails }) => `/songs/list-recommendations?key=${songIdForDetails}` }),
      }),
    });
    
    export const {
      useGetTopChartsQuery,
      useGetCountryListQuery,
      useGetCountryTopSongsQuery,
      useGetSongsBySearchQuery,
      useGetArtistDetailsQuery,
      useGetSongDetailsQuery,
      useGetSongIdQuery,
      useGetSongRelatedQuery,
    } = shazamCoreApi;
