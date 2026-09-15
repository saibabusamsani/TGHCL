import { View,  StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SearchHeader from '../components/SearchHeader'
import { PROJECT_STATUS } from '../../../constants'
import { AppTheme,useThemedStyles } from '../../../theme'
import { TabButton } from '../components/TabButton'



const ProjectList = () => {
  const [selected, setSelected] = useState<string>('All');
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <SearchHeader />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        <TabButton title="All" active={selected === 'All'} onPress={() => setSelected('All')} />
        {Object.keys(PROJECT_STATUS).map((status) => (
          <TabButton
            key={status}
            title={status}
            active={selected === status}
            onPress={() => setSelected(status)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default ProjectList

const createStyles = ({ spacing, colors }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.background,
    },
    tabContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      flexWrap: 'nowrap',
      alignItems:"flex-start"
    },
  });