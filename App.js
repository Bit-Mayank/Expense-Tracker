import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './src/navigation/Navigator';
import { UserPreferences } from './src/context/UserPreferences';

export default function App() {
  return (
    <UserPreferences>
      <Navigator />
    </UserPreferences>
  );
}