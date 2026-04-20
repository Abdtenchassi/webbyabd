'use client';
import '../globals.css';
import { useState, useEffect, useCallback } from 'react';

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [pastedJson, setPastedJson] = useState('');
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    const k = localStorage.getItem('webby_key') || key;
    try {
      const res = await fetch('/api/admin/leads', { headers: { 'x-admin-key': k } });
      if (res.status === 401) { alert('Invalid key'); localStorage.removeItem('webby_key'); setLoggedIn(false); return; }
      const data = await res.json();
      if (data.error) {
        alert('Database Error: ' + data.error);
        setLeads([]);
      } else if (Array.isArray(data)) {
        setLeads(data);
      } else {
        setLeads([]);
      }
      setLoggedIn(true);
      localStorage.setItem('webby_key', k);
    } catch { alert('Failed to load leads'); }
  }, [key]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('webby_key')) {
      setKey(localStorage.getItem('webby_key'));
      setTimeout(() => loadData(), 100);
    }
  }, []);

  const login = () => { if (key) loadData(); };
  const logout = () => { localStorage.removeItem('webby_key'); setLoggedIn(false); setLeads([]); };

  const updateStatus = async (id, status) => {
    const k = localStorage.getItem('webby_key');
    await fetch(`/api/admin/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-key': k }, body: JSON.stringify({ status }) });
    loadData();
  };

  const deleteL = async (id) => {
    if (!confirm('Delete this project request?')) return;
    const k = localStorage.getItem('webby_key');
    await fetch(`/api/admin/leads/${id}`, { method: 'DELETE', headers: { 'x-admin-key': k } });
    loadData();
  };

  const updatePlanStatus = async (id, plan_status) => {
    const k = localStorage.getItem('webby_key');
    await fetch(`/api/admin/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-key': k }, body: JSON.stringify({ plan_status }) });
    loadData();
  };

  const buildPrompt = (lead) => {
    return `You are a web development project planner for WebbyAbd, a mobile-first web studio in Lebanon.

A client just submitted a project request. Generate a clear, actionable project plan based on their info.

CLIENT INFO:
- Name: ${lead.client_name}
- Business: ${lead.client_business || 'Not specified'}
- Contact: ${lead.email_phone}
- Notes: ${lead.notes || 'None'}
- Uploaded files: ${lead.attached_files || 'None'}

REQUESTED FEATURES:
${(lead.features || []).map(f => `- ${f}`).join('\n')}

HOSTING TIER: ${lead.hosting?.tierName || 'Not selected'}
- Render: ${lead.hosting?.render?.tier || 'TBD'} (${lead.hosting?.render?.ram || 'TBD'} RAM, ${lead.hosting?.render?.cpu || 'TBD'})
- Supabase: ${lead.hosting?.supabase?.tier || 'TBD'} (${lead.hosting?.supabase?.db || 'TBD'} DB)
- Client expects: ${lead.hosting?.answers?.visitors || 'TBD'} daily visitors, ${lead.hosting?.answers?.content || 'TBD'} content volume

BUDGET ESTIMATE: $${lead.estimateMin || '?'} - $${lead.estimateMax || '?'} (one-time build cost)
MONTHLY HOSTING: $${lead.hosting?.clientPrice || '0'}/mo (what client pays)

Generate a JSON response with this exact structure (no markdown, no backticks, just raw JSON):
{
  "summary": "2-3 sentence project overview",
  "pages": ["list of pages/screens to build"],
  "techStack": {
    "frontend": "framework and key libraries",
    "backend": "API approach",
    "database": "tables and schema overview",
    "hosting": "deployment plan"
  },
  "timeline": {
    "day1": "what gets done on day 1",
    "day2": "what gets done on day 2",
    "delivery": "final delivery details"
  },
  "risks": ["potential challenges or things to clarify with client"],
  "questions": ["questions to ask the client before starting"],
  "priority": "high | medium | low based on project complexity and revenue potential"
}`;
  };

  const copyPrompt = async (lead) => {
    const prompt = buildPrompt(lead);
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { alert('Could not copy. Please select and copy manually.'); }
  };

  const savePlan = async (id) => {
    let parsed;
    try {
      const cleaned = pastedJson.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      alert('Invalid JSON. Please paste the raw JSON response from Claude.');
      return;
    }
    const k = localStorage.getItem('webby_key');
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': k },
      body: JSON.stringify({ plan: parsed, plan_status: 'pending_approval' }),
    });
    if (res.ok) {
      setPastedJson('');
      setExpandedId(null);
      loadData();
    } else {
      alert('Failed to save plan.');
    }
  };

  const st = {
    page: { maxWidth: 1000, margin: '4rem auto', padding: '0 1rem', fontFamily: "'DM Sans', sans-serif" },
    loginWrap: { maxWidth: 400, margin: '10rem auto', background: '#fff', padding: '3rem', borderRadius: 16, boxShadow: '0 20px 25px -5px rgba(0,0,0,.05)', textAlign: 'center', border: '1px solid #E2E8F0' },
    input: { width: '100%', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: "'DM Sans'", fontSize: '1rem', background: '#F8FAFC', textAlign: 'center', marginBottom: '1rem' },
    btnP: { background: '#1A56DB', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: 8, fontWeight: 600, fontSize: '1rem', cursor: 'pointer', width: '100%', fontFamily: "'DM Sans'" },
    btnO: { background: 'transparent', border: '1px solid #E2E8F0', color: '#64748B', padding: '.5rem 1rem', borderRadius: 6, cursor: 'pointer', fontFamily: "'DM Sans'", fontWeight: 500, fontSize: '.9rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem' },
    card: { background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.04)', marginBottom: '1rem' },
    badge: (s) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase',
      ...(s === 'new' ? { background: '#E0E7FF', color: '#4338CA' } : s === 'contacted' ? { background: '#FEF3C7', color: '#B45309' } : { background: '#D1FAE5', color: '#047857' })
    }),
    pill: { background: '#F1F5F9', color: '#334155', padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '.82rem', border: '1px solid #E2E8F0', display: 'inline-block', marginRight: 6, marginBottom: 6 },
  };

  if (!loggedIn) {
    return (
      <div style={st.page}>
        <div style={st.loginWrap}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1A56DB', fontFamily: "'Outfit'", marginBottom: '1.5rem' }}>W</div>
          <h1 style={{ color: '#0F172A', marginBottom: '1.5rem', fontFamily: "'Outfit'", fontSize: '1.5rem' }}>Admin Access</h1>
          <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="Enter admin key..." style={st.input} onKeyDown={e => e.key === 'Enter' && login()} />
          <button style={st.btnP} onClick={login}>Authenticate</button>
        </div>
      </div>
    );
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);
  const newCount = leads.filter(l => l.status === 'new').length;

  return (
    <div style={st.page}>
      <div style={st.header}>
        <div>
          <h1 style={{ fontFamily: "'Outfit'", fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#1A56DB' }}>W</span> WebbyAbd Leads
          </h1>
          <p style={{ color: '#64748B', marginTop: 4 }}>{leads.length} total requests</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={st.btnO} onClick={loadData}>Refresh</button>
          <button style={st.btnO} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'new', 'contacted', 'signed'].map(f => (
          <button key={f} style={{ ...st.btnO, ...(filter === f ? { background: '#1A56DB', color: '#fff', border: 'none' } : {}) }} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'new' && newCount > 0 ? `(${newCount})` : ''}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 14, border: '1px dashed #E2E8F0', color: '#64748B' }}>
          No project requests found.
        </div>
      ) : filtered.map(lead => (
        <div style={st.card} key={lead.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontFamily: "'Outfit'", fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>{lead.client_business || 'No business name'}</h3>
              <p style={{ color: '#64748B', fontSize: '.9rem' }}>{lead.client_name} &middot; {lead.email_phone}</p>
              <div style={{ ...st.badge(lead.status), marginTop: 6 }}>{lead.status}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#64748B', fontSize: '.8rem' }}>{new Date(lead.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              {/* PRICE VISIBLE TO ADMIN ONLY */}
              {lead.estimateMin != null && (
                <div style={{ background: '#E0E7FF', color: '#1A56DB', padding: '6px 14px', borderRadius: 8, marginTop: 8, fontFamily: "'Outfit'", fontWeight: 700, fontSize: '1.1rem' }}>
                  ${lead.estimateMin} – ${lead.estimateMax}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontFamily: "'Outfit'", fontSize: '.9rem', marginBottom: 8, color: '#334155' }}>Requested Features</h4>
            <div>{(lead.features || []).map((f, i) => <span key={i} style={st.pill}>{f}</span>)}</div>
          </div>

          {lead.attached_files && (
            <div style={{ padding: '.75rem', background: '#EFF6FF', borderRadius: 8, fontSize: '.85rem', color: '#1A56DB', border: '1px dashed #1A56DB', marginBottom: '1rem' }}>
              Attached: {lead.attached_files}
            </div>
          )}
          {lead.notes && (
            <div style={{ padding: '.75rem', background: '#F8FAFC', borderRadius: 8, fontSize: '.85rem', marginBottom: '1rem' }}>
              <strong>Notes:</strong> {lead.notes}
            </div>
          )}

          {/* HOSTING TECHNICAL BREAKDOWN — ADMIN ONLY */}
          {lead.hosting && (
            <div style={{ padding: '1rem', background: '#F0F4FF', borderRadius: 12, border: '1px solid #C7D2FE', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem', flexWrap: 'wrap', gap: 8 }}>
                <h4 style={{ fontFamily: "'Outfit'", fontSize: '.95rem', fontWeight: 700, color: '#1A56DB', margin: 0 }}>
                  🖥️ Hosting: {lead.hosting.tierName} Plan
                </h4>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ background: '#1A56DB', color: '#fff', padding: '4px 10px', borderRadius: 100, fontFamily: "'Outfit'", fontWeight: 700, fontSize: '.8rem' }}>
                    Client pays: ${lead.hosting.clientPrice}/mo
                  </div>
                  <div style={{ background: '#059669', color: '#fff', padding: '4px 10px', borderRadius: 100, fontFamily: "'Outfit'", fontWeight: 700, fontSize: '.8rem' }}>
                    Profit: ${lead.hosting.profit}/mo
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {/* Render Compute */}
                <div style={{ padding: '.75rem', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Render Compute</div>
                  <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#0F172A' }}>${lead.hosting.render.price}/mo</div>
                  <div style={{ fontSize: '.75rem', color: '#64748B', marginTop: 4 }}>
                    {lead.hosting.render.tier}<br/>
                    CPU: {lead.hosting.render.cpu}<br/>
                    RAM: {lead.hosting.render.ram}
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '.68rem', marginTop: 4 }}>{lead.hosting.render.note}</div>
                </div>
                {/* Render Workspace */}
                <div style={{ padding: '.75rem', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Render Workspace</div>
                  <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#0F172A' }}>${lead.hosting.renderWorkspace || 19}/mo</div>
                  <div style={{ fontSize: '.75rem', color: '#64748B', marginTop: 4 }}>
                    Professional Plan<br/>
                    Unlimited envs<br/>
                    Autoscaling
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '.68rem', marginTop: 4 }}>Fixed monthly cost</div>
                </div>
                {/* Supabase */}
                <div style={{ padding: '.75rem', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Supabase DB</div>
                  <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#0F172A' }}>${lead.hosting.supabase.price}/mo</div>
                  <div style={{ fontSize: '.75rem', color: '#64748B', marginTop: 4 }}>
                    {lead.hosting.supabase.tier}<br/>
                    DB: {lead.hosting.supabase.db}<br/>
                    MAU: {lead.hosting.supabase.mau}
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '.68rem', marginTop: 4 }}>{lead.hosting.supabase.note}</div>
                </div>
              </div>

              {/* Profit summary */}
              <div style={{ marginTop: 10, padding: '.75rem', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.06em' }}>Client pays</div>
                    <div style={{ fontFamily: "'Outfit'", fontWeight: 800, fontSize: '1.1rem', color: '#1A56DB' }}>${lead.hosting.clientPrice}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.06em' }}>Infra cost</div>
                    <div style={{ fontFamily: "'Outfit'", fontWeight: 800, fontSize: '1.1rem', color: '#DC2626' }}>-${lead.hosting.infraCost}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.06em' }}>Workspace</div>
                    <div style={{ fontFamily: "'Outfit'", fontWeight: 800, fontSize: '1.1rem', color: '#DC2626' }}>-$19</div>
                  </div>
                  <div style={{ background: '#F0FDF4', borderRadius: 6, padding: '4px' }}>
                    <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '.06em' }}>Profit/mo</div>
                    <div style={{ fontFamily: "'Outfit'", fontWeight: 800, fontSize: '1.1rem', color: '#059669' }}>+${lead.hosting.profit}</div>
                  </div>
                </div>
              </div>

              {/* Client's answers */}
              {lead.hosting.answers && (
                <div style={{ marginTop: 8, padding: '.5rem .75rem', background: 'rgba(255,255,255,.5)', borderRadius: 6, fontSize: '.72rem', color: '#64748B' }}>
                  <strong style={{ color: '#334155' }}>Client answers:</strong>{' '}
                  Visitors: {lead.hosting.answers.visitors} · Accounts: {lead.hosting.answers.accounts} · Content: {lead.hosting.answers.content} · Speed: {lead.hosting.answers.speed}
                </div>
              )}
            </div>
          )}

          {/* CLAUDE-GENERATED PROJECT PLAN */}
          {lead.plan && (
            <div style={{ padding: '1rem', background: lead.plan_status === 'approved' ? '#F0FDF4' : lead.plan_status === 'rejected' ? '#FEF2F2' : '#FFFBEB', borderRadius: 12, border: `1px solid ${lead.plan_status === 'approved' ? '#86EFAC' : lead.plan_status === 'rejected' ? '#FECACA' : '#FDE68A'}`, marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem', flexWrap: 'wrap', gap: 8 }}>
                <h4 style={{ fontFamily: "'Outfit'", fontSize: '.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  AI Project Plan
                </h4>
                <div style={{ display: 'flex', gap: 6 }}>
                  {lead.plan_status === 'approved' && <span style={{ background: '#059669', color: '#fff', padding: '3px 10px', borderRadius: 100, fontSize: '.72rem', fontWeight: 700 }}>APPROVED</span>}
                  {lead.plan_status === 'rejected' && <span style={{ background: '#DC2626', color: '#fff', padding: '3px 10px', borderRadius: 100, fontSize: '.72rem', fontWeight: 700 }}>REJECTED</span>}
                  {lead.plan_status === 'pending_approval' && <span style={{ background: '#D97706', color: '#fff', padding: '3px 10px', borderRadius: 100, fontSize: '.72rem', fontWeight: 700 }}>AWAITING APPROVAL</span>}
                  {lead.plan.priority && <span style={{ background: lead.plan.priority === 'high' ? '#7C3AED' : lead.plan.priority === 'medium' ? '#2563EB' : '#64748B', color: '#fff', padding: '3px 10px', borderRadius: 100, fontSize: '.72rem', fontWeight: 700 }}>{lead.plan.priority.toUpperCase()}</span>}
                </div>
              </div>

              {/* Summary */}
              <div style={{ padding: '.75rem', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 8 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Summary</div>
                <p style={{ fontSize: '.85rem', color: '#334155', lineHeight: 1.6 }}>{lead.plan.summary}</p>
              </div>

              {/* Pages & Timeline side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <div style={{ padding: '.75rem', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Pages to Build</div>
                  {(lead.plan.pages || []).map((p, i) => (
                    <div key={i} style={{ fontSize: '.78rem', color: '#334155', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 4, height: 4, borderRadius: 2, background: '#1A56DB', flexShrink: 0 }} />{p}
                    </div>
                  ))}
                </div>
                <div style={{ padding: '.75rem', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Timeline</div>
                  {lead.plan.timeline && Object.entries(lead.plan.timeline).map(([k, v]) => (
                    <div key={k} style={{ fontSize: '.78rem', padding: '3px 0' }}>
                      <strong style={{ color: '#1A56DB', textTransform: 'capitalize' }}>{k}:</strong>{' '}
                      <span style={{ color: '#334155' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              {lead.plan.techStack && (
                <div style={{ padding: '.75rem', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 8 }}>
                  <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Tech Stack</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {Object.entries(lead.plan.techStack).map(([k, v]) => (
                      <div key={k} style={{ fontSize: '.78rem', padding: '2px 0' }}>
                        <strong style={{ color: '#64748B', textTransform: 'capitalize' }}>{k}:</strong>{' '}
                        <span style={{ color: '#334155' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risks & Questions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                {lead.plan.risks && lead.plan.risks.length > 0 && (
                  <div style={{ padding: '.75rem', background: '#FFF7ED', borderRadius: 8, border: '1px solid #FED7AA' }}>
                    <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Risks</div>
                    {lead.plan.risks.map((r, i) => <div key={i} style={{ fontSize: '.78rem', color: '#9A3412', padding: '2px 0' }}>- {r}</div>)}
                  </div>
                )}
                {lead.plan.questions && lead.plan.questions.length > 0 && (
                  <div style={{ padding: '.75rem', background: '#EFF6FF', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                    <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Questions for Client</div>
                    {lead.plan.questions.map((q, i) => <div key={i} style={{ fontSize: '.78rem', color: '#1E40AF', padding: '2px 0' }}>- {q}</div>)}
                  </div>
                )}
              </div>

              {/* Approve / Reject buttons */}
              {lead.plan_status === 'pending_approval' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button style={{ ...st.btnP, background: '#059669', flex: 1 }} onClick={() => { updatePlanStatus(lead.id, 'approved'); updateStatus(lead.id, 'contacted'); }}>Approve Plan</button>
                  <button style={{ ...st.btnO, flex: 1, color: '#DC2626', borderColor: '#FECACA' }} onClick={() => updatePlanStatus(lead.id, 'rejected')}>Reject Plan</button>
                </div>
              )}
              {lead.plan_status === 'approved' && <div style={{ fontSize: '.78rem', color: '#059669', fontWeight: 600, marginTop: 4 }}>Plan approved — ready to start building.</div>}
              {lead.plan_status === 'rejected' && <div style={{ fontSize: '.78rem', color: '#DC2626', fontWeight: 600, marginTop: 4 }}>Plan rejected — review and resubmit manually.</div>}
            </div>
          )}
          {!lead.plan && (lead.plan_status === 'not_generated' || lead.plan_status === 'no_plan' || !lead.plan_status) && (
            <div style={{ padding: '1rem', background: '#FAFBFF', borderRadius: 12, border: '1.5px dashed #C7D2FE', marginBottom: '1rem' }}>
              {expandedId !== lead.id ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '.88rem', color: '#334155', fontWeight: 600, marginBottom: 4 }}>No AI plan yet</div>
                  <div style={{ fontSize: '.78rem', color: '#64748B', marginBottom: 12 }}>Copy the prompt, paste into claude.ai, then paste Claude&apos;s response back here</div>
                  <button style={{ ...st.btnP, background: '#7C3AED' }} onClick={() => { setExpandedId(lead.id); setPastedJson(''); }}>
                    Add AI Plan
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                    <strong style={{ fontSize: '.85rem', color: '#0F172A' }}>Step 1: Copy prompt → paste in claude.ai</strong>
                    <button
                      style={{ ...st.btnO, background: copied ? '#D1FAE5' : '#fff', color: copied ? '#047857' : '#334155', borderColor: copied ? '#6EE7B7' : '#E2E8F0' }}
                      onClick={() => copyPrompt(lead)}
                    >
                      {copied ? 'Copied!' : 'Copy Prompt'}
                    </button>
                  </div>
                  <pre style={{ background: '#0F172A', color: '#CBD5E1', padding: '10px 12px', borderRadius: 8, fontSize: '.72rem', maxHeight: 140, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'ui-monospace, SFMono-Regular, monospace', marginBottom: 12 }}>
                    {buildPrompt(lead)}
                  </pre>
                  <strong style={{ fontSize: '.85rem', color: '#0F172A', display: 'block', marginBottom: 6 }}>Step 2: Paste Claude&apos;s JSON response below</strong>
                  <textarea
                    value={pastedJson}
                    onChange={(e) => setPastedJson(e.target.value)}
                    placeholder='{"summary": "...", "pages": [...], ...}'
                    style={{ width: '100%', minHeight: 120, padding: 10, borderRadius: 8, border: '1.5px solid #E2E8F0', fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: '.8rem', resize: 'vertical', marginBottom: 10, background: '#fff' }}
                  />
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button style={{ ...st.btnP, background: '#7C3AED', flex: 1 }} onClick={() => savePlan(lead.id)} disabled={!pastedJson.trim()}>Save Plan</button>
                    <button style={st.btnO} onClick={() => { setExpandedId(null); setPastedJson(''); }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {lead.status === 'new' && <button style={st.btnP} onClick={() => updateStatus(lead.id, 'contacted')}>Mark Contacted</button>}
            {lead.status === 'contacted' && <button style={{ ...st.btnP, background: '#047857' }} onClick={() => updateStatus(lead.id, 'signed')}>Mark Signed</button>}
            <button style={st.btnO} onClick={() => deleteL(lead.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
