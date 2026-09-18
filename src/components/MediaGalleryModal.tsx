import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Video from 'react-native-video';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CapturedVideo, EvidenceItem } from '../types';
import { AppTheme, useTheme, useThemedStyles } from '../theme';

interface MediaGalleryModalProps {
  visible: boolean;
  items: EvidenceItem[];
  initialIndex: number;
  onClose: () => void;
}

export const MediaGalleryModal: React.FC<MediaGalleryModalProps> = ({ visible, items, initialIndex, onClose }) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (visible) setActiveIndex(initialIndex);
  }, [visible, initialIndex]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} presentationStyle="fullScreen">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={iconSize.lg} color={colors.white} />
        </TouchableOpacity>

        <PagerView
          style={styles.pager}
          initialPage={initialIndex}
          onPageSelected={(event : any) => setActiveIndex(event.nativeEvent.position)}
        >
          {items.map((item, index) => (
            <View key={index} style={styles.page}>
              {item.type === 'photo' ? (
                <Image source={{ uri: item.photo.uri }} style={styles.fullMedia} resizeMode="contain" />
              ) : (
                <VideoPage video={item.video} isActive={activeIndex === index} />
              )}
            </View>
          ))}
        </PagerView>
      </View>
    </Modal>
  );
};

interface VideoPageProps {
  video: CapturedVideo;
  isActive: boolean;
}

const VideoPage: React.FC<VideoPageProps> = ({ video, isActive }) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const [playing, setPlaying] = useState(false);

  // Swiped away from this page — stop playback so it doesn't keep running off-screen.
  useEffect(() => {
    if (!isActive) setPlaying(false);
  }, [isActive]);

  if (!playing) {
    return (
      <TouchableOpacity style={styles.fullMedia} activeOpacity={0.9} onPress={() => setPlaying(true)}>
        <Image source={{ uri: video.thumbnailUri }} style={styles.fullMedia} resizeMode="contain" />
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={72} color={colors.white} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Video
      source={{ uri: video.uri }}
      style={styles.fullMedia}
      controls
      resizeMode="contain"
      onEnd={() => setPlaying(false)}
    />
  );
};

const createStyles = ({ spacing, colors, iconSize }: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.black },
    closeButton: {
      position: 'absolute',
      top: spacing.xl,
      right: spacing.md,
      zIndex: 10,
      width: iconSize.xl,
      height: iconSize.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pager: { flex: 1 },
    page: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    fullMedia: { width: '100%', height: '100%' },
    playOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  });