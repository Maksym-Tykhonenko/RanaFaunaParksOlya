import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ImageBackground,
  Animated,
  Easing,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const BG = require('../assets/onboard_bg.png');
const LOGO = require('../assets/logo.png');
const SUN = require('../assets/sun.png');

const ONBOARD_1 = require('../assets/onboard1.png');
const ONBOARD_2 = require('../assets/onboard2.png');
const ONBOARD_3 = require('../assets/onboard3.png');
const ONBOARD_4 = require('../assets/onboard4.png');

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

type Step = {
  id: number;
  topType: 'logo' | 'sun';
  welcome: string;
  body: string;
  button: string;
  hero: any;
};

const STEPS: Step[] = [
  {
    id: 1,
    topType: 'logo',
    welcome: 'Welcome to',
    body:
      'Hi!\nTogether we’ll explore the most fascinating animal parks across Canada — one story, one park at a time.\nEvery journey starts with curiosity. Ready?',
    button: 'Start Exploring',
    hero: ONBOARD_1,
  },
  {
    id: 2,
    topType: 'sun',
    welcome: 'Parks Made for You',
    body:
      'Canada is full of incredible wildlife parks — but not every park is for everyone.\n' +
      'I’ll help you find the one that fits your interests, pace, and curiosity.\n' +
      'Just answer a few simple questions, and I’ll do the rest.',
    button: 'How It Works',
    hero: ONBOARD_2,
  },
  {
    id: 3,
    topType: 'sun',
    welcome: 'Four Questions. One Perfect Park.',
    body:
      'I’ll ask you 4 quick questions.\n' +
      'Based on your answers, I’ll match you with a park from the category that suits you best — and surprise you with a unique destination.',
    button: 'Take the Quiz',
    hero: ONBOARD_3,
  },
  {
    id: 4,
    topType: 'sun',
    welcome: 'Stories Along the Way',
    body:
      'Each park has its own story.\n' +
      'I’ll share facts, history, and wildlife moments you won’t find on signs or maps.\n' +
      'Save your favorite parks, return anytime, and let the journey continue.',
    button: 'Enter the Parks',
    hero: ONBOARD_4,
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmall = Math.min(width, height) < 360 || height < 700;

  const [index, setIndex] = useState(0);
  const step = STEPS[index];

  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const heroOpacity = useRef(new Animated.Value(1)).current;
  const heroScale = useRef(new Animated.Value(1)).current;

  const layout = useMemo(() => {
    const statusPad = 40;
    const contentTopOffset = isSmall ? 34 : 44;
    const topPad = statusPad + contentTopOffset;

    const logoH = clamp(height * 0.11, 70, 110);
    const logoW = clamp(width * 0.78, 260, 360);

    const sunS = clamp(width * 0.18, 60, 90);

    const welcomeSize = isSmall ? 20 : 22;
    const bodySize = isSmall ? 13.2 : 14.2;

    const welcomeLine = isSmall ? 24 : 26;
    const bodyLine = isSmall ? 18 : 19;

    const heroH = clamp(height * 0.44, isSmall ? 270 : 310, 520);

    const heroWidth = step.id === 2 ? 0.86 : 0.92;
    const heroExtraScale = step.id === 2 ? 0.94 : 1.0;

    const buttonH = isSmall ? 54 : 58;

    return {
      topPad,
      logoH,
      logoW,
      sunS,
      welcomeSize,
      welcomeLine,
      bodySize,
      bodyLine,
      heroH,
      heroWidth,
      heroExtraScale,
      buttonH,
    };
  }, [width, height, isSmall, step.id]);

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(10);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  useEffect(() => {
    heroOpacity.setValue(0);
    heroScale.setValue(0.985);

    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(heroScale, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, heroOpacity, heroScale]);

  const onNext = () => {
    if (index < STEPS.length - 1) {
      setIndex((v) => v + 1);
    } else {
      navigation.replace('MainMenu');
    }
  };

  const bodyText = useMemo(() => step.body.replace(/\n{2,}/g, '\n'), [step.body]);

  return (
    <View style={styles.root}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay} />

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingTop: layout.topPad, paddingBottom: 22 }]}
        >
          <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>
            <Text style={[styles.welcome, { fontSize: layout.welcomeSize, lineHeight: layout.welcomeLine }]}>
              {step.welcome}
            </Text>

            <View style={styles.topIconWrap}>
              {step.topType === 'logo' ? (
                <Image source={LOGO} resizeMode="contain" style={{ width: layout.logoW, height: layout.logoH }} />
              ) : (
                <Image source={SUN} resizeMode="contain" style={{ width: layout.sunS, height: layout.sunS }} />
              )}
            </View>

            <Text style={[styles.body, { fontSize: layout.bodySize, lineHeight: layout.bodyLine }]}>
              {bodyText}
            </Text>

            <View style={[styles.heroWrap, { height: layout.heroH }]}>
              <Animated.Image
                source={step.hero}
                resizeMode="contain"
                style={[
                  styles.hero,
                  {
                    width: `${layout.heroWidth * 100}%`,
                    opacity: heroOpacity,
                    transform: [{ scale: heroScale }, { scale: layout.heroExtraScale }],
                  },
                ]}
              />
            </View>

            <Pressable style={[styles.btn, { height: layout.buttonH }]} onPress={onNext}>
              <Text style={styles.btnText}>{step.button}</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    justifyContent: 'flex-start',
  },

  content: {
    flex: 1,
    alignItems: 'center',
  },

  welcome: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },

  topIconWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  body: {
    color: 'rgba(255,255,255,0.86)',
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  heroWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 14,
    marginBottom: 14,
  },

  hero: {
    height: '100%',
  },

  btn: {
    width: '92%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffb300',
    borderWidth: 3,
    borderColor: '#ff6a00',
  },

  btnText: {
    color: '#c70000',
    fontWeight: '900',
    fontSize: 16,
  },
});
