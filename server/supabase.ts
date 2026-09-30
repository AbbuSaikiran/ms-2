import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://fzgaovarznrqevpilwef.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_MKVBEYe8KcapdbeCDQtd5g_j18al0wh';

export const supabase = createClient(supabaseUrl, supabaseKey);
