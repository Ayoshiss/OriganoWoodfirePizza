import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default function LinearGrad({
  text,
  animating,
  activityStyles,
  iconName,
  width,
}) {
  return (
    <LinearGradient
      style={[styles.buttonStyles, width]}
      colors={['#F47621', '#F89919']}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 0}}>
      <Text style={styles.btnText}>{text} </Text>

      <MaterialCommunityIcons name={iconName} color="white" size={20} />
      <ActivityIndicator
        animating={animating}
        size="small"
        color="white"
        style={activityStyles}
      />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  buttonStyles: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: hp('1.6%'),
    marginVertical: hp('1.6%'),
    borderRadius: 100,
  },
  btnText: {
    fontFamily: 'Lato-Black',
    color: 'white',
    fontSize: hp('2.5%'),
  },
});
