import React, { useState } from 'react';
import { TouchableHighlight, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-community/picker';

import { gStyles } from './styles/styles.js';


// Picker to get the number of rows and columns to display in the game
const NumberPicker = (props) => {
    let pickerItems = [];
    for(let i=props.min; i <= props.max; i++) {
        pickerItems.push(
            <Picker.Item key={i} label={'' + i} value={i} />
        );
    }
    return (
        <Picker
            selectedValue={props.selectedValue}
            style={{ height: 28, width: 120 }}
            mode='dropdown'
            onValueChange={(itemValue) => props.setValue(itemValue)}
        >
            {pickerItems}
        </Picker>
    );
};

export default function Settings({ navigation }) {

    const [rowNumber, setRowNumber] = useState(7);
    const [colNumber, setColNumber] = useState(15);

    return (
        <SafeAreaView style={gStyles.container}>

            <View style={gStyles.statusBar}>
                <View style={gStyles.containerStatus}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={gStyles.textStatusBar}>
                            MineSweeper
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ flex: 12 }}>
                <View style={[gStyles.card, { marginTop: 60 }]}>
                    <Text style={styles.title}>
                        Settings
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardText}>Number of rows :</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <NumberPicker
                                min={5}
                                max={20}
                                setValue={setColNumber}
                                selectedValue={colNumber}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardText}>Number of columns :</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <NumberPicker
                                min={3}
                                max={10}
                                setValue={setRowNumber}
                                selectedValue={rowNumber}
                            />
                        </View>
                    </View>
                    <Text style={[styles.title, { marginTop: 25 }]}>
                        How to play
                    </Text>
                    <Text style={styles.cardText}>
                        Make a quick press on a square to reveal it.
                    </Text>
                    <Text style={styles.cardText}>
                        Make a long press on a square to place a flag upon it.
                    </Text>
                    <Text style={styles.cardText}>
                        Reveal all the squares without a bomb to win the game.
                    </Text>
                    <Text style={styles.cardText}>
                        Use the number on the revealed squares, that indicates the number of bombs next to it,
                        to guess where the bombs are.
                    </Text>
                    <TouchableHighlight
                            style={[gStyles.openButton, { marginTop: 35 }]}
                            onPress={() => navigation.navigate('Game', { 
                                row: rowNumber,
                                col: colNumber
                            })}
                    >
                        <Text style={gStyles.textStyle}>Play</Text>
                    </TouchableHighlight>
                </View>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    cardText: {
        fontSize: 16,
        alignSelf: 'flex-start',
        marginBottom: 8
    },
    title: {
        alignSelf: 'flex-start',
        color: '#252365',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    }
});