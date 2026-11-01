
import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
} from 'react-native';

import NativeCounter from './src/specs/NativeCounter';

const App = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    try {
      const result = NativeCounter.increment(count);

      console.log('Native result:', result);
      setCount(result);
    } catch (error) {
      console.error('Turbo Module Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        iOS Turbo Module Test
      </Text>

      <Text style={styles.count}>
        Count: {count}
      </Text>

      <Button
        title="Increment Count"
        onPress={handleIncrement}
        disabled={Platform.OS !== 'ios'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  count: {
    fontSize: 30,
    marginBottom: 20,
  },
});

export default App;
