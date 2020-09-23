import React, {Component} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

export default class StorePicker extends Component {
  render() {
    return (
      <DropDownPicker
        items={[
          {
            label: 'Origano Woodfire Pizza, Alexandria',
          },
        ]}
        placeholder="Select Pickup Store"
        defaultIndex={0}
        containerStyle={{height: 40}}
        onChangeItem={this.props.onChangeItem}
      />
    );
  }
}
