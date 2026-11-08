import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';
const c = createClient('a','b'); await c.from('x').select('*');
