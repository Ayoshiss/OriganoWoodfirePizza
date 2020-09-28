import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Feather';
class OrdersTab extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {orders, tabName} = this.props;
    if (tabName === 'Orders' && orders.length === 0) {
      return (
        <Text
          style={{
            paddingHorizontal: wp('10%'),
            paddingVertical: hp('2%'),
            fontFamily: 'Lato-Black',
            color: '#B6B6B6',
          }}>
          No Active Orders
        </Text>
      );
    }
    if (tabName === 'Completed Orders' && orders.length === 0) {
      return (
        <Text
          style={{
            paddingHorizontal: wp('10%'),
            paddingVertical: hp('2%'),
            fontFamily: 'Lato-Black',
            color: '#B6B6B6',
          }}>
          No Completed Orders Yet
        </Text>
      );
    } else {
      return (
        <ScrollView style={{flex: 1}}>
          {orders.map((item, i) => {
            var date = item[2];
            var newDate = date.substr(0, 15);
            var quantity = 0;
            var orderType = item[5];
            item[1].map((food) => {
              quantity = quantity + food.quantity;
            });
            return (
              <Card
                key={i}
                elevation={2}
                cornerRadius={20}
                style={styles.cardView}>
                <View style={styles.orderContentView}>
                  <Text style={styles.boldText}>{item[3]}</Text>
                  <Text style={styles.boldText}>{newDate}</Text>
                </View>
                <View style={styles.orderContentView}>
                  <Text style={styles.simpleText}>
                    Items :
                    <Text style={{fontFamily: 'Lato-Black'}}> {quantity}</Text>
                  </Text>
                  <Text style={styles.simpleText}>
                    Total Amount:{' '}
                    <Text style={{fontFamily: 'Lato-Black'}}>${item[9]}</Text>
                  </Text>
                </View>
                <View style={styles.orderContentView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.props.navigation.navigate('OrderSuccess', {
                        docID: item[3],
                        dataCart: item[1],
                        orderType,
                        previousScreen: 'My Orders',
                        tabName,
                      });
                    }}>
                    <View style={styles.detailBtn}>
                      <Text
                        style={{fontFamily: 'Lato-Black', color: '#EC942A'}}>
                        Details
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        this.props.props.navigation.navigate('TrackOrder', {
                          orderId: item[3],
                          orderType,
                          tabName,
                        });
                      }}>
                      <Text style={styles.statusText}>{item[4]}</Text>
                      <Icon name="arrow-up-right" size={20} color="#EC942A" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: 'red',
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
  cardView: {
    minHeight: hp('15%'),
    width: wp('90%'),
    alignSelf: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginVertical: hp('1%'),
  },
  boldText: {
    fontFamily: 'Lato-Black',
    color: '#B6B6B6',
    fontSize: hp('2%'),
    color: 'grey',
  },
  simpleText: {
    fontSize: hp('2%'),
    fontFamily: 'Lato-Bold',
    color: '#B6B6B6',
  },
  orderContentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: hp('2%'),
    alignItems: 'center',
  },
  detailBtn: {
    height: hp('5%'),
    width: wp('20%'),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#EC942A',
    fontFamily: 'Lato-Black',
    fontSize: hp('2%'),
  },
});
export default OrdersTab;
