import React, {Component} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
class InputTextField extends Component {
  render() {
    return (
      <View>
        <MaterialCommunityIcons
          name={this.props.icon}
          size={24}
          style={{
            position: 'absolute',
            marginTop: hp('1.5%'),
            marginHorizontal: hp('1%'),
          }}
          color="#EC942A"
        />

        <TextInput
          placeholder={this.props.placeholderText}
          placeholderTextColor="grey"
          secureTextEntry={this.props.isSecure}
          onChangeText={this.props.onChange}
          autoCapitalize={this.props.autoCapitalize}
          keyboardType={this.props.type}
          selectionColor="#d8d8d8"
          autoCompleteType={this.props.autoCompleteType}
          value={this.props.value}
          style={styles.input}></TextInput>
      </View>
    );
  }
}

export default InputTextField;

const styles = StyleSheet.create({
  inputTitle: {
    color: '#ABB4BD',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    color: 'grey',
    paddingHorizontal: wp('10%'),
    fontSize: hp('2.2%'),
    fontFamily: 'Lato-Regular',
    marginBottom: hp('1.5%'),

    paddingVertical: hp('1.5%'),
  },
});
