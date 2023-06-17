import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

import { useTimer, useGame } from '../hooks';

import { headerStyle } from '../styles';


const HeaderRight = () => {
    const { value: timerValue } = useTimer();
    const { numBombs } = useGame();

    const formatNumber = (n: number) => `0${n}`.slice(-2); // Format numbers for timer

    return (
        <View style={headerStyle.headerRight}>
            <Text style={headerStyle.headerRightText}>
                {`${numBombs}  `}
                <Image
                    style={{ width: 17, height: 17 }}
                    source={require('../../assets/bomb.png')}
                />
            </Text>
            <Text style={headerStyle.headerRightText}>
                {`${formatNumber(timerValue.min)}:${formatNumber(timerValue.sec)}`}
            </Text>
        </View>
    );
};


export default HeaderRight;
