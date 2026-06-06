import api from '../services/saavnApi';

export const getArtistSongs = async(artistId: string) => {
    const response = await api.get(
        `/artist/${artistId}/songs`
    );
    return response.data;
    
};