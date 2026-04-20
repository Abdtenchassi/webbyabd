let leads = [];
let nextId = 1;

export function getLeads() { return leads; }

export function addLead(lead) {
  const newLead = { id: nextId++, ...lead, status: 'new', created_at: new Date().toISOString() };
  leads.unshift(newLead);
  return newLead;
}

export function updateLeadStatus(id, status) {
  const lead = leads.find(l => l.id === id);
  if (lead) lead.status = status;
  return lead;
}

export function deleteLead(id) {
  leads = leads.filter(l => l.id !== id);
}
