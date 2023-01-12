// Note: '@reduxjs/toolkit/query' gives a version of createApi that DOES NOT create custom hooks (be careful of typo)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { faker } from '@faker-js/faker';

const photosApi = createApi({
    reducerPath: 'photos',
    baseQuery: fetchBaseQuery({
        baseUrl:
            'https://e0026557-curly-meme-55vj6v4gx4rf4jj4-3005.preview.app.github.dev/',
    }),
    endpoints(builder) {
        return {
            fetchPhotos: builder.query({
                providesTags: (result, error, album) => {
                    const tags = result.map((photo) => {
                        return {
                            type: 'Photo',
                            id: photo.id,
                        };
                    });

                    tags.push({ type: 'AlbumPhoto', id: album.id });
                    return tags;
                },
                // query for photos from an album
                query: (album) => {
                    return {
                        url: '/photos',
                        params: {
                            albumId: album.id,
                        },
                        method: 'GET',
                    };
                },
            }),
            addPhoto: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [
                        {
                            type: 'AlbumPhoto',
                            id: album.id,
                        },
                    ];
                },
                query: (album) => {
                    return {
                        url: '/photos',
                        body: {
                            albumId: album.id,
                            // Get random image url from faker library
                            url: faker.image.abstract(150, 150, true),
                        },
                        method: 'POST',
                    };
                },
            }),
            removePhoto: builder.mutation({
                invalidatesTags: (result, error, photo) => {
                    return [
                        {
                            type: 'Photo',
                            id: photo.id,
                        },
                    ];
                },
                query: (photo) => {
                    return {
                        url: `/photos/${photo.id}`,
                        method: 'DELETE',
                    };
                },
            }),
        };
    },
});

export const {
    useFetchPhotosQuery,
    useAddPhotoMutation,
    useRemovePhotoMutation,
} = photosApi;

export { photosApi };
