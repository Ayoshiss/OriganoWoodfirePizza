import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import CheckBox from 'react-native-check-box';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Checkbox = ({ingredient, addIngredient, checkValue, price}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View>
        <CheckBox
          style={{
            flex: 1,
            paddingBottom: hp('2%'),
            paddingRight: hp('1%'),
            paddingTop: hp('2%'),
          }}
          onClick={() => addIngredient()}
          isChecked={checkValue}
          checkedImage={
            <MaterialCommunityIcons
              name="checkbox-marked"
              size={28}
              color="#EC942A"
            />
          }
          unCheckedImage={
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={28}
              color="#EC942A"
            />
          }
        />
      </View>

      <View style={{flexDirection: 'row', width: wp('60%')}}>
        <TouchableOpacity onPress={() => addIngredient()}>
          <Text style={{fontSize: hp('2.3%'), fontFamily: 'Lato-Regular'}}>
            {ingredient}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{
            fontSize: hp('2.3%'),
            color: 'green',
            paddingHorizontal: hp('5%'),
          }}>
          {'$'}
          {price}
        </Text>
      </View>
    </View>
  );
};

export default Checkbox;
