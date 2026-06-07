import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PlayerScreen from '../screens/PlayerScreen';
import ArtistDetailScreen from '../screens/ArtistScreen';
import AlbumScreen from '../screens/AlbumScreen';

// Placeholder screens
import { View, Text } from 'react-native';
const FavouritesScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: '600', color: '#888' }}>
      Favourites Coming Soon
    </Text>
  </View>
);
const PlaylistsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: '600', color: '#888' }}>
      Playlists Coming Soon
    </Text>
  </View>
);
const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: '600', color: '#888' }}>
      Settings Coming Soon
    </Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home stack — Player aur Artist bhi iske andar
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
      <Stack.Screen name="Artist" component={ArtistDetailScreen} />
      <Stack.Screen name="Album" component={AlbumScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#ff8c1a',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, any> = {
            HomeTab:      focused ? 'home'          : 'home-outline',
            Favourites:   focused ? 'heart'         : 'heart-outline',
            Playlists:    focused ? 'musical-notes' : 'musical-notes-outline',
            Settings:     focused ? 'settings'      : 'settings-outline',
          };
          return (
            <Ionicons
              name={icons[route.name]}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ tabBarLabel: 'Favourites' }}
      />
      <Tab.Screen
        name="Playlists"
        component={PlaylistsScreen}
        options={{ tabBarLabel: 'Playlists' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}