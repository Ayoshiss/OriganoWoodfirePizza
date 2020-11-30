import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: hp('2%'),
  },
  flatList: {
    flex: 1,
  },
  item: {
    flex: 1,
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('3%'),
    flexDirection: 'row',
    borderRadius: 10,
  },
  image_container: {
    width: wp('22%'),
    height: hp('12%'),
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
  },
  name: {
    color: 'white',
    
    fontSize: hp('2.5%'),
  },
  rating: {
    marginTop: hp('1%'),
    flexDirection: 'row',
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  price_container: {
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  price: {
    backgroundColor: 'white',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: 50,
  },
  textPrice: {
    color: '#F89919',
  },

  popularImg: {
    top: 0,
    right: 0,
    position: 'absolute',
    height: hp('4.1%'),
    width: wp('15.7%'),
    resizeMode: 'contain',
  },
});

export default styles;
