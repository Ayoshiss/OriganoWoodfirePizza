import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import EditIngredients from '../../components/EditIngredients';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export class DetailTopping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: '',
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <EditIngredients props={this.props} />
      </View>
    );
  }
}
export default DetailTopping;
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: wp('5%'),
  },
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
    borderColor: '#EC942A',
    borderWidth: 1,
    justifyContent: 'space-around',
  },
  buttonSize: {
    flex: 1,
    padding: 14,
    alignContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#EC942A',
    color: '#FFF',
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
  sizeText: {
    fontSize: 16,
  },
});
