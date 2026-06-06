import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const NotFound = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>
        😢
      </Text>

      <Text style={styles.title}>
        Not Found
      </Text>

      <Text style={styles.subtitle}>
        Try another keyword
      </Text>

      <Text style={styles.subtitle}>
      Or write us at @getlokalapp.com
      </Text>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emoji: {
    fontSize: 70,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },

  subtitle: {
    color: 'gray',
    marginTop: 5,
  },
});