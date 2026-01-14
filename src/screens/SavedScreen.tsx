import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { LOCATIONS, formatCoords } from '../data/locationsData';

type Props = NativeStackScreenProps<RootStackParamList, 'Saved'>;

const ICON_BACK = require('../assets/icon_back.png');

const ORANGE = '#ff6a00';
const YELLOW = '#ffb300';
const DARK = '#0e0f10';

const SAVED_KEY = 'saved_locations_v1';

type SavedItem = {
  id: string;
  title: string;
  coords: { lat: number; lng: number };
};

type SavedCard = {
  id: string;
  title: string;
  coords: { lat: number; lng: number };
  image: any;
  description: string;
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

export default function SavedScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmall = Math.min(width, height) < 360 || height < 700;

  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      const list = await readSaved();
      setItems(list);
    });
    return unsub;
  }, [navigation]);

  const ui = useMemo(() => {
    const topPad = 30 + (isSmall ? 30 : 44); 
    const sidePad = isSmall ? 14 : 18;
    const stroke = isSmall ? 3 : 4;

    const backSize = clamp(width * 0.14, isSmall ? 48 : 50, isSmall ? 58 : 62);

    const cardW = clamp(width * 0.9, 300, 392);
    const cardRadius = 26;

    const imageW = cardW - 16 * 2;
    const imageH = clamp(Math.round(imageW * (9 / 16)), isSmall ? 150 : 170, 230);

    const titleSize = isSmall ? 13.5 : 14.5;
    const subSize = isSmall ? 11 : 12;

    return {
      topPad,
      sidePad,
      stroke,
      backSize,
      cardW,
      cardRadius,
      imageH,
      titleSize,
      subSize,
    };
  }, [width, height, isSmall]);

  const cards: SavedCard[] = useMemo(() => {
    const byId = new Map(LOCATIONS.map((l) => [l.id, l]));
    return items
      .map((s) => {
        const full = byId.get(s.id);
        if (!full) return null;
        return {
          id: s.id,
          title: full.title ?? s.title,
          coords: full.coords ?? s.coords,
          image: full.image,
          description: full.description,
        } as SavedCard;
      })
      .filter(Boolean) as SavedCard[];
  }, [items]);

  const empty = cards.length === 0;

  const renderItem = ({ item }: { item: SavedCard }) => {
    return (
      <Pressable
        style={[
          styles.card,
          {
            width: ui.cardW,
            borderRadius: ui.cardRadius,
            borderWidth: ui.stroke,
            padding: 14,
          },
        ]}
        onPress={() => navigation.navigate('LocationDetail', { id: item.id })}
      >
        <View
          style={[
            styles.imageWrap,
            {
              height: ui.imageH,
              borderRadius: ui.cardRadius - 8,
              borderWidth: ui.stroke,
            },
          ]}
        >
          <Image source={item.image} style={styles.image} resizeMode="cover" />
        </View>

        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Text style={[styles.cardTitle, { fontSize: ui.titleSize }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.cardSub, { fontSize: ui.subSize }]} numberOfLines={1}>
            {formatCoords(item.coords.lat, item.coords.lng)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: ui.topPad, paddingHorizontal: ui.sidePad }]}>
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

        <View style={[styles.titleContainer, { paddingTop: ui.topPad }]}>
          <Text style={styles.title}>Saved</Text>
        </View>
      </View>

      {empty ? (
        <View style={{ paddingHorizontal: ui.sidePad, paddingTop: 20, alignItems: 'center' }}>
          <Text style={styles.empty}>No saved parks yet</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 102,
            gap: 14,
            alignItems: 'center',
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
  },

  backBtn: {
    backgroundColor: YELLOW,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  titleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 22,
    textTransform: 'uppercase',
  },

  empty: { color: 'rgba(255,255,255,0.75)', fontWeight: '700', fontSize: 16 },

  card: {
    backgroundColor: DARK,
    borderColor: ORANGE,
  },

  imageWrap: {
    width: '100%',
    overflow: 'hidden',
    borderColor: ORANGE,
    backgroundColor: '#0b0c0d',
  },

  image: { width: '100%', height: '100%' },

  cardTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  cardSub: { marginTop: 4, color: 'rgba(255,255,255,0.65)', fontWeight: '800', textAlign: 'center' },
});