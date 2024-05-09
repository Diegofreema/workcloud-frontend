import { StreamChat } from 'stream-chat';
import { supabase } from './lib/supabase';
import Toast from 'react-native-toast-message';
const client = StreamChat.getInstance('cnvc46pm8uq9');
export const generateToken = async (user: any) => {
  if (!user?.id) return;
  console.log('🚀 ~ file: generateToken.ts:generateToken ~ user:', user);
  console.log();
  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select()
    .eq('user_id', user?.id);
  if (profileError) {
    return Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: 'Please try signing again',
    });
  }

  if (!profile?.length) {
    const { data, error } = await supabase.from('profile').upsert({
      user_id: user?.id,
      avatarUrl: user?.imageUrl,
      email: user?.emailAddresses[0].emailAddress,
      name: user?.fullName,
      boarded: true,
      streamToken: client.devToken(user?.id),
    });

    if (error) {
      console.log('🚀 ~ file: generateToken.ts:generateToken ~ error:', error);

      return Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try signing again',
      });
    }
  }
};
