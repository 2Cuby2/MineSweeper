import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react';
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
    BackHandler
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'

import Grid from './Grid';

import { useTimer, useGame } from '../hooks';
import { GameStatus } from '../providers';

import { globalStyle as gStyles } from '../styles';


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


const Game = () => {
    const {
        grid,
        status: gameStatus,
        restart: restartGame,
        revealSquare,
        flagSquare,
    } = useGame();

    const { start: startTimer, reset: resetTimer } = useTimer();

    const cols = grid.length;
    const rows = grid.length ? grid[0].length : 0;

    // Text to display once game is over (win or loose)
    const [text, setText] = useState('');
    // State if it's possible to click on the grid
    const [canBePressed, setCanBePressed] = useState<'auto' | 'none'>('auto');

    // Y position of the popup (start hidden at the bottom of the screen)
    const pos = useRef(new Animated.Value(-180));
    // Scale of the popup for the animation
    const scale = useRef(new Animated.Value(1));

    // Handle game status updates
    useEffect(() => {
        switch (gameStatus) {
            case GameStatus.Started:
                startTimer();
                break;
            case GameStatus.Lost:
                resetTimer();
                showModal('You lose :(');
                break;
            case GameStatus.Won:
                resetTimer();
                showModal('You win !');
                break;
            default:
                break;
        }
    }, [gameStatus]);

    const restart = () => {
        restartGame();
        Animated.timing(pos.current, {
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
            Animated.timing(pos.current, {
                toValue: Dimensions.get('window').height / 2 - 90,
                duration: 1000,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease)
            }),
            // Pulse animation once popup has appeared
            Animated.timing(scale.current, {
                toValue: 1.4,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(scale.current, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            })
        ]).start(() => setCanBePressed('none')); // Prevent from clicking on the grid when popup show
    }

    // Handle press actions
    const onPress = (x: number, y: number) => revealSquare(x, y);

    // Handle long press action to place a flag
    const onLongPress = (x: number, y: number) => {
        flagSquare(x, y);
        Vibration.vibrate(200); // Vibrate to confirm that a flag has been placed
    }

    return (
        <SafeAreaView style={gStyles.container}>

            <View style={styles.grid} pointerEvents={canBePressed}>
                <Grid
                    rows={rows}
                    cols={cols}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    grid={grid}
                />
            </View>

            <Animated.View
                style={[
                    styles.animatedView,
                    { bottom: pos.current }
                ]}
            >
                <Animated.View
                    style={[
                        gStyles.card,
                        { transform: [{ scale: scale.current }] }
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

            <HandleReturn stopTimer={resetTimer as () => undefined} />

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