import api from '../services/saavnApi';

export const getArtistSongs = async(artistId: string) => {
    const response = await api.get(
        `/artist/${artistId}/songs`
    );
    return response.data;
    
};

export const searchArtists = async (
  query: string
) => {
  const response = await api.get(
    `/search/artists?query=${query}`
  );

  return response.data;
};