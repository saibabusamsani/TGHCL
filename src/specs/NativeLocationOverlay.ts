import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  overlayLocationDataOnImage(
    imageUri: string,
    currentAddress: string,
    latitude: number,
    longitude: number
  ): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LocationOverlayModule');