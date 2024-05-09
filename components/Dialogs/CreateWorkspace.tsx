import React from 'react';
import { StyleSheet, Pressable, View, FlatList } from 'react-native';
// import { Plus, X } from 'lucide-react-native';
import { useCreate } from '../../hooks/useCreate';
import Modal from 'react-native-modal';
import { MyText } from '../Ui/MyText';

import { HStack } from '@gluestack-ui/themed';
import { colors } from '../../constants/Colors';
import { useSelectRow } from '../../hooks/useSelectRow';

import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { useDeleteWks } from '@/hooks/useDeleteWks';
import { DottedButton } from '../Ui/DottedButton';
import { EmptyText } from '../EmptyText';
import { useRouter } from 'expo-router';
import { Wks } from '@/constants/types';
import { useDarkMode } from '@/hooks/useDarkMode';

export const CreateWorkspaceModal = ({ workspace }: { workspace: Wks }) => {
  const { isOpen, onClose } = useCreate();
  const { darkMode } = useDarkMode();
  const { onOpen: onSelectRow, onClose: onCloseRow } = useSelectRow();
  const { onOpen: onOpenDelete, getId } = useDeleteWks();
  const router = useRouter();

  const handleClose = () => {
    onClose();
    onSelectRow();
  };
  const onDelete = (id: any) => {
    getId(id);
    onOpenDelete();
    onClose();
  };

  const handlePress = (item: Wks) => {
    onClose();

    router.push(`/wk/${item.id}`);
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
        <View
          style={[
            styles.centeredView,
            {
              backgroundColor: darkMode === 'dark' ? 'black' : 'white',
              shadowColor: darkMode === 'dark' ? '#fff' : '#000',
            },
          ]}
        >
          <MyText poppins="Bold" fontSize={20}>
            Your workspaces
          </MyText>
          <Pressable
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              styles.button,
            ]}
            onPress={onClose}
          >
            <FontAwesome
              name="times"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
              style={{ fontWeight: '300' }}
            />
          </Pressable>

          {!workspace?.id && (
            <DottedButton onPress={handleClose} text="Create personal WKS" />
          )}
          <View style={{ marginTop: 20, width: '100%' }}>
            {workspace?.id && (
              <Pressable onPress={() => handlePress(workspace)}>
                <HStack
                  justifyContent="space-between"
                  alignItems="center"
                  mb={15}
                  mx={5}
                >
                  <MyText fontSize={13} poppins="Medium">
                    {workspace?.role}
                  </MyText>
                  <Pressable
                    style={({ pressed }) => [
                      styles.trash,
                      { opacity: pressed ? 0.5 : 1 },
                    ]}
                    onPress={() => onDelete(workspace?.id)}
                  >
                    <EvilIcons
                      name="trash"
                      size={24}
                      color={colors.closeTextColor}
                    />
                  </Pressable>
                </HStack>
              </Pressable>
            )}
            {!workspace?.id && <EmptyText text="No personal WKS" />}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    borderRadius: 15,
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
    borderRadius: 55,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 4,
  },
});
