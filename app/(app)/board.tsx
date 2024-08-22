import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AuthTitle } from '../../components/AuthTitle';
import { Button, Text } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { InputComponent } from '../../components/InputComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormik } from 'formik';
import { useRouter } from 'expo-router';
// import RNPickerSelect from 'react-native-picker-select';
import { supabase } from '../../lib/supabase';
import * as yup from 'yup';
import dateFormat from 'dateformat';
import { defaultStyle } from '../../constants';
import { AuthHeader } from '../../components/AuthHeader';
import { useDarkMode } from '../../hooks/useDarkMode';
import Toast from 'react-native-toast-message';

type Props = {};
const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),

  gender: yup.string().required('Gender is required'),
});
const signup = (props: Props) => {
  const { darkMode } = useDarkMode();

  const [date, setDate] = useState(new Date());
  const [error, setError] = useState(false);

  useEffect(() => {}, [error]);

  const [show, setShow] = useState(false);
  const router = useRouter();
  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Unauthorized',
  //       text2: 'Please login to continue',
  //     });
  //     router.replace('/login');
  //   }
  // }, []);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setError(false);
  };
  const showMode = () => {
    setShow(true);
  };

  const currentDate = new Date();
  const userDateOfBirth = new Date(date);

  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const birthMonth = userDateOfBirth.getMonth();
  const birthDay = userDateOfBirth.getDate();

  let differenceInYears =
    currentDate.getFullYear() - userDateOfBirth.getFullYear();

  if (
    birthMonth > currentMonth ||
    (birthMonth === currentMonth && birthDay > currentDay)
  ) {
    differenceInYears--;
  }

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',

      gender: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (differenceInYears < 18) {
        setError(true);
        return;
      }
      if (date === new Date()) {
        setError(true);
        return;
      }
      const { email, firstName, gender, lastName } = values;
      const { error } = await supabase.from('profile').insert({
        email,
        name: `${firstName} ${lastName}`,
        user_id: '',
        gender,
        boarded: true,
        avatarUrl: '',
        date_of_birth: dateFormat(date, 'isoDate'),
      });
      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'Welcome to Workcloud',
          text2: `${firstName
            .charAt(0)
            .toUpperCase()} your  profile was created`,
        });

        router.push('/(app)/(tabs)/home');
      }

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
        });
      }
    },
  });

  const { email, firstName, gender, lastName } = values;

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ ...defaultStyle, paddingTop: 20 }}
    >
      <AuthHeader />
      <View style={{ marginBottom: 20 }} />
      <AuthTitle>Complete your profile</AuthTitle>
      <Text style={{ marginTop: 20, color: colors.textGray }}>
        Enter your details below
      </Text>
      <View style={{ marginTop: 20, flex: 1 }}>
        <View style={{ flex: 0.6, gap: 10 }}>
          <>
            <InputComponent
              label="Email"
              value={email}
              onChangeText={handleChange('email')}
              placeholder="Email"
              keyboardType="email-address"
            />
            {touched.email && errors.email && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.email}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="First Name"
              value={firstName}
              onChangeText={handleChange('firstName')}
              placeholder="First Name"
              keyboardType="default"
            />
            {touched.firstName && errors.firstName && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.firstName}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Last Name"
              value={lastName}
              onChangeText={handleChange('lastName')}
              placeholder="Last Name"
              keyboardType="default"
            />
            {touched.lastName && errors.lastName && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.lastName}
              </Text>
            )}
          </>
          <>
            <Text
              style={{
                color: darkMode ? colors.white : colors.black,
                fontWeight: 'bold',
              }}
            >
              Date of birth
            </Text>
            <Pressable onPress={showMode} style={styles2.border}>
              <Text style={{ color: colors.black }}>
                {' '}
                {`${dateFormat(date, 'dd/mm/yyyy') || ' Date Of Birth'}`}{' '}
              </Text>
            </Pressable>
            {error && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {'Please you should be at least 18 years old'}
              </Text>
            )}
          </>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={'date'}
              is24Hour={true}
              onChange={onChange}
            />
          )}

          <>
            <Text
              style={{
                color: darkMode ? colors.white : colors.black,
                fontWeight: 'bold',
              }}
            >
              Gender
            </Text>
            <View style={styles2.border}>
              {/* <RNPickerSelect
                value={gender}
                onValueChange={handleChange('gender')}
                items={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
                style={styles}
              />*/}
            </View>
            {touched.gender && errors.gender && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.gender}
              </Text>
            )}
          </>
        </View>
        <View style={{ flex: 0.4, marginTop: 30 }}>
          <Button
            loading={isSubmitting}
            mode="contained"
            onPress={() => handleSubmit()}
            buttonColor={colors.buttonBlue}
            textColor="white"
          >
            Submit
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default signup;

const styles2 = StyleSheet.create({
  border: {
    backgroundColor: '#E9E9E9',
    minHeight: 52,
    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
  },
});
const styles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
