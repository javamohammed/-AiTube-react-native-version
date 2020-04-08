import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import Icons from 'react-native-vector-icons/Entypo';
const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Icons}
      color='black'
      iconSize={23}
    />
  );
};

export default CustomHeaderButton;
