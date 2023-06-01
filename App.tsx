import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Game from './src/Game.js'; // Game component
import Settings from './src/Settings.js'; // Settings component


const Stack = createStackNavigator();


const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Settings' component={Settings} />
                <Stack.Screen name='Game' component={Game} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default App;
