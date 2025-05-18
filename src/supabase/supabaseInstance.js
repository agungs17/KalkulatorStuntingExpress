import { createClient } from '@supabase/supabase-js';
import config  from '../../configurations/index';

const supabaseInstance = createClient(config.supabase.url, config.supabase.serviceRoleKey);

export default supabaseInstance;