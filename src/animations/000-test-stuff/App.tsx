import Animated, {
    Easing,
    ReduceMotion,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue, withDecay, withDelay,
    withRepeat, withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import React, {useEffect} from "react";
import {Button, ScrollView, StyleSheet, Text, View} from "react-native";
import Svg, {Circle} from "react-native-svg";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// const duration = 2000;
const boxWidth = 120;
const OFFSET = 20;
const TIME = 150;
const DELAY = 400;

const SIZE = 120;
const BOUNDARY_OFFSET = 50;

export default function App() {
    const width = useSharedValue(100);
    const translateX = useSharedValue<number>(0);
    const defaultAnim = useSharedValue<number>(boxWidth / 2 - 160);
    const linear = useSharedValue<number>(boxWidth / 2 - 160);
    const r = useSharedValue(10);
    const offset = useSharedValue<number>(0)
    const pressed = useSharedValue<boolean>(false);
    const gestureOffset = useSharedValue<number>(0);

    const animatedStyles = useAnimatedStyle(() => {
        console.log('translateX.value', translateX.value)
        return {
            transform: [{ translateX: withSpring(translateX.value * 2) }],
        }
    });
    const animatedDefault = useAnimatedStyle(() => ({
        transform: [{ translateX: defaultAnim.value }],
    }));
    const animatedChanged = useAnimatedStyle(() => ({
        transform: [{ translateX: linear.value }],
    }));
    const style = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value }],
    }));
    const animatedStylesGesture = useAnimatedStyle(() => ({
        backgroundColor: pressed.value ? '#FFE04B' : '#B58DF1',
        transform: [{ scale: withTiming(pressed.value ? 1.2 : 1) }],
    }));
    const animatedStylesPan = useAnimatedStyle(() => ({
        transform: [
            { translateX: gestureOffset.value },
            { scale: withTiming(pressed.value ? 1.2 : 1) },
        ],
        backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
    }));

    const animatedProps = useAnimatedProps(() => ({
        r: withSpring(r.value),
    }));

    const handlePress1 = () => {
        // width.value = width.value + 50;
        width.value = withSpring(width.value + 50);
    };

    const handlePress2 = () => {
        // translateX.value = withSpring(translateX.value + 50);
        translateX.value += 50;
    };

    const handlePress3 = () => {
        r.value += 10;
    };

    const handlePress4 = () => {
        // offset.value = withTiming(OFFSET);
        // offset.value = withRepeat(withTiming(OFFSET), 5, false);
        offset.value = withDelay(
            DELAY,
            withSequence(
                // start from -OFFSET
                withTiming(-OFFSET, { duration: TIME / 2 }),
                // shake between -OFFSET and OFFSET 5 times
                withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true),
                // go back to 0 at the end
                withTiming(0, { duration: TIME / 2 })
            )
        );
    };

    useEffect(() => {
        linear.value = withRepeat(
            withTiming(-linear.value, {
                duration: 2000,
                easing: Easing.bounce,
                reduceMotion: ReduceMotion.System,
            }),
            -1,
            true
        );
        defaultAnim.value = withRepeat(
            withSpring(-defaultAnim.value, {
                mass: 1, // how hard is it to make an object move and to bring it to a stop
                stiffness: 100, // how bouncy the spring is
                damping: 5, // Higher damping means the spring will come to rest faster
                reduceMotion: ReduceMotion.Never
            }),
            -1,
            true
        );
    }, []);

    const tap = Gesture.Tap()
        .onBegin(() => {
            pressed.value = true;
        })
        .onFinalize(() => {
            pressed.value = false;
        });

    // const pan = Gesture.Pan()
    //     .onBegin(() => {
    //         pressed.value = true;
    //     })
    //     .onChange((event) => {
    //         gestureOffset.value = event.translationX;
    //     })
    //     .onFinalize(() => {
    //         gestureOffset.value = withSpring(0);
    //         pressed.value = false;
    //     });

    const pan2 = Gesture.Pan()
        .onChange((event) => {
            gestureOffset.value += event.changeX;
        })
        .onFinalize((event) => {
            gestureOffset.value = withDecay({
                velocity: event.velocityX,
                rubberBandEffect: true,
                clamp: [
                    -(width.value / 2) + SIZE / 2 + BOUNDARY_OFFSET,
                    width.value / 2 - SIZE / 2 - BOUNDARY_OFFSET,
                ],
            });
        });

    return (
        <ScrollView contentContainerStyle={{alignItems: 'center', paddingBottom: 30}} >
            <Animated.View
                style={{
                    width,
                    marginTop: 100,
                    height: 100,
                    backgroundColor: 'violet',
                }}
            />
            <Button onPress={handlePress1} title="Change width" />
            <Animated.View style={[{height: 100, width: 100, backgroundColor: 'violet'}, animatedStyles
                // { transform: [{ translateX }]}
            ]}/>
            <Button onPress={handlePress2} title="Translate X" />
            <Svg
                style={{
                    width: 100,
                    height: 100,
                }}
            >
                <AnimatedCircle cx="50" cy="50" animatedProps={animatedProps} fill="blue" />
            </Svg>
            <Button onPress={handlePress3} title="Grow" />
            <View style={{marginBottom: 20, height: 1, backgroundColor: 'black', width: 300}} />
            <View style={styles.container}>
                <Animated.View style={[styles.box, animatedDefault]}>
                    <Text style={styles.text}>inout</Text>
                </Animated.View>
                <Animated.View style={[styles.box, animatedChanged]}>
                    <Text style={styles.text}>linear</Text>
                </Animated.View>
            </View>
            <View style={{marginBottom: 30, height: 1, backgroundColor: 'black', width: 300}} />
            <Animated.View style={[styles.box, style]} />
            <Button title="shake" onPress={handlePress4} />
            <View style={{marginBottom: 30, height: 1, backgroundColor: 'black', width: 300}} />
            <GestureHandlerRootView style={styles.container}>
                <View style={styles.container}>
                    <GestureDetector gesture={tap}>
                        <Animated.View style={[styles.circle, animatedStylesGesture]} />
                    </GestureDetector>
                    <GestureDetector gesture={pan2}>
                        <Animated.View style={[styles.circle, animatedStylesPan]} />
                    </GestureDetector>
                </View>
            </GestureHandlerRootView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    box: {
        height: 80,
        width: 80,
        margin: 20,
        borderWidth: 1,
        borderColor: '#b58df1',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#b58df1',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    circle: {
        height: 120,
        width: 120,
        borderRadius: 500,
    },
});