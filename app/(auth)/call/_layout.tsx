// import { View, Text } from 'react-native';
// import React, { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import {
//   StreamVideo,
//   StreamVideoClient,
// } from '@stream-io/video-react-native-sdk';
// import { chatApiKey } from '../../../../chatConfig';
// import { useData } from '@/hooks/useData';

// type Props = {};

// const client = new StreamVideoClient({ apiKey: chatApiKey });

// const VideoCallLayout = (props: Props) => {
//   const { user } = useData();

//   const userData = {
//     id: user?.id as string,
//     name: user?.name as string,
//   };
//   useEffect(() => {
//     const connectUser = async () => {
//       await client.connectUser(userData, user?.streamToken);
//     };

//     connectUser();
//     return () => {
//       client.disconnectUser();
//     };
//   }, []);

//   return (
//     <StreamVideo client={client}>
//       <Stack screenOptions={{ headerShown: false }} />
//     </StreamVideo>
//   );
// };

// export default VideoCallLayout;
