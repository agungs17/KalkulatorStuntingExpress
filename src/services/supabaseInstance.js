import { createClient } from '@supabase/supabase-js';
import config from '../configurations';

const configSupabase = config?.supabase || {}
const supabaseInstance = configSupabase.useSupabase ? createClient(configSupabase?.url, configSupabase?.serviceRoleKey) : undefined;

export default supabaseInstance;