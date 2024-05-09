import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { HeaderNav } from '../../components/HeaderNav';
import { ProfileUpdateForm } from '../../components/Forms/ProfileUpdateForm';
import { CompleteDialog } from '../../components/Dialogs/SavedDialog';
import { Container } from '../../components/Ui/Container';
import { useProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';

const Update = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const { data, isError, isPending, isPaused, refetch } = useProfile(userId);

  if (isError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }
  if (isPending) {
    return <LoadingComponent />;
  }

  const { profile } = data;
  return (
    <>
      <CompleteDialog text="Changes saved successfully" />

      <Container>
        <HeaderNav title="Edit Profile" />
        <ProfileUpdateForm person={profile} />
      </Container>
    </>
  );
};

export default Update;
