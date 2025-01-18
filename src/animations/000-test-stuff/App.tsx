import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';
import React from "react";
import {Button, View} from "react-native";

export default function App() {
    const width = useSharedValue(100);
    const translateX = useSharedValue<number>(0);


    const animatedStyles = useAnimatedStyle(() => {
        console.log('translateX.value', translateX.value)
        return {
            transform: [{ translateX: withSpring(translateX.value * 2) }],
        }
    });

    const handlePress1 = () => {
        // width.value = width.value + 50;
        width.value = withSpring(width.value + 50);
    };

    const handlePress2 = () => {
        // translateX.value = withSpring(translateX.value + 50);
        translateX.value += 50;
    };

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Animated.View
                style={{
                    width,
                    marginTop: 100,
                    height: 100,
                    backgroundColor: 'violet',
                }}
            />
            <Button onPress={handlePress1} title="Click me" />
            <Animated.View style={[{height: 100, width: 100, backgroundColor: 'violet'}, animatedStyles
                // { transform: [{ translateX }]}
            ]}/>
            <Button onPress={handlePress2} title="Click me" />
        </View>
    );
}