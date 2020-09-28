import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { purple } from '../utils/colors';

export default function ({ children, onPress, style = {} }) {
  return(
    <TouchableOpacity onPress={onPress}>
      <Text style={[{textAlign: 'center', color: purple}, style]}>{ children }</Text>
    </TouchableOpacity>
  )
}