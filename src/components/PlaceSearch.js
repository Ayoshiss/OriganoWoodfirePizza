import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
class PlaceSearch extends Component {
  constructor(props) {
    super(props), (this.state = {});
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <GooglePlacesAutocomplete
          placeholder="Enter your full address"
          query={{
            key: 'AIzaSyCT1DuqZIQOfaeDTw1FcxdQUCUCELLJzwU',
            language: 'en',
            components: 'country:au',
            region: 'au',
            types: ['(regions)'],
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]}
          styles={{
            textInputContainer: {
              backgroundColor: 'none',
              marginHorizontal: wp('3%'),
              borderWidth: 0,

              borderTopWidth: 0,
              height: hp('7%'),
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: hp('7%'),
              color: '#5d5d5d',
              fontSize: 16,
              borderWidth: 1,
              borderColor: 'grey',
            },
          }}
          keyboardType="default"
          autoFocus={true}
          editable={true}
          onPress={this.props.onPress}
          scrollEnabled={true}
        />
      </View>
    );
  }
}

export default PlaceSearch;
