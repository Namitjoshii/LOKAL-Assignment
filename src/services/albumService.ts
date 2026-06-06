import api from './saavnApi';

export const searchAlbums = async (
  query: string
) => {
  const response = await api.get(
    `/search/albums?query=${query}`
  );

  return response.data;
};