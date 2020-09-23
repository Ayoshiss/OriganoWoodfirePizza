import React, {Component} from 'react';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import OrdersTab from './MyOrdersTab/OrdersTab';
export class MyOrdersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUid: '',
      uid: '',
      orders: [],
      completedOrders: [],
      isUser: false,
      noOrders: true,
      orderType: '',
    };
  }
  getOrdersData = (currentUid) => {
    let ordersData = [];
    var changedOrders = [];
    firestore()
      .collection('Orders')
      .where('uid', '==', currentUid)
      .onSnapshot((snapshot) => {
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          if (change.type === 'added') {
            var address,
              dataCart,
              date,
              orderId,
              orderStatus,
              orderType,
              paymentStatus,
              paymentType,
              specialInstruction,
              totalPrice,
              uid;
            address = change.doc.data().address;
            dataCart = change.doc.data().dataCart;
            date = change.doc.data().date;
            orderId = change.doc.data().orderId;
            orderStatus = change.doc.data().orderStatus;
            orderType = change.doc.data().orderType;
            paymentStatus = change.doc.data().paymentStatus;
            paymentType = change.doc.data().paymentType;
            specialInstruction = change.doc.data().specialInstruction;
            totalPrice = change.doc.data().totalPrice;
            uid = change.doc.data().uid;
            modifiedOrders = [
              address,
              dataCart,
              date,
              orderId,
              orderStatus,
              orderType,
              paymentStatus,
              paymentType,
              specialInstruction,
              totalPrice,
              uid,
            ];
            ordersData = [...ordersData, modifiedOrders];
            this.setState({orders: ordersData, noOrders: false});
          }
          if (change.type === 'modified') {
            var modifiedOrders,
              address = change.doc.data().address;
            dataCart = change.doc.data().dataCart;
            date = change.doc.data().date;
            orderId = change.doc.data().orderId;
            orderStatus = change.doc.data().orderStatus;
            orderType = change.doc.data().orderType;
            paymentStatus = change.doc.data().paymentStatus;
            paymentType = change.doc.data().paymentType;
            specialInstruction = change.doc.data().specialInstruction;
            totalPrice = change.doc.data().totalPrice;
            uid = change.doc.data().uid;
            modifiedOrders = [
              address,
              dataCart,
              date,
              orderId,
              orderStatus,
              orderType,
              paymentStatus,
              paymentType,
              specialInstruction,
              totalPrice,
              uid,
            ];
            changedOrders = this.state.orders.filter((item) => {
              return item[3] !== modifiedOrders[3];
            });
            changedOrders = [...changedOrders, modifiedOrders];
            this.setState({orders: changedOrders, noOrders: false});
          }
          if (change.type === 'removed') {
            changedOrders = this.state.orders.filter((item) => {
              return item[3] !== change.doc.data().orderId;
            });
            this.setState({orders: changedOrders, noOrders: false});
          }
        });
      });
  };
  getCompletedOrders = (asd) => {
    let completedOrders = [];
    let changedOrders = [];
    const {currentUid} = this.state;
    firestore()
      .collection('Completed Orders')
      .where('uid', '==', currentUid)
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length === 0) {
          this.setState({completedOrders: []});
          return;
        }
        let changes = snapshot.docChanges();
        changes.forEach((change) => {
          if (change.type === 'added') {
            x = change.doc.data();
            var address,
              dataCart,
              date,
              orderId,
              orderStatus,
              orderType,
              paymentStatus,
              paymentType,
              specialInstruction,
              totalPrice,
              uid,
              modifiedOrders;
            address = change.doc.data().address;
            dataCart = change.doc.data().dataCart;
            date = change.doc.data().date;
            orderId = change.doc.data().orderId;
            orderStatus = change.doc.data().orderStatus;
            orderType = change.doc.data().orderType;
            paymentStatus = change.doc.data().paymentStatus;
            paymentType = change.doc.data().paymentType;
            specialInstruction = change.doc.data().specialInstruction;
            totalPrice = change.doc.data().totalPrice;
            uid = change.doc.data().uid;
            modifiedOrders = [
              address,
              dataCart,
              date,
              orderId,
              orderStatus,
              orderType,
              paymentStatus,
              paymentType,
              specialInstruction,
              totalPrice,
              uid,
            ];
            completedOrders = [...completedOrders, modifiedOrders];
            this.setState({completedOrders, noOrders: false});
          }
          if (change.type === 'removed') {
            changedOrders = this.state.completedOrders.filter((item) => {
              return item[3] !== change.doc.data().orderId;
            });
            this.setState({completedOrders: changedOrders, noOrders: false});
          }
        });
      });
  };
  componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      auth().onAuthStateChanged((user) => {
        if (user) {
          const currentUid = user.uid;
          this.setState({currentUid, isUser: true});
          this.getOrdersData(currentUid);
          this.getCompletedOrders(currentUid);
        } else {
          this.setState({orders: [], isUser: false});
        }
      });
    });
  }
  renderIsUserWithOrders() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollableTabView
          tabBarActiveTextColor="#EC942A"
          tabBarTextStyle={{fontFamily: 'Lato-Bold'}}
          renderTabBar={() => (
            <ScrollableTabBar
              underlineStyle={{
                backgroundColor: '#EC942A',
              }}
            />
          )}>
          <OrdersTab
            orders={this.state.orders}
            tabLabel="Active Orders"
            props={this.props}
            tabName="Orders"
          />
          <OrdersTab
            orders={this.state.completedOrders}
            tabLabel="Completed Orders"
            props={this.props}
            tabName="Completed Orders"
          />
        </ScrollableTabView>
      </SafeAreaView>
    );
  }
  renderIsUserWithNoOrders() {
    return (
      <SafeAreaView>
        <View
          style={{
            paddingHorizontal: wp('5%'),
            paddingVertical: hp('5%'),
          }}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
              color: '#B6B6B6',
            }}>
            No Orders History. Start Ordering.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  renderNotUser() {
    return (
      <SafeAreaView>
        <View
          style={{
            paddingHorizontal: wp('5%'),
            paddingVertical: hp('5%'),
          }}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
              color: '#B6B6B6',
            }}>
            Please Login to view your orders
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  render() {
    const {isUser, noOrders} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: hp('1%'),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: hp('3.5%'),
              fontFamily: 'Lato-Black',
              color: '#EC942A',
            }}>
            My Orders
          </Text>
        </View>
        {isUser && !noOrders && this.renderIsUserWithOrders()}
        {isUser && noOrders && this.renderIsUserWithNoOrders()}
        {!isUser && this.renderNotUser()}
      </SafeAreaView>
    );
  }
}
export default MyOrdersScreen;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  // boldText: {
  //   fontWeight: 'bold',
  //   fontSize: hp('2%'),
  //   color: 'grey',
  // },
  simpleText: {
    fontSize: hp('2%'),
    color: 'grey',
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
    fontWeight: 'bold',
    fontSize: hp('2%'),
  },
});
