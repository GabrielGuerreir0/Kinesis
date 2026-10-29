import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const letters = 'Kinesis'.split('');

type Props = {
  ready: boolean;
  onLayout: () => void;
  onDone: () => void;
};

export function LaunchSplash({ ready, onLayout, onDone }: Props) {
  const styles = useThemedStyles(makeStyles);
  const intro = useSharedValue(0);
  const title = useSharedValue(0);
  const line = useSharedValue(0);
  const ripple = useSharedValue(0);
  const veil = useSharedValue(1);
  const done = useRef(onDone);
  const closed = useRef(false);
  done.current = onDone;

  useEffect(() => {
    intro.value = withTiming(1, { duration: 980, easing: ease });
    title.value = withDelay(340, withTiming(1, { duration: 820, easing: ease }));
    line.value = withDelay(760, withTiming(1, { duration: 560, easing: ease }));
    ripple.value = withDelay(420, withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) }));
  }, [intro, line, ripple, title]);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      veil.value = withTiming(0, { duration: 520, easing: ease }, (finished) => {
        if (finished) runOnJS(finish)();
      });
    }, 1650);
    return () => clearTimeout(timer);
  }, [ready, veil]);

  function finish() {
    if (closed.current) return;
    closed.current = true;
    done.current();
  }

  const outer = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ scale: 0.72 + intro.value * 0.28 }],
  }));
  const middle = useAnimatedStyle(() => {
    const t = Math.min(1, Math.max(0, (intro.value - 0.12) / 0.88));
    return { opacity: t, transform: [{ scale: 0.68 + t * 0.32 }] };
  });
  const inner = useAnimatedStyle(() => {
    const t = Math.min(1, Math.max(0, (intro.value - 0.28) / 0.72));
    return { opacity: t, transform: [{ scale: 0.5 + t * 0.5 }] };
  });
  const wave = useAnimatedStyle(() => ({
    opacity: 0.35 * (1 - ripple.value),
    transform: [{ scale: 0.9 + ripple.value * 1.7 }],
  }));
  const rule = useAnimatedStyle(() => ({
    opacity: line.value,
    transform: [{ scaleX: line.value }],
  }));
  const caption = useAnimatedStyle(() => ({
    opacity: line.value,
    transform: [{ translateY: (1 - line.value) * 8 }],
  }));
  const cover = useAnimatedStyle(() => ({ opacity: veil.value }));

  return (
    <Animated.View accessibilityLabel="Carregando" onLayout={onLayout} pointerEvents="auto" style={[StyleSheet.absoluteFill, styles.veil, cover]}>
      <View style={styles.mark}>
        <Animated.View style={[styles.ring, styles.waveRing, wave]} />
        <Animated.View style={[styles.ring, styles.outer, outer]} />
        <Animated.View style={[styles.ring, styles.middle, middle]} />
        <Animated.View style={[styles.ring, styles.inner, inner]} />
        <Animated.View style={[styles.core, inner]} />
      </View>
      <View style={styles.word}>
        <View style={styles.row}>
          {letters.map((char, index) => (
            <Letter key={char + index} char={char} index={index} progress={title} />
          ))}
        </View>
        <Animated.View style={[styles.line, rule]} />
        <Animated.Text style={[styles.caption, caption]}>Descanso</Animated.Text>
      </View>
    </Animated.View>
  );
}

function Letter({ char, index, progress }: { char: string; index: number; progress: SharedValue<number> }) {
  const styles = useThemedStyles(makeStyles);
  const style = useAnimatedStyle(() => {
    const start = index * 0.07;
    const t = Math.min(1, Math.max(0, (progress.value - start) / 0.42));
    return { opacity: t, transform: [{ translateY: (1 - t) * 16 }] };
  });
  return <Animated.Text style={[styles.title, style]}>{char}</Animated.Text>;
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  veil: {
    zIndex: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: { width: 176, height: 176, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderColor: colors.ink, backgroundColor: 'transparent' },
  waveRing: { width: 168, height: 168, borderRadius: 84, borderWidth: 1.5 },
  outer: { width: 148, height: 148, borderRadius: 74, borderWidth: 2 },
  middle: { width: 104, height: 104, borderRadius: 52, borderWidth: 2 },
  inner: { width: 58, height: 58, borderRadius: 29, borderWidth: 2 },
  core: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.ink },
  word: { marginTop: 28, alignItems: 'center', gap: 12 },
  row: { flexDirection: 'row' },
  title: { color: colors.ink, fontSize: 42, fontWeight: '700', letterSpacing: -0.6 },
  line: { width: 56, height: 2, borderRadius: 1, backgroundColor: colors.ink },
  caption: { color: colors.ink, fontSize: 13, fontWeight: '700', letterSpacing: 3 },
  });
