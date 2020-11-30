import React from 'react';
import {View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
const ScreenHeaders = ({name, props}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: hp('1%'),
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <MaterialIcons
        name="arrow-back"
        color="grey"
        size={35}
        onPress={() => props.navigation.goBack()}
      />
      <Text
        style={{
          textAlign: 'center',
          fontSize: hp('3.5%'),
          color: '#EC942A',
        }}>
        {name}
      </Text>
      <Ionicons
        name="ios-cart"
        color="grey"
        size={28}
        onPress={() => props.navigation.navigate('Cart')}
      />
    </View>
  );
};
export default ScreenHeaders;
