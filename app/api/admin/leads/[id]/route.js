import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { updateLeadStatus, deleteLead } from '../../../../lib/store';
 
export async function PATCH(request, { params }) {
  const key = request.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  // Accept status, plan_status, plan (manual paste), or any other field updates
  const updates = {};
  if (body.status) updates.status = body.status;
  if (body.plan_status) updates.plan_status = body.plan_status;
  if (body.plan !== undefined) updates.plan = body.plan;
  try {
    const { error } = await supabase.from('leads').update(updates).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    if (body.status) updateLeadStatus(Number(id), body.status);
    return NextResponse.json({ success: true });
  }
}
 
export async function DELETE(request, { params }) {
  const key = request.headers.get('x-admin-key');
  if (key !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    deleteLead(Number(id));
    return NextResponse.json({ success: true });
  }
}
