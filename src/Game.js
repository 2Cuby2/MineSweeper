import React, { Component, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Animated,
    Dimensions,
    Easing,
    Vibration,
    Image,
    BackHandler
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'

// Component that handle the grid display
import Grid from './Grid.js';

import { gStyles } from './styles/styles.js';

// File with all utils function for the algorithm
import { createBlankGrid, setGrid, handle0Bomb, isOver } from './utils/utils.js';


/* Handle hardware android back button events that should stop timer before changing screen to prevent
 * state chage before unmounting Game component
*/
const HandleReturn = ({ stopTimer }) => {
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => stopTimer();
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    return null;
};

export default class Game extends Component {

    constructor(props) {
        super(props);
        let infos = createBlankGrid(props.route.params.row, props.route.params.col);
        this.state = {
            grid: infos[0], // Grid
            num: infos[1], // Number of bombs
            isFirstMove: true, // Check whether it's the first move of the player
            text: '', // Text to display once game is over (win or loose)
            timer: { min: 0, sec: 0 }, // Timer
            pos: new Animated.Value(-180), // Y position of the popup (start hidden at the bottom of the screen)
            scale: new Animated.Value(1), // Scale of the popup for the animation
            canBePressed: 'auto' // State if it's possible to click on the grid
        };
        this.onPress = this.onPress.bind(this);
        this.onLongPress = this.onLongPress.bind(this);
        this.restart = this.restart.bind(this);
    }

    // Set the value of the state variable canBePressed to allow or not click on the grid
    setBePressed(value) { this.setState({ canBePressed: value }); }

    // Restart the game from the beginning
    restart() {
        let infos = createBlankGrid(this.props.route.params.row, this.props.route.params.col);
        this.setState({ grid: infos[0], num: infos[1], isFirstMove: true }, () => {
            // Hide the popup
            Animated.timing(this.state.pos, {
                toValue: -180,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease)
            }).start(() => {
                this.setBePressed('auto'); // Allow click on the grid
                this.resetTimer(); // Reset timer for the new game
            });
        });
    }

    // Start the timer or stop it depending on the value of arg
    startTimer(bool) {
        if (bool) {
            this.interval = setInterval(() => {
                let timer = this.state.timer;
                if (timer.sec === 59) {
                    this.setState({ timer: { min: timer.min + 1, sec: 0 } });
                }
                else {
                    this.setState({ timer: { min: timer.min, sec: timer.sec + 1 } });
                }
            }, 1000);
        }
        else {
            clearInterval(this.interval);
        }
    }

    // Reset timer to zero
    resetTimer() { this.setState({ timer: { min: 0, sec: 0 } }); }

    // Show popup once game is over
    showModal(text) {
        this.setState({ text: text }, () => {
            Animated.sequence([
                // EaseOut animation from the bottom of the screen to the center
                Animated.timing(this.state.pos, {
                    toValue: Dimensions.get('window').height / 2 - 90,
                    duration: 1000,
                    useNativeDriver: false,
                    easing: Easing.out(Easing.ease)
                }),
                // Pulse animation once popup has appeared
                Animated.timing(this.state.scale, {
                    toValue: 1.4,
                    duration: 250,
                    useNativeDriver: false,
                }),
                Animated.timing(this.state.scale, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: false,
                })
            ]).start(() => this.setBePressed('none')); // Prevent from clicking on the grid when popup show
        })
    }

    // Handle press actions
    onPress(x, y) {
        let uGrid = this.state.grid;
        uGrid[y][x].selected = 1;
        // If it's the first move, set the grid and start the timer
        if (this.state.isFirstMove) {
            uGrid = setGrid(uGrid, this.state.num, x, y);
            this.startTimer(true);
            this.setState({ isFirstMove: false });
        }
        // If it's a bomb, game is lost
        if (uGrid[y][x].type === -1) {
            this.startTimer(false);
            this.showModal('You lose :(');
        }
        else {
            // If 0 bomb next to the square, recursivly reveal the other squares
            if (uGrid[y][x].type === 0) {
                uGrid = handle0Bomb(uGrid, x, y);
            }
            // Check if game is over and display the winning message
            if (isOver(uGrid)) {
                this.startTimer(false);
                this.showModal('You win !');
            }
        }
        this.setState({ grid: uGrid });
    }

    // Handle long press action to place a flag
    onLongPress(x, y) {
        let uGrid = this.state.grid;
        if (uGrid[y][x].selected === 0) uGrid[y][x].selected = 2;
        else uGrid[y][x].selected = 0;
        this.setState({ grid: uGrid }, () => Vibration.vibrate(200)); // Vibrate to confirm that a flag has been placed
    }

    render() {

        const formatNumber = number => `0${number}`.slice(-2); // Format numbers for timer

        return (
            <SafeAreaView style={gStyles.container}>

                <View style={gStyles.statusBar}>
                    <View style={gStyles.containerStatus}>
                        <View style={styles.subView}>
                            <Text style={gStyles.textStatusBar}>
                                {`${this.state.num}  `}
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    source={require('./img/bomb.png')}
                                />
                            </Text>
                        </View>
                        <View style={[styles.subView, { alignItems: 'flex-end' }]}>
                            <Text style={gStyles.textStatusBar}>
                                {`${formatNumber(this.state.timer.min)}:${formatNumber(this.state.timer.sec)}`}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.grid} pointerEvents={this.state.canBePressed}>
                    <Grid
                        row={this.props.route.params.row}
                        col={this.props.route.params.col}
                        onPress={this.onPress}
                        onLongPress={this.onLongPress}
                        grid={this.state.grid}
                    />
                </View>

                <Animated.View
                    style={[
                        styles.animatedView,
                        { bottom: this.state.pos }
                    ]}
                >
                    <Animated.View
                        style={[
                            gStyles.card,
                            { transform: [{ scale: this.state.scale }] }
                        ]}
                    >
                        <Text style={styles.modalText}>
                            {this.state.text}
                        </Text>
                        <TouchableHighlight
                            style={gStyles.openButton}
                            onPress={this.restart}
                        >
                            <Text style={gStyles.textStyle}>Retry</Text>
                        </TouchableHighlight>
                    </Animated.View>
                </Animated.View>

                <HandleReturn stopTimer={() => this.startTimer(false)} />

            </SafeAreaView>
        );
    }

}


const styles = StyleSheet.create({
    animatedView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0
    },
    modalText: {
        marginBottom: 25,
        fontSize: 15,
        color: 'black',
        textAlign: 'center'
    },
    grid: {
        flex: 12,
        marginVertical: 2,
        marginHorizontal: 2
    },
    subView: {
        flex: 1,
        justifyContent: 'center'
    }
});
