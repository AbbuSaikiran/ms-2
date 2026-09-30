/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://fzgaovarznrqevpilwef.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MKVBEYe8KcapdbeCDQtd5g_j18al0wh';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
