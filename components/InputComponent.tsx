import { StyleSheet, View, Text, TextInputProps } from 'react-native';

import { useDarkMode } from '../hooks/useDarkMode';
import { colors } from '../constants/Colors';
import { fontFamily } from '../constants';
import { Input } from '@rneui/themed';
import { IconNode, InputProps } from '@rneui/base';
import { MyText } from './Ui/MyText';

type Props = TextInputProps & {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  label?: string;
  setToggle?: () => void;
  password?: boolean;
  id?: string;
  numberOfLines?: number;
  rightIcon?: IconNode;
};

export const InputComponent = ({
  onChangeText,
  placeholder,
  value,
  keyboardType,
  secureTextEntry,
  setToggle,
  id,
  password,
  label,
  numberOfLines,

  ...props
}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  const handleToggle = (inputId: string) => {
    if (id === inputId) {
      setToggle && setToggle();
    }
  };
  return (
    <>
      {label && (
        <MyText
          poppins="Bold"
          style={{
            marginBottom: 5,

            fontSize: 12,
            color: darkMode ? 'white' : 'black',
          }}
        >
          {label}
        </MyText>
      )}
      <Input
        {...props}
        placeholder={placeholder}
        containerStyle={{
          justifyContent: 'center',
        }}
        inputContainerStyle={{
          borderBottomColor: 'transparent',
          backgroundColor: '#E5E5E5',
          borderBottomWidth: 0,
          marginHorizontal: -10,
          padding: 8,
          borderRadius: 5,
        }}
        placeholderTextColor={'grey'}
        inputStyle={{
          fontFamily: 'PoppinsLight',
          fontSize: 13,
        }}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </>
  );
};

const styles = StyleSheet.create({});
