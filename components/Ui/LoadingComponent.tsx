import { StyleSheet, useColorScheme } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { defaultStyle } from '../../constants/index';
import { View } from '../Themed';
import { Container } from './Container';
import { Box } from '@gluestack-ui/themed';
import { useDarkMode } from '@/hooks/useDarkMode';

type Props = {};

export const LoadingComponent = ({}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <Box
      bg={darkMode === 'dark' ? 'black' : 'white'}
      style={{
        flex: 1,
        ...defaultStyle,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator
        size="large"
        color={darkMode === 'dark' ? 'white' : 'black'}
      />
    </Box>
  );
};

const styles = StyleSheet.create({});
