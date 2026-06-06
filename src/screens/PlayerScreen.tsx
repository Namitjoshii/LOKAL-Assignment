import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { decodeHtml } from '../utils/decodeHtml';
import { SafeAreaView } from 'react-native-safe-area-context';
import ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

const PlayerScreen = () => {
  const route = useRoute<any>();

  const { song } = route.params;

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <View style={styles.header}>
    <TouchableOpacity>
    <Ionicons
    name="arrow-black"
    size={26}
    color="black"
    />
   </TouchableOpacity>

  <TouchableOpacity>
    <Ionicons
    name="ellipsis-horizontal"
    size={26}
    color="black"
    />
  </TouchableOpacity>
</View>
      <Image
        source={{
          uri: song.image?.[2]?.url || song.image?.[2]?.link,
        }}
        style={styles.image}
      />

      <Text style={styles.title}>
        {decodeHtml(song.name)}
      </Text>

      <Text style={styles.artist}>
        {song.primaryArtists}
      </Text>
    </View>
    </SafeAreaView>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  image: {
    width: 320,
    height: 320,
    borderRadius: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
  },

  artist: {
    fontSize: 16,
    color: 'gray',
    marginTop: 8,
  },
  header:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 30,
  }
});