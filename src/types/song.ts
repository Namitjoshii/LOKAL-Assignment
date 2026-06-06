export interface Song {
  id: string;
  name: string;
  primaryArtists: string;
  image: {
    quality: string;
    link: string;
  }[];
}