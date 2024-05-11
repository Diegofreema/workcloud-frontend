import React from 'react';
import { StyleSheet, Pressable, View, FlatList } from 'react-native';

import Modal from 'react-native-modal';
import { MyText } from '../Ui/MyText';
import { HStack } from '@gluestack-ui/themed';
import { colors } from '../../constants/Colors';
import { useSelectRow } from '../../hooks/useSelectRow';
import { Divider } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { FontAwesome } from '@expo/vector-icons';
import { useData } from '@/hooks/useData';
import { Profile } from '@/constants/types';
import { useRouter } from 'expo-router';
import { useDarkMode } from '@/hooks/useDarkMode';

const roles = [
  'Manager',
  'Consultant',
  'Team Leader',
  'Business Analyst',
  'Project Manager',
  'Developer',
  'Designer',
  'Dentist',
  'Content Creator',
  'Marketer',
  'Sales Representative',
  'Customer Support',
  'Human Resources Manager',
  'Finance Manager',
  'IT Support Specialist',
  'Operations Manager',
  'Legal Counsel',
  'Quality Assurance Analyst',
  'Data Analyst',
  'Researcher',
  'Trainer',
  'Executive',
  'Agent',
  'Advisor',
  'Therapist',
  'Health Consultant',
  'Entrepreneur',
  'Publicist',
  'Risk Manager',
  'Control',
  'Auditor',
  'Account Officer',
  'Help Desk',
  'Complaint Desk',
  'ICT Support',
  'Customers Support',
];
export const SelectRow = ({
  organizationId,
  profile,
}: {
  organizationId: number;
  profile: Profile;
}) => {
  const { isOpen, onClose } = useSelectRow();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const { id } = useData();
  console.log(profile.id);

  const createWorkspace = async (role: string) => {
    if (!profile?.workerId?.id) {
      Toast.show({
        type: 'info',
        text1: 'Failed to create workspace',
        text2: "Please create a worker's profile first",
      });
      router.push('/create-worker-profile');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('workspace')
        .insert({
          role: role,
          ownerId: id,
          organizationId: organizationId,
          workerId: profile?.workerId?.userId,
          personal: true,
          locked: false,
        })
        .select()
        .single();

      if (!error) {
        const { error: err } = await supabase
          .from('worker')
          .update({
            workspaceId: data?.id,
            organizationId: profile?.organizationId?.id,
          })
          .eq('userId', id);
        if (!err) {
          Toast.show({
            type: 'success',
            text1: 'Workspace created successfully',
          });
          queryClient.invalidateQueries({ queryKey: ['personal', id] });
        }

        if (err) {
          console.log(err);

          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: 'Please try again later',
          });
        }
      }
      if (error) {
        console.log(error, 'error');

        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again later',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    }
    onClose();
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
          <MyText poppins="Medium" fontSize={15}>
            Select your role
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
              size={20}
              color={darkMode === 'dark' ? '#fff' : '#000'}
            />
          </Pressable>
          <Divider style={[styles.divider, { marginBottom: -10 }]} />
          <View style={{ marginTop: 20, width: '100%', gap: 14 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={roles}
              ItemSeparatorComponent={() => <Divider style={styles.divider} />}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => createWorkspace(item)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    p={10}
                  >
                    <MyText fontSize={13} poppins="Medium">
                      {item}
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

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
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
