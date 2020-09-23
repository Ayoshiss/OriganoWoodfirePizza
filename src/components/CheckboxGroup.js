import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Checkbox from './Checkbox';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const {width, height} = Dimensions.get('screen');
class CheckboxGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.props.toppingsList,
      smallPrice: this.props.props.itemSmallPrice,
      medPrice: this.props.props.itemMedPrice,
      largePrice: this.props.props.itemLargePrice,
      finalIngredients: [],
      size: '',
      sizePrice: 0,
      ingredientPrice: 0,
    };
  }

  renderSizeSection() {
    const {size, sizePrice, smallPrice, medPrice, largePrice} = this.state;

    return (
      <View style={styles.section}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.title}>Choose your Size</Text>
          <Text
            style={{
              fontSize: 18,
              marginVertical: 14,
              paddingLeft: wp('36%'),
              color: 'green',
            }}>
            {'$'}
            {sizePrice}
          </Text>
        </View>
        <View style={styles.size}>
          <TouchableOpacity
            style={[styles.buttonSize, size === 'Small' ? styles.active : null]}
            onPress={() =>
              this.setState({size: 'Small', sizePrice: smallPrice})
            }>
            <Text style={styles.sizeText}>Small</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonSize,
              size === 'Medium' ? styles.active : null,
            ]}
            onPress={() =>
              this.setState({size: 'Medium', sizePrice: medPrice})
            }>
            <Text style={styles.sizeText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSize, size === 'Large' ? styles.active : null]}
            onPress={() =>
              this.setState({size: 'Large', sizePrice: largePrice})
            }>
            <Text style={styles.sizeText}>Large</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
    if (this.state.sizePrice == 0) {
      alert('Select a Pizza size');
      return;
    }

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
    const finalPrice = totalPrice + this.state.sizePrice;

    var food = {
      image: this.props.props.itemImg,
      name: this.props.props.itemName,
      size: this.state.size,
    };
    var itemCart = {
      food: food,
      price: finalPrice,
      quantity: 1,
      ingredients: newArry,
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
  renderIngridientSection() {
    return (
      <View style={styles.section}>
        <View>
          <Text style={{fontSize: 18, marginVertical: 14}}>
            Add Ingredients
          </Text>
        </View>
        <View>
          <FlatList
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.ItemSeparatorComponent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={{flex: 1}}>
        {this.renderSizeSection()}
        {this.renderIngridientSection()}
        <View style={styles.buttonContainer}>
          <Text
            style={{
              fontSize: hp('2.5%'),
              paddingBottom: hp('2%'),
            }}>
            Total :
            <Text style={{color: 'green'}}>
              {' '}
              {'$'}
              {this.state.ingredientPrice + this.state.sizePrice}{' '}
            </Text>
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#EC942A',
              width: width - 30,
              flex: 1,
              alignItems: 'center',
              padding: 10,
              borderRadius: 5,
              marginBottom: 20,
            }}
            onPress={this.onSubmitCart}>
            <Text style={styles.checkOutButtontext}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default CheckboxGroup;
var styles = StyleSheet.create({
  section: {
    flexDirection: 'column',
    marginHorizontal: 14,
    marginBottom: 14,
    paddingBottom: 24,
    borderBottomColor: '#A5A5A5',
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 18,
    marginVertical: 14,
  },
  size: {
    flexDirection: 'row',
    borderRadius: 7,
    borderColor: '#FF7657',
    borderWidth: 1,
    borderColor: '#FF7657',
    justifyContent: 'space-around',
  },
  buttonSize: {
    flex: 1,
    padding: 14,
    alignContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#FF7657',
    color: '#FFF',
  },
  sizeText: {
    fontSize: 16,
  },
  checkOutButtontext: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
