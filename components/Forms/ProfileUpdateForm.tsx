import { Profile } from '@/constants/types';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useData } from '@/hooks/useData';
import { onDeleteImage } from '@/lib/helper';
import { supabase } from '@/lib/supabase';
import { FontAwesome } from '@expo/vector-icons';
import { Button, HStack, VStack } from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { colors } from '../../constants/Colors';
import { useSaved } from '../../hooks/useSaved';
import { InputComponent } from '../InputComponent';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { MyButton } from '../Ui/MyButton';
import { MyText } from '../Ui/MyText';
import { useUser } from '@clerk/clerk-expo';
import { ActivityIndicator } from 'react-native-paper';
const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  avatar: yup.string().required('Profile image is required'),
  phoneNumber: yup.string(),
});
export const ProfileUpdateForm = ({
  person,
}: {
  person: Profile | null | undefined;
}): JSX.Element => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { onOpen } = useSaved();
  const {
    handleSubmit,
    isSubmitting,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    resetForm,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      date_of_birth: '',
      phoneNumber: '',
      avatar: '',
    },
    validationSchema,
    onSubmit: async () => {
      const { firstName, lastName, phoneNumber, avatar } = values;

      try {
        user?.update({
          firstName,
          lastName,
          primaryPhoneNumberId: phoneNumber,
        });

        const { error } = await supabase
          .from('user')
          .update({
            avatar: user?.imageUrl,
            name: `${firstName} ${lastName}`,
            phoneNumber: phoneNumber,
          })
          .eq('userId', user?.id!);

        if (!error) {
          Toast.show({
            type: 'success',
            text1: 'Profile updated successfully',
          });
          resetForm();
          router.back();
          queryClient.invalidateQueries({
            queryKey: ['profile'],
          });
        }

        if (error) {
          console.log(JSON.stringify(error, null, 2), 'Error');
          Toast.show({
            type: 'error',
            text1: 'Error updating profile',
          });
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error updating profile',
        });
        console.log(error, 'Error');
      }
    },
  });

  const [path, setPath] = useState('');
  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (person) {
      setFieldValue('firstName', person.name.split(' ')[0]);
      setFieldValue('lastName', person.name.split(' ')[1]);
      setFieldValue('email', person.email);
      setFieldValue('date_of_birth', person.birthday);
      setFieldValue('phoneNumber', person.phoneNumber);
      setFieldValue('avatar', person.avatar);
      setFieldValue('phoneNumber', person.phoneNumber);
    }
  }, [person]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    // Save image if not cancelled
    if (!result.canceled) {
      const base64Image = `data:image/png;base64,${result.assets[0].base64}`;
      try {
        setLoading(true);
        user?.setProfileImage({ file: base64Image });
      } catch (error) {
        console.log(JSON.stringify(error, null, 1));

        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Failed to upload image',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (!person) return <LoadingComponent />;

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        >
          <Image
            contentFit="cover"
            style={{ width: 100, height: 100, borderRadius: 50 }}
            source={{ uri: user?.imageUrl }}
          />

          {loading ? (
            <ActivityIndicator
              style={[
                styles.abs,
                { backgroundColor: darkMode ? 'white' : 'black' },
              ]}
              size={20}
            />
          ) : (
            <TouchableOpacity
              style={[
                styles.abs,
                { backgroundColor: darkMode ? 'white' : 'black' },
              ]}
              onPress={pickImageAsync}
            >
              <FontAwesome
                name="plus"
                size={20}
                color={darkMode ? 'black' : 'white'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ marginTop: 50 }}>
        <MyText style={{ marginBottom: 10 }} poppins="Bold" fontSize={14}>
          User information
        </MyText>

        <VStack gap={10}>
          <>
            <InputComponent
              label="First Name"
              onChangeText={handleChange('firstName')}
              placeholder="First Name"
              value={values.firstName}
            />
            {touched.firstName && errors.firstName && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.firstName}
              </MyText>
            )}
          </>
          <>
            <InputComponent
              label="Last Name"
              onChangeText={handleChange('lastName')}
              placeholder="Last Name"
              value={values.lastName}
            />
            {touched.lastName && errors.lastName && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.lastName}
              </MyText>
            )}
          </>

          <>
            <InputComponent
              label="Phone Number"
              onChangeText={handleChange('phoneNumber')}
              placeholder="Phone Number"
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.phoneNumber}
              </MyText>
            )}
          </>
        </VStack>

        <View style={{ marginTop: 50 }}>
          <MyButton disabled={isSubmitting} onPress={() => handleSubmit()}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </MyButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  error: { color: 'red', marginTop: 2 },
  date: {
    height: 120,
    marginTop: -10,
  },
  camera: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    width: 20,
    height: 20,
    borderRadius: 9999,
    lineHeight: 20,
    verticalAlign: 'middle',
    position: 'absolute',
    bottom: 2,
    right: -2,
  },

  phone: {
    width: '100%',
    backgroundColor: '#E9E9E9',
    height: 60,
    paddingHorizontal: 20,

    borderRadius: 2,
  },

  border: {
    borderRadius: 2,
    minHeight: 50,
    alignItems: 'center',

    height: 60,
    backgroundColor: '#E9E9E9',
    borderWidth: 0,
  },
  content: {
    paddingLeft: 10,

    width: 60,
    color: 'black',
    fontFamily: 'PoppinsMedium',
    fontSize: 12,
  },

  container: {
    backgroundColor: '#E9E9E9',
    color: 'black',
    fontFamily: 'PoppinsMedium',
    marginTop: 10,
  },
  abs: {
    position: 'absolute',
    bottom: 0,
    right: 3,

    padding: 5,
    borderRadius: 30,
  },
});
