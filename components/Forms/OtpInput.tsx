import { Input } from '@rneui/themed';
import { forwardRef, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInputProps,
  TextInput,
} from 'react-native';

interface Props extends TextInputProps {}

export const OtpInput = forwardRef<TextInput, Props>((props, ref) => {
  return (
    <Input
      ref={ref}
      {...props}
      placeholderTextColor={'black'}
      containerStyle={{ width: 62 }}
      inputStyle={{
        borderColor: 'blue',
        borderWidth: 2,
        textAlign: 'center',
        color: 'black',
        borderRadius: 999,
      }}
      inputContainerStyle={{ borderBottomWidth: 0 }}
    />
  );
});

const styles = StyleSheet.create({});
