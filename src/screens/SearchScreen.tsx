import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { searchSongs } from '../services/songService';
import SongCard from '../components/SongCard';
import NotFound from '../components/NotFound';

const SearchScreen = () => {
  const navigation = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<any[]>([]);

  const handleSearch = async () => {
  if (!query.trim()) return;

  try {
    const data = await searchSongs(query);

    console.log("SEARCH QUERY:", query);
    console.log("SEARCH RESPONSE:", JSON.stringify(data, null, 2));

    setSongs(data.data.results || []);
  } catch (error) {
    console.log("SEARCH ERROR:", error);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <TextInput
          placeholder="Search songs..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          style={styles.input}
        />
      </View>

      {songs.length > 0 ? (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={() =>
                navigation.navigate('Player', {
                  song: item,
                })
              }
              onMenuPress={() => {}}
            />
          )}
        />
      ) : (
        query.length > 0 && <NotFound />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
});