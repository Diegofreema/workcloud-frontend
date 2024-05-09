import { StyleSheet, View, Text, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/Colors';

type Props = {};

export const CallComponent = ({}: Props): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={{ uri: 'https://via.placeholder.com/48x48' }}
        />
        <View
          style={{
            gap: 2,
          }}
        >
          <Text style={styles.name}>Roland Gracias</Text>
          <View style={styles.common}>
            <Text style={styles.title}>Compliant office at hopper mobile</Text>
            <Text style={styles.time}>20 min ago</Text>
          </View>
        </View>
      </View>

      <Feather name="phone" size={24} color={colors.phone1} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 11,

    flexDirection: 'row',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#2D2D2D',
  },

  name: {
    color: '#2D2D2D',
    fontSize: 14,
    fontFamily: 'PoppinsBold',
    fontWeight: '500',
  },

  time: {
    textAlign: 'right',
    color: '#999999',
    fontSize: 10,
    fontFamily: 'PoppinsLight',
    fontWeight: '400',
  },

  title: {
    color: '#999999',
    fontSize: 12,
    fontFamily: 'PoppinsLight',
    fontWeight: '400',
    maxWidth: 200,
  },

  common: {
    alignItems: 'flex-start',
    gap: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
