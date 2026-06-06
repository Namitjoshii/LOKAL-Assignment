import api from "./saavnApi";

export const searchSongs = async (query: string) => {
  const response = await api.get(`/search/songs?query=${query}`);
  return response.data;
};

export const searchArtists = async (query: string) => {
  const response = await api.get(`/search/artists?query=${query}`);
  return response.data;
};

export const getArtistById = async (id: string) => {
  const response = await api.get(`/artists/${id}`);
  return response.data;
};

export const getArtistSongs = async (id: string) => {
  const response = await api.get(`/artists/${id}/songs`);
  return response.data;
};