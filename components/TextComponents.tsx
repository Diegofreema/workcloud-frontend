import { HStack, VStack } from '@gluestack-ui/themed';
import { Image } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';

type Props = {};

export const TextComponents = ({}: Props): JSX.Element => {
  return (
    <HStack space="md" alignItems="center" mb={15}>
      <Image
        style={{
          width: 48,
          height: 48,
          borderRadius: 9999,
          borderWidth: 2,
          borderColor: '#4EC442',
        }}
        source={{ uri: 'https://via.placeholder.com/48x48' }}
      />

      <VStack flex={1}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text style={styles.title}>Fidelity bank PLC</Text>
          <Text style={styles.time}>Just now</Text>
        </HStack>
        <Text style={styles.text}>
          Hi, Audrey we just sent you a confimation code ...
        </Text>
      </VStack>
      <View style={styles.unread}>
        <Text style={styles.unreadText}>2</Text>
      </View>
    </HStack>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#2D2D2D',
    fontSize: 14,
    fontFamily: 'PoppinsMedium',
  },
  time: {
    color: '#B3B3B3',
    fontSize: 10,
    fontFamily: 'PoppinsLight',
  },
  text: {
    color: '#999999',
    fontSize: 12,
    fontFamily: 'PoppinsLight',
  },
  unread: {
    backgroundColor: '#0047FF',
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  unreadText: {
    color: 'white',
  },
});
