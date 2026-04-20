import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { getLeads } from '../../../lib/store';

export async function GET(request) {
  const key = request.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(getLeads());
  }
}
