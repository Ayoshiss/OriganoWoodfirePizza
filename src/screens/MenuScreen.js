import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Pasta from './menu/Pasta';
import Salad from './menu/Salad';
import Dessert from './menu/Dessert';
import Beverages from './menu/Beverages';
import EntreeAndSide from './menu/EntreeAndSide';
import Pizza from './menu/Pizza';
import Special from './menu/Special';

class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      badgeCount: 0,
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getBadgeCount();
    });
  }
  getBadgeCount = () => {
    AsyncStorage.getItem('cart').then((cart) => {
      if (cart !== null) {
        const cartfood = JSON.parse(cart);
        const badgeCount = cartfood.length;
        this.setState({badgeCount});
      }
    });
  };

  render() {
    return (
      <SafeAreaView
        style={{
          ...(Platform.OS === 'ios'
            ? {flex: 1, backgroundColor: 'white', paddingHorizontal: hp('5%')}
            : {flex: 1, backgroundColor: 'white'}),
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: hp('1%'),
            paddingHorizontal: wp('5%'),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MaterialIcons
            name="arrow-back"
            color="grey"
            size={35}
            onPress={() => this.props.navigation.goBack()}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: hp('3.5%'),
              fontFamily: 'Lato-Black',
              color: '#EC942A',
            }}>
            Menu
          </Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Cart')}>
            <Ionicons name="ios-cart" color="grey" size={32} />

            <View style={styles.badge}>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  color: '#fbfbfb',
                  textAlign: 'center',
                  fontSize: wp('3.5%'),
                }}>
                {this.state.badgeCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.tabbar}>
          <ScrollableTabView
            initialPage={this.props.route.params.initialPage}
            tabBarActiveTextColor="#EC942A"
            tabBarTextStyle={{fontFamily: 'Lato-Bold'}}
            renderTabBar={() => (
              <ScrollableTabBar
                underlineStyle={{
                  backgroundColor: '#EC942A',
                }}
              />
            )}>
            <Special
              tabLabel="Special"
              props={this.props}
              specialList={this.props.route.params.specialList}
              toppingsList={this.props.route.params.toppingsList}
            />
            <Pizza
              tabLabel="Pizza"
              props={this.props}
              pizzaList={this.props.route.params.pizzaList}
              toppingsList={this.props.route.params.toppingsList}
            />

            <Pasta
              tabLabel="Pasta"
              props={this.props}
              pastaList={this.props.route.params.pastaList}
            />
            <EntreeAndSide
              tabLabel="Sides"
              props={this.props}
              entreeList={this.props.route.params.entreeList}
            />
            <Salad
              tabLabel="Salad"
              props={this.props}
              saladList={this.props.route.params.saladList}
            />
            <Dessert
              tabLabel="Dessert"
              props={this.props}
              dessertList={this.props.route.params.dessertList}
            />
            <Beverages
              tabLabel="Beverages"
              props={this.props}
              beverageList={this.props.route.params.beverageList}
            />
          </ScrollableTabView>
        </View>
      </SafeAreaView>
    );
  }
}
export default MenuScreen;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  title: {
    color: '#EC942A',
    fontWeight: 'bold',
    fontSize: 25,
  },
  tabbar: {
    flex: 1,
    paddingHorizontal: wp('3%'),
  },
  badge: {
    alignItems: 'center',
    height: wp('4.5%'),
    borderRadius: 150,
    width: wp('4.5%'),
    right: 1,
    top: 0,
    backgroundColor: 'red',
    position: 'absolute',
  },
});
