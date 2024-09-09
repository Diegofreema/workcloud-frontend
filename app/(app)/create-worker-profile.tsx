import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { Button, Text } from 'react-native-paper';
import { AuthTitle } from '../../components/AuthTitle';
import { InputComponent } from '../../components/InputComponent';
import { colors } from '../../constants/Colors';

import { Container } from '@/components/Ui/Container';
import { MyText } from '@/components/Ui/MyText';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { AuthHeader } from '../../components/AuthHeader';
import { fontFamily } from '../../constants';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useUser } from '@clerk/clerk-expo';
type Props = {};
const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),

  gender: yup.string().required('Gender is required'),
  location: yup.string().required('Location is required'),
  experience: yup
    .string()
    .required('Experience is required')
    .max(100, 'Maximum 100 characters'),
  skills: yup
    .string()
    .required('Skills are required')
    .min(1, 'Minimum of 1 skill is required'),
  qualifications: yup.string().required('Qualifications are required'),
});

const max = 150;
const genders = [
  {
    key: 'Male',
    value: 'Male',
  },
  {
    key: 'Female',
    value: 'Female',
  },
];
const CreateProfile = (props: Props) => {
  const { darkMode } = useDarkMode();
  const { user } = useUser();

  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: {
      email: user?.emailAddresses[0].emailAddress,
      location: '',
      gender: '',
      skills: '',
      experience: '',
      userId: user?.id,
      qualifications: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const {
        experience,

        location,
        skills,
        userId,

        gender,

        qualifications,
      } = values;

      try {
        const { data, error } = await supabase
          .from('worker')
          .insert({
            userId,
            skills,
            experience,
            location,
            gender,
            qualifications,
          })
          .select()
          .single();
        if (!error) {
          const { error: err } = await supabase
            .from('user')
            .update({
              workerId: data.id,
            })
            .eq('userId', user?.id!);
          if (!err) {
            Toast.show({
              type: 'success',
              text1: 'Welcome to onboard',
              text2: `${user?.firstName} your work profile was created`,
            });
            queryClient.invalidateQueries({ queryKey: ['profile'] });

            router.replace(`/myWorkerProfile/${user?.id}`);
            resetForm();
          }
          if (err) {
            Toast.show({
              type: 'error',
              text1: 'Error, failed to create profile',
              text2: 'Please try again',
            });
          }
        }

        if (error) {
          console.log(error);

          Toast.show({
            type: 'error',
            text1: 'Error, failed to create profile',
            text2: 'Please try again',
          });
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error?.response?.data.error,
        });
        console.log(error, 'Error');
      }
    },
  });
  const {
    gender,

    location,
    experience,
    skills,
    qualifications,
  } = values;
  useEffect(() => {
    if (experience.length > 150) {
      setValues({ ...values, experience: experience.substring(0, 150) });
    }
  }, [experience]);

  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <AuthHeader />
        <View style={{ marginBottom: 10 }} />
        <AuthTitle>Set up your profile to work on workcloud</AuthTitle>
        <MyText
          poppins="Light"
          fontSize={15}
          style={{ marginTop: 20, color: colors.textGray }}
        >
          Enter your details below
        </MyText>
        <View style={{ marginTop: 20, flex: 1 }}>
          <View style={{ flex: 0.6, gap: 10 }}>
            <>
              <InputComponent
                label="Experience"
                value={experience}
                onChangeText={handleChange('experience')}
                placeholder="Write about your past work experience..."
                keyboardType="default"
                numberOfLines={5}
                multiline
              />
              <MyText poppins="Medium" fontSize={15}>
                {experience.length}/{max}
              </MyText>
              {touched.experience && errors.experience && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.experience}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Qualifications"
                value={qualifications}
                onChangeText={handleChange('qualifications')}
                placeholder="Bsc. Computer Science, Msc. Computer Science"
                keyboardType="default"
                numberOfLines={5}
                multiline
              />

              {touched.qualifications && errors.qualifications && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.qualifications}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Skills"
                value={skills}
                onChangeText={handleChange('skills')}
                placeholder="e.g Customer service, marketing, sales"
                keyboardType="default"
                numberOfLines={5}
                multiline
              />
              {touched.skills && errors.skills && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.skills}
                </Text>
              )}
            </>
            <>
              <InputComponent
                label="Location"
                value={location}
                onChangeText={handleChange('location')}
                placeholder="Where do you reside?"
                keyboardType="default"
                numberOfLines={5}
                multiline
              />
              {touched.location && errors.location && (
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  {errors.location}
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
                Gender
              </Text>

              <SelectList
                search={false}
                boxStyles={{
                  ...styles2.border,
                  justifyContent: 'flex-start',
                  borderWidth: 0,
                  height: 50,
                }}
                dropdownTextStyles={{
                  color: darkMode === 'dark' ? colors.white : colors.black,
                }}
                inputStyles={{ textAlign: 'left', borderWidth: 0 }}
                fontFamily="PoppinsMedium"
                setSelected={handleChange('gender')}
                data={genders}
                save="value"
                placeholder="Select your a gender"
              />

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
              style={{ borderRadius: 5 }}
              textColor="white"
              contentStyle={{ height: 50, borderRadius: 2 }}
              labelStyle={{ fontFamily: fontFamily.Medium, fontSize: 14 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default CreateProfile;

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
    fontFamily: 'PoppinsMedium',
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
    fontFamily: 'PoppinsMedium',
  },
});
