
import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  increment(value: number): number;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeCounter',
);
