import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { Button, Center, HStack, VStack } from '@gluestack-ui/themed';
import PhoneInput from 'react-native-phone-input';
import { Image } from 'expo-image';
import { SelectList } from 'react-native-dropdown-select-list';
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MyText } from '../Ui/MyText';
import { InputComponent } from '../InputComponent';
import { colors } from '../../constants/Colors';
import { MyButton } from '../Ui/MyButton';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSaved } from '../../hooks/useSaved';
import { Person, Profile } from '@/constants/types';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useData } from '@/hooks/useData';
import { LoadingComponent } from '../Ui/LoadingComponent';
import { onDeleteImage } from '@/lib/helper';
import { useDarkMode } from '@/hooks/useDarkMode';
const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email'),
  avatar: yup.string().required('Profile image is required'),
  date_of_birth: yup.string(),
  phoneNumber: yup.string(),
});
export const ProfileUpdateForm = ({
  person,
}: {
  person: Profile | null | undefined;
}): JSX.Element => {
  const { id } = useData();
  const queryClient = useQueryClient();
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
      const { date_of_birth, email, firstName, lastName, phoneNumber, avatar } =
        values;

      try {
        const { error } = await supabase
          .from('user')
          .update({
            avatar: avatar,
            name: `${firstName} ${lastName}`,
            email: email,
            birthday: date_of_birth,
            phoneNumber: phoneNumber,
          })
          .eq('userId', id);

        if (!error) {
          Toast.show({
            type: 'success',
            text1: 'Profile updated successfully',
          });
          queryClient.invalidateQueries({
            queryKey: ['profile', id],
          });
        }

        if (error) {
          console.log(error, 'Error');
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

      resetForm();

      router.back();
    },
  });

  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  console.log(values.avatar);
  const [path, setPath] = useState('');
  const { darkMode } = useDarkMode();
  const [date, setDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showPicker, setShowPicker] = useState(false);

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
      quality: 1,
      base64: true,
    });

    // Save image if not cancelled
    if (!result.canceled) {
      const image = result.assets[0];

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;
      try {
        const { data, error: uploadError } = await supabase.storage
          .from('avatars/profile')
          .upload(path, arraybuffer, {
            contentType: image.mimeType ?? 'image/jpeg',
          });

        if (uploadError) {
          throw uploadError.message;
        }

        if (!uploadError) {
          setPath(data?.path);
          setFieldValue(
            'avatar',
            // @ts-ignore
            `https://mckkhgmxgjwjgxwssrfo.supabase.co/storage/v1/object/public/${data?.fullPath}`
          );
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

  const onHideDatePicker = () => {
    setShowPicker(false);
  };

  const onShowDatePicker = () => {
    setShowPicker(true);
  };

  const onChange = (event: any, selectedDate: any) => {
    if (event.type === 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === 'android') {
        setDateOfBirth(currentDate.toISOString().split('T')[0]);
        setFieldValue(
          'date_of_birth',
          format(currentDate.toISOString(), 'yyyy-MM-dd')
        );
        onHideDatePicker();
      }
    }
  };

  const onConfirmIos = () => {
    setDateOfBirth(inputDate?.toISOString().split('T')[0] || '');
    setFieldValue('date_of_birth', dateOfBirth);
    onHideDatePicker();
  };
  const handleDeleteImage = () => {
    setFieldValue('avatar', '');

    onDeleteImage(`logo/${path}`);
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
            source={{ uri: values.avatar }}
          />
          {!values.avatar && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 3,
                backgroundColor: darkMode ? 'white' : 'black',
                padding: 5,
                borderRadius: 30,
              }}
              onPress={pickImageAsync}
            >
              <FontAwesome
                name="plus"
                size={20}
                color={darkMode ? 'black' : 'white'}
              />
            </TouchableOpacity>
          )}
          {values.avatar && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 3,
                backgroundColor: darkMode ? 'white' : 'black',
                padding: 5,
                borderRadius: 30,
              }}
              onPress={handleDeleteImage}
            >
              <FontAwesome name="trash" size={20} color={'red'} />
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
              label="Email"
              onChangeText={handleChange('email')}
              placeholder="Email"
              value={values.email}
            />
            {touched.email && errors.email && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.email}
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

          <>
            {showPicker && Platform.OS === 'android' && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
              />
            )}
            {showPicker && Platform.OS === 'ios' && (
              <>
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  style={styles.date}
                />
                <HStack justifyContent="space-between" alignItems="center">
                  <Button
                    onPress={onHideDatePicker}
                    style={{
                      backgroundColor: colors.textGray,
                      borderRadius: 10,
                    }}
                  >
                    <MyText
                      poppins="Medium"
                      fontSize={12}
                      style={{ color: 'black' }}
                    >
                      Cancel
                    </MyText>
                  </Button>
                  <Button
                    style={{
                      backgroundColor: colors.dialPad,
                      borderRadius: 10,
                    }}
                    onPress={onConfirmIos}
                  >
                    <MyText
                      poppins="Medium"
                      fontSize={12}
                      style={{ color: 'white' }}
                    >
                      Confirm
                    </MyText>
                  </Button>
                </HStack>
              </>
            )}

            {Platform.OS === 'android' ? (
              <Pressable onPress={onShowDatePicker}>
                <InputComponent
                  editable={false}
                  label="Date Of Birth"
                  placeholder="Date Of Birth"
                  value={values.date_of_birth}
                />
              </Pressable>
            ) : (
              <InputComponent
                editable={false}
                label="Date Of Birth"
                placeholder="Date Of Birth"
                value={values.date_of_birth}
                onPressIn={onShowDatePicker}
              />
            )}
            {touched.date_of_birth && errors.date_of_birth && (
              <MyText poppins="Medium" style={styles.error}>
                {errors.date_of_birth}
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
});
