import React, {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import DetailScreen from './src/screens/DetailScreen';
import MenuScreen from './src/screens/MenuScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import SignupScreen from './src/screens/Profile/SignupScreen';
import LoginScreen from './src/screens/Profile/LoginScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import LoadingScreen from './src/screens/Profile/LoadingScreen';
// import AccountVerify from './src/screens/Profile/AccountVerify';
import ChangePassword from './src/screens/Profile/ChangePassword';
import ForgotPassword from './src/screens/Profile/ForgotPassword';
import OrderSuccess from './src/screens/OrderScreens/OrderSuccess';
import ShippingDetails from './src/screens/OrderScreens/ShippingDetails';
import TrackOrder from './src/screens/OrderScreens/TrackOrder';
import OrderPreference from './src/screens/OrderPreference';
import PizzaDetailScreen from './src/screens/menu/PizzaDetailScreen';
import PhoneVerification from './src/screens/Profile/PhoneVerification';
import StripeScreen from './src/screens/StripeScreens/StripeScreen';
import SplashScreen from './src/screens/SplashScreen';
import HalfPizzaScreen from './src/screens/halfPizzaScreens/HalfPizzaScreen';
import DealDetails from './src/screens/DealScreens/DealDetails';

const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="orange"
      // inactiveColor="#424242"

      barStyle={{
        backgroundColor: 'white',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="ios-home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({color}) => (
            <>
              <Ionicons name="ios-cart" color={color} size={26} />
            </>
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={MyOrdersScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="ios-pizza" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <Ionicons name="ios-person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <ProfileStack.Screen name="Loading" component={LoadingScreen} />
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Login" component={LoginScreen} />
      <ProfileStack.Screen name="Signup" component={SignupScreen} />
      {/* <ProfileStack.Screen name="AccountVerify" component={AccountVerify} /> */}
      <ProfileStack.Screen
        name="PhoneVerification"
        component={PhoneVerification}
      />
      <ProfileStack.Screen name="ChangePassword" component={ChangePassword} />
      <ProfileStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </ProfileStack.Navigator>
  );
};

const RootStack = () => {
  // const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('HomeScreen');

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp((remoteMessage) => {
      Alert.alert(
        'Alert',
        `${remoteMessage.notification.body}`,
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          setInitialRoute('Notifications'); // e.g. "Settings"
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
  }, []);

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        // initialRouteName="Autocomplete"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        headerMode="float">
        <Stack.Screen name="HomeScreen" component={HomeTabNavigator} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="PizzaDetail" component={PizzaDetailScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="StripeScreen" component={StripeScreen} />
        <Stack.Screen name="HalfPizzaScreen" component={HalfPizzaScreen} />
        <Stack.Screen name="DealDetails" component={DealDetails} />
        <Stack.Screen
          name="OrderSuccess"
          component={OrderSuccess}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen name="ShippingDetails" component={ShippingDetails} />
        <Stack.Screen name="TrackOrder" component={TrackOrder} />

        <Stack.Screen name="OrderPreference" component={OrderPreference} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
