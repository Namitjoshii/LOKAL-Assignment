import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function FavouritesScreen() {
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
      <Ionicons name="heart-outline" size={70} color="#ff8c1a" />

      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          marginTop: 16,
        }}
      >
        No Favourites Yet
      </Text>

      <Text
        style={{
          textAlign: 'center',
          color: '#777',
          marginTop: 8,
        }}
      >
        Songs marked as favourite will appear here.
      </Text>
    </View>
  );
}