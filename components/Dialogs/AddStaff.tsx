import React from 'react';
import { StyleSheet, Pressable, View, FlatList } from 'react-native';

import Modal from 'react-native-modal';
import { MyText } from '../Ui/MyText';
import { HStack } from '@gluestack-ui/themed';
import { colors } from '../../constants/Colors';
import { useSelectNewRow } from '../../hooks/useSelectNewRow';
import { Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { FontAwesome } from '@expo/vector-icons';
import { useAddStaff } from '@/hooks/useAddStaff';
import { useHandleStaff } from '@/hooks/useHandleStaffs';
import { useData } from '@/hooks/useData';
import { useChatContext } from 'stream-chat-expo';
import { useRemoveUser } from '@/hooks/useRemoveUser';
import { useDarkMode } from '@/hooks/useDarkMode';

const roles = [{ role: 'Add new staff' }];
export const AddStaff = () => {
  const { isOpen, onClose } = useAddStaff();
  const { onOpen: onOpenSelectRowModal } = useSelectNewRow();
  const queryClient = useQueryClient();
  const router = useRouter();

  const onOpenSelectRow = () => {
    onClose();
    onOpenSelectRowModal();
  };

  return (
    <View>
      <Modal
        hasBackdrop={false}
        onDismiss={onClose}
        animationIn={'slideInDown'}
        isVisible={isOpen}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
      >
        <View style={styles.centeredView}>
          <MyText poppins="Medium" fontSize={15}>
            Add Staff
          </MyText>
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.button,
            ]}
            onPress={onClose}
          >
            <FontAwesome name="times" size={20} color="black" />
          </Pressable>
          <Divider style={[styles.divider, { marginBottom: -10 }]} />
          <View style={{ marginTop: 20, width: '100%', gap: 14 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={roles}
              ItemSeparatorComponent={() => <Divider style={styles.divider} />}
              keyExtractor={(item) => item.role}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onOpenSelectRow()}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    p={10}
                  >
                    <MyText fontSize={13} poppins="Medium">
                      {item.role}
                    </MyText>
                  </HStack>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

type Props = {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  array: { icon: any; text: any }[];
};

export const Menu = ({ isVisible, setIsVisible, array }: Props) => {
  const queryClient = useQueryClient();
  const { onOpen } = useRemoveUser();
  const { client } = useChatContext();
  const { user } = useData();
  const router = useRouter();
  const { item } = useHandleStaff();
  const { darkMode } = useDarkMode();
  const onClose = () => {
    setIsVisible(false);
  };
  const onViewProfile = () => {
    router.push(`/workerProfile/${item?.userId?.userId}`);
    onClose();
  };

  const onRemoveStaff = async () => {
    onOpen();
    onClose();
  };

  const onSendMessage = async () => {
    const channel = client.channel('messaging', {
      members: [user?.id as string, item?.userId?.userId as any],
    });

    await channel.watch();

    router.push(`/chat/${channel.id}`);
    onClose();
  };

  const onUnlockWorkspace = async () => {
    const { error } = await supabase
      .from('workspace')
      .update({ locked: !item?.workspaceId?.locked })
      .eq('id', item?.workspaceId?.id);
    if (!error) {
      Toast.show({
        type: 'success',
        text1: 'Workspace has been unlocked',
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ['myStaffs', user?.id] });
    }

    if (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    }
  };
  const handlePress = (text: string) => {
    console.log(text);

    switch (text) {
      case 'View profile':
        onViewProfile();
        break;
      case 'Remove staff':
        onRemoveStaff();
        break;
      case 'Send message':
        onSendMessage();
        break;
      case 'Unlock workspace':
        onUnlockWorkspace();
        break;
      case 'Lock workspace':
        onUnlockWorkspace();
        break;
      default:
        break;
    }
  };
  return (
    <View>
      <Modal
        hasBackdrop={true}
        onDismiss={onClose}
        animationIn={'slideInDown'}
        isVisible={isVisible}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <View
          style={[
            styles.centeredView,
            {
              backgroundColor: darkMode === 'dark' ? 'black' : 'white',
              shadowColor: darkMode === 'dark' ? '#fff' : '#000',
            },
          ]}
        >
          <View style={{ marginTop: 20, width: '100%', gap: 14 }}>
            {array.map(({ icon, text }, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                onPress={() => handlePress(text)}
              >
                <HStack gap={15} alignItems="center" p={10}>
                  <FontAwesome
                    name={icon}
                    size={28}
                    color={
                      text === 'Remove staff'
                        ? 'red'
                        : darkMode === 'dark'
                        ? '#fff'
                        : 'black'
                    }
                  />
                  <MyText
                    poppins="Medium"
                    fontSize={13}
                    style={{
                      color:
                        text === 'Remove staff'
                          ? 'red'
                          : darkMode === 'dark'
                          ? '#fff'
                          : 'black',
                    }}
                  >
                    {text}
                  </MyText>
                </HStack>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    width: 200,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    borderRadius: 10,
  },
  trash: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 4,
    borderRadius: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 6,
  },
  button: {
    position: 'absolute',
    top: 7,
    right: 15,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.gray10,
    padding: 10,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
});
