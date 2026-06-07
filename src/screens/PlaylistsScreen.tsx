import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PlaylistsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
      }}
    >
      <Ionicons
        name="musical-notes-outline"
        size={70}
        color="#ff8c1a"
      />

      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          marginTop: 16,
        }}
      >
        No Playlists
      </Text>

      <Text
        style={{
          textAlign: 'center',
          color: '#777',
          marginTop: 8,
        }}
      >
        Create and manage playlists here.
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: '#ff8c1a',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 25,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          Create Playlist
        </Text>
      </TouchableOpacity>
    </View>
  );
}