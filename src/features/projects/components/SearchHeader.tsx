import { View, StyleSheet, TextInput, Animated, Easing, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText, Button } from '../../../components';
import Icon from '@react-native-vector-icons/ionicons';

const SEARCH_ROW_HEIGHT = 44;

const AnimatedAppText = Animated.createAnimatedComponent(AppText);

const SearchHeader = () => {
  const styles = useThemedStyles(createStyle);
  const { colors, iconSize } = useTheme();

  const [isOpenSearch, setOpenSearch] = useState(false);
  const [text, setText] = useState('');

  // Single source of truth: 0 = closed, 1 = open
  const anim = useRef(new Animated.Value(0)).current;

  const animateTo = (toValue: 0 | 1, onDone?: () => void) => {
    Animated.timing(anim, {
      toValue,
      duration: toValue === 1 ? 280 : 220,
      easing: toValue === 1 ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: false, // height/fontSize aren't native-driver-eligible
    }).start(({ finished }) => finished && onDone?.());
  };

  const openSearch = () => {
    setOpenSearch(true);
    animateTo(1);
  };

  const closeSearch = () => {
    animateTo(0, () => {
      setOpenSearch(false);
      setText('');
    });
  };

  const handleSearch = () => {
    // submit `text`
  };

  const titleFontSize = anim.interpolate({ inputRange: [0, 1], outputRange: [28, 20] });
  const subtitleOpacity = anim.interpolate({ inputRange: [0, 0.4], outputRange: [1, 0], extrapolate: 'clamp' });
  const subtitleHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  const buttonOpacity = anim.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp' });

  const searchRowHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [0, SEARCH_ROW_HEIGHT] });
  const searchRowOpacity = anim.interpolate({ inputRange: [0.3, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const searchRowTranslateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <AnimatedAppText variant="h1" color={colors.text} style={[styles.title, { fontSize: titleFontSize }]}>
            Projects
          </AnimatedAppText>
          <Animated.View style={{ opacity: subtitleOpacity, height: subtitleHeight, overflow: 'hidden' }}>
            <AppText variant="subtitle" style={styles.subtitle}>
              Assigned to you only
            </AppText>
          </Animated.View>
        </View>

        {!isOpenSearch && (
          <Animated.View style={{ opacity: buttonOpacity }}>
            <Button
              title="Search"
              onPress={openSearch}
              icon={<Icon color={colors.white} name="search" size={iconSize.md} />}
              style={styles.button}
            />
          </Animated.View>
        )}
      </View>

      <Animated.View
        style={[
          styles.searchRow,
          {
            height: searchRowHeight,
            opacity: searchRowOpacity,
            transform: [{ translateY: searchRowTranslateY }],
          },
        ]}
        pointerEvents={isOpenSearch ? 'auto' : 'none'}
      >
        {isOpenSearch && (
          <View style={styles.searchInner}>
            <Icon color={colors.textLight} name="search" size={iconSize.sm} />
            <TextInput
              autoFocus
              value={text}
              onChangeText={setText}
              onSubmitEditing={handleSearch}
              placeholder="Search project id or beneficairy"
              placeholderTextColor={colors.textLight}
              style={styles.input}
            />
            <TouchableOpacity onPress={closeSearch} hitSlop={8}>
              <Icon color={colors.textLight} name="close" size={iconSize.md} />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default SearchHeader;

const createStyle = ({ spacing, colors, radius, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      backgroundColor:colors.background
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    left: {
      flexShrink: 1,
    },
    title: {
      fontWeight: typography.fontWeight.bold ,
    },
    subtitle: {
      fontWeight: typography.fontWeight.medium,
    },
    button: {
      paddingHorizontal: spacing.md,
    },
    searchRow: {
      overflow: 'hidden',
    },
    searchInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      height: SEARCH_ROW_HEIGHT,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingHorizontal: spacing.sm,
      marginTop: spacing.xs,
    },
    input: {
      flex: 1,
      color: colors.text,
    },
  });