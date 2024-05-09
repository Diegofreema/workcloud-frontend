import { Pressable } from 'react-native';
import React from 'react';
import { Container } from '@/components/Ui/Container';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { HeaderNav } from '@/components/HeaderNav';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useGetPosts } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { uploadPostImage } from '@/lib/helper';
import { useQueryClient } from '@tanstack/react-query';
import { useData } from '@/hooks/useData';
import { DeletePostModal } from '@/components/Dialogs/DeletePost';
import { PostComponent } from '@/components/PostComponent';

const Posts = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data,
    isPending,
    isRefetching,
    refetch,
    isPaused,
    isError,
    isRefetchError,
  } = useGetPosts(id);
  if (isError || isPaused || isRefetchError) {
    return <ErrorComponent refetch={refetch} />;
  }
  if (isPending) {
    return <LoadingComponent />;
  }

  const { imgUrls } = data;
  console.log(imgUrls, 'data');

  return (
    <>
      <Container>
        <HeaderNav title="Posts" RightComponent={RightComponent} />
        <DeletePostModal />
        <PostComponent
          isRefetching={isRefetching}
          refetch={refetch}
          imgUrls={imgUrls}
        />
      </Container>
    </>
  );
};

export default Posts;

const RightComponent = () => {
  const { darkMode } = useDarkMode();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { id: userId } = useData();
  const queryClient = useQueryClient();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;
      try {
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, arraybuffer, {
            contentType: image.mimeType ?? 'image/jpeg',
          });

        if (uploadError) {
          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: 'Failed to upload image',
          });
        }

        if (!uploadError) {
          uploadPostImage(
            `https://mckkhgmxgjwjgxwssrfo.supabase.co/storage/v1/object/public/avatars/${data.path}`,
            id
          );
          Toast.show({
            type: 'success',
            text1: 'Image uploaded successfully',
            text2: 'Your image has been uploaded',
          });
          queryClient.invalidateQueries({ queryKey: ['posts', userId] });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Failed to upload image',
        });
      }
    }
  };
  return (
    <Pressable
      onPress={pickImage}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
    >
      <AntDesign
        name="pluscircleo"
        size={24}
        color={darkMode === 'dark' ? 'white' : 'black'}
      />
    </Pressable>
  );
};
