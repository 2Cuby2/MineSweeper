import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import {  NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GameManagerProvider, TimerManagerProvider } from './src/providers';
import {
    HeaderRight,
    Game,
    Settings,
} from './src/components';

import Theme from './src/theme';


const Stack = createNativeStackNavigator();


const App = () => {
    NavigationBar.setBackgroundColorAsync(Theme.colors.primaryDark);
    NavigationBar.setVisibilityAsync('visible');

    return (
        <>
            <StatusBar style="light" translucent={true} />
            <GameManagerProvider>
                <TimerManagerProvider>
                    <NavigationContainer theme={Theme}>
                        <Stack.Navigator
                            screenOptions={{
                                title: 'MineSweeper',
                                headerBackVisible: false,
                                headerTitleStyle: { color: Theme.colors.textLight },
                                headerStyle: { backgroundColor: Theme.colors.primaryDark },
                                animation: 'none',
                            }}
                        >
                            <Stack.Screen name='Settings' component={Settings} />
                            <Stack.Screen name='Game' component={Game} options={{ headerRight: HeaderRight }} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </TimerManagerProvider>
            </GameManagerProvider>
        </>
    );
}


export default App;
