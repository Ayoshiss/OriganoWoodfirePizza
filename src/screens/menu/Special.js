import React, {Component} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import styles from './pizzastyles';
import MenuItemsLinearGrad from '../../components/MenuItemsLinearGrad';

export default class Salad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.setState({data: this.props.specialList});
  }
  handleOnPress = (item) => {
    if (
      item.type === 'Pasta' ||
      item.type === 'Sides' ||
      item.type === 'Salad' ||
      item.type === 'Dessert' ||
      item.type === 'Beverages'
    ) {
      this.props.props.navigation.navigate('Detail', {
        image: item.image,
        price: item.price,
        name: item.name,
        desc: item.desc,
        type: item.type,
        isAvailable: item.isAvailable,
      });
    } else {
      this.props.props.navigation.navigate('PizzaDetail', {
        image: item.image,
        price: item.smallPrice,
        smallPrice: item.smallPrice,
        medPrice: item.medPrice,
        largePrice: item.largePrice,
        gfPrice: item.gfPrice,
        name: item.name,
        type: item.type,
        desc: item.desc,
        toppingsList: this.props.toppingsList,
        isAvailable: item.isAvailable,
      });
    }
  };
  renderItem = ({item}) => {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}} key={item.id}>
        <MenuItemsLinearGrad
          image_container={styles.image_container}
          item_image={{uri: item.image}}
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
          itemType={item.type}
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
