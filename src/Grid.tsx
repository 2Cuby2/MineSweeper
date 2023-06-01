import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleProp,
    TextStyle,
} from 'react-native';

import Constants from 'expo-constants';

import { Item, Grid } from './utils';


type ItemProps = {
    key: number;
    pos: { x: number, y: number };
    onPress: (x: number, y: number) => void;
    onLongPress: (x: number, y: number) => void;
    item: Item;
};
const Item = (props: ItemProps) => {
    // State if button should be disabled
    const [disabled, setDisabled] = useState(false);
    // Handle the style of the button depending on the type of box
    const [style, setStyle] = useState<StyleProp<TextStyle>>(styles.button);
    // Content to display in the box
    const [content, setContent] = useState<React.JSX.Element | null>(null);

    // If grid is updated, update the view of the box depending on the player move
    useEffect(() => {
        if (props.item.selected === 0) {
            const content = Constants.manifest!.extra!.test
                ? <Text style={styles.text}>{props.item.type}</Text>
                : null;
            setContent(content);
            setStyle([styles.button, styles.buttonEnabled]);
        } else if (props.item.selected === 1) {
            let count = props.item.type;
            let content;
            if (count === 0) count = null;
            if (count === -1) {
                content = (
                    <Image
                        style={{ width: 20, height: 20 }}
                        source={require('./img/bomb_black.png')}
                    />
                );
            } else {
                content = (
                    <Text style={styles.text}>{count}</Text>
                );
            }
            setDisabled(true);
            setStyle([styles.button, styles.buttonDisabled]);
            setContent(content);
        } else if (props.item.selected === 2) {
            const content = (
                <Image
                    style={{width: 20, height: 20}}
                    source={require('./img/flag.png')}
                />
            );
            setContent(content);
        }
    }, [props])

    return (
        <View style={styles.item}>
            <TouchableOpacity 
                style={style}
                onPress={() => props.onPress(props.pos.x, props.pos.y)}
                onLongPress={() => props.onLongPress(props.pos.x, props.pos.y)}
                disabled={disabled}
            >
                {content}
            </TouchableOpacity>
        </View>
    );
};


type RowProps = {
    key: number;
    pos: number;
    num: number;
    onPress: (x: number, y: number) => void;
    onLongPress: (x: number, y: number) => void;
    rowItem: Item[]
};
const Row = (props: RowProps) => {
    let rows = [];
    for(let i=0; i < props.num; i++) {
        rows.push(
            <Item
                key={i}
                pos={{x: i, y: props.pos}}
                onPress={props.onPress}
                onLongPress={props.onLongPress}
                item={props.rowItem[i]}
            />
        );
    }
    return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
            {rows}
        </View>
    );
};


type GridProps = {
    row: number;
    col: number;
    onPress: (x: number, y: number) => void;
    onLongPress: (x: number, y: number) => void;
    grid: Grid;
};
const Grid = (props: GridProps) => {
    let cols = [];
    for(let i=0; i < props.col; i++) {
        cols.push(
            <Row
                key={i}
                pos={i}
                num={props.row}
                onPress={props.onPress}
                onLongPress={props.onLongPress}
                rowItem={props.grid[i]}
            />
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
