import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Share,
  ScrollView,
  Platform,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { LOCATIONS, formatCoords } from '../data/locationsData';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationDetail'>;

const ICON_BACK = require('../assets/icon_back.png');
const ICON_BOOKMARK = require('../assets/icon_bookmark.png');
const ICON_SHARE = require('../assets/icon_share.png');

const ORANGE = '#ff6a00';
const YELLOW = '#ffb300';
const DARK = '#0e0f10';
const RED = '#c70000';

const SAVED_KEY = 'saved_locations_v1';

type SavedItem = {
  id: string;
  title: string;
  coords: { lat: number; lng: number };
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

async function readSaved(): Promise<SavedItem[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedItem[]) : [];
  } catch {
    return [];
  }
}

async function writeSaved(list: SavedItem[]) {
  try {
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(list));
  } catch {}
}

export default function LocationDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const location = useMemo(() => LOCATIONS.find((x) => x.id === id), [id]);

  const { width, height } = useWindowDimensions();
  const isSmall = Math.min(width, height) < 360 || height < 700;

  const [saved, setSaved] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const ui = useMemo(() => {
    const sidePad = isSmall ? 14 : 18;
    const topPad = 34 + (isSmall ? 28 : 42);
    const stroke = isSmall ? 3 : 4;

    const backSize = clamp(width * 0.14, isSmall ? 48 : 50, isSmall ? 58 : 62);

    const cardW = clamp(width * 0.92, isSmall ? 300 : 312, 400);
    const cardRadius = isSmall ? 22 : 26;
    const cardPad = isSmall ? 12 : 14;

    const titleSize = isSmall ? 13.5 : 15;
    const subSize = isSmall ? 11.2 : 12;
    const textSize = isSmall ? 12 : 13;
    const line = isSmall ? 16.5 : 18;

    const btnH = clamp(height * 0.07, isSmall ? 46 : 48, isSmall ? 54 : 56);
    const saveH = clamp(btnH * 0.86, isSmall ? 40 : 42, isSmall ? 50 : 52);

    const mapH = clamp(height * 0.28, isSmall ? 175 : 210, isSmall ? 240 : 290);

    const imgRadius = cardRadius - 8;

    return {
      sidePad,
      topPad,
      stroke,
      backSize,
      cardW,
      cardRadius,
      cardPad,
      imgRadius,
      titleSize,
      subSize,
      textSize,
      line,
      btnH,
      saveH,
      mapH,
    };
  }, [width, height, isSmall]);

  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [a]);

  const entryAnim = {
    opacity: a,
    transform: [
      { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) },
      { scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.99, 1] }) },
    ],
  };

  const mapA = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(mapA, {
      toValue: mapOpen ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [mapOpen, mapA]);

  const mapHeight = mapA.interpolate({ inputRange: [0, 1], outputRange: [0, ui.mapH] });

  useEffect(() => {
    (async () => {
      if (!location) return;
      const list = await readSaved();
      setSaved(list.some((x) => x.id === location.id));
    })();
  }, [location?.id]);

  if (!location) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>Location not found</Text>
        <Pressable
          style={[
            styles.bigBtn,
            { marginTop: 12, borderWidth: 3, borderRadius: 24, height: 48, paddingHorizontal: 18 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.bigBtnText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const { lat, lng } = location.coords;

  const onShare = async () => {
    try {
      await Share.share({
        message: `${location.title}\n${formatCoords(lat, lng)}\n\n${location.description}`,
      });
    } catch {}
  };

  const toggleSaved = async () => {
    const next = !saved;
    setSaved(next);

    const list = await readSaved();
    if (next) {
      const item: SavedItem = { id: location.id, title: location.title, coords: { lat, lng } };
      await writeSaved([item, ...list.filter((x) => x.id !== location.id)]);
    } else {
      await writeSaved(list.filter((x) => x.id !== location.id));
    }
  };

  const onToggleMap = () => setMapOpen((v) => !v);

  return (
    <View style={styles.root}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: ui.topPad,
          paddingBottom: isSmall ? 18 : 22,
          paddingHorizontal: ui.sidePad,
        }}
      >
        <Pressable
          style={[
            styles.backBtn,
            { width: ui.backSize, height: ui.backSize, borderRadius: ui.backSize * 0.36, borderWidth: ui.stroke },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={ICON_BACK}
            style={{ width: ui.backSize * 0.42, height: ui.backSize * 0.42 }}
            resizeMode="contain"
          />
        </Pressable>

        <Animated.View
          style={[
            styles.card,
            { width: ui.cardW, borderRadius: ui.cardRadius, borderWidth: ui.stroke, marginTop: 12, padding: ui.cardPad },
            entryAnim,
          ]}
        >
    
          <View
            style={[
              styles.imageWrap,
              {
                borderRadius: ui.imgRadius,
                borderWidth: ui.stroke,
              },
            ]}
          >
            <Image 
              source={location.image} 
              style={styles.image} 
              resizeMode="cover" 
              fadeDuration={0} 
            />
          </View>

          <Text style={[styles.title, { fontSize: ui.titleSize, marginTop: isSmall ? 8 : 10 }]}>
            {location.title}
          </Text>
          <Text style={[styles.coords, { fontSize: ui.subSize, marginTop: 4 }]}>{formatCoords(lat, lng)}</Text>

          <Text style={[styles.desc, { fontSize: ui.textSize, lineHeight: ui.line, marginTop: isSmall ? 7 : 8 }]}>
            {location.description}
          </Text>

          <Pressable
            style={[
              styles.bigBtn,
              { height: ui.btnH, borderRadius: ui.btnH / 2, borderWidth: ui.stroke, marginTop: isSmall ? 10 : 12 },
            ]}
            onPress={onShare}
          >
            <Text style={styles.bigBtnText}>Share</Text>
            <Image source={ICON_SHARE} style={{ width: 18, height: 18 }} resizeMode="contain" />
          </Pressable>

          <Pressable
            style={[
              styles.saveBtn,
              {
                height: ui.saveH,
                borderRadius: ui.saveH / 2,
                borderWidth: ui.stroke,
                marginTop: isSmall ? 10 : 12,
                backgroundColor: saved ? YELLOW : 'transparent',
              },
            ]}
            onPress={toggleSaved}
          >
            <Text style={[styles.saveText, { color: saved ? RED : ORANGE }]}>{saved ? 'Saved' : 'Save'}</Text>
            <Image
              source={ICON_BOOKMARK}
              style={{ width: 20, height: 20, tintColor: saved ? '#000' : undefined }}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable
            style={[
              styles.bigBtn,
              { height: ui.btnH, borderRadius: ui.btnH / 2, borderWidth: ui.stroke, marginTop: isSmall ? 10 : 12 },
            ]}
            onPress={onToggleMap}
          >
            <Text style={styles.bigBtnText}>{mapOpen ? 'Close map' : 'Open in map'}</Text>
          </Pressable>

          <Animated.View
            style={[
              styles.mapWrap,
              {
                height: mapHeight,
                borderRadius: 22,
                borderWidth: mapOpen ? ui.stroke : 0,
                marginTop: mapOpen ? (isSmall ? 10 : 12) : 0,
                opacity: mapA,
              },
            ]}
          >
            {mapOpen ? (
              <MapView
                style={StyleSheet.absoluteFillObject}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={{
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.25,
                  longitudeDelta: 0.25,
                }}
              >
                <Marker coordinate={{ latitude: lat, longitude: lng }} />
              </MapView>
            ) : null}
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  backBtn: {
    backgroundColor: YELLOW,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    alignSelf: 'center',
    backgroundColor: DARK,
    borderColor: ORANGE,
  },

  imageWrap: {
    width: '100%',
    backgroundColor: '#0b0c0d',
    borderColor: ORANGE,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 16 / 9,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  title: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  coords: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', textAlign: 'center' },
  desc: { color: 'rgba(255,255,255,0.85)', fontWeight: '600', textAlign: 'center' },

  bigBtn: {
    backgroundColor: YELLOW,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  bigBtnText: { color: RED, fontWeight: '900', fontSize: 14 },

  saveBtn: {
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  saveText: { fontWeight: '900', fontSize: 13 },

  mapWrap: {
    overflow: 'hidden',
    borderColor: ORANGE,
    backgroundColor: '#111',
  },
});