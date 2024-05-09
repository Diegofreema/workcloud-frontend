import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { useFormik } from 'formik';
import Toast from 'react-native-toast-message';
import { SelectList } from 'react-native-dropdown-select-list';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useDarkMode } from '../../../../hooks/useDarkMode';
import { days, defaultStyle } from '../../../../constants';
import { AuthHeader } from '../../../../components/AuthHeader';
import { InputComponent } from '../../../../components/InputComponent';
import { colors } from '../../../../constants/Colors';
import axios from 'axios';
import { format } from 'date-fns';
import { updateOrg } from '@/lib/helper';
import { supabase } from '@/lib/supabase';
import { Organization } from '@/constants/types';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
const validationSchema = yup.object().shape({
  organizationName: yup.string().required('Name of organization is required'),
  category: yup.string().required('Category is required'),
  location: yup.string().required('Location is required'),
  description: yup.string().required('Description is required'),
  startDay: yup.string().required('Working days are required'),
  endDay: yup.string().required('Working days are required'),
  startTime: yup.string().required('Working time is required'),
  endTime: yup.string().required('Working time is required'),
  websiteUrl: yup.string().required('Website link is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

type Props = {};

const Edit = (props: Props) => {
  const [start, setStartTime] = useState(new Date(1598051730000));
  const [end, setEndTime] = useState(new Date(1598051730000));
  const [error, setError] = useState(false);
  const [organization, setOrganization] = useState();
  const [image, setImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { editId } = useLocalSearchParams<{ editId: string; id: string }>();

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [orgId, setOrgId] = useState('');
  const { darkMode } = useDarkMode();
  const router = useRouter();

  const queryClient = useQueryClient();

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Save image if not cancelled
    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;

      setImage(base64);
    }
  };

  const {
    values,
    handleChange,

    handleSubmit,
    isSubmitting,
    errors,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      email: '',
      organizationName: '',
      category: '',
      startDay: '',
      endDay: '',
      description: '',
      location: '',
      websiteUrl: '',
      startTime: '',
      endTime: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // @ts-ignore
      const { error } = await supabase
        .from('organization')
        .update({
          name: values.organizationName,
          category: values.category,
          description: values.description,
          avatar: image,
          email: values.email,
          location: values.location,
          start: values.startTime,
          end: values.endTime,
          website: values.websiteUrl,
          workDays: values.startDay + ' - ' + values.endDay,
        })
        .eq('id', orgId);

      if (!error) {
        resetForm();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Organization updated successfully',
          position: 'bottom',
        });
        queryClient.invalidateQueries({
          queryKey: ['organizations', 'organization'],
        });

        // @ts-ignore
        router.replace(`/(organization)/${editId}`);
      }

      if (error) {
        console.log(error);

        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again',
          position: 'bottom',
        });
      }
      return;
    },
  });
  const getOrgs = async () => {
    setError(false);
    try {
      const { data, error } = await supabase
        .from('organization')
        .select('*')
        .eq('id', editId)
        .single();
      if (!error) {
        setValues({
          ...values,
          email: data?.email,
          category: data?.category,
          location: data?.location,
          organizationName: data?.name,
          description: data?.description,
          websiteUrl: data?.website,
          startTime: data?.workDays.split('-')[0],
          endTime: data?.workDays.split('-')[1],
        });

        setOrgId(data?.id);
        setImage(data?.avatar);
      }

      if (error) {
        setError(true);
      }
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getOrgs();
  }, []);

  const onChange = (event: any, selectedDate: any, type: string) => {
    const currentDate = selectedDate;
    if (type === 'startTime') {
      setShow(false);
      setStartTime(currentDate);
      setValues({ ...values, startTime: format(currentDate, 'HH:mm') });
    } else {
      setShow2(false);
      setEndTime(currentDate);
      setValues({ ...values, endTime: format(currentDate, 'HH:mm') });
    }
  };
  const showMode = () => {
    setShow(true);
  };
  const showMode2 = () => {
    setShow2(true);
  };
  const {
    email,
    category,
    endDay,
    location,
    organizationName,
    startDay,
    description,
    websiteUrl,
    startTime,
    endTime,
  } = values;

  if (error) {
    return <ErrorComponent refetch={getOrgs} />;
  }
  if (isLoading) {
    return <LoadingComponent />;
  }
  console.log(organization);

  return (
    <ScrollView
      style={[defaultStyle, { flex: 1 }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 20 }}
    >
      <AuthHeader path="Edit Organization" />

      <View style={{ marginTop: 20, flex: 1 }}>
        <View style={{ flex: 0.6, gap: 10 }}>
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
                source={image}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 3,
                  backgroundColor: darkMode ? 'white' : 'black',
                  padding: 5,
                  borderRadius: 30,
                  height: 30,
                  width: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
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
          </View>

          <>
            <InputComponent
              label="Organization Name"
              value={organizationName}
              onChangeText={handleChange('organizationName')}
              placeholder="Organization Name"
              keyboardType="default"
            />
            {touched.organizationName && errors.organizationName && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.organizationName}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Description"
              value={description}
              onChangeText={handleChange('description')}
              placeholder="Description"
              keyboardType="default"
              numberOfLines={5}
            />
            {touched.description && errors.description && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.description}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Category"
              value={category}
              onChangeText={handleChange('category')}
              placeholder="Category"
              keyboardType="default"
            />
            {touched.category && errors.category && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.category}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Location"
              value={location}
              onChangeText={handleChange('location')}
              placeholder="Location"
              keyboardType="default"
            />
            {touched.location && errors.location && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.location}
              </Text>
            )}
          </>
          <>
            <InputComponent
              label="Website Link"
              value={websiteUrl}
              onChangeText={handleChange('websiteUrl')}
              placeholder="Website link"
              keyboardType="default"
            />
            {touched.websiteUrl && errors.websiteUrl && (
              <Text style={{ color: 'red', fontWeight: 'bold' }}>
                {errors.websiteUrl}
              </Text>
            )}
          </>
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
        </View>

        <>
          <Text style={{ marginBottom: 5, fontFamily: 'PoppinsMedium' }}>
            Work Days
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              width: '100%',
            }}
          >
            <>
              <SelectList
                search={false}
                boxStyles={{
                  ...styles2.border,
                  width: '100%',
                }}
                inputStyles={{
                  textAlign: 'left',
                  fontSize: 14,
                  borderWidth: 0,
                }}
                fontFamily="PoppinsMedium"
                setSelected={handleChange('startDay')}
                data={days}
                defaultOption={{ key: 'monday', value: 'Monday' }}
                save="key"
                placeholder="Select your state"
              />
            </>
            <>
              <SelectList
                search={false}
                boxStyles={{
                  ...styles2.border,
                  justifyContent: 'flex-start',
                  backgroundColor: '#E9E9E9',
                  width: '100%',
                }}
                inputStyles={{ textAlign: 'left', fontSize: 14 }}
                fontFamily="PoppinsMedium"
                setSelected={handleChange('endDay')}
                data={days}
                defaultOption={{ key: 'friday', value: 'Friday' }}
                save="key"
                placeholder="Select your state"
              />
            </>
          </View>
        </>
        <>
          <Text style={{ marginBottom: 5, fontFamily: 'PoppinsMedium' }}>
            Opening And Closing Time
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <>
              <Pressable onPress={showMode} style={styles2.border}>
                <Text> {`${format(start, 'HH:mm') || ' Opening Time'}`} </Text>
              </Pressable>

              {show && (
                <DateTimePicker
                  display="spinner"
                  testID="dateTimePicker"
                  value={start}
                  mode={'time'}
                  is24Hour={true}
                  onChange={(event, selectedDate) =>
                    onChange(event, selectedDate, 'startTime')
                  }
                />
              )}
            </>
            <>
              <Pressable onPress={showMode2} style={styles2.border}>
                <Text>{`${format(end, 'HH:mm') || ' Closing Time'}`} </Text>
              </Pressable>

              {show2 && (
                <DateTimePicker
                  display="spinner"
                  testID="dateTimePicker"
                  value={end}
                  mode={'time'}
                  is24Hour={true}
                  onChange={(event, selectedDate) =>
                    onChange(event, selectedDate, 'endTime')
                  }
                />
              )}
            </>
          </View>
        </>
        <View style={{ flex: 0.4, marginTop: 30 }}>
          <Button
            loading={isSubmitting}
            mode="contained"
            onPress={() => handleSubmit()}
            buttonColor={colors.buttonBlue}
            textColor={colors.white}
            labelStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default Edit;

const styles2 = StyleSheet.create({
  border: {
    backgroundColor: '#E9E9E9',
    minHeight: 52,
    paddingLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    width: '50%',
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
