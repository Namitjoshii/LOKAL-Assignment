import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { decodeHtml } from '../utils/decodeHtml';

const SuggestedContent = () => {
  const navigation = useNavigation<any>();

  const { recentlyPlayed } =
    usePlayerStore();
    

const artists = recentlyPlayed
  .flatMap(song => song.artists?.primary || [])
  .filter(
    (artist, index, self) =>
      index ===
      self.findIndex(
        a => a.id === artist.id
      )
  );

  return (
    <View style={styles.container}>

      <View style={styles.sectionHeader}>
        <Text style={styles.heading}>
          Recently Played
        </Text>

        <TouchableOpacity>
          <Text style={styles.seeAll}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recentlyPlayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                'Player',
                {
                  song: item,
                }
              )
            }
          >
            <Image
              source={{
                uri:
                  item.image?.[2]?.url ||
                  item.image?.[2]?.link,
              }}
              style={styles.image}
            />

            <Text
              numberOfLines={1}
              style={styles.title}
            >
              {decodeHtml(item.name)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {recentlyPlayed.length === 0 && (
        <Text style={styles.empty}>
          Play some songs first 🎵
        </Text>
      )}

    <View style={styles.artistSection}>
  <View style={styles.sectionHeader}>
    <Text style={styles.heading}>
      Artists
    </Text>

    <TouchableOpacity>
      <Text style={styles.seeAll}>
        See All
      </Text>
    </TouchableOpacity>
  </View>

  <FlatList
    horizontal
    data={artists}
    keyExtractor={(item) => item.id}
    showsHorizontalScrollIndicator={false}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.artistCard}
      >
        <Image
          source={{
            uri:
              item.image?.[2]?.url,
          }}
          style={styles.artistImage}
        />

        <Text
          numberOfLines={1}
          style={styles.artistName}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    )}
  />
</View>
  

    </View>
  );
};

export default SuggestedContent;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
  },

  seeAll: {
    color: '#ff8c1a',
    fontWeight: '600',
  },

  card: {
    width: 140,
    marginLeft: 15,
  },

  image: {
    width: 140,
    height: 140,
    borderRadius: 16,
  },

  title: {
    marginTop: 8,
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: 'gray',
  },
  artistSection: {
  marginTop: 25,
},

artistCard: {
  width: 100,
  marginLeft: 15,
  alignItems: 'center',
},

artistImage: {
  width: 90,
  height: 90,
  borderRadius: 45,
},

artistName: {
  marginTop: 8,
  textAlign: 'center',
},
});