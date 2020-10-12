import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
class TrackOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      orderStatus: '',
      orderType: '',
      orderPlaced: true,
      processing: false,
      orderReady: false,
      readytoCollect: false,
      completed: false,
    };
  }
  componentDidMount() {
    const {orderId, orderType, tabName} = this.props.route.params;
    if (tabName) {
      var collectionName = tabName;
    } else {
      var collectionName = 'Orders';
    }

    this.setState({orderId, orderType});
    firestore()
      .collection(collectionName)
      .doc(orderId)
      .get()
      .then((snap) => {
        const orderStatus = snap.data().orderStatus;
        if (orderStatus == 'Requested') {
          this.setState({orderPlaced: true});
        }
        if (orderStatus == 'Processing') {
          this.setState({orderPlaced: true, processing: true});
        }
        if (orderStatus == 'Ready') {
          this.setState({
            orderPlaced: true,
            processing: true,
            orderReady: true,
            outForDelivery: true,
            readytoCollect: true,
          });
        }
        if (orderStatus == 'Completed') {
          this.setState({
            orderPlaced: true,
            processing: true,
            orderReady: true,
            outForDelivery: true,
            completed: true,
          });
        }
      });
  }
  renderStatus() {
    return (
      <View>
        <View style={styles.statusView}>
          <View style={styles.status}>
            {this.state.orderPlaced ? (
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                size={32}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            ) : (
              <MaterialCommunityIcons
                name="checkbox-marked-circle-outline"
                size={32}
                color="grey"
                style={{paddingRight: hp('8%')}}
              />
            )}
            <Text style={styles.statusText}>Order Placed</Text>
          </View>
          {this.state.processing ? (
            <View style={styles.line} />
          ) : (
            <View style={styles.line2} />
          )}
          <View style={styles.status}>
            {this.state.processing ? (
              <MaterialIcons
                name="restaurant-menu"
                size={32}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            ) : (
              <MaterialIcons
                name="restaurant-menu"
                size={32}
                color="grey"
                style={{paddingRight: hp('8%')}}
              />
            )}
            <Text style={styles.statusText}>Preparing</Text>
          </View>
          {this.state.orderReady ? (
            <View style={styles.line} />
          ) : (
            <View style={styles.line2} />
          )}
          <View style={styles.status}>
            {/* {this.state.orderType === 'Delivery' ? (
              <MaterialCommunityIcons
                name="truck-fast"
                size={32}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            ) : (
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={24}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            )}
            {this.state.orderReady ? (
              <MaterialIcons
                name="check-circle"
                size={24}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            ) : (
              <MaterialIcons
                name="access-time"
                size={24}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            )}
            {this.state.orderType === 'Delivery' ? (
              <Text style={styles.statusText}>Out for delivery</Text>
            ) : (
              <Text style={styles.statusText}>Ready to Collect</Text>
            )} */}
            {this.state.orderType === 'Pickup' && this.state.orderReady && (
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={32}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            )}
            {this.state.orderType === 'Pickup' && !this.state.orderReady && (
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={32}
                color="grey"
                style={{paddingRight: hp('8%')}}
              />
            )}
            {this.state.orderType === 'Delivery' && this.state.orderReady && (
              <MaterialCommunityIcons
                name="truck-fast"
                size={32}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            )}
            {this.state.orderType === 'Delivery' && !this.state.orderReady && (
              <MaterialCommunityIcons
                name="truck-fast"
                size={32}
                color="grey"
                style={{paddingRight: hp('8%')}}
              />
            )}
            {this.state.orderType === 'Delivery' ? (
              <Text style={styles.statusText}>Out for delivery</Text>
            ) : (
              <Text style={styles.statusText}>Ready to Collect</Text>
            )}
          </View>
          {this.state.completed ? (
            <View style={styles.line} />
          ) : (
            <View style={styles.line2} />
          )}
          <View style={styles.status}>
            {this.state.completed ? (
              <MaterialCommunityIcons
                name="check-all"
                size={32}
                color="#EC942A"
                style={{paddingRight: hp('8%')}}
              />
            ) : (
              <MaterialCommunityIcons
                name="check-all"
                size={32}
                color="grey"
                style={{paddingRight: hp('8%')}}
              />
            )}
            {this.state.orderType === 'Delivery' ? (
              <Text style={styles.statusText}>Delivered</Text>
            ) : (
              <Text style={styles.statusText}>Picked Up</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.headerText}>Order Status</Text>
        </View>
        <View style={styles.trackOrderView}>
          <Text
            style={{
              fontSize: hp('2.8%'),
              fontFamily: 'Lato-Black',
              color: '#555',
            }}>
            Order ID : <Text> {this.state.orderId}</Text>
          </Text>
          {this.renderStatus()}
          <View style={{alignSelf: 'center'}}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#F47621', '#F89919']}
                width={wp('80%')}
                height={hp('6%')}
                style={styles.buttonDelivery}>
                <Text style={styles.textOrder}>Back to Home </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    textAlign: 'center',
    fontSize: hp('3.5%'),
    fontFamily: 'Lato-Black',
    color: '#EC942A',
    paddingVertical: hp('1%'),
  },
  line: {
    height: hp('5%'),
    width: wp('0.5%'),
    marginHorizontal: wp('4%'),
    backgroundColor: '#EC942A',
  },
  line2: {
    height: hp('5%'),
    width: wp('0.5%'),
    marginHorizontal: wp('4%'),
    backgroundColor: 'grey',
  },
  trackOrderView: {
    height: hp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusView: {
    height: hp('60%'),
    justifyContent: 'center',
  },
  status: {
    flexDirection: 'row',
  },
  statusText: {
    textAlign: 'left',
    fontSize: hp('2%'),
    fontFamily: 'Lato-Bold',
    paddingVertical: hp('0.5%'),
    textTransform: 'uppercase',
    color: 'grey',
  },
  buttonDelivery: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 50,
    position: 'relative',
  },
  textOrder: {
    color: 'white',
    fontFamily: 'Lato-Black',
    fontSize: hp('2.5%'),
  },
});
export default TrackOrder;
