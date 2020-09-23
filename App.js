import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import NetworkManager from './src/components/NetworkManager';
import RootStack from './RootStack';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppIntroSlider from 'react-native-app-intro-slider';
const data = [
  {
    title: '',
    text: 'Your Favorite Pizzas, Just a Click Away',
    image: require('./src/assets/img/SplashScreen.png'),
    bg: '#f4791f',
    key: '1',
  },
  {
    title: '',
    text: 'Order from our wide range of pizzas',
    image: require('./src/assets/img/order1.png'),
    bg: '#f4791f',
    key: '2',
  },
  {
    title: '',
    text: 'Get your orders delivered to your doorstep',
    image: require('./src/assets/img/delivery1.png'),
    bg: '#f4791f',
    key: '3',
  },
  {
    title: '',
    text: 'Or pickup your order from our outlet at Alexandria 2015, NSW',
    image: require('./src/assets/img/pickup1.png'),
    bg: '#f4791f',
    key: '4',
  },
  {
    title: '',
    text: 'Cheers!!!',
    image: require('./src/assets/img/enjoy1.png'),
    bg: '#f4791f',
    key: '5',
  },
];
class App extends Component {
  constructor(props) {
    super(props);
    NetworkManager.RegisterConnectionChangeCallback((isAvailable) => {
      this.setState({});
    });
    this.state = {
      show_app: undefined,
    };
  }
  componentDidMount() {
    this.getAppLaunchInfo();
  }

  on_Done_all_slides = () => {
    this.setState({show_app: true});
    var show_app = 'true';
    this.storeAppLaunchInfo(show_app);
  };
  on_Skip_slides = () => {
    this.setState({show_app: true});
    var show_app = 'true';
    this.storeAppLaunchInfo(show_app);
  };
  _renderItem = ({item}) => {
    return (
      <View
        key={item.key}
        style={{
          flex: 1,
          backgroundColor: item.bg,
        }}>
        <ImageBackground
          source={item.image}
          style={{flex: 1, resizeMode: 'cover', justifyContent: 'center'}}>
          <View style={{width: wp('100%'), height: hp('45%')}}>
            {/* <Image source={item.image} style={styles.image} /> */}
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </ImageBackground>
      </View>
    );
  };

  storeAppLaunchInfo = async (show_app) => {
    try {
      await AsyncStorage.setItem('HasLaunched', show_app);
    } catch (e) {}
  };
  getAppLaunchInfo = async () => {
    try {
      const HasLaunched = await AsyncStorage.getItem('HasLaunched');
      if (HasLaunched == 'true') {
        this.setState({
          show_app: true,
        });
      }
      if (HasLaunched == 'false') {
        this.setState({show_app: false});
      }
    } catch (e) {}
  };

  render() {
    const {show_app} = this.state;
    if (show_app) {
      return (
        <>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" />
          <View style={{flex: 1}}>
            {!NetworkManager.IsInternetAvailable && (
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  alignItems: 'center',
                }}>
                {/* <Image source={EmptyCart} style={{height: 200, width: 200}} /> */}
                <Icon name={'wifi-off'} style={[{color: '#ddd'}]} size={200} />
                <Text
                  style={{
                    fontSize: hp('2%'),
                    fontWeight: 'bold',
                    color: '#B6B6B6',
                    alignSelf: 'center',
                    textAlign: 'center',
                    paddingVertical: hp('3%'),
                    marginHorizontal: wp('10%'),
                  }}>
                  No Internet. Please Check Your Internet Connection.
                </Text>
              </View>
            )}
            {NetworkManager.IsInternetAvailable && <RootStack />}
          </View>
        </>
      );
    } else {
      return (
        <>
          <StatusBar translucent backgroundColor="transparent" />
          <AppIntroSlider
            // keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            bottomButton
            showSkipButton
            showPrevButton
            data={data}
            onDone={this.on_Done_all_slides}
            onSkip={this.on_Skip_slides}
          />
        </>
      );
    }
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: hp('2.5%'),
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },

  image: {
    alignSelf: 'center',
    width: wp('80%'),
    height: hp('70%'),
    resizeMode: 'contain',
  },
  title: {
    paddingVertical: hp('1%'),
    fontSize: hp('4%'),
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Lato-Black',
  },
});

export default App;
