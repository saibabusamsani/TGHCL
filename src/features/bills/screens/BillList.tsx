import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { AppTheme, colors, useThemedStyles } from '../../../theme';
import { AppText, Button } from '../../../components';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { ContractorStackParamList } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const BillList = () => {

    const styles = useThemedStyles(createStyles);
   const navigation = useNavigation<NativeStackNavigationProp<ContractorStackParamList, 'MainTab'>>();
  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <View>
                <AppText variant='h1'>Bills</AppText>
                <AppText variant='subtitle'>Submissin & tackinig</AppText>
            </View>
            <Button
             title='New Bill'
             icon={<Ionicons name="add-outline" color={colors.white}/>}
             iconPosition='left'
             gradient='warning'
             onPress={()=> navigation.navigate("BillForm")}
            
             style={styles.button}
            />
        </View>
    </View>
  )
}

export default BillList;

const createStyles = ({colors,spacing}:AppTheme)=>
    StyleSheet.create({
       container:{
         flex:1,
         backgroundColor:colors.background,
         padding:spacing.sm
       },
       header:{
        paddingHorizontal:spacing.md,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
       },
       button:{
        paddingHorizontal:spacing.md
       }
      
    })