import React, {Component} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
export class LoadingScreen extends Component {
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      auth().onAuthStateChanged((user) => {
        this.props.navigation.navigate(user ? 'Profile' : 'Login');
      });
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text> Loading ...</Text>
        <ActivityIndicator size="large" color="#EC942A" />
      </View>
    );
  }
}
export default LoadingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
