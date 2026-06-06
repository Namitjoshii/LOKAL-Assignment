import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { decodeHtml } from '../utils/decodeHtml';
import Ionicons from '@expo/vector-icons/Ionicons';

import { usePlayerStore } from '../store/playerStore';


const MiniPlayer = () => {
    const{ currentSong,isPlaying,sound,setIsPlaying} = usePlayerStore();

    if(!currentSong){
        return null;
    }

    

    return (
        <View style={styles.container}>
            <Image source={{
                uri: currentSong.image?.[2]?.url,
            }}
            style ={styles.image}
            />

            <View style={styles.info}>
                <Text numberOfLines={1}
                style={styles.title}
                >
                    {decodeHtml(currentSong.name)}
                </Text>
            </View>

            <TouchableOpacity 
            onPress={async () => {
                if(!sound) return;
                try{
                    if(isPlaying){
                        await sound.pauseAsync();
                        setIsPlaying(false);
                    }else{
                        await sound.playAsync();
                        setIsPlaying(true);
                    }
                    }catch(error){
                        console.log(error);
                    }
            }}>
                <Ionicons
                name={
                    isPlaying?'pause':'play'
                }
                size={24}
                color="black"
                />
            </TouchableOpacity>
        </View>
    )
}

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  title: {
    fontWeight: '600',
  },
});