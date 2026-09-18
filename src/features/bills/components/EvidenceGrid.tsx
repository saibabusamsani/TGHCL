import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { AppText, MediaGalleryModal } from '../../../components';
import { CapturedPhoto, CapturedVideo, EvidenceItem } from '../../../types/media.type';
import { formatDuration } from '../../../utils';

interface EvidenceGridProps {
  photos: CapturedPhoto[];
  video: CapturedVideo | null;
  onRemovePhoto: (uri: string) => void;
  onRemoveVideo: () => void;
}

export const EvidenceGrid: React.FC<EvidenceGridProps> = ({ photos, video, onRemovePhoto, onRemoveVideo }) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const items: EvidenceItem[] = useMemo(() => {
    const photoItems: EvidenceItem[] = photos.map((photo) => ({ type: 'photo', photo }));
    return video ? [...photoItems, { type: 'video', video }] : photoItems;
  }, [photos, video]);

  if (photos.length === 0 && !video) return null;

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.grid}
      >
        {photos.map((photo, index) => (
          <View key={photo.uri} style={styles.tile}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setGalleryIndex(index)}>
              <Image source={{ uri: photo.uri }} style={styles.tileImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeBadge} onPress={() => onRemovePhoto(photo.uri)}>
              <Ionicons name="close" size={iconSize.xs} color={colors.white} />
            </TouchableOpacity>
          </View>
        ))}

        {video ? (
          <View style={styles.tile}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => setGalleryIndex(photos.length)}>
              <Image source={{ uri: video.thumbnailUri }} style={styles.tileImage} />
              <View style={styles.videoScrim} />
              <View style={styles.durationBadge}>
                <AppText variant="caption" style={styles.durationText}>
                  {formatDuration(video.durationSeconds)}
                </AppText>
              </View>
              <View style={styles.playIcon}>
                <Ionicons name="play" size={iconSize.md} color={colors.white} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeBadge} onPress={onRemoveVideo}>
              <Ionicons name="close" size={iconSize.xs} color={colors.white} />
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <MediaGalleryModal
        visible={galleryIndex !== null}
        items={items}
        initialIndex={galleryIndex ?? 0}
        onClose={() => setGalleryIndex(null)}
      />
    </>
  );
};

const createStyles = ({ spacing, colors, radius }: AppTheme) => {
  const tileSize = spacing.xxl + spacing.lg;

  return StyleSheet.create({
    scrollContainer: { marginBottom: spacing.md },
    grid: { gap: spacing.sm, paddingRight: spacing.md },
    tile: {
      width: tileSize,
      height: tileSize,
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    tileImage: { width: '100%', height: '100%' },
    videoScrim: { ...StyleSheet.absoluteFill, backgroundColor: colors.black, opacity: 0.35 },
    playIcon: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    durationBadge: {
      position: 'absolute',
      top: spacing.xs,
      left: spacing.xs,
      backgroundColor: colors.error,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xs / 2,
    },
    durationText: { color: colors.white, fontWeight: '700' },
    removeBadge: {
      position: 'absolute',
      top: spacing.xs,
      right: spacing.xs,
      width: spacing.lg,
      height: spacing.lg,
      borderRadius: radius.full,
      backgroundColor: colors.black,
      opacity: 0.6,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};