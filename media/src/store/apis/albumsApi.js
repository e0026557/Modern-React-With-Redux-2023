import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { faker } from '@faker-js/faker';

// DEV ONLY!!!
const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

const albumsApi = createApi({
    reducerPath: 'albums',
    baseQuery: fetchBaseQuery({
        baseUrl:
            'https://e0026557-curly-meme-55vj6v4gx4rf4jj4-3005.preview.app.github.dev',
        fetchFn: async (...args) => {
            // REMOVE FOR PRODUCTION
            await pause(1000);
            return fetch(...args);
        },
    }),
    endpoints(builder) {
        return {
            removeAlbum: builder.mutation({
                // album is 3rd arg because we are passing album as the arg in the removeAlbum function
                invalidatesTags: (result, error, album) => {
                    return [
                        {
                            type: 'Album',
                            id: album.id,
                        },
                    ];
                },
                // arg is album in this case
                query: (album) => {
                    return {
                        method: 'DELETE',
                        url: `/albums/${album.id}`,
                    };
                },
            }),
            fetchAlbums: builder.query({
                // arg (3rd arg) is user in this case -> the arg passed into the useFetchAlbumsQuery hook
                // result is the data that we fetched from the backend server -> list of albums in this case
                providesTags: (result, error, user) => {
                    const tags = result.map((album) => {
                        return {
                            type: 'Album',
                            id: album.id,
                        };
                    });

                    tags.push({ type: 'UsersAlbums', id: user.id });
                    return tags;
                },
                query: (user) => {
                    return {
                        url: '/albums',
                        params: {
                            userId: user.id,
                        },
                        method: 'GET',
                    };
                },
            }),
            addAlbum: builder.mutation({
                // arg is user in this case -> arg from the function returned when we call useAddAlbumMutation hook
                invalidatesTags: (result, error, user) => {
                    return [{ type: 'UsersAlbums', id: user.id }];
                },
                query: (user) => {
                    return {
                        url: '/albums',
                        method: 'POST',
                        body: {
                            userId: user.id,
                            title: faker.commerce.productName(),
                        },
                    };
                },
            }),
        };
    },
});

export const {
    useFetchAlbumsQuery,
    useAddAlbumMutation,
    useRemoveAlbumMutation,
} = albumsApi;
export { albumsApi };
