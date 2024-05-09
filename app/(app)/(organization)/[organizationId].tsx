import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetPersonalWk, usePersonalOrgs } from '../../../lib/queries';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { colors } from '../../../constants/Colors';
import { EvilIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { ErrorComponent } from '../../../components/Ui/ErrorComponent';

import { useCreate } from '../../../hooks/useCreate';
import { LoadingComponent } from '../../../components/Ui/LoadingComponent';
import { useData } from '@/hooks/useData';
import { CreateWorkspaceModal } from '@/components/Dialogs/CreateWorkspace';
import { SelectRow } from '@/components/Dialogs/SelectRow';
import { DeleteWksSpaceModal } from '@/components/Dialogs/DeleteWks';
import { AuthHeader } from '@/components/AuthHeader';
import { Image } from 'expo-image';
import { WorkspaceDetails } from '@/components/WorkspaceDetails';
import { Button } from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/constants/types';
import { MyText } from '@/components/Ui/MyText';

type Props = {};
type SubProps = {
  name: any;
  text: any;
  website?: boolean;
};

// const images = [
//   {
//     name: 'Workspace',
//     uri: '../../assets/images/workspace.png',
//   },
//   {
//     name: 'Staffs',
//     uri: '../../assets/images/staff.png',
//   },
//   {
//     name: 'Messages',
//     uri: '../../assets/images/message.png',
//   },
//   {
//     name: 'Posts',
//     uri: '../../assets/images/post.png',
//   },
//   {
//     name: 'Sales',
//     uri: '../../assets/images/sales.png',
//   },
//   {
//     name: 'Featured WKS',
//     uri: '../../assets/images/featured.png',
//   },
//   {
//     name: 'Services point',
//     uri: '../../assets/images/service.png',
//   },
//   {
//     name: 'Delete WKS',
//     uri: '../../assets/images/delete.png',
//   },
// ];

export const OrganizationItems = ({ name, text, website }: SubProps) => {
  const { darkMode } = useDarkMode();

  if (website) {
    return (
      <Pressable
        onPress={() => Linking.openURL('https://' + text)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
      >
        <EvilIcons
          color={darkMode === 'dark' ? colors.white : colors.textGray}
          name={name}
          size={24}
        />
        <MyText
          poppins="Bold"
          style={{
            color: colors.buttonBlue,

            fontSize: 10,
          }}
        >
          {text}
        </MyText>
      </Pressable>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <EvilIcons
        color={darkMode === 'dark' ? colors.white : colors.textGray}
        name={name}
        size={24}
      />
      <Text
        style={{
          color: darkMode === 'dark' ? colors.white : colors.textGray,
          fontFamily: 'PoppinsBold',
          fontSize: 10,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
const OrganizationDetails = (props: Props) => {
  const { id } = useData();
  const [profile, setProfile] = useState<Profile | null>(null);

  const { organizationId } = useLocalSearchParams<{ organizationId: string }>();
  const { onOpen } = useCreate();
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const { data, isPending, error, refetch, isPaused } = usePersonalOrgs(id);

  const {
    data: workspaces,
    isPending: isPendingWks,
    isError,
    isPaused: isPausedWks,
  } = useGetPersonalWk(id);
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
            .eq('userId', id)
            .single();
          // @ts-ignore
          setProfile(data);
          return data;
        };
        const res = await queryClient.fetchQuery({
          queryKey: ['profile', id],
          queryFn: getProfile,
        });

        return res;
      } catch (error) {
        console.log(error);
        return {};
      }
    };
    getFn();
  }, [id]);
  const handleRefetch = () => {
    refetch();
  };

  if (error || isError || isPaused || isPausedWks) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  if (isPending || isPendingWks || !profile) {
    return <LoadingComponent />;
  }

  const { organizations } = data;

  const { wks, error: er } = workspaces;

  const organization = organizations[0];

  const startDay = organization?.workDays?.split('-')[0];
  const endDay = organization?.workDays?.split('-')[1];

  return (
    <>
      <CreateWorkspaceModal workspace={wks} />
      <SelectRow organizationId={organization?.id} profile={profile} />
      <DeleteWksSpaceModal />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <AuthHeader
          style={{ marginTop: 10, alignItems: 'center' }}
          path="Manage Organizations"
        />

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}
            >
              <Image
                style={{ width: 70, height: 70, borderRadius: 50 }}
                contentFit="cover"
                source={{ uri: organization?.avatar }}
              />
              <View>
                <Text
                  style={{
                    fontFamily: 'PoppinsBold',

                    fontSize: 14,
                    color: darkMode === 'dark' ? colors.white : colors.black,
                  }}
                >
                  {organization?.name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'PoppinsMedium',
                    fontSize: 10,
                    color: darkMode === 'dark' ? colors.white : colors.black,
                  }}
                >
                  {organization?.ownerId?.name} | Admin
                </Text>
              </View>
            </View>
            {id === organization?.ownerId?.userId && (
              <Button
                onPress={() =>
                  router.push(`/(app)/(organization)/edit/${organization?.id}`)
                }
                textColor="white"
                buttonColor={colors.buttonBlue}
                style={{ borderRadius: 5 }}
                labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
              >
                Edit
              </Button>
            )}
          </View>
          <View
            style={{
              marginTop: 10,
              borderTopColor: darkMode ? colors.white : colors.gray,
              borderTopWidth: 1,
              paddingTop: 10,
            }}
          >
            <MyText
              poppins="Light"
              style={{
                fontSize: 13,
              }}
            >
              {organization?.description}
            </MyText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'PoppinsBold',
                  fontSize: 10,

                  color: darkMode === 'dark' ? colors.white : colors.black,
                  textTransform: 'uppercase',
                }}
              >
                {startDay} - {endDay}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: '#CCF2D9',
                  }}
                >
                  <Text
                    style={{
                      color: '#00C041',
                      fontFamily: 'PoppinsBold',
                      fontSize: 10,
                    }}
                  >
                    {organization?.start}
                  </Text>
                </View>
                <Text style={{ marginBottom: 8 }}> — </Text>
                <View
                  style={{
                    backgroundColor: '#FFD9D9',

                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: '#D61B0C',
                      fontFamily: 'PoppinsBold',
                      fontSize: 10,
                    }}
                  >
                    {organization?.end}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              gap: 10,
              marginTop: 15,
            }}
          >
            <OrganizationItems name="envelope" text={organization?.email} />
            <OrganizationItems name="location" text={organization?.location} />
            <OrganizationItems
              name="link"
              text={organization?.website}
              website
            />
            <Text
              style={{
                fontFamily: 'PoppinsBold',
                fontSize: 12,
                color: darkMode === 'dark' ? colors.white : colors.black,
              }}
            >
              Members {organization?.followers?.length}
            </Text>
          </View>
          <View>
            <View
              style={{
                marginVertical: 20,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: darkMode === 'dark' ? colors.white : colors.gray,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <WorkspaceDetails
              onPress={onOpen}
              darkMode={darkMode}
              uri={require('../../../assets/images/workspace.png')}
              name="Workspaces"
            />

            <WorkspaceDetails
              onPress={() => router.push(`/staffs/${id}`)}
              darkMode={darkMode}
              uri={require('../../../assets/images/staff.png')}
              name="Staffs"
            />
            <WorkspaceDetails
              onPress={() => router.push(`/messages`)}
              darkMode={darkMode}
              uri={require('../../../assets/images/message.png')}
              name="Messages"
            />
            <WorkspaceDetails
              onPress={() => router.push(`/posts/${organization?.id}`)}
              darkMode={darkMode}
              uri={require('../../../assets/images/post.png')}
              name="Posts"
            />
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <WorkspaceDetails
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/featured.png')}
              name="Featured WKS"
            />
            <WorkspaceDetails
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/service.png')}
              name="Service point"
            />
            <WorkspaceDetails
              onPress={() => {}}
              darkMode={darkMode}
              uri={require('../../../assets/images/delete.png')}
              name="Delete WKS"
            />
          </View> */}
        </ScrollView>
      </View>
    </>
  );
};

export default OrganizationDetails;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
