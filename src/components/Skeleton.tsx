import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Animated, DimensionValue } from 'react-native';

import { useTheme } from '../theme';


type SkeletonState = { loading: boolean; opacity: Animated.Value };

const SkeletonContext = createContext<SkeletonState>({loading: false,opacity: new Animated.Value(1)});

export const SkeletonProvider = ({loading,children}: {loading: boolean;children: React.ReactNode}) => {
 
    const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!loading) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [loading, opacity]);

  return (
    <SkeletonContext.Provider value={{ loading, opacity }}>{children}</SkeletonContext.Provider>
  );
};

type ShimmerProps = {
  width?: DimensionValue;
  height?: number;
  onPrimary?: boolean;
  children?: React.ReactNode;
};

export const Shimmer = ({ width = '60%', height = 16, onPrimary, children }: ShimmerProps) => {
  const { loading, opacity } = useContext(SkeletonContext);
  const { colors, radius } = useTheme();

  if (!loading) return <>{children}</>;

  return (
    <Animated.View
      importantForAccessibility="no-hide-descendants"
      style={{
        width,
        height,
        opacity,
        borderRadius: radius.sm,
        backgroundColor: onPrimary ? colors.chipBg : colors.border,
      }}
    />
  );
};