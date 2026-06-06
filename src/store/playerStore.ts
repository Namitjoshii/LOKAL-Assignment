import { create } from 'zustand';
import { Audio } from 'expo-av';

interface PlayerStore {
  currentSong: any;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  recentlyPlayed: any[];
  shuffle: boolean;
  repeat: boolean;
  queue: any[];

  setCurrentSong: (song: any) => void;
  setIsPlaying: (playing: boolean) => void;
  setSound: (sound: Audio.Sound | null) => void;
  addRecentlyPlayed: (song: any) => void;
  setShuffle: (value: boolean) => void;
  setRepeat: (value: boolean) => void;
  setQueue:(songs: any[]) => void;
  
}

export const usePlayerStore =
  create<PlayerStore>((set) => ({
    currentSong: null,
    isPlaying: false,
    sound: null,
    recentlyPlayed: [],
    shuffle: false,
    repeat: false,
    queue: [],

    setQueue:(songs) => set({queue:songs}),
    
    setShuffle: (value) =>
      set({
        shuffle: value,
      }),

    setRepeat: (value) =>
      set({
        repeat: value,
      }),

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
      }),

    addRecentlyPlayed: (song) =>
      set((state) => {
        const filtered =
          state.recentlyPlayed.filter(
            (item) => item.id !== song.id
          );

        return {
          recentlyPlayed: [
            song,
            ...filtered,
          ].slice(0, 10),
        };
      }),
  }));