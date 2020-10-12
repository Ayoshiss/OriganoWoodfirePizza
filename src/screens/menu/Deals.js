import React, {Component} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import styles from './pizzastyles';
import MenuItemsLinearGrad from '../../components/MenuItemsLinearGrad';

export default class Deals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name: 'Big Deal', price: 49, url: 'big'},
        {name: 'Max Deal', price: 59, url: 'max'},
        {name: 'Party Deal', price: 100, url: 'party'},
      ],
      image:
        'https://firebasestorage.googleapis.com/v0/b/origanofirewood.appspot.com/o/pizzaImages%2Foriganopizza.jpg?alt=media&token=8df5cad2-f002-47c8-94e9-4d74d26f3ef0',
    };
  }
  handleOnPress = (item) => {
    // if (item.name === 'Big Deal' || item.name === 'Max Deal') {
    //   this.props.props.navigation.navigate('BigOrMaxDeals', {
    //     image: this.state.image,
    //     price: item.price,
    //     name: item.name,
    //     pizzaList: this.props.pizzaList,
    //   });
    // } else {
    //   this.props.props.navigation.navigate('PartyDeal', {
    //     image: this.state.image,
    //     price: item.price,
    //     name: item.name,
    //     pizzaList: this.props.pizzaList,
    //     pastaList: this.props.pastaList,
    //   });
    // }
    this.props.props.navigation.navigate('DealDetails', {
      image: this.state.image,
      price: item.price,
      name: item.name,
      pizzaList: this.props.pizzaList,
      pastaList: this.props.pastaList,
    });
  };
  renderItem = ({item}) => {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}} key={item.id}>
        <MenuItemsLinearGrad
          image_container={styles.image_container}
          item_image={{
            uri: this.state.image,
          }}
          item_image_styles={styles.image}
          isPopular={item.isPopular}
          popularView={styles.popularView}
          popularImg={require('../../assets/img/Popular.png')}
          popularImgStyle={styles.popularImg}
          contentStyles={styles.content}
          nameStyles={styles.name}
          name={item.name}
          price_container={styles.price_container}
          priceStyles={styles.price}
          textPrice={styles.textPrice}
          itemPrice={item.price}
          btnStyles={styles.button}
          onPress={() => this.handleOnPress(item)}
        />
      </SafeAreaView>
    );
  };
  ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 10,
        }}
      />
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.flatList}>
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
}
