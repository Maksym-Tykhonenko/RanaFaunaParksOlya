import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Share,
  useWindowDimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const WILD_FACTS = [
  "Canada has over 40 national parks protecting wildlife and landscapes.",
  "Banff National Park is Canada’s oldest national park, founded in 1885.",
  "Canada is home to more than 70,000 species of plants and animals.",
  "Moose can weigh over 600 kg and are excellent swimmers.",
  "Grizzly bears can run as fast as a horse for short distances.",
  "Woodland caribou rely on old-growth forests to survive.",
  "Gray wolves play a key role in keeping ecosystems balanced.",
  "Jasper National Park is one of the world’s largest dark-sky preserves.",
  "Beavers, Canada’s national animal, shape entire ecosystems with dams.",
  "Polar bears spend most of their lives on sea ice, not land.",
  "Algonquin Park protects over 1,000 lakes and rivers.",
  "Bald eagles can spot prey from over 3 km away.",
  "Pacific Rim National Park is home to ancient coastal rainforests.",
  "Lynx have large paws that act like snowshoes in winter.",
  "Orcas can be found along Canada’s Pacific coastline.",
  "Elk shed and regrow their antlers every year.",
  "Gros Morne National Park reveals rocks from Earth’s mantle.",
  "Snowy owls migrate south to Canada’s parks during winter.",
  "Parks Canada protects nearly 500,000 km² of natural areas.",
  "Many Canadian parks help protect endangered species and habitats.",
];

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const SUN = require('../assets/sun.png');
const ICON_SETTINGS = require('../assets/icon_settings.png');
const ICON_STAR = require('../assets/icon_star.png');
const ICON_BOOKMARK = require('../assets/icon_bookmark.png');
const CANADA_1 = require('../assets/canada_1.png');
const CANADA_2 = require('../assets/canada_2.png');

const ORANGE = '#ff6a00';
const YELLOW = '#ffb300';
const DARK = '#0e0f10';

export default function MainMenuScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmall = Math.min(width, height) < 360 || height < 700;
  const [randomFact, setRandomFact] = useState('');

  const ui = useMemo(() => {
    const topPad = 20 + 40 + (isSmall ? 18 : 26);
    const iconBox = clamp(width * 0.14, 50, 64);
    const iconInner = clamp(iconBox * 0.52, 22, 30);
    const exploreH = clamp(height * 0.075, isSmall ? 50 : 52, 62);
    const exploreW = clamp(width * 0.58, isSmall ? 210 : 220, 330);
    const cardRadius = clamp(width * 0.06, 18, 24);
    const stroke = isSmall ? 3 : 4;
    const shareH = clamp(height * 0.07, isSmall ? 48 : 50, 58);
    const thumbH = clamp(height * 0.12, isSmall ? 72 : 78, 96);
    const titleSize = isSmall ? 18 : 20;
    const paragraphSize = isSmall ? 13.1 : 14.2;
    const bodySize = isSmall ? 13.5 : 14.5;
    const line = isSmall ? 18 : 20;
    const sunS = clamp(width * 0.12, 38, 44);

    return {
      topPad, iconBox, iconInner, exploreH, exploreW, cardRadius,
      stroke, shareH, thumbH, titleSize, paragraphSize, bodySize,
      line, sunS, sidePad: isSmall ? 16 : 18, gapRow: isSmall ? 12 : 14,
      mbTopRow: isSmall ? 14 : 18, mbActionRow: isSmall ? 14 : 16,
    };
  }, [width, height, isSmall]);

  const aTop = useRef(new Animated.Value(0)).current;
  const aActions = useRef(new Animated.Value(0)).current;
  const aCard = useRef(new Animated.Value(0)).current;
  const aBottom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WILD_FACTS.length);
    setRandomFact(WILD_FACTS[randomIndex]);

    const mk = (v: Animated.Value, delay: number) =>
      Animated.timing(v, {
        toValue: 1,
        duration: 380,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

    Animated.parallel([mk(aTop, 0), mk(aActions, 90), mk(aCard, 180), mk(aBottom, 260)]).start();
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Rana Fauna Parks — Did you know? ${randomFact}`,
      });
    } catch {
    }
  };

  const topAnimStyle = { opacity: aTop, transform: [{ translateY: aTop.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] };
  const actionsAnimStyle = { opacity: aActions, transform: [{ translateY: aActions.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] };
  const cardAnimStyle = { opacity: aCard, transform: [{ translateY: aCard.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }, { scale: aCard.interpolate({ inputRange: [0, 1], outputRange: [0.985, 1] }) }] };
  const bottomAnimStyle = { opacity: aBottom, transform: [{ translateY: aBottom.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] };

  return (
    <View style={styles.root}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: ui.topPad, paddingBottom: 26, paddingHorizontal: ui.sidePad },
        ]}
      >
        <Animated.View style={[styles.topRow, { marginBottom: ui.mbTopRow }, topAnimStyle]}>
          <Image source={SUN} style={{ width: ui.sunS, height: ui.sunS, opacity: 0.95 }} resizeMode="contain" />
          <Pressable
            style={[styles.iconBox, { width: ui.iconBox, height: ui.iconBox, borderRadius: ui.iconBox * 0.36, borderWidth: ui.stroke }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Image source={ICON_SETTINGS} style={{ width: ui.iconInner, height: ui.iconInner }} resizeMode="contain" />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.actionRow, { gap: ui.gapRow, marginBottom: ui.mbActionRow }, actionsAnimStyle]}>
          <Pressable
            style={[styles.exploreBtn, { height: ui.exploreH, width: ui.exploreW, borderRadius: ui.exploreH / 2, borderWidth: ui.stroke }]}
            onPress={() => navigation.navigate('Locations')}
          >
            <Text style={styles.exploreText}>Explore</Text>
          </Pressable>

          <Pressable
            style={[styles.iconBox, { width: ui.iconBox, height: ui.iconBox, borderRadius: ui.iconBox * 0.36, borderWidth: ui.stroke }]}
            onPress={() => navigation.navigate('Blog')}
          >
            <Image source={ICON_STAR} style={{ width: ui.iconInner, height: ui.iconInner }} resizeMode="contain" />
          </Pressable>

          <Pressable
            style={[styles.iconBox, { width: ui.iconBox, height: ui.iconBox, borderRadius: ui.iconBox * 0.36, borderWidth: ui.stroke }]}
            onPress={() => navigation.navigate('Saved')}
          >
            <Image source={ICON_BOOKMARK} style={{ width: ui.iconInner, height: ui.iconInner }} resizeMode="contain" />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.factCard, { borderRadius: ui.cardRadius, borderWidth: ui.stroke }, cardAnimStyle]}>
          <Text style={[styles.factText, { fontSize: ui.bodySize, lineHeight: ui.line }]}>
            {randomFact}
          </Text>

          <Pressable
            style={[styles.shareBtn, { height: ui.shareH, borderRadius: ui.shareH / 2, borderWidth: ui.stroke }]}
            onPress={onShare}
          >
            <Text style={styles.shareText}>Share</Text>
            <Text style={styles.shareIcon}>⌁</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={bottomAnimStyle}>
          <View style={styles.divider} />
          <View style={styles.sectionTitleRow}>
            <Text style={[styles.sectionTitle, { fontSize: ui.titleSize }]}>Canada</Text>
            <Text style={[styles.sectionSub, { fontSize: ui.titleSize - 2 }]}> - brief description</Text>
          </View>

          <View style={[styles.thumbsRow, { marginBottom: isSmall ? 12 : 14 }]}>
            <Image source={CANADA_1} style={[styles.thumb, { height: ui.thumbH, borderRadius: 18 }]} resizeMode="cover" />
            <Image source={CANADA_2} style={[styles.thumb, { height: ui.thumbH, borderRadius: 18 }]} resizeMode="cover" />
          </View>

          <Text style={[styles.paragraph, { fontSize: ui.paragraphSize, lineHeight: ui.line }]}>
            <Text style={styles.paragraphStrong}>Canada</Text>{' '}
            is a land of vast wilderness, endless forests, and untamed beauty.{'\n'}
            From towering mountains and crystal lakes to rugged coastlines and Arctic tundra, nature
            shapes life here.{'\n'}
            It is home to some of the world’s most iconic wildlife — bears, moose, wolves, caribou,
            whales, and countless bird species.{'\n'}
            Canada’s parks protect these animals and their habitats, offering rare chances to
            experience nature in its purest form.{'\n'}
            Every park tells a story.{'\n'}
            Every journey reveals a new side of the wild.
          </Text>
          <View style={{ height: Platform.OS === 'ios' ? 16 : 22 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  scroll: { flexGrow: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { backgroundColor: YELLOW, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  exploreBtn: { backgroundColor: YELLOW, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  exploreText: { color: '#c70000', fontWeight: '900', fontSize: 16, letterSpacing: 0.2 },
  factCard: { backgroundColor: DARK, borderColor: ORANGE, padding: 18, marginBottom: 18, minHeight: 120, justifyContent: 'center' },
  factText: { color: 'rgba(255,255,255,0.9)', fontWeight: '700', textAlign: 'center', marginBottom: 14 },
  shareBtn: { backgroundColor: YELLOW, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
  shareText: { color: '#c70000', fontWeight: '900', fontSize: 16 },
  shareIcon: { color: '#c70000', fontWeight: '900', fontSize: 18, marginTop: -1 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.35)', marginBottom: 16 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  sectionTitle: { color: '#fff', fontWeight: '900' },
  sectionSub: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  thumbsRow: { flexDirection: 'row', gap: 12 },
  thumb: { flex: 1 },
  paragraph: { color: 'rgba(255,255,255,0.78)', fontWeight: '600' },
  paragraphStrong: { color: '#fff', fontWeight: '900' },
});