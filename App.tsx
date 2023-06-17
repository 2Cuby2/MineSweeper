import React from 'react';
import { useColorScheme } from 'react-native';
import {
    NavigationContainer,
    DarkTheme,
    DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GameManagerProvider, TimerManagerProvider } from './src/providers';
import {
    HeaderRight,
    Game,
    Settings,
} from './src/components';

import { headerStyle } from './src/styles';


const Stack = createNativeStackNavigator();


const App = () => {
    const scheme = useColorScheme();

    return (
        <GameManagerProvider>
            <TimerManagerProvider>
                <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack.Navigator
                        screenOptions={{
                            title: 'MineSweeper',
                            headerBackVisible: false,
                            headerStyle: headerStyle.header,
                            headerTitleStyle: headerStyle.headerTitle,
                            animation: 'none',
                        }}
                    >
                        <Stack.Screen name='Settings' component={Settings} />
                        <Stack.Screen name='Game' component={Game} options={{ headerRight: HeaderRight }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </TimerManagerProvider>
        </GameManagerProvider>
    );
}


export default App;
