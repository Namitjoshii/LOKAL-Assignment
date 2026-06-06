import api from "./saavnApi";

export const searchSongs = async (query: string) => {
  const response = await api.get(`/search/songs?query=${query}`);
  return response.data;
};