import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  Animated,
  Easing,
  useWindowDimensions,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BLOG_POSTS, BlogPost } from '../data/blogData'; 

const ICON_BACK = require('../assets/icon_back.png');

const ORANGE = '#ff6a00';
const YELLOW = '#ffb300';
const DARK = '#0e0f10';
const RED = '#c70000';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Blog'>;
};

export default function BlogScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmall = width < 375 || height < 680;
  const isTiny = width < 330;

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const ui = useMemo(() => {
    const baseTopPad = Platform.OS === 'ios' ? (isSmall ? 44 : 60) : (isSmall ? 20 : 40);
    const topPad = Platform.OS === 'android' ? baseTopPad + 20 : baseTopPad;
    
    const sidePad = isSmall ? 12 : 20;
    const stroke = isSmall ? 2.5 : 4;
    const backSize = isSmall ? 44 : 54;
    const listCardW = isTiny ? width * 0.92 : clamp(width * 0.88, 280, 400);
    const detailCardH = clamp(height * 0.62, 380, 680);

    return {
      topPad, sidePad, stroke, backSize, listCardW, detailCardH,
      headerSize: isSmall ? 18 : 22,
      listTitleSize: isSmall ? 14 : 16,
      bodySize: isSmall ? 13 : 15,
      lineHeight: isSmall ? 18 : 22
    };
  }, [width, height, isSmall, isTiny]);

  const current = useMemo(() => 
    BLOG_POSTS.find((p: BlogPost) => p.id === selectedId) ?? null, 
  [selectedId]);

  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.back(1)),
      useNativeDriver: true,
    }).start();
  }, [a]);

  const detailA = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(detailA, {
      toValue: current ? 1 : 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8
    }).start();
  }, [current, detailA]);

  const onShare = async () => {
    if (!current) return;
    try {
      await Share.share({ message: `${current.title}\n\n${current.body}` });
    } catch {}
  };

  return (
    <View style={styles.root}>
      <Animated.View 
        style={[
          styles.wrap, 
          { paddingTop: ui.topPad, paddingHorizontal: ui.sidePad },
          { opacity: a, transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }
        ]}
      >
        <View style={styles.topRow}>
          <Pressable
            style={[
              styles.backBtn,
              { width: ui.backSize, height: ui.backSize, borderRadius: ui.backSize / 2, borderWidth: ui.stroke },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Image source={ICON_BACK} style={{ width: '45%', height: '45%' }} resizeMode="contain" />
          </Pressable>
          <Text style={[styles.header, { fontSize: ui.headerSize }]}>Parks Blog</Text>
          <View style={{ width: ui.backSize }} /> 
        </View>

        {!current ? (
          <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            <FlatList
              data={BLOG_POSTS}
              keyExtractor={(it) => it.id}
              contentContainerStyle={{ paddingTop: 10, paddingBottom: 120, gap: 12 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.listCard, { width: ui.listCardW, borderWidth: ui.stroke, padding: isSmall ? 12 : 16 }]}
                  onPress={() => setSelectedId(item.id)}
                >
                  <Text style={[styles.listTitle, { fontSize: ui.listTitleSize }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.listSub} numberOfLines={2}>
                    {item.body.replace(/\s+/g, ' ')}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        ) : (
          <Animated.View 
            style={[
              styles.detailWrap, 
              { opacity: detailA, transform: [{ translateY: detailA.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }
            ]}
          >
            <View style={[
              styles.detailCard, 
              { width: ui.listCardW, maxHeight: ui.detailCardH, borderWidth: ui.stroke, padding: isSmall ? 15 : 20 }
            ]}>
              <Text style={[styles.detailTitle, { fontSize: ui.headerSize - 2 }]}>{current.title}</Text>
              <ScrollView 
                fadingEdgeLength={100} 
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 30 }}
              >
                <Text style={[styles.detailBody, { fontSize: ui.bodySize, lineHeight: ui.lineHeight }]}>
                  {current.body}
                </Text>
              </ScrollView>
            </View>

            <View style={[styles.buttonGroup, { width: ui.listCardW }]}>
                <Pressable
                  style={[styles.shareBtn, { height: isSmall ? 48 : 56, borderWidth: ui.stroke }]}
                  onPress={onShare}
                >
                  <Text style={styles.shareText}>Share Story</Text>
                </Pressable>

                <Pressable
                  style={[styles.ghostBackBtn, { height: 40 }]}
                  onPress={() => setSelectedId(null)}
                >
                  <Text style={styles.ghostBackText}>← Back to list</Text>
                </Pressable>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  wrap: { flex: 1, alignItems: 'center' },
  topRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  backBtn: { backgroundColor: YELLOW, borderColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  header: { color: '#fff', fontWeight: '900', textTransform: 'uppercase' },
  listCard: { backgroundColor: DARK, borderColor: ORANGE, borderRadius: 16 },
  listTitle: { color: '#fff', fontWeight: '900', marginBottom: 4 },
  listSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
  detailWrap: { alignItems: 'center', width: '100%', flex: 1 },
  detailCard: { backgroundColor: DARK, borderColor: ORANGE, borderRadius: 24, overflow: 'hidden' },
  detailTitle: { color: YELLOW, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  detailBody: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  buttonGroup: { marginTop: 15, gap: 8, paddingBottom: 30 },
  shareBtn: { backgroundColor: YELLOW, borderColor: ORANGE, borderRadius: 28, alignItems: 'center', justifyContent: 'center', width: '100%' },
  shareText: { color: RED, fontWeight: '900', fontSize: 16 },
  ghostBackBtn: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  ghostBackText: { color: ORANGE, fontWeight: '800', fontSize: 14 },
});