import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import {  NavigationContainer, DefaultTheme } from '@react-navigation/native';
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
    NavigationBar.setBackgroundColorAsync('#3346A6');
    NavigationBar.setVisibilityAsync('visible');

    return (
        <>
            <StatusBar style="light" />
            <GameManagerProvider>
                <TimerManagerProvider>
                    <NavigationContainer theme={DefaultTheme}>
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
        </>
    );
}


export default App;
