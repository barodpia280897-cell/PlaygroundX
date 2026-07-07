// src/mock/platformDatabase.js — Complete Enterprise Mock Dataset
export const INITIAL_PLATFORM_DATABASE = {

  // ─── TENANTS ──────────────────────────────────────────────────────────────
  tenants: [
    { id:'ACME_001', name:'Acme Digital Ltd.',    industry:'Digital Media',    plan:'Enterprise', status:'Active',    mrr:12500, arr:150000, users:45, joined:'2023-01-15', lastLogin:'2026-06-25', renewal:'2026-07-15', manager:'Sarah Mitchell', apiUsage:'1.2M/mo',  storage:'12.4 GB', contact:'raj@acme.com',     region:'North America' },
    { id:'GOLD_002', name:'Gold Gym Global',      industry:'Fitness',          plan:'Pro',        status:'Active',    mrr:4500,  arr:54000,  users:12, joined:'2023-05-20', lastLogin:'2026-06-24', renewal:'2026-07-20', manager:'James Hooper', apiUsage:'340K/mo',  storage:'4.8 GB',  contact:'mgr@goldgym.com',   region:'Europe' },
    { id:'ABC_003',  name:'ABC Travels',          industry:'Travel',           plan:'Basic',      status:'Suspended', mrr:0,     arr:0,      users:3,  joined:'2024-02-10', lastLogin:'2026-05-01', renewal:'2026-06-10', manager:'Unassigned',   apiUsage:'0/mo',     storage:'1.2 GB',  contact:'info@abctravel.in',  region:'Asia Pacific' },
    { id:'XYZ_004',  name:'XYZ Creators',         industry:'Content Creator',  plan:'Enterprise', status:'Active',    mrr:18200, arr:218400, users:60, joined:'2022-11-05', lastLogin:'2026-06-25', renewal:'2026-07-01', manager:'Sarah Mitchell', apiUsage:'2.8M/mo', storage:'38.2 GB', contact:'ops@xyz.io',         region:'North America' },
    { id:'FIT_005',  name:'FitLife Studios',      industry:'Fitness',          plan:'Pro',        status:'Active',    mrr:6200,  arr:74400,  users:22, joined:'2023-08-01', lastLogin:'2026-06-23', renewal:'2026-08-01', manager:'James Hooper', apiUsage:'620K/mo',  storage:'8.1 GB',  contact:'hi@fitlife.com',     region:'Europe' },
    { id:'ZEN_006',  name:'Zenith Corp',          industry:'Enterprise SaaS',  plan:'Enterprise', status:'Active',    mrr:22000, arr:264000, users:88, joined:'2022-06-14', lastLogin:'2026-06-25', renewal:'2026-07-14', manager:'Sarah Mitchell', apiUsage:'3.4M/mo', storage:'52.6 GB', contact:'admin@zenith.com',   region:'North America' },
    { id:'LOCAL_07', name:'Local Shop Network',   industry:'Retail',           plan:'Basic',      status:'Suspended', mrr:0,     arr:0,      users:5,  joined:'2024-03-22', lastLogin:'2026-05-19', renewal:'2026-06-22', manager:'Unassigned',   apiUsage:'0/mo',     storage:'0.8 GB',  contact:'owner@local.shop',   region:'Asia Pacific' },
    { id:'NOVA_008', name:'Nova Health Tech',     industry:'Healthcare',       plan:'Pro',        status:'Active',    mrr:8800,  arr:105600, users:30, joined:'2023-11-12', lastLogin:'2026-06-24', renewal:'2026-07-12', manager:'James Hooper', apiUsage:'1.0M/mo',  storage:'18.4 GB', contact:'cto@novahealth.io',  region:'Europe' },
    { id:'BRT_009',  name:'BrightSpark Media',    industry:'Media',            plan:'Pro',        status:'Trial',     mrr:0,     arr:0,      users:5,  joined:'2026-06-15', lastLogin:'2026-06-25', renewal:'2026-07-15', manager:'Unassigned',   apiUsage:'18K/mo',   storage:'0.4 GB',  contact:'hello@brightspark.com', region:'North America' },
    { id:'DATA_010', name:'DataNest Analytics',   industry:'Analytics',        plan:'Enterprise', status:'Trial',     mrr:0,     arr:0,      users:12, joined:'2026-06-18', lastLogin:'2026-06-25', renewal:'2026-07-18', manager:'Unassigned',   apiUsage:'62K/mo',   storage:'1.1 GB',  contact:'team@datanest.ai',   region:'Europe' },
  ],

  // ─── TRIAL ACCOUNTS ───────────────────────────────────────────────────────
  trialAccounts: [
    { id:'TRL_101', name:'BrightSpark Media',   email:'hello@brightspark.com',  plan:'Pro',        trialStart:'2026-06-15', trialEnd:'2026-07-15', users:5,  industry:'Media',      status:'Trial',    daysLeft:20, activityScore:82, logins:34, apiCalls:18200 },
    { id:'TRL_102', name:'DataNest Analytics',  email:'team@datanest.ai',       plan:'Enterprise', trialStart:'2026-06-18', trialEnd:'2026-07-18', users:12, industry:'Analytics',  status:'Trial',    daysLeft:23, activityScore:91, logins:71, apiCalls:62400 },
    { id:'TRL_103', name:'Peak Retail Co.',     email:'ops@peakretail.com',     plan:'Basic',      trialStart:'2026-06-10', trialEnd:'2026-07-10', users:3,  industry:'Retail',     status:'Trial',    daysLeft:15, activityScore:55, logins:12, apiCalls:4200  },
    { id:'TRL_104', name:'Luminary Events',     email:'book@luminaryevents.in', plan:'Pro',        trialStart:'2026-06-20', trialEnd:'2026-07-20', users:7,  industry:'Events',     status:'Trial',    daysLeft:25, activityScore:73, logins:28, apiCalls:9800  },
    { id:'TRL_105', name:'Orbital Logistics',   email:'fleet@orbital.co',       plan:'Pro',        trialStart:'2026-06-22', trialEnd:'2026-07-22', users:18, industry:'Logistics',  status:'Trial',    daysLeft:27, activityScore:88, logins:55, apiCalls:44000 },
    { id:'TRL_106', name:'GreenLeaf Farms',     email:'info@greenleaf.farm',    plan:'Basic',      trialStart:'2026-06-05', trialEnd:'2026-07-05', users:2,  industry:'AgriTech',   status:'Expiring', daysLeft:10, activityScore:40, logins:8,  apiCalls:1800  },
  ],

  // ─── PLATFORM REVENUE ─────────────────────────────────────────────────────
  platformRevenue: {
    totalArr: 866400,
    totalMrr: 72200,
    growth: '+18.4%',
    pendingPayments: 18200,
    failedAmount: 860,
    refunds: 1200,
    history: [
      { month:'Jan', revenue:58000, enterprise:28000, pro:20000, basic:10000 },
      { month:'Feb', revenue:61000, enterprise:30000, pro:21000, basic:10000 },
      { month:'Mar', revenue:64000, enterprise:31000, pro:22000, basic:11000 },
      { month:'Apr', revenue:67000, enterprise:33000, pro:22000, basic:12000 },
      { month:'May', revenue:70000, enterprise:35000, pro:23000, basic:12000 },
      { month:'Jun', revenue:72200, enterprise:37700, pro:24000, basic:10500 },
    ],
  },

  // ─── PLATFORM HEALTH ──────────────────────────────────────────────────────
  platformHealth: {
    activeTenants: 8,
    trialAccounts: 6,
    enterpriseCustomers: 4,
    expiredSubscriptions: 2,
    platformUsers: 18500,
    apiUsage: '84.2M / mo',
    storageUsage: '14.2 TB',
    serverUptime: '99.99%',
    supportTickets: 6,
    pendingRenewals: 4,
    failedPayments: 3,
  },

  // ─── SUBSCRIPTION TIERS ───────────────────────────────────────────────────
  subscriptionTiers: [
    { name:'Enterprise', value:4,  color:'#8a2be2' },
    { name:'Pro',        value:4,  color:'#3b82f6' },
    { name:'Basic',      value:2,  color:'#39ff14' },
    { name:'Trial',      value:6,  color:'#f59e0b' },
  ],

  // ─── BILLING INVOICES ─────────────────────────────────────────────────────
  billingInvoices: [
    { id:'INV-2006', tenant:'Zenith Corp',        plan:'Enterprise', amount:22000, status:'Paid',    date:'2026-06-01', dueDate:'2026-06-15', method:'Credit Card',   txnId:'ch_3N4kXYZ001' },
    { id:'INV-2005', tenant:'XYZ Creators',       plan:'Enterprise', amount:18200, status:'Pending', date:'2026-06-01', dueDate:'2026-06-30', method:'Bank Transfer',  txnId:'—'             },
    { id:'INV-2004', tenant:'Acme Digital Ltd.',  plan:'Enterprise', amount:12500, status:'Paid',    date:'2026-06-01', dueDate:'2026-06-15', method:'Credit Card',   txnId:'ch_3N4kXYZ002' },
    { id:'INV-2003', tenant:'Nova Health Tech',   plan:'Pro',        amount:8800,  status:'Paid',    date:'2026-06-01', dueDate:'2026-06-15', method:'Credit Card',   txnId:'ch_3N4kXYZ003' },
    { id:'INV-2002', tenant:'FitLife Studios',    plan:'Pro',        amount:6200,  status:'Paid',    date:'2026-06-01', dueDate:'2026-06-15', method:'PayPal',        txnId:'ch_3N4kXYZ004' },
    { id:'INV-2001', tenant:'Gold Gym Global',    plan:'Pro',        amount:4500,  status:'Paid',    date:'2026-06-01', dueDate:'2026-06-15', method:'Credit Card',   txnId:'ch_3N4kXYZ005' },
    { id:'INV-1007', tenant:'ABC Travels',        plan:'Basic',      amount:450,   status:'Overdue', date:'2026-05-01', dueDate:'2026-05-15', method:'Credit Card',   txnId:'—'             },
    { id:'INV-1006', tenant:'Local Shop Network', plan:'Basic',      amount:120,   status:'Overdue', date:'2026-05-01', dueDate:'2026-05-15', method:'Bank Transfer',  txnId:'—'             },
  ],

  // ─── FAILED PAYMENTS ──────────────────────────────────────────────────────
  failedPayments: [
    { id:'FP-01', tenant:'ABC Travels',        amount:450, reason:'Card Expired',       date:'2026-05-18', attempts:3, nextRetry:'2026-06-26', contact:'info@abctravel.in',   method:'Visa •••• 4242' },
    { id:'FP-02', tenant:'Local Shop Network', amount:120, reason:'Insufficient Funds', date:'2026-05-19', attempts:2, nextRetry:'2026-06-27', contact:'owner@local.shop',    method:'Bank Transfer'  },
    { id:'FP-03', tenant:'GreenLeaf Farms',    amount:290, reason:'Card Declined',      date:'2026-06-01', attempts:1, nextRetry:'2026-06-28', contact:'info@greenleaf.farm', method:'Visa •••• 8810' },
  ],

  // ─── API KEYS ─────────────────────────────────────────────────────────────
  apiKeys: [
    { id:'AK_001', name:'Production Gateway Key',     env:'Production', scope:'Full Access',  createdBy:'System',         created:'2022-06-14', lastUsed:'2026-06-25 10:41 AM', status:'Active',   requests:'84.2M', rateLimit:'10K rpm', key:'pgx_live_a1b2c3d4e5f6g7h8' },
    { id:'AK_002', name:'Sandbox / Staging Key',      env:'Sandbox',    scope:'Full Access',  createdBy:'System',         created:'2022-06-14', lastUsed:'2026-06-25 09:12 AM', status:'Active',   requests:'12.4M', rateLimit:'5K rpm',  key:'pgx_test_h8g7f6e5d4c3b2a1' },
    { id:'AK_003', name:'Acme Digital Integration',   env:'Production', scope:'Read + Write', createdBy:'Sarah Mitchell', created:'2023-01-20', lastUsed:'2026-06-25 10:39 AM', status:'Active',   requests:'1.2M',  rateLimit:'1K rpm',  key:'pgx_live_acme_xxxxxxxxxxxx' },
    { id:'AK_004', name:'XYZ Creators Data Sync',     env:'Production', scope:'Read Only',    createdBy:'Sarah Mitchell', created:'2022-11-10', lastUsed:'2026-06-25 10:22 AM', status:'Active',   requests:'2.8M',  rateLimit:'2K rpm',  key:'pgx_live_xyz_xxxxxxxxxxxx'  },
    { id:'AK_005', name:'Nova Health FHIR Bridge',    env:'Production', scope:'Write Only',   createdBy:'James Hooper',   created:'2023-11-15', lastUsed:'2026-06-24 02:12 PM', status:'Active',   requests:'1.0M',  rateLimit:'500 rpm', key:'pgx_live_nova_xxxxxxxxxxxx' },
    { id:'AK_006', name:'Legacy Analytics Connector', env:'Production', scope:'Read Only',    createdBy:'System',         created:'2021-04-01', lastUsed:'2026-03-12 08:00 AM', status:'Revoked',  requests:'0',     rateLimit:'100 rpm', key:'pgx_live_legacy_xxxxxxxxxx' },
  ],

  // ─── WEBHOOKS ─────────────────────────────────────────────────────────────
  apiWebhooks: [
    { id:'WH-01', tenant:'Acme Digital Ltd.',  endpoint:'https://api.acme.com/webhook',       events:['lead.created','payment.success'],    status:'Active',  deliveryRate:'99.2%', lastPing:'2 min ago',  secret:'whsec_acme_xxxx', totalDelivered:148200, failed:1180  },
    { id:'WH-02', tenant:'XYZ Creators',       endpoint:'https://xyz.com/pgx/hooks',          events:['user.registered'],                   status:'Failing', deliveryRate:'12.0%', lastPing:'1 hr ago',   secret:'whsec_xyz_xxxxx', totalDelivered:4200,   failed:36400 },
    { id:'WH-03', tenant:'Gold Gym Global',    endpoint:'https://goldgym.io/crm/events',      events:['appointment.booked','lead.created'],  status:'Active',  deliveryRate:'100%',  lastPing:'5 min ago',  secret:'whsec_ggym_xxxx', totalDelivered:62800,  failed:0     },
    { id:'WH-04', tenant:'Nova Health Tech',   endpoint:'https://nova.health/intake/webhook', events:['patient.registered'],                status:'Active',  deliveryRate:'97.8%', lastPing:'1 min ago',  secret:'whsec_nova_xxxx', totalDelivered:38400,  failed:844   },
    { id:'WH-05', tenant:'Zenith Corp',        endpoint:'https://zenith.corp/pgx-hook',       events:['payment.success','user.churned'],    status:'Paused',  deliveryRate:'—',     lastPing:'3 days ago', secret:'whsec_zen_xxxxx', totalDelivered:92000,  failed:0     },
    { id:'WH-06', tenant:'FitLife Studios',    endpoint:'https://fitlife.io/webhooks',        events:['session.completed'],                 status:'Active',  deliveryRate:'98.5%', lastPing:'12 min ago', secret:'whsec_fit_xxxxx', totalDelivered:28400,  failed:428   },
  ],

  // ─── SUPPORT TICKETS ──────────────────────────────────────────────────────
  supportTickets: [
    { id:'TKT-991', tenant:'Acme Digital Ltd.',  subject:'API Rate Limit Increase Request',   priority:'High',   status:'Open',        category:'API',     sla:'2h',  elapsed:'1h 42m', date:'2026-06-25', assignee:'Unassigned',    channel:'Email',  csat:null  },
    { id:'TKT-992', tenant:'Gold Gym Global',    subject:'Billing Issue - double charge',     priority:'Medium', status:'In Progress', category:'Billing', sla:'4h',  elapsed:'3h 10m', date:'2026-06-25', assignee:'Sarah Mitchell', channel:'Chat',   csat:null  },
    { id:'TKT-993', tenant:'XYZ Creators',       subject:'Webhook not triggering on events',  priority:'High',   status:'Open',        category:'API',     sla:'2h',  elapsed:'6h 02m', date:'2026-06-25', assignee:'Unassigned',    channel:'Email',  csat:null  },
    { id:'TKT-994', tenant:'Nova Health Tech',   subject:'Data export CSV missing columns',   priority:'Low',    status:'Open',        category:'Data',    sla:'24h', elapsed:'18h 40m',date:'2026-06-24', assignee:'Dev Team',       channel:'Portal', csat:null  },
    { id:'TKT-995', tenant:'Zenith Corp',        subject:'SSO SAML Integration Setup',        priority:'Medium', status:'Resolved',    category:'Auth',    sla:'8h',  elapsed:'4h 20m', date:'2026-06-24', assignee:'Sarah Mitchell', channel:'Phone',  csat:5     },
    { id:'TKT-996', tenant:'FitLife Studios',    subject:'Cannot access admin dashboard',     priority:'High',   status:'Resolved',    category:'Access',  sla:'2h',  elapsed:'1h 55m', date:'2026-06-23', assignee:'James Hooper',   channel:'Chat',   csat:4     },
    { id:'TKT-997', tenant:'DataNest Analytics', subject:'API docs clarification needed',     priority:'Low',    status:'Open',        category:'Docs',    sla:'48h', elapsed:'5h 00m', date:'2026-06-24', assignee:'Unassigned',    channel:'Portal', csat:null  },
    { id:'TKT-998', tenant:'BrightSpark Media',  subject:'Onboarding support needed',         priority:'Medium', status:'In Progress', category:'Onboard', sla:'8h',  elapsed:'2h 30m', date:'2026-06-25', assignee:'James Hooper',   channel:'Chat',   csat:null  },
  ],

  // ─── AUDIT LOGS ───────────────────────────────────────────────────────────
  auditLogs: [
    { id:1,  action:'Tenant Provisioned',   module:'Tenant Mgmt', user:'Sarah Mitchell', role:'Platform Admin', tenant:'BrightSpark Media',   ip:'192.168.1.12',  device:'Chrome / macOS',   date:'2026-06-25T10:24:00Z', status:'Success' },
    { id:2,  action:'API Key Generated',    module:'API Mgmt',    user:'System',         role:'System',         tenant:'Acme Digital Ltd.',   ip:'10.0.0.1',      device:'System',            date:'2026-06-25T09:15:00Z', status:'Success' },
    { id:3,  action:'Tenant Suspended',     module:'Tenant Mgmt', user:'Sarah Mitchell', role:'Platform Admin', tenant:'ABC Travels',          ip:'192.168.1.12',  device:'Chrome / macOS',   date:'2026-06-25T08:30:00Z', status:'Success' },
    { id:4,  action:'Invoice Generated',    module:'Billing',     user:'System',         role:'System',         tenant:'XYZ Creators',         ip:'10.0.0.1',      device:'System',            date:'2026-06-24T14:00:00Z', status:'Success' },
    { id:5,  action:'Failed Login',         module:'Auth',        user:'unknown',        role:'—',              tenant:'—',                    ip:'203.0.113.45',  device:'Firefox / Windows', date:'2026-06-24T13:50:00Z', status:'Failed'  },
    { id:6,  action:'Webhook Updated',      module:'API Mgmt',    user:'Sarah Mitchell', role:'Platform Admin', tenant:'Nova Health Tech',     ip:'192.168.1.12',  device:'Chrome / macOS',   date:'2026-06-24T11:20:00Z', status:'Success' },
    { id:7,  action:'Payment Retried',      module:'Billing',     user:'Sarah Mitchell', role:'Platform Admin', tenant:'Local Shop Network',   ip:'192.168.1.12',  device:'Chrome / macOS',   date:'2026-06-24T09:00:00Z', status:'Failed'  },
    { id:8,  action:'Plan Downgraded',      module:'Billing',     user:'Sarah Mitchell', role:'Platform Admin', tenant:'ABC Travels',          ip:'192.168.1.12',  device:'Chrome / macOS',   date:'2026-06-23T16:30:00Z', status:'Success' },
    { id:9,  action:'Support Ticket Closed',module:'Support',     user:'James Hooper',   role:'Platform Support',tenant:'FitLife Studios',    ip:'192.168.1.18',  device:'Safari / macOS',   date:'2026-06-23T14:00:00Z', status:'Success' },
    { id:10, action:'Admin Login',          module:'Auth',        user:'Sarah Mitchell', role:'Platform Admin', tenant:'—',                    ip:'192.168.1.12',  device:'Chrome / macOS',   date:'2026-06-23T09:02:00Z', status:'Success' },
    { id:11, action:'Config Updated',       module:'Settings',    user:'Sarah Mitchell', role:'Platform Admin', tenant:'—',                    ip:'192.168.1.12',  device:'Chrome / macOS',   date:'2026-06-22T17:45:00Z', status:'Success' },
    { id:12, action:'Backup Completed',     module:'System',      user:'System',         role:'System',         tenant:'—',                    ip:'10.0.0.1',      device:'System',            date:'2026-06-22T02:00:00Z', status:'Success' },
  ],

  // ─── RENEWALS ─────────────────────────────────────────────────────────────
  renewals: [
    { id:'RNW-101', tenant:'XYZ Creators',      plan:'Enterprise', amount:18200, date:'2026-07-01', status:'Pending'  },
    { id:'RNW-102', tenant:'Acme Digital Ltd.', plan:'Enterprise', amount:12500, date:'2026-07-15', status:'Pending'  },
    { id:'RNW-103', tenant:'Gold Gym Global',   plan:'Pro',        amount:4500,  date:'2026-07-20', status:'Pending'  },
    { id:'RNW-104', tenant:'FitLife Studios',   plan:'Pro',        amount:6200,  date:'2026-08-01', status:'Upcoming' },
  ],

  // ─── DASHBOARD EXTRAS ─────────────────────────────────────────────────────
  conversionFunnel: [
    { stage:'Signups',    count:1284, rate:'100%' },
    { stage:'Trial',      count:744,  rate:'58%'  },
    { stage:'Active',     count:538,  rate:'42%'  },
    { stage:'Pro',        count:372,  rate:'29%'  },
    { stage:'Enterprise', count:231,  rate:'18%'  },
  ],
  topRegions: [
    { name:'North America', value:450, percentage:'45%' },
    { name:'Europe',        value:300, percentage:'30%' },
    { name:'Asia Pacific',  value:150, percentage:'15%' },
    { name:'Latin America', value:80,  percentage:'8%'  },
    { name:'Middle East',   value:20,  percentage:'2%'  },
  ],
  todaySummary: [
    { label:'API Requests processed',   value:'4.2M' },
    { label:'Webhooks delivered',       value:'1.1M' },
    { label:'New Tenant Signups',       value:'14'   },
    { label:'Invoices Paid',            value:'42'   },
    { label:'Support Tickets Resolved', value:'8'    },
  ],
  enterprisePipeline: [
    { stage:'New Enterprise Lead', count:122 },
    { stage:'Demo Scheduled',      count:84  },
    { stage:'Contract Sent',       count:71  },
    { stage:'Security Review',     count:45  },
    { stage:'Closed Won',          count:15  },
  ],
  smbPipeline: [
    { stage:'Trial Signup',  count:344 },
    { stage:'Active Usage',  count:201 },
    { stage:'Payment Added', count:146 },
    { stage:'Pro Upgraded',  count:112 },
    { stage:'Renewed',       count:97  },
  ],
  infrastructureHealth: {
    uptime:'99.99%',
    queries:'14.2M',
    errors:42,
    successRate:'99.8%',
  },

  // ─── PLATFORM SETTINGS (for Settings page) ────────────────────────────────
  platformSettings: {
    general: { platformName:'PlayGroundX', tagline:'Enterprise SaaS CRM Platform', supportEmail:'support@playgroundx.io', timezone:'UTC', dateFormat:'DD/MM/YYYY', maintenanceMode:false },
    security: { mfaRequired:true, sessionTimeout:30, passwordPolicy:'Strong', ipWhitelist:true, ssoEnabled:true, securityScore:92 },
    billing:  { currency:'USD', taxMode:'Automatic', stripeConnected:true, invoicePrefix:'INV', gracePeriodDays:7 },
    email:    { provider:'SendGrid', fromName:'PlayGroundX', fromEmail:'noreply@playgroundx.io', connected:true, dailySent:12400 },
    sms:      { provider:'Twilio', fromNumber:'+1-800-PGX-SAAS', connected:true, dailySent:2800 },
    whatsapp: { provider:'Meta Business API', connected:true, dailySent:1200 },
    api:      { rateLimitDefault:1000, maxKeysPerTenant:5, webhookRetries:3, logRetentionDays:90 },
    ai:       { provider:'Google Gemini', model:'gemini-pro', connected:true, tokensUsed:'14.2M', budget:50000 },
    backup:   { frequency:'Daily', lastBackup:'2026-06-25 02:00 AM', retentionDays:30, status:'Healthy', size:'2.4 TB' },
    featureFlags: [
      { name:'AI Auto-Responder',    enabled:true  },
      { name:'Video Calling',        enabled:true  },
      { name:'WhatsApp Integration', enabled:true  },
      { name:'Beta Analytics',       enabled:false },
      { name:'Custom Branding',      enabled:true  },
      { name:'Multi-Language',       enabled:false },
    ],
  },
};
