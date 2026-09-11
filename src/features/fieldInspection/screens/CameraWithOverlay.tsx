import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { CaptureStatus, InspectionPhoto } from '../fieldInspection.type';
import { useFieldInspectionCamera } from '../hooks/useFieldInspectionCameraResult';


const STATUS_LABEL: Record<CaptureStatus, string> = {
  idle: '',
  capturing: 'Opening camera…',
  locating: 'Fetching location…',
  overlaying: 'Stamping image…',
};

export default function CameraWithOverlay() {
  const { photos, status, isBusy, isLocationReady, handleCaptureImage, removePhoto } =
    useFieldInspectionCamera();

  const renderItem = useCallback(
    ({ item }: { item: InspectionPhoto }) => (
      <View style={styles.thumbWrap}>
        <Image source={{ uri: item.uri }} style={styles.thumb} resizeMode="cover" />
        <TouchableOpacity style={styles.removeBadge} onPress={() => removePhoto(item.uri)}>
          <Text style={styles.removeBadgeText}>×</Text>
        </TouchableOpacity>
      </View>
    ),
    [removePhoto]
  );

  const captureDisabled = isBusy || !isLocationReady;

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <TouchableOpacity
          style={[styles.captureButton, captureDisabled && styles.captureButtonDisabled]}
          onPress={handleCaptureImage}
          disabled={captureDisabled}
        >
          {isBusy ? <ActivityIndicator color="#fff" /> : <View style={styles.captureInner} />}
        </TouchableOpacity>
        {isBusy && <Text style={styles.statusText}>{STATUS_LABEL[status]}</Text>}
        {!isBusy && !isLocationReady && (
          <Text style={styles.statusText}>Getting location…</Text>
        )}
      </View>

      {photos.length > 0 && (
        <FlatList
          data={photos}
          horizontal
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  captureButtonDisabled: { opacity: 0.5 },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff' },
  statusText: { color: '#fff', fontSize: 14 },
  list: { padding: 12, gap: 8 },
  thumbWrap: { marginRight: 8, position: 'relative' },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBadgeText: { color: '#fff', fontWeight: '700', lineHeight: 16 },
});