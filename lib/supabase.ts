import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../supabase';

const supabaseUrl = 'https://mckkhgmxgjwjgxwssrfo.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ja2toZ214Z2p3amd4d3NzcmZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAxMzk4NjksImV4cCI6MjAxNTcxNTg2OX0.f5RhZOj4wLrd6jl9rIFoljlsD4ihZCLKlZnPtcXWxsM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
