import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from './Checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
class EditIngredients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descList: this.props.props.descList,
      toppings: false,
      data: this.props.props.toppingsList,
      smallPrice: this.props.props.itemSmallPrice,
      medPrice: this.props.props.itemMedPrice,
      largePrice: this.props.props.itemLargePrice,
      gfPrice: this.props.props.itemGfPrice,
      finalIngredients: [],
      size: '',
      sizePrice: 0,
      ingredientPrice: 0,
      checkSize: null,
      quantity: 1,
      newDescList: [],
    };
  }
  componentDidMount() {
    let newDescList = [];
    this.state.descList.map((item) => {
      let quantity = 1;
      newDescList = [...newDescList, {item, quantity}];
    });
    this.setState({newDescList});
  }
  onChangeQuat(i, type) {
    const {newDescList} = this.state;
    let newQuantity = newDescList[i].quantity;
    if (type && newQuantity < 1) {
      newQuantity = newQuantity + 1;
      newDescList[i].quantity = newQuantity;
      this.setState({newDescList});
    }
    if (!type && newQuantity > 0) {
      newQuantity = newQuantity - 1;
      newDescList[i].quantity = newQuantity;
      this.setState({newDescList});
    }
  }
  renderIngredients = () => {
    const {newDescList} = this.state;
    const {smallPrice, medPrice, largePrice, gfPrice, checkSize} = this.state;
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: hp('3%'),
              marginVertical: 14,
              fontFamily: 'Lato-Black',
              alignSelf: 'center',
            }}>
            Pizza Ingredients
          </Text>
        </View>
        <ScrollView style={{height: hp('46.5%')}}>
          <View
            style={{
              ...(Platform.OS !== 'android'
                ? {
                    zIndex: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }
                : {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }),
            }}>
            <DropDownPicker
              items={[
                {
                  label: 'Small',
                  value: 'Small',
                },
                {
                  label: 'Medium',
                  value: 'Medium',
                },
                {
                  label: 'Large',
                  value: 'Large',
                },
                {
                  label: 'Gluten Free',
                  value: 'Gluten Free',
                },
              ]}
              placeholder="Select Size"
              defaultIndex={0}
              labelStyle={{
                fontSize: hp('2.2%'),
                textAlign: 'left',
                color: '#000',
                fontFamily: 'Lato-Regular',
              }}
              containerStyle={{
                height: hp('6%'),
                width: wp('60%'),

                // marginHorizontal: wp('5%'),
                marginVertical: hp('2%'),
              }}
              onChangeItem={(item) => {
                const checkSize = item.value;
                let temp = 0;
                if (checkSize === 'Small') {
                  temp = smallPrice;
                }
                if (checkSize === 'Medium') {
                  temp = medPrice;
                }
                if (checkSize === 'Large') {
                  temp = largePrice;
                }
                if (checkSize === 'Gluten Free') {
                  temp = gfPrice;
                }
                this.setState({checkSize, sizePrice: temp});
              }}
            />
            <Text style={{color: 'white'}}>$</Text>
            <Text style={styles.price}>${this.state.sizePrice}</Text>
            <Text style={{color: 'white'}}>$</Text>
          </View>
          <View>
            {newDescList.map((item, i) => {
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: hp('0.5%'),
                  }}>
                  <View style={{width: wp('60%')}}>
                    <Text
                      style={{
                        fontSize: hp('2.2%'),
                        fontFamily: 'Lato-Regular',
                      }}>
                      {item.item}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.onChangeQuat(i, false)}>
                      <Ionicons
                        name={'ios-remove-circle'}
                        style={{color: '#EC942A'}}
                        size={30}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'Lato-Bold',
                        paddingHorizontal: wp('4%'),
                      }}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.onChangeQuat(i, true)}>
                      <Ionicons
                        name={'ios-add-circle'}
                        style={[{color: '#EC942A'}]}
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View
          style={{
            backgroundColor: '#EC942A',
            height: hp('0.1%'),
            width: wp('90%'),
            alignSelf: 'center',
          }}
        />
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {
            this.setState({toppings: true});
          }}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              paddingHorizontal: wp('5%'),
              paddingVertical: hp('2.5%'),
              fontFamily: 'Lato-Black',
            }}>
            Add More Toppings
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  renderToppings = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: wp('1.5%'),
          }}>
          <Ionicons
            name={
              Platform.OS === 'ios'
                ? 'arrow-back-outline'
                : 'ios-arrow-round-back'
            }
            color="grey"
            size={Platform.OS === 'ios' ? 35 : 42}
            onPress={() => this.setState({toppings: false})}
          />
          <Text
            style={{
              fontSize: hp('3%'),
              marginVertical: 14,
              fontFamily: 'Lato-Black',
              alignSelf: 'center',
            }}>
            Add More Toppings
          </Text>
          <Ionicons
            name={
              Platform.OS === 'ios'
                ? 'arrow-back-outline'
                : 'ios-arrow-round-back'
            }
            color="white"
            size={Platform.OS === 'ios' ? 35 : 42}
          />
        </View>
        <View>
          <FlatList
            style={{height: hp('55%')}}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.ItemSeparatorComponent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
  };
  renderItem = ({item}) => {
    let {ingredientPrice} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Checkbox
          ingredient={item.name}
          addIngredient={() => {
            if (!this.state[item.name]) {
              ingredientPrice = ingredientPrice + item.price;
            } else {
              ingredientPrice = ingredientPrice - item.price;
            }
            this.setState({
              [item.name]: !this.state[item.name],
              ingredientPrice,
            });
          }}
          checkValue={this.state[item.name]}
          price={item.price}
        />
      </SafeAreaView>
    );
  };
  onSubmitCart = () => {
    const {sizePrice} = this.state;
    if (sizePrice == 0) {
      alert('Select a Pizza size');
      return;
    }
    let finalDesc = [];
    this.state.newDescList.map((item) => {
      if (item.quantity === 0) {
        finalDesc = [...finalDesc, item.item];
      }
    });
    let newArry = [...this.state.finalIngredients];
    this.state.data.map((item) => {
      if (this.state[item.name]) {
        const name = item.name;
        const price = item.price;
        newArry = [...newArry, {name, price}];
      }
    });
    let totalPrice = 0;
    newArry.map((item) => {
      totalPrice += item.price;
    });
    const finalPrice = totalPrice + sizePrice;
    var food = {
      image: this.props.props.itemImg,
      name: this.props.props.itemName,
      size: this.state.checkSize,
    };
    var itemCart = {
      food: food,
      price: finalPrice,
      quantity: 1,
      ingredients: newArry,
      finalDesc,
    };
    AsyncStorage.getItem('cart')
      .then((datacart) => {
        if (datacart !== null) {
          const cart = JSON.parse(datacart);
          cart.push(itemCart);
          AsyncStorage.setItem('cart', JSON.stringify(cart));
        } else {
          const cart = [];
          cart.push(itemCart);
          AsyncStorage.setItem('cart', JSON.stringify(cart));
        }
        this.props.props.closeRB();
        this.props.props.badgeCount();
        alert('Item added to Cart');
      })
      .catch((error) => {
        alert(error);
      });
  };
  render() {
    const {toppings} = this.state;
    return (
      <View>
        {!toppings && this.renderIngredients()}
        {toppings && this.renderToppings()}
        <View
          style={{
            backgroundColor: '#EC942A',
            height: hp('0.1%'),
            width: wp('90%'),
            alignSelf: 'center',
          }}
        />
        <View style={styles.buttonContainer}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              paddingVertical: hp('1%'),
              fontFamily: 'Lato-Regular',
            }}>
            Total :
            <Text style={{color: 'green', fontFamily: 'Lato-Black'}}>
              {' '}
              {'$'}
              {this.state.ingredientPrice + this.state.sizePrice}{' '}
            </Text>
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#EC942A',
              width: wp('90%'),
              alignItems: 'center',
              padding: 10,
              borderRadius: 5,
            }}
            onPress={this.onSubmitCart}>
            <Text style={styles.checkOutButtontext}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hp('2%'),
  },
  title: {
    fontSize: hp('2.2%'),
    paddingHorizontal: wp('5%'),
  },
  sizeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Lato-Bold',
    fontSize: hp('2.2%'),
  },
  checkOutButtontext: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default EditIngredients;
