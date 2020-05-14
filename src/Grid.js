import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

import Constants from 'expo-constants';


class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false, // State if button should be disabled
            style: styles.button, // Handle the style of the button depending on the type of box
            content: null // Content to display in the box
        };
    }

    // If grid is updated, update the view of the box depending on the player move
    static getDerivedStateFromProps(props, _) {
        if(props.item.selected === 0) {
            let content = null;
            if(Constants.manifest.extra.test) content = <Text style={styles.text}>{props.item.type}</Text>
            return ({disabled: false, style: [styles.button, styles.buttonEnabled], content: content});
        }
        else if(props.item.selected === 1) {
            let count = props.item.type;
            let content;
            if(count === 0) count = '';
            if(count === -1) {
                content = (
                    <Image
                        style={{width: 20, height: 20}}
                        source={require('./bomb_black.png')}
                    />
                );
            }
            else {
                content = (
                    <Text style={styles.text}>{count}</Text>
                );
            }
            return ({disabled: true, style: [styles.button, styles.buttonDisabled], content: content});
        }
        else if(props.item.selected === 2) {
            let content = (
                <Image
                    style={{width: 20, height: 20}}
                    source={require('./flag.png')}
                />
            );
            return ({content: content});
        }
        return null;
    }

    render() {
        return (
            <View style={styles.item}>
                <TouchableOpacity 
                    style={this.state.style}
                    onPress={() => this.props.onPress(this.props.pos.x, this.props.pos.y)}
                    onLongPress={() => this.props.onLongPress(this.props.pos.x, this.props.pos.y)}
                    disabled={this.state.disabled}
                >
                    {this.state.content}
                </TouchableOpacity>
            </View>
        );
    }
}

const Row = (props) => {
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

export default function Grid(props) {
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
