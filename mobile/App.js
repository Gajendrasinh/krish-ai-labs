import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ChatScreen from './src/screens/ChatScreen';
import { theme } from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <ChatScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
