import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}