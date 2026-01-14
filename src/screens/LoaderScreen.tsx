import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, Easing, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

const LOGO = require('../assets/logo.png');

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function LoaderScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmall = Math.min(width, height) < 360 || height < 700;

  const [phase, setPhase] = useState<'spinner' | 'logo'>('spinner');

  const spinnerOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  const timers = useRef<{ t1?: ReturnType<typeof setTimeout>; t2?: ReturnType<typeof setTimeout> }>({});

  const layout = useMemo(() => {
    const boxW = clamp(width * 0.72, 240, 340);
    const maxH = height * 0.74;
    const boxH = clamp(maxH, 360, 560);
    const logoSize = isSmall ? 0.56 : 0.62;
    const spinnerScale = isSmall ? 0.82 : 1.0;

    return { boxW, boxH, logoSize, spinnerScale };
  }, [width, height, isSmall]);

  useEffect(() => {
    timers.current.t1 = setTimeout(() => {
      Animated.timing(spinnerOpacity, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setPhase('logo');
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      });
    }, 3000);
    //timers.current.t2 = setTimeout(() => {
    //  navigation.replace('Onboarding');
    //}, 5000);

    return () => {
      if (timers.current.t1) clearTimeout(timers.current.t1);
      if (timers.current.t2) clearTimeout(timers.current.t2);
    };
  }, [navigation, logoOpacity, spinnerOpacity]);

  const html = useMemo(() => buildSpinnerHTML(layout.spinnerScale), [layout.spinnerScale]);

  return (
    <View style={styles.root}>
      <View style={[styles.centerBox, { width: layout.boxW, height: layout.boxH }]}>
    
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: spinnerOpacity }]}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.web}
            containerStyle={styles.web}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            javaScriptEnabled
            domStorageEnabled
          />
        </Animated.View>

        {phase === 'logo' && (
          <Animated.View style={[StyleSheet.absoluteFillObject, styles.logoWrap, { opacity: logoOpacity }]}>
            <Image
              source={LOGO}
              resizeMode="contain"
              style={{
                width: `${layout.logoSize * 100}%`,
                height: `${layout.logoSize * 100}%`,
              }}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16, 
  },

  centerBox: {
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },

  web: {
    backgroundColor: 'transparent',
  },

  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

function buildSpinnerHTML(scale: number) {
  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      html, body {
        height: 100%;
        width: 100%;
        margin: 0;
        background: transparent;
        overflow: hidden;
      }
      .wrap {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .scale {
        transform: scale(${scale});
        transform-origin: center;
      }

      .loadingspinner {
        --square: 26px;
        --offset: 30px;
        --duration: 2.4s;
        --delay: 0.2s;
        --timing-function: ease-in-out;
        --in-duration: 0.4s;
        --in-delay: 0.1s;
        --in-timing-function: ease-out;
        width: calc( 3 * var(--offset) + var(--square));
        height: calc( 2 * var(--offset) + var(--square));
        padding: 0px;
        margin: 0px;
        position: relative;
      }

      .loadingspinner div {
        display: inline-block;
        background: darkorange;
        border: none;
        border-radius: 2px;
        width: var(--square);
        height: var(--square);
        position: absolute;
        padding: 0px;
        margin: 0px;
      }

      .loadingspinner #square1 {
        left: calc( 0 * var(--offset) );
        top: calc( 0 * var(--offset) );
        animation: square1 var(--duration) var(--delay) var(--timing-function) infinite,
                 squarefadein var(--in-duration) calc(1 * var(--in-delay)) var(--in-timing-function) both;
      }

      .loadingspinner #square2 {
        left: calc( 0 * var(--offset) );
        top: calc( 1 * var(--offset) );
        animation: square2 var(--duration) var(--delay) var(--timing-function) infinite,
                 squarefadein var(--in-duration) calc(1 * var(--in-delay)) var(--in-timing-function) both;
      }

      .loadingspinner #square3 {
        left: calc( 1 * var(--offset) );
        top: calc( 1 * var(--offset) );
        animation: square3 var(--duration) var(--delay) var(--timing-function) infinite,
                 squarefadein var(--in-duration) calc(2 * var(--in-delay)) var(--in-timing-function) both;
      }

      .loadingspinner #square4 {
        left: calc( 2 * var(--offset) );
        top: calc( 1 * var(--offset) );
        animation: square4 var(--duration) var(--delay) var(--timing-function) infinite,
                 squarefadein var(--in-duration) calc(3 * var(--in-delay)) var(--in-timing-function) both;
      }

      .loadingspinner #square5 {
        left: calc( 3 * var(--offset) );
        top: calc( 1 * var(--offset) );
        animation: square5 var(--duration) var(--delay) var(--timing-function) infinite,
                 squarefadein var(--in-duration) calc(4 * var(--in-delay)) var(--in-timing-function) both;
      }

      @keyframes square1 {
        0% { left: calc(0 * var(--offset)); top: calc(0 * var(--offset)); }
        8.333% { left: calc(0 * var(--offset)); top: calc(1 * var(--offset)); }
        100% { left: calc(0 * var(--offset)); top: calc(1 * var(--offset)); }
      }

      @keyframes square2 {
        0% { left: calc(0 * var(--offset)); top: calc(1 * var(--offset)); }
        8.333% { left: calc(0 * var(--offset)); top: calc(2 * var(--offset)); }
        16.67% { left: calc(1 * var(--offset)); top: calc(2 * var(--offset)); }
        25.00% { left: calc(1 * var(--offset)); top: calc(1 * var(--offset)); }
        83.33% { left: calc(1 * var(--offset)); top: calc(1 * var(--offset)); }
        91.67% { left: calc(1 * var(--offset)); top: calc(0 * var(--offset)); }
        100% { left: calc(0 * var(--offset)); top: calc(0 * var(--offset)); }
      }

      @keyframes square3 {
        0%,100% { left: calc(1 * var(--offset)); top: calc(1 * var(--offset)); }
        16.67% { left: calc(1 * var(--offset)); top: calc(1 * var(--offset)); }
        25.00% { left: calc(1 * var(--offset)); top: calc(0 * var(--offset)); }
        33.33% { left: calc(2 * var(--offset)); top: calc(0 * var(--offset)); }
        41.67% { left: calc(2 * var(--offset)); top: calc(1 * var(--offset)); }
        66.67% { left: calc(2 * var(--offset)); top: calc(1 * var(--offset)); }
        75.00% { left: calc(2 * var(--offset)); top: calc(2 * var(--offset)); }
        83.33% { left: calc(1 * var(--offset)); top: calc(2 * var(--offset)); }
        91.67% { left: calc(1 * var(--offset)); top: calc(1 * var(--offset)); }
      }

      @keyframes square4 {
        0% { left: calc(2 * var(--offset)); top: calc(1 * var(--offset)); }
        33.33% { left: calc(2 * var(--offset)); top: calc(1 * var(--offset)); }
        41.67% { left: calc(2 * var(--offset)); top: calc(2 * var(--offset)); }
        50.00% { left: calc(3 * var(--offset)); top: calc(2 * var(--offset)); }
        58.33% { left: calc(3 * var(--offset)); top: calc(1 * var(--offset)); }
        100% { left: calc(3 * var(--offset)); top: calc(1 * var(--offset)); }
      }

      @keyframes square5 {
        0% { left: calc(3 * var(--offset)); top: calc(1 * var(--offset)); }
        50.00% { left: calc(3 * var(--offset)); top: calc(1 * var(--offset)); }
        58.33% { left: calc(3 * var(--offset)); top: calc(0 * var(--offset)); }
        66.67% { left: calc(2 * var(--offset)); top: calc(0 * var(--offset)); }
        75.00% { left: calc(2 * var(--offset)); top: calc(1 * var(--offset)); }
        100% { left: calc(2 * var(--offset)); top: calc(1 * var(--offset)); }
      }

      @keyframes squarefadein {
        0% { transform: scale(0.75); opacity: 0.0; }
        100% { transform: scale(1.0); opacity: 1.0; }
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="scale">
        <div class="loadingspinner" aria-label="Loading">
          <div id="square1"></div>
          <div id="square2"></div>
          <div id="square3"></div>
          <div id="square4"></div>
          <div id="square5"></div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
}
