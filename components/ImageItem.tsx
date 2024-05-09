import { FileObject } from '@supabase/storage-js';
import { Image, View, Text, TouchableOpacity } from 'react-native';

import { useEffect, useState } from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

// Image item component that displays the image from Supabase Storage and a delte button
const ImageItem = ({
  item,
  userId,
  onRemoveImage,
  image,
  setImage,
  darkMode,
  onSelectImage,
}: {
  item: FileObject;
  userId?: string | null;
  onRemoveImage: () => void;
  image: string;
  setImage: (image: string) => void;
  darkMode?: boolean;
  onSelectImage: () => Promise<void>;
}) => {
  //   useEffect(() => {
  //     const loadImage = async () => {
  //       await supabase.storage
  //         .from('organizations')
  //         .download(`${userId}/${item?.name}`)
  //         .then(({ data }) => {
  //           const fr = new FileReader();
  //           fr.readAsDataURL(data!);
  //           fr.onload = () => {
  //             setImage(fr.result as string);
  //           };
  //         });
  //     };

  //     loadImage();
  //   }, [image]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {image ? (
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,

            backgroundColor: 'gray',
          }}
        >
          <Image style={{ width: 80, height: 80 }} source={{ uri: image }} />
          <TouchableOpacity onPress={onRemoveImage}>
            <Ionicons name="trash-outline" size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,

            backgroundColor: 'gray',
          }}
        >
          {/* <Image /> */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 0,
              right: 3,
              backgroundColor: darkMode ? 'white' : 'black',
              padding: 5,
              borderRadius: 30,
            }}
            onPress={onSelectImage}
          >
            <FontAwesome
              name="plus"
              size={20}
              color={darkMode ? 'black' : 'white'}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageItem;
