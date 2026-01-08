
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqluomkbypxnjyfqqwcj.supabase.co';
const supabaseKey = 'sb_publishable_CptdLJ-SOKBrZjJ-96q_FA_N_NyllvP';

export const supabase = createClient(supabaseUrl, supabaseKey);
