import { create } from 'zustand';
import {Audio} from 'expo-av';

interface PlayerStore {
  currentSong: any;
  isPlaying: boolean;
sound: Audio.Sound | null;
  setCurrentSong: (song: any) => void;
  setIsPlaying: (playing: boolean) => void;
  setSound: (sound: Audio.Sound | null) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentSong: null,
  isPlaying: false,
  sound: null,

    setCurrentSong: (song) =>
      set({
        currentSong: song,
      }),

    setIsPlaying: (playing) =>
      set({
        isPlaying: playing,
      }),
      setSound: (sound) =>
      set({
        sound: sound,
      })
  })
);