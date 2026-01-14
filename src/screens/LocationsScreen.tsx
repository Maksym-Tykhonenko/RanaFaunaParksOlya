import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
  FlatList,
  Modal,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { CATEGORIES, LOCATIONS, type CategoryId, type LocationItem } from '../data/locationsData';

type Props = NativeStackScreenProps<RootStackParamList, 'Locations'>;

const ICON_BACK = require('../assets/icon_back.png');

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const ORANGE = '#ff6a00';
const YELLOW = '#ffb300';
const DARK = '#0e0f10';
const RED = '#c70000';

export default function LocationsScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmall = Math.min(width, height) < 360 || height < 700;

  const [selected, setSelected] = useState<CategoryId>(CATEGORIES[0]?.id ?? 1);
  const [modalOpen, setModalOpen] = useState(false);

  const ui = useMemo(() => {
    const topPad = 40 + (isSmall ? 34 : 44);
    const sidePad = isSmall ? 16 : 18;
    const stroke = isSmall ? 3 : 4;
    const backSize = clamp(width * 0.14, 50, 62);
    const questionW = clamp(width * 0.9, 290, 420);
    const questionH = clamp(height * 0.13, 96, 128);
    const catBtnH = clamp(height * 0.095, isSmall ? 72 : 78, 98);
    const catBtnW = clamp(width * 0.86, 300, 420);
    const qSize = isSmall ? 13.5 : 14.5;
    const catTitleSize = isSmall ? 14 : 15;
    const catSubSize = isSmall ? 12.5 : 13;
    const gap = isSmall ? 14 : 16;
    const modalW = clamp(width * 0.92, 320, 430);
    const modalMaxH = clamp(height * 0.72, isSmall ? 440 : 520, 680);
    const cardRadius = 18;
    const cardPad = isSmall ? 12 : 14;
    const thumbSize = clamp(width * 0.23, 86, 110);
    const titleSize = isSmall ? 13.6 : 14.8;
    const subSize = isSmall ? 11.8 : 12.8;
    const snippetSize = isSmall ? 11.8 : 12.4;
    const line = isSmall ? 16 : 17;
    const openBtnH = isSmall ? 52 : 56;

    return {
      topPad, sidePad, stroke, backSize, questionW, questionH, catBtnH, catBtnW,
      qSize, catTitleSize, catSubSize, gap, modalW, modalMaxH, cardRadius,
      cardPad, thumbSize, titleSize, subSize, snippetSize, line, openBtnH,
    };
  }, [width, height, isSmall]);

  const selectedCategory = useMemo(() => CATEGORIES.find((c) => c.id === selected), [selected]);
  const filtered = useMemo(() => LOCATIONS.filter((x) => x.categoryId === selected), [selected]);

  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [a]);

  const screenAnim = {
    opacity: a,
    transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
  };

  const modalA = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(modalA, {
      toValue: modalOpen ? 1 : 0,
      duration: modalOpen ? 220 : 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [modalOpen, modalA]);

  const modalCardAnim = {
    opacity: modalA,
    transform: [
      { translateY: modalA.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
      { scale: modalA.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) },
    ],
  };

  const snippet = (text: string) => {
    const t = text.replace(/\s+/g, ' ').trim();
    return t.length > 95 ? t.slice(0, 95) + '…' : t;
  };

  const renderItem = ({ item }: { item: LocationItem }) => (
    <View style={[styles.placeCard, { borderRadius: ui.cardRadius, borderWidth: ui.stroke, padding: ui.cardPad }]}>
      <View style={[styles.thumbWrap, { width: ui.thumbSize, height: ui.thumbSize, borderRadius: 14, borderWidth: ui.stroke }]}>
        <Image source={item.image} style={styles.thumbImage} resizeMode="cover" fadeDuration={0} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.placeTitle, { fontSize: ui.titleSize }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.placeSub, { fontSize: ui.subSize }]} numberOfLines={1}>Tap arrow for details</Text>
        <Text style={[styles.placeSnippet, { fontSize: ui.snippetSize, lineHeight: ui.line }]} numberOfLines={3}>
          {snippet(item.description)}
        </Text>
      </View>
      <Pressable
        style={[styles.arrow, { borderWidth: ui.stroke, borderRadius: 14 }]}
        onPress={() => {
          setModalOpen(false);
          requestAnimationFrame(() => navigation.navigate('LocationDetail', { id: item.id }));
        }}
        hitSlop={12}
      >
        <Text style={styles.arrowText}>›</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.wrap, { paddingTop: ui.topPad, paddingHorizontal: ui.sidePad }, screenAnim]}>
        <View style={styles.backRow}>
          <Pressable
            style={[styles.backBtn, { width: ui.backSize, height: ui.backSize, borderRadius: ui.backSize * 0.36, borderWidth: ui.stroke }]}
            onPress={() => navigation.goBack()}
          >
            <Image source={ICON_BACK} style={{ width: ui.backSize * 0.42, height: ui.backSize * 0.42 }} resizeMode="contain" />
          </Pressable>
        </View>

        <View style={[styles.questionCard, { width: ui.questionW, height: ui.questionH, borderRadius: 22, borderWidth: ui.stroke, marginTop: ui.gap }]}>
          <Text style={[styles.questionText, { fontSize: ui.qSize }]}>
            What kind of experience are you{'\n'}looking for?
          </Text>
        </View>

        <View style={{ marginTop: ui.gap, width: '100%', alignItems: 'center', gap: 12 }}>
          {CATEGORIES.map((c) => {
            const active = c.id === selected;
            return (
              <Pressable
                key={c.id}
                style={[styles.catBtn, {
                  width: ui.catBtnW,
                  minHeight: ui.catBtnH,
                  borderRadius: ui.catBtnH / 2,
                  borderWidth: ui.stroke,
                  backgroundColor: active ? YELLOW : 'transparent',
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                }]}
                onPress={() => setSelected(c.id)}
              >
                <Text style={[styles.catTitle, { fontSize: ui.catTitleSize, lineHeight: ui.catTitleSize + 4, color: active ? RED : ORANGE }]}>
                  {c.title}
                </Text>
                <Text style={[styles.catSub, { fontSize: ui.catSubSize, marginTop: 6, color: active ? 'rgba(199,0,0,0.95)' : 'rgba(255,106,0,0.85)' }]}>
                  {c.subtitle}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[styles.openBtn, { height: ui.openBtnH, borderRadius: ui.openBtnH / 2, borderWidth: ui.stroke, width: ui.catBtnW, marginTop: ui.gap }]}
          onPress={() => setModalOpen(true)}
        >
          <Text style={styles.openBtnText}>Open</Text>
        </Pressable>
      </Animated.View>

      <Modal visible={modalOpen} transparent animationType="none" onRequestClose={() => setModalOpen(false)} statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { width: ui.modalW, maxHeight: ui.modalMaxH, borderWidth: ui.stroke, borderRadius: 24 }, modalCardAnim]}>
            <View style={[styles.modalHeader, { borderBottomWidth: ui.stroke }]}>
              <Text style={styles.modalTitle}>{selectedCategory?.title ?? 'Locations'}</Text>
              <Pressable onPress={() => setModalOpen(false)} style={[styles.closeBtn, { borderWidth: ui.stroke }]} hitSlop={10}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle}>{selectedCategory?.subtitle ?? 'Tap arrow for details'}</Text>
            <FlatList
              data={filtered}
              keyExtractor={(it) => it.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 12, paddingBottom: 14, gap: 12 }}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  wrap: { flex: 1, alignItems: 'center' },
  backRow: { width: '100%', alignItems: 'flex-start' },
  backBtn: { backgroundColor: YELLOW, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  questionCard: { backgroundColor: DARK, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  questionText: { color: 'rgba(255,255,255,0.92)', fontWeight: '700', textAlign: 'center', lineHeight: 18 },
  catBtn: { borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  catTitle: { fontWeight: '900', textAlign: 'center' },
  catSub: { fontWeight: '800', textAlign: 'center' },
  openBtn: { backgroundColor: YELLOW, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  openBtnText: { color: RED, fontWeight: '900', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14 },
  modalCard: { backgroundColor: DARK, borderColor: ORANGE, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, borderColor: 'rgba(255,106,0,0.45)' },
  modalTitle: { color: '#fff', fontWeight: '900', fontSize: 16, textAlign: 'center', flex: 1 },
  closeBtn: { width: 36, height: 36, borderRadius: 12, borderColor: ORANGE, backgroundColor: '#0b0c0d', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 0, top: -2 },
  closeText: { color: 'rgba(255,255,255,0.9)', fontWeight: '900', fontSize: 14 },
  modalSubtitle: { marginTop: 10, color: 'rgba(255,255,255,0.72)', fontWeight: '700', textAlign: 'center' },
  placeCard: { backgroundColor: '#0b0c0d', borderColor: ORANGE, flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumbWrap: { overflow: 'hidden', borderColor: ORANGE, backgroundColor: '#0b0c0d' },
  thumbImage: { width: '100%', height: '100%' },
  placeTitle: { color: '#fff', fontWeight: '900' },
  placeSub: { marginTop: 3, color: 'rgba(255,255,255,0.65)', fontWeight: '700' },
  placeSnippet: { marginTop: 6, color: 'rgba(255,255,255,0.78)', fontWeight: '600' },
  arrow: { width: 38, height: 38, backgroundColor: YELLOW, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center', marginLeft: 2 },
  arrowText: { color: RED, fontWeight: '900', fontSize: 22, marginTop: -2 },
});