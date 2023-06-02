import React, { useState, useCallback } from 'react';
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
import { useFocusEffect, RouteProp, ParamListBase } from '@react-navigation/native'

// Component that handle the grid display
import Grid from './Grid';

import gStyles from './styles';

// File with all utils function for the algorithm
import {
    createBlankGrid,
    setUpGrid,
    handle0Bomb,
    isOver,
} from './utils';


/* Handle hardware android back button events that should stop timer before changing screen to prevent
 * state chage before unmounting Game component
*/
type HandleReturnProps = { stopTimer: () => boolean | null | undefined };
const HandleReturn = ({ stopTimer }: HandleReturnProps) => {
    useFocusEffect(
        useCallback(() => {
            const onBackPress = stopTimer;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    return null;
};


type GameProps = { route: RouteProp<ParamListBase> };
const Game = (props: GameProps) => {
    const { row, col } = props.route.params as { row: number; col: number };

    const infos = createBlankGrid(row, col);

    // Interval for the timer
    let interval: NodeJS.Timer;

    // Grid
    const [grid, setGrid] = useState(infos[0]);
    // Number of bombs
    const [num, setNum] = useState(infos[1]);
    // Check whether it's the first move of the player
    const [isFirstMove, setIsFirstMove] = useState(true);
    // Text to display once game is over (win or loose)
    const [text, setText] = useState('');
    // Timer
    const [timer, setTimer] = useState({ min: 0, sec: 0 });
    // Y position of the popup (start hidden at the bottom of the screen)
    const [pos, setPos] = useState(new Animated.Value(-180));
    // Scale of the popup for the animation
    const [scale, setScale] = useState(new Animated.Value(1));
    // State if it's possible to click on the grid
    const [canBePressed, setCanBePressed] = useState<'auto' | 'none' | 'box-none' | 'box-only'>('auto');

    // Start the timer or stop it depending on the value of arg
    const startTimer = (bool: boolean) => {
        if (bool) {
            interval = setInterval(() => {
                if (timer.sec === 59) {
                    setTimer({ min: timer.min + 1, sec: 0 });
                } else {
                    setTimer({ min: timer.min, sec: timer.sec + 1 });
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
    }

    // Reset timer to zero
    const resetTimer = () => {
        setTimer({ min: 0, sec: 0 });
    };

    const restart = () => {
        const infos = createBlankGrid(row, col);
        setGrid(infos[0]);
        setNum(infos[1]);
        setIsFirstMove(true);
        Animated.timing(pos, {
            toValue: -180,
            duration: 500,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease)
        }).start(() => {
            setCanBePressed('auto'); // Allow click on the grid
            resetTimer(); // Reset timer for the new game
        });
    }

    // Show popup once game is over
    const showModal = (text: string) => {
        setText(text);
        Animated.sequence([
            // EaseOut animation from the bottom of the screen to the center
            Animated.timing(pos, {
                toValue: Dimensions.get('window').height / 2 - 90,
                duration: 1000,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease)
            }),
            // Pulse animation once popup has appeared
            Animated.timing(scale, {
                toValue: 1.4,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            })
        ]).start(() => setCanBePressed('none')); // Prevent from clicking on the grid when popup show
    }

    // Handle press actions
    const onPress = (x: number, y: number) => {
        let uGrid = grid;
        uGrid[y][x].selected = 1;
        // If it's the first move, set the grid and start the timer
        if (isFirstMove) {
            uGrid = setUpGrid(uGrid, num, x, y);
            startTimer(true);
            setIsFirstMove(false);
        }
        // If it's a bomb, game is lost
        if (uGrid[y][x].type === -1) {
            startTimer(false);
            showModal('You lose :(');
        }
        else {
            // If 0 bomb next to the square, recursivly reveal the other squares
            if (uGrid[y][x].type === 0) {
                uGrid = handle0Bomb(uGrid, x, y);
            }
            // Check if game is over and display the winning message
            if (isOver(uGrid)) {
                startTimer(false);
                showModal('You win !');
            }
        }
        setGrid(uGrid);
    }

    // Handle long press action to place a flag
    const onLongPress = (x: number, y: number) => {
        const uGrid = grid;
        if (uGrid[y][x].selected === 0) uGrid[y][x].selected = 2;
        else uGrid[y][x].selected = 0;
        setGrid(uGrid);
        Vibration.vibrate(200); // Vibrate to confirm that a flag has been placed
    }

    const formatNumber = (n: number) => `0${n}`.slice(-2); // Format numbers for timer

    return (
        <SafeAreaView style={gStyles.container}>

            <View style={gStyles.statusBar}>
                <View style={gStyles.containerStatus}>
                    <View style={styles.subView}>
                        <Text style={gStyles.textStatusBar}>
                            {`${num}  `}
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require('./img/bomb.png')}
                            />
                        </Text>
                    </View>
                    <View style={[styles.subView, { alignItems: 'flex-end' }]}>
                        <Text style={gStyles.textStatusBar}>
                            {`${formatNumber(timer.min)}:${formatNumber(timer.sec)}`}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.grid} pointerEvents={canBePressed}>
                <Grid
                    row={row}
                    col={col}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    grid={grid}
                />
            </View>

            <Animated.View
                style={[
                    styles.animatedView,
                    { bottom: pos }
                ]}
            >
                <Animated.View
                    style={[
                        gStyles.card,
                        { transform: [{ scale }] }
                    ]}
                >
                    <Text style={styles.modalText}>
                        {text}
                    </Text>
                    <TouchableHighlight
                        style={gStyles.openButton}
                        onPress={restart}
                    >
                        <Text style={gStyles.textStyle}>Retry</Text>
                    </TouchableHighlight>
                </Animated.View>
            </Animated.View>

            <HandleReturn stopTimer={() => startTimer(false) as undefined} />

        </SafeAreaView>
    );
};


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


export default Game;
