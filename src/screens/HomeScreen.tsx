import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SongCard from '../components/SongCard';
import { searchSongs } from '../services/songService';
import { usePlayerStore } from '../store/playerStore';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const{setCurrentSong} = usePlayerStore();

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSongs = async () => {
    try {
      setLoading(true);

      const data = await searchSongs('arijit');

      console.log('API DATA:', data);

      setSongs(data.data.results);
    } catch (error) {
      console.log('ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongCard
            song={item}
            onPress={() => {
              navigation.navigate('Player', {
                song: item,
              });
            }}
            onMenuPress={() => {
              console.log('Menu clicked');
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;