import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCreate } from '../../hooks/useCreate';
import Modal from 'react-native-modal';
import { MyText } from '../Ui/MyText';

import { HStack } from '@gluestack-ui/themed';
import { colors } from '../../constants/Colors';
import { useSelectRow } from '../../hooks/useSelectRow';
import { useQueryClient } from '@tanstack/react-query';
import { MyButton } from '../Ui/MyButton';
import { useDeleteWks } from '@/hooks/useDeleteWks';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useData } from '@/hooks/useData';
import { Button } from '@rneui/themed';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useDeletePost } from '@/hooks/useDeletePost';
import { useOpen } from '@/hooks/useOpen';
type Props = {
  onPress: () => void;
  title: string;
  isLoading: boolean;
};
export const MyModal = ({ onPress, title, isLoading }: Props) => {
  const { isOpen, onClose } = useOpen();
  const { darkMode } = useDarkMode();
  const { id: userId } = useData();

  const handlePress = async () => {
    onPress();
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
          <MyText
            poppins="Bold"
            fontSize={17}
            style={{ textAlign: 'center', marginBottom: 15 }}
          >
            Are you sure you want to this?
          </MyText>
          <MyText
            poppins="Bold"
            fontSize={20}
            style={{ textAlign: 'center', marginBottom: 15, color: 'red' }}
          >
            {title}
          </MyText>

          <HStack gap={10}>
            <Button
              disabled={isLoading}
              titleStyle={{ fontFamily: 'PoppinsMedium' }}
              buttonStyle={{
                backgroundColor: colors.closeTextColor,
                borderRadius: 5,
                width: 120,
              }}
              onPress={handlePress}
            >
              Proceed
            </Button>

            <Button
              titleStyle={{ fontFamily: 'PoppinsMedium' }}
              buttonStyle={{
                backgroundColor: colors.dialPad,
                borderRadius: 5,
                width: 120,
              }}
              onPress={onClose}
            >
              Cancel
            </Button>
          </HStack>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    padding: 30,
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
    padding: 4,
    borderRadius: 15,
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
