import React, {Component} from 'react';
import {Text, View, ImageBackground, StatusBar} from 'react-native';

export class SplashScreen extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" />
        <ImageBackground
          source={require('../assets/img/SplashScreen.png')}
          style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}
        />
      </View>
    );
  }
}

export default SplashScreen;
