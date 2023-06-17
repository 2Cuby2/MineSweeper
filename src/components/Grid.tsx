import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleProp,
    ViewStyle,
    Vibration,
} from 'react-native';

import Constants from 'expo-constants';

import { ItemObjectStatus } from '../providers/utils';

import { useGameManager } from '../hooks';


type ItemProps = { pos: { x: number, y: number }; };
const Item = ({ pos }: ItemProps) => {
    const {
        grid,
        revealSquare,
        flagSquare,
    } = useGameManager();

    const item = grid[pos.y][pos.x];

    const onPress = () => revealSquare(pos.x, pos.y);
    const onLongPress = () => {
        flagSquare(pos.x, pos.y);
        Vibration.vibrate(200);
    };

    let disabled = false;
    let content: JSX.Element | null = null;
    let style: StyleProp<ViewStyle> = styles.button;

    if (item.status === ItemObjectStatus.Hidden) {
        content = Constants.expoConfig?.extra?.test
            ? <Text style={styles.text}>{item.isBomb ? 'x' : ' '}</Text>
            : null;
        style = [styles.button, styles.buttonEnabled];
    } else if (item.status === ItemObjectStatus.Revealed) {
        const count = item.nextBombsCount;

        if (item.isBomb) {
            content = (
                <Image
                    style={{ width: 20, height: 20 }}
                    source={require('../../assets/bomb_black.png')}
                />
            );
        } else {
            content = (
                <Text style={styles.text}>{count === 0 ? null : count}</Text>
            );
        }

        disabled = true;
        style = [styles.button, styles.buttonDisabled];
    } else if (item.status === ItemObjectStatus.Flagged) {
        content = (
            <Image
                style={{ width: 20, height: 20 }}
                source={require('../../assets/flag.png')}
            />
        );
        style = [styles.button, styles.buttonEnabled];
    }

    return (
        <View style={styles.item}>
            <TouchableOpacity 
                style={style}
                onPress={onPress}
                onLongPress={onLongPress}
                delayLongPress={300}
                disabled={disabled}
            >
                {content}
            </TouchableOpacity>
        </View>
    );
};


type RowProps = { pos: number; num: number; };
const Row = ({ pos, num }: RowProps) => {
    const rows = [];
    for (let i=0; i < num; i++) {
        rows.push(
            <Item key={i} pos={{ x: i, y: pos }} />
        );
    }
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            {rows}
        </View>
    );
};


type GridProps = { rows: number; cols: number; };
const Grid = ({ rows, cols: colsNum }: GridProps) => {
    const cols = [];
    for (let i=0; i < colsNum; i++) {
        cols.push(
            <Row key={i} pos={i} num={rows} />
        );
    }
    return (
        <View style={{ flex: 1 }}>
            {cols}
        </View>
    );
}


const styles = StyleSheet.create({
    item: {
        flex: 1,
        marginVertical: 2,
        marginHorizontal: 2
    },
    button: {
        flex: 1,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonEnabled: {
        backgroundColor: '#6284E6'
    },
    buttonDisabled: {
        backgroundColor: '#C49FEF'
    },
    text: {
        color: 'black',
    }
});


export default Grid;
