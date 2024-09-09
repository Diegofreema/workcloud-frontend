import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { MyText } from '@/components/Ui/MyText';
import { HeaderNav } from '@/components/HeaderNav';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Profile } from '@/constants/types';
import { useDetailsToAdd } from '@/hooks/useDetailsToAdd';
import { useAuth } from '@clerk/clerk-expo';
import { useDarkMode } from '@/hooks/useDarkMode';
import Toast from 'react-native-toast-message';
import { Divider } from 'react-native-paper';
import { HStack } from '@gluestack-ui/themed';
import { colors } from '@/constants/Colors';

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

const Role = () => {
  const { getData } = useDetailsToAdd();
  const { userId } = useAuth();
  const { darkMode } = useDarkMode();
  const [profile, setProfile] = useState<Profile | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const getFn = async () => {
      try {
        const getProfile = async () => {
          const { data, error } = await supabase
            .from('user')
            .select(
              `name, avatar, streamToken, email, userId, organizationId (*), workerId (*)`
            )
            .eq('userId', userId!)
            .single();
          // @ts-ignore
          setProfile(data);
          return data;
        };
        const res = await queryClient.fetchQuery({
          queryKey: ['profile', userId],
          queryFn: getProfile,
        });

        return res;
      } catch (error) {
        console.log(error);
        return {};
      }
    };
    getFn();
  }, [userId]);

  const router = useRouter();

  const navigate = async (item: string) => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('workspace')
      .insert({
        ownerId: userId,
        role: item,
        organizationId: profile.organizationId?.id,
      })
      .select()
      .single();

    if (!error) {
      router.back();
      getData(item, data.id, profile.organizationId?.id);
      router.push(`/allStaffs`);
    }
    if (error) {
      console.log(error, 'dnfkjnjsd');
      router.back();
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
      <HeaderNav title="Select a role" />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={roles}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigate(item)}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          >
            <HStack justifyContent="space-between" alignItems="center" p={10}>
              <MyText fontSize={13} poppins="Medium">
                {item}
              </MyText>
            </HStack>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Role;

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 6,
  },
});
