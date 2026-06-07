import api from './saavnApi';

export const searchAlbums = async (query: string) => {
  const response = await api.get(`/search/albums?query=${query}`);
  return response.data;
};

export const getAlbumById = async (id: string) => {
  const response = await api.get(`/albums?id=${id}`);  
  return response.data;
};