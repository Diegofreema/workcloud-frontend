import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import { useOrganizationModal } from '../hooks/useOrganizationModal';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { MyText } from './Ui/MyText';
import { useDarkMode } from '@/hooks/useDarkMode';

type Props = {};

export const OrganizationModal = ({}: Props): JSX.Element => {
  const { isOpen, onClose } = useOrganizationModal();
  const router = useRouter();
  const { darkMode } = useDarkMode();

  const createOrganization = () => {
    router.push('/create-workspace');
    onClose();
  };
  const connectToOrganization = () => {
    router.push('/organizations');
    onClose();
  };

  const createWorkerProfile = () => {
    router.push('/create-worker-profile');
    onClose();
  };
  return (
    <Portal>
      <Dialog
        visible={isOpen}
        onDismiss={onClose}
        style={[
          styles.dialog,
          { backgroundColor: darkMode === 'dark' ? 'black' : 'white' },
        ]}
      >
        <View style={{ alignItems: 'center' }}>
          <MyText
            poppins="Bold"
            fontSize={17}
            style={{ textAlign: 'center', marginTop: 15 }}
          >
            Hi, start your journey on workcloud
          </MyText>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              { position: 'absolute', right: 15, top: -8 },
            ]}
          >
            <Feather name="x" size={20} />
          </Pressable>
        </View>
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: 'white',
            marginTop: 10,
          }}
        />
        <Dialog.Content style={{ padding: 10, alignItems: 'center' }}>
          <View style={{ gap: 15, marginTop: 20 }}>
            <Button
              buttonColor={colors.buttonBlue}
              mode="elevated"
              textColor="white"
              onPress={createOrganization}
              labelStyle={{ fontFamily: 'PoppinsLight' }}
            >
              Create An Organization
            </Button>
            <Button
              buttonColor="#C0D1FE"
              textColor={colors.buttonBlue}
              mode="elevated"
              onPress={connectToOrganization}
              labelStyle={{ fontFamily: 'PoppinsBold', fontSize: 12 }}
              contentStyle={{
                width: '100%',
              }}
            >
              Connect To An Organization
            </Button>
            <Button
              buttonColor={colors.lightBlue}
              textColor={colors.buttonBlue}
              mode="elevated"
              onPress={createWorkerProfile}
              labelStyle={{ fontFamily: 'PoppinsLight', color: 'white' }}
            >
              Register as a worker
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: 'center' }}>
          <Button
            labelStyle={{ verticalAlign: 'middle', fontFamily: 'PoppinsBold' }}
            onPress={onClose}
            textColor="blue"
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
});
