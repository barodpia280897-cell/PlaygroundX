// src/utils/leadHelpers.js

// Determine if a lead is considered VIP based on score or explicit flag
export const isVIP = (lead) => {
  return lead.vipScore >= 80 || lead.status === 'VIP Prospect' || lead.stage === 'VIP' || lead.vip === true;
};

// Filter a list of leads to only include VIPs
export const getVIPLeads = (leads) => {
  if (!leads) return [];
  return leads.filter(isVIP);
};

// Get VIPs by specific category
export const getVIPsByCategory = (leads, category) => {
  const vips = getVIPLeads(leads);
  
  switch(category) {
    case 'VIP Creators':
      return vips.filter(l => l.type === 'Creator');
    case 'VIP Fans':
      return vips.filter(l => l.type === 'Fan');
    case 'VIP Prospects':
      return leads.filter(l => l.status === 'VIP Prospect' || l.status === 'Hot Lead');
    case 'High Rollers':
      return vips.filter(l => l.healthScore >= 90 && l.type === 'Fan');
    case 'Top Earners':
      return vips.filter(l => l.healthScore >= 90 && l.type === 'Creator');
    case 'Watchlist':
      return vips.filter(l => l.healthScore < 50); // VIPs at risk
    default:
      return vips;
  }
};
