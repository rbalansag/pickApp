import { Dimensions } from 'react-native';
import { Colors, ConnectionStatusBar, Image, Text, View } from 'react-native-ui-lib';

import React from 'react';

const SplashScreen = (props) => {
    const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
    return (
        <View center height={windowHeight} width={windowWidth}>

            <View flexG center>
                <Text text40BO size center>Pick App</Text>
                <Text text50S size center marginT20>{props?.label}</Text>
            </View>

            <View marginB-50 absB>
                {props?.description && (
                    <View marginT-30>
                        <Text text50S size center marginT20>{props?.description.label}</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

export default SplashScreen;