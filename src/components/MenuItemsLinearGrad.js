import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../../src/screens/menu/pizzastyles';
import FastImage from 'react-native-fast-image';
export default function MenuItemsLinearGrad({
  image_container,
  item_image,
  item_image_styles,
  isPopular,
  popularImg,
  popularImgStyle,
  contentStyles,
  nameStyles,
  name,
  price_container,
  priceStyles,
  textPrice,
  itemPrice,
  btnStyles,
  onPress,
  itemType,
}) {
  return (
    <LinearGradient
      colors={['#F47621', '#F89919']}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 0}}
      style={styles.item}>
      <TouchableOpacity onPress={onPress}>
        <View style={image_container}>
          <FastImage source={item_image} style={item_image_styles} />
          {isPopular === 'Yes' && (
            // <View style={popularView}>
            <FastImage source={popularImg} style={popularImgStyle} />
            // </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={contentStyles}>
        <TouchableOpacity onPress={onPress}>
          <Text style={nameStyles}>{name}</Text>
        </TouchableOpacity>

        {itemPrice && (
          <View style={price_container}>
            <View style={priceStyles}>
              <Text style={textPrice}>${itemPrice}</Text>
            </View>
          </View>
        )}

        {itemType && (
          <View style={price_container}>
            <View style={priceStyles}>
              <Text style={textPrice}>{itemType}</Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={onPress} style={btnStyles}>
        <AntDesign name="arrowright" color="#CC0000" size={15} />
      </TouchableOpacity>
    </LinearGradient>
  );
}
