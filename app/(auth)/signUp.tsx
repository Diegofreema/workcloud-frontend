import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import { InputComponent } from '@/components/InputComponent';
import { Center, VStack } from '@gluestack-ui/themed';
import { AuthTitle } from '@/components/AuthTitle';
import { colors } from '@/constants/Colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useRouter } from 'expo-router';
// import OTPMyTextView from 'react-native-otp-textinput';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { Button } from '@rneui/themed';
import { ActivityIndicator } from 'react-native-paper';
import { Container } from '@/components/Ui/Container';
import { MyText } from '@/components/Ui/MyText';
import { View } from '@/components/Themed';
// import Clipboard from '@react-native-clipboard/clipboard';

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  emailAddress: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});
const array = Array(6).fill(0);
export default function SignUpScreen() {
  const [otp, setOtp] = useState([...array]);
  const inputRef = useRef<TextInput>(null);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const router = useRouter();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [id, setId] = useState('');
  const [verified, setVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [code, setCode] = useState('');
  const [imageUrl, setImageUrl] = useState('https://placehold.co/100x100');
  const [startTimer, setStartTimer] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const {
    errors,
    handleChange,
    handleSubmit,
    touched,
    setValues,
    resetForm,
    values,
    isSubmitting,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);

      const { emailAddress, firstName, lastName, password } = values;
      try {
        const { data } = await axios.post(
          'https://workserver-plum.vercel.app/auth/create',
          {
            email: emailAddress.toLowerCase(),
            name: `${firstName} ${lastName}`,
            password: password,
            avatar: imageUrl,
          }
        );
        console.log(data);
        if (data?.user) {
          console.log(data, 'fgsdgsdg');

          const { data: userData, error } = await supabase
            .from('user')
            .insert({
              userId: data.user.id,
              email: data.user.email,
              streamToken: data.user.streamToken,
              name: data.user.name,
              avatar: data?.user?.avatar,
            })
            .select();
          console.log('🚀 ~ onSubmit: ~ userData:', userData);

          if (!error) {
            setId(data?.user?.id);
            // setPendingVerification(true);
            Toast.show({
              type: 'success',
              text1: 'Welcome to workcloud',
              text2: 'Please log in to continue',
            });
            resetForm();
            setImageUrl('https://placehold.co/100x100');
            router.push('/');
          }

          if (error) {
            console.log(JSON.stringify(error));

            Toast.show({
              type: 'error',
              text1: 'Please something went wrong',
            });
          }
        }
      } catch (error: any) {
        if (
          error?.response?.data?.error ===
          'User already exists, Please use a different email'
        ) {
          return Toast.show({
            type: 'info',
            text1: 'User already exists',
            text2: 'Please use a different email',
          });
        }
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again later',
          swipeable: true,
        });
        console.log(error, 'Error');
      }
    },
  });
  const { emailAddress, firstName, lastName, password, confirmPassword } =
    values;

  const setOtpInput = (text: any) => {
    setCode(text);
  };
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    if (value === 'Backspace') {
      if (!newOtp[index]) setActiveOtpIndex(index - 1);
      setActiveOtpIndex(activeOtpIndex - 1);
      newOtp[index] = '';
    } else {
      setActiveOtpIndex(index + 1);
      newOtp[index] = value;
    }

    setOtp([...newOtp]);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeOtpIndex]);
  console.log(otp);

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };
  console.log(code);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTimer) {
      timer = setInterval(() => {
        setSeconds((prevCount) => {
          if (prevCount === 0) {
            setStartTimer(false);
            return prevCount;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [startTimer]);
  const onPressVerify = async () => {
    setVerifyingCode(true);
    if (otp.every((digit) => digit === '')) {
      return Toast.show({
        type: 'info',
        text1: 'To continue',
        text2: 'Please enter OTP',
        position: 'top',
      });
    }

    try {
      const { data } = await axios.post(
        'https://workserver-plum.vercel.app/auth/verify-email',
        {
          token: code,
          userId: id,
        }
      );
      if (data.message === 'Your email has been verified!') {
        Toast.show({
          type: 'success',
          text1: 'Email verified',
          text2: 'Welcome to workcloud',
        });
        setPendingVerification(false);
        setVerified(true);
        setOtp([...array]);
        router.push('/');
      }
      console.log(data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error, something went wrong',
        text2: error?.response?.data.error,
      });
      console.log(error);
    } finally {
      setPendingVerification(false);
      setVerifyingCode(false);
    }
  };

  const resendOtp = async () => {
    setResendingOtp(true);
    setStartTimer(true);
    try {
      const { data } = await axios.post(
        'https://workserver-plum.vercel.app/auth/re-verify-email',
        {
          userId: id,
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Token has been resent',
        text2: data.message,
      });
      console.log(data);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error, something went wrong',
        text2: error?.response?.data.error,
      });
      console.log(error);
    } finally {
      setResendingOtp(false);
    }
  };
  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      // console.log(result);

      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      setImageUrl(base64);
    }
  };
  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {!pendingVerification && (
          <VStack gap={20} flex={1}>
            <VStack gap={5} mt={40}>
              <AuthTitle>Create account</AuthTitle>
              <MyText
                poppins="Bold"
                style={{
                  marginTop: 20,

                  color: colors.textGray,

                  fontSize: 13,
                }}
              >
                Enter a valid email address either company email or personal
                email to create an account
              </MyText>
            </VStack>
            <Center>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  contentFit="cover"
                />
                <Pressable
                  onPress={onSelectImage}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.5 : 1 },
                    styles.absolute,
                  ]}
                >
                  <FontAwesome name="plus" color="white" size={20} />
                </Pressable>
              </View>
            </Center>
            <SemiContainer>
              <InputComponent
                autoCapitalize="none"
                value={firstName}
                placeholder="First Name..."
                onChangeText={handleChange('firstName')}
              />
              {touched.firstName && errors.firstName && (
                <MyText poppins="Bold" style={{ color: 'red' }}>
                  {errors.firstName}
                </MyText>
              )}
            </SemiContainer>
            <SemiContainer>
              <InputComponent
                autoCapitalize="none"
                value={lastName}
                placeholder="Last Name..."
                onChangeText={handleChange('lastName')}
              />
              {touched.lastName && errors.lastName && (
                <MyText poppins="Bold" style={{ color: 'red' }}>
                  {errors.lastName}
                </MyText>
              )}
            </SemiContainer>
            <SemiContainer>
              <InputComponent
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email..."
                onChangeText={handleChange('emailAddress')}
              />
              {touched.emailAddress && errors.emailAddress && (
                <MyText poppins="Bold" style={{ color: 'red' }}>
                  {errors.emailAddress}
                </MyText>
              )}
            </SemiContainer>

            <SemiContainer>
              <InputComponent
                value={password}
                placeholder="Password..."
                placeholderTextColor="#000"
                onChangeText={handleChange('password')}
              />
              {touched.password && errors.password && (
                <MyText poppins="Bold" style={{ color: 'red' }}>
                  {errors.password}
                </MyText>
              )}
            </SemiContainer>
            <SemiContainer>
              <InputComponent
                value={confirmPassword}
                placeholder="Confirm password..."
                placeholderTextColor="#000"
                onChangeText={handleChange('confirmPassword')}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <MyText poppins="Bold" style={{ color: 'red' }}>
                  {errors.confirmPassword}
                </MyText>
              )}
            </SemiContainer>
            {/* <SemiContainer>
            <SelectList
              search={false}
              boxStyles={{
                ...styles2.border,
                justifyContent: 'flex-start',
                backgroundColor: '#E9E9E9',
              }}
              inputStyles={{ textAlign: 'left', fontSize: 14 }}
              fontFamily="PoppinsMedium"
              setSelected={handleChange('gender')}
              data={[
                {
                  key: 'male',
                  value: 'Male',
                },
                {
                  key: 'female',
                  value: 'Female',
                },
              ]}
              defaultOption={{ key: 'male', value: 'Male' }}
              save="key"
              placeholder="Select your state"
            />
          </SemiContainer> */}
            <View style={{ marginTop: 'auto', marginBottom: 100 }}>
              <Button
                icon={
                  isSubmitting && (
                    <ActivityIndicator
                      style={{ marginRight: 10 }}
                      size={20}
                      color="white"
                    />
                  )
                }
                titleStyle={{ fontFamily: 'PoppinsMedium' }}
                buttonStyle={{
                  backgroundColor: colors.dialPad,
                  borderRadius: 5,
                }}
                onPress={() => handleSubmit()}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </View>
          </VStack>
        )}
        {/* {pendingVerification && (
        <VStack flex={1} mb={20}>
          <VStack gap={5} mt={40}>
            <AuthTitle>Check your email</AuthTitle>
            <MyText
              style={{
                marginTop: 20,
                color: colors.textGray,
                fontFamily: 'PoppinsBold',
                fontSize: 13,
              }}
            >
              {` Please enter the verification code sent to ${emailAddress}`}
            </MyText>
          </VStack>
          <View style={{ marginTop: 20 }}>
            <HStack>
              {array.map((_, index) => (
                <OtpInput
                  onKeyPress={({ nativeEvent }) => {
                    handleOtpChange(nativeEvent.key, index);
                  }}
                  ref={activeOtpIndex === index ? inputRef : null}
                  key={index}
                  keyboardType="numeric"
                  value={otp[index] || ''}
                  onChangeText={handlePaste}
                />
              ))}
            </HStack>
          </View>
          <VStack gap={6} my={20}>
            <MyText style={{ textAlign: 'center', fontFamily: 'PoppinsMedium' }}>
              Didn’t receive the code?{' '}
            </MyText>

            <Button
              disabled={resendingOtp || startTimer}
              titleStyle={{
                fontFamily: 'PoppinsMedium',
                color: colors.dialPad,
              }}
              buttonStyle={{
                backgroundColor: 'transparent',
                borderRadius: 5,
              }}
              onPress={resendOtp}
            >
              Resend
            </Button>
            {startTimer && (
              <MyText
                style={{
                  textAlign: 'center',
                  fontFamily: 'PoppinsMedium',
                  color: 'black',
                }}
              >
                You can resend in {seconds}
              </MyText>
            )}
          </VStack>
          <View style={{ marginTop: 'auto', marginBottom: 100 }}>
            <Button
              icon={
                verifyingCode && (
                  <ActivityIndicator
                    style={{ marginRight: 10 }}
                    size={20}
                    color="white"
                  />
                )
              }
              titleStyle={{ fontFamily: 'PoppinsMedium' }}
              buttonStyle={{
                backgroundColor: colors.dialPad,
                borderRadius: 5,
              }}
              onPress={onPressVerify}
            >
              Verify
            </Button>
          </View>
        </VStack>
      )} */}
      </ScrollView>
    </Container>
  );
}

const styles2 = StyleSheet.create({
  border: {
    borderWidth: 0,
    borderColor: 'black',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderRadius: 0,
    minHeight: 57,

    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.grayText,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
const styles = StyleSheet.create({
  textInputStyle: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 4,
    width: 30,
    height: 55,
  },
  image: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 999,
    overflow: 'hidden',
  },
  absolute: {
    position: 'absolute',
    right: 5,
    bottom: 10,
    zIndex: 99,
    backgroundColor: '#000',
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const SemiContainer = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ gap: 10 }}>{children}</View>;
};
