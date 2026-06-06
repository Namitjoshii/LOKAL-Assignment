import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { decodeHtml } from '../utils/decodeHtml';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Audio} from 'expo-av';
import { useState } from 'react';
import { usePlayerStore } from '../store/playerStore';

const PlayerScreen = () => {
  const route = useRoute<any>();
 const navigation = useNavigation<any>();
const{currentSong,setCurrentSong,isPlaying,setIsPlaying,sound,setSound,} = usePlayerStore();
 

 /*useEffect(() => {
  return sound?() =>{
    sound.unloadAsync();
  }
  :undefined;
 },[sound]); //yeh apan ne memory release krne ke liye use kiya hai
 //jaise agar tu ek baar song 1 krega back krke 2 chalayega toh song 1 wahi rahega 
 //toh isse nahi rahegaa
 */

const { song } = route.params;

console.log("CLICKED SONG:", song.name);
console.log("STORE SONG:", currentSong?.name);
console.log("SOUND EXISTS:", !!sound);

const playSong = async () => {
  try {
    // Same song hai -> Pause / Resume
    if (
      sound &&
      currentSong?.id === song.id
    ) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }

      return;
    }

    // Agar koi aur song pehle se loaded hai
    if (sound) {
      await sound.unloadAsync();
    }

    const audioUrl =
      song.downloadUrl?.[4]?.url ||
      song.downloadUrl?.[0]?.url;
console.log("PLAYING URL:", audioUrl);
    const { sound: newSound } =
      await Audio.Sound.createAsync({
        uri: audioUrl,
      });

    await newSound.playAsync();
    console.log("NEW SONG STARTED:", song.name);

    setSound(newSound);
    setCurrentSong(song);
    setIsPlaying(true);

  } catch (error) {
    console.log('PLAY ERROR:', error);
  }
};
  

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
      <View style={styles.header}>
    <TouchableOpacity onPress ={() => navigation.goBack()}>
    <Ionicons
    name="arrow-back"
    size={22}
    color="black"
    />
   </TouchableOpacity>

  <TouchableOpacity>
    <Ionicons
    name="ellipsis-horizontal-circle-outline"
    size={28}
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

      <Text style={styles.title}
      numberOfLines={1}>
        {decodeHtml(song.name)}
      </Text>

      <Text style={styles.artist}
      numberOfLines={1}>
        {song.primaryArtists}
      </Text>

      <View style={styles.divider} />

      <View style={styles.progressContainer}>
  <View style={styles.progressTrack}>
    <View style={styles.progressFill} />
    <View style={styles.progressThumb} />
  </View>

  <View style={styles.timeRow}>
    <Text >00:35</Text>
    <Text>03:50</Text>
  </View>
</View>

<View style={styles.controls}>
  <Ionicons
    name="play-skip-back"
    size={25}
    color="black"
  />

  <MaterialIcons
    name="replay-10"
    size={27}
    color="black"
  />

  <Pressable 
  style={styles.playButton}
  onPress={playSong}
  >
    <Ionicons
      name={currentSong?.id === song.id && isPlaying? 'pause':'play'}
      size={30}
      color="white"
      style={{marginLeft: 4}}
    />
  </Pressable>

  <MaterialIcons
    name="forward-10"
    size={27}
    color="black"
  />

  <Ionicons
    name="play-skip-forward"
    size={25}
    color="black"
  />
</View>
<View style={styles.bottomActions}>
  <MaterialCommunityIcons
    name="speedometer"
    size={24}
    color="black"
  />

  <MaterialCommunityIcons
    name="timer-outline"
    size={24}
    color="black"
  />

  <MaterialCommunityIcons
    name="cast"
    size={24}
    color="black"
  />

  <Ionicons
    name="ellipsis-vertical"
    size={24}
    color="black"
  />
</View>

<View style={styles.lyricsContainer}>
  <Ionicons
    name="chevron-up"
    size={24}
    color="black"
  />

  <Text style={styles.lyricsText}>
    Lyrics
  </Text>
</View>
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
    borderRadius: 30,
    alignSelf:'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    textAlign:'center',
  },

  artist: {
    fontSize: 16,
    color: 'gray',
    marginTop: 0,
    textAlign:'center',
    paddingHorizontal:20,
  },
  header:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 27,
  marginTop:10
  },
  progressContainer: {
  marginTop: 30,
},

progressTrack: {
  height: 4,
  backgroundColor: '#ddd',
  borderRadius: 10,
  position: 'relative',
},

progressFill: {
  width: '70%',
  height: 4,
  backgroundColor: '#ff8c1a',
  borderRadius: 10,
},

progressThumb: {
  width: 14,
  height: 14,
  borderRadius: 7,
  backgroundColor: '#ff8c1a',
  position: 'absolute',
  right: '28%',
  top: -5,
},

timeRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},

controls: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
  marginLeft:10,
},

playButton: {
  width: 60,
  height: 60,
  borderRadius: 35,
  backgroundColor: '#ff8c1a',
  justifyContent: 'center',
  alignItems: 'center',
},

bottomActions: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: 20,
},

lyricsContainer: {
  alignItems: 'center',
  marginTop: 30,
  marginBottom:20
  
},

lyricsText: {
  fontSize: 17,
  fontWeight: '700',
  marginTop: 4,
},

divider: {
  height: 1,
  backgroundColor: '#EAEAEA',
  marginTop: 0,
  marginBottom: 0,
},
});