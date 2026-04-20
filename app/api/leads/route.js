import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { addLead } from '../../lib/store';

export async function POST(request) {
  try {
    const body = await request.json();
    const { client_name, client_business, email_phone, notes, features, attached_files, estimateMin, estimateMax, hosting } = body;
    if (!client_name || !email_phone) {
      return NextResponse.json({ success: false, error: 'Name and contact info are required.' }, { status: 400 });
    }

    const leadRecord = {
      client_name, client_business, email_phone, notes,
      features, attached_files, estimateMin, estimateMax,
      hosting, plan: null, plan_status: 'not_generated',
      status: 'new'
    };

    // Try Supabase first
    try {
      const { data, error } = await supabase.from('leads').insert([leadRecord]).select();
      if (error) throw error;
      return NextResponse.json({ success: true, lead: data[0] });
    } catch {
      // Fallback to in-memory
      const lead = addLead(leadRecord);
      return NextResponse.json({ success: true, lead });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
