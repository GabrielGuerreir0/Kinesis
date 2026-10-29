import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Platform } from 'react-native';

const driver = Platform.OS !== 'web';
const sheetHeight = Math.round(Dimensions.get('window').height * 0.86);

export function useBottomSheet(visible: boolean) {
  const [shown, setShown] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setShown(true);
      const opening = Animated.timing(progress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: driver,
      });
      opening.start();
      return () => opening.stop();
    }
    const closing = Animated.timing(progress, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: driver,
    });
    closing.start(({ finished }) => {
      if (finished) setShown(false);
    });
    return () => closing.stop();
  }, [progress, visible]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [sheetHeight, 0] });
  const backdrop = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] });
  return { shown, translateY, backdrop, sheetHeight };
}
