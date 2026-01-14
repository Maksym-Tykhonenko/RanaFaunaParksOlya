import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Switch,
  Share,
  useWindowDimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ICON_BACK = require('../assets/icon_back.png');

const ORANGE = '#ff6a00';
const YELLOW = '#ffb300';
const DARK = '#0e0f10';
const RED = '#c70000';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const KEY_SETTINGS = 'app_settings_v1';

type SettingsState = {
  notification: boolean;
  vibration: boolean;
};

async function readSettings(): Promise<SettingsState> {
  try {
    const raw = await AsyncStorage.getItem(KEY_SETTINGS);
    if (!raw) return { notification: true, vibration: false };
    const p = JSON.parse(raw) as Partial<SettingsState>;
    return {
      notification: typeof p.notification === 'boolean' ? p.notification : true,
      vibration: typeof p.vibration === 'boolean' ? p.vibration : false,
    };
  } catch {
    return { notification: true, vibration: false };
  }
}

async function writeSettings(next: SettingsState) {
  try {
    await AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(next));
  } catch {}
}

export default function SettingsScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const isSmall = Math.min(width, height) < 360 || height < 700;

  const ui = useMemo(() => {
    const topPad = 38 + (isSmall ? 24 : 40);
    const sidePad = isSmall ? 16 : 18;
    const stroke = isSmall ? 3 : 4;

    const backSize = clamp(width * 0.14, isSmall ? 48 : 50, isSmall ? 58 : 62);

    const titleSize = isSmall ? 14.5 : 15.5;

    const rowW = clamp(width * 0.86, 290, 360);
    const rowPadV = isSmall ? 11 : 14;

    const labelSize = isSmall ? 12.6 : 13.5;

    const shareH = clamp(height * 0.07, isSmall ? 46 : 48, isSmall ? 54 : 56);
    const shareW = clamp(width * 0.86, 290, 360);

    const bottomPadBase = isSmall ? 14 : 22;
    const raiseShareBy = isSmall ? 48 : 90; 
    const shareBottom = bottomPadBase + raiseShareBy;

    return {
      topPad,
      sidePad,
      stroke,
      backSize,
      titleSize,
      rowW,
      rowPadV,
      labelSize,
      shareH,
      shareW,
      shareBottom,
    };
  }, [width, height, isSmall]);

  const [notification, setNotification] = useState(true);
  const [vibration, setVibration] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await readSettings();
      setNotification(s.notification);
      setVibration(s.vibration);
    })();
  }, []);

  const setAndSave = async (next: SettingsState) => {
    setNotification(next.notification);
    setVibration(next.vibration);
    await writeSettings(next);
  };

  const onShareApp = async () => {
    try {
      await Share.share({
        message:
          'Rana Fauna Parks\n\nDiscover wildlife parks across Canada, explore stories, and save your favorite places.',
      });
    } catch {}
  };

  return (
    <View style={styles.root}>
      <View style={[styles.wrap, { paddingTop: ui.topPad, paddingHorizontal: ui.sidePad }]}>
        <Pressable
          style={[
            styles.backBtn,
            { width: ui.backSize, height: ui.backSize, borderRadius: ui.backSize * 0.36, borderWidth: ui.stroke },
          ]}
          onPress={() => navigation?.goBack?.()}
        >
          <Image
            source={ICON_BACK}
            style={{ width: ui.backSize * 0.42, height: ui.backSize * 0.42 }}
            resizeMode="contain"
          />
        </Pressable>

        <Text style={[styles.header, { fontSize: ui.titleSize }]}>Settings</Text>

        <View style={[styles.rowsWrap, { width: ui.rowW, marginTop: isSmall ? 14 : 16 }]}>
          <View style={[styles.row, { paddingVertical: ui.rowPadV }]}>
            <Text style={[styles.rowLabel, { fontSize: ui.labelSize }]}>Notification</Text>
            <Switch
              value={notification}
              onValueChange={(v) => setAndSave({ notification: v, vibration })}
              trackColor={{ false: '#2b2b2b', true: '#2ecc71' }}
              thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
              ios_backgroundColor="#2b2b2b"
            />
          </View>

          <View style={styles.divider} />

          <View style={[styles.row, { paddingVertical: ui.rowPadV }]}>
            <Text style={[styles.rowLabel, { fontSize: ui.labelSize }]}>Vibration</Text>
            <Switch
              value={vibration}
              onValueChange={(v) => setAndSave({ notification, vibration: v })}
              trackColor={{ false: '#2b2b2b', true: '#2ecc71' }}
              thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
              ios_backgroundColor="#2b2b2b"
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          style={[
            styles.shareBtn,
            {
              width: ui.shareW,
              height: ui.shareH,
              borderRadius: ui.shareH / 2,
              borderWidth: ui.stroke,
              marginBottom: ui.shareBottom, 
            },
          ]}
          onPress={onShareApp}
        >
          <Text style={styles.shareText}>Share the app</Text>
          <Text style={styles.shareIcon}>⌁</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  wrap: { flex: 1, alignItems: 'center' },

  backBtn: {
    alignSelf: 'flex-start',
    backgroundColor: YELLOW,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    marginTop: 12,
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },

  rowsWrap: {
    backgroundColor: 'transparent',
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLabel: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '900',
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  shareBtn: {
    backgroundColor: YELLOW,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  shareText: { color: RED, fontWeight: '900', fontSize: 14 },
  shareIcon: { color: RED, fontWeight: '900', fontSize: 16, marginTop: -1 },
});
