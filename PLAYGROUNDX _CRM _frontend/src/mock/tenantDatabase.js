import { INITIAL_DATABASE } from './database';

export const INITIAL_TENANT_DATABASE = {
  ...INITIAL_DATABASE,
  company: {
    id: 'ACME_001',
    name: 'Acme Digital Ltd.',
    plan: 'Enterprise',
    industry: 'Digital Media',
    settings: { timezone: 'UTC', currency: 'USD' }
  },

  // SECTIONS & QUEUES
  sections: [
    { id: 1, name: 'English Department', type: 'Language', agents: 45, supervisors: 5, leads: 1250, conversion: '12%', status: 'Active', color: '#00f0ff', languages: ['English'] },
    { id: 2, name: 'Spanish Department', type: 'Language', agents: 28, supervisors: 3, leads: 840, conversion: '15%', status: 'Active', color: '#ff0055', languages: ['Spanish'] },
    { id: 3, name: 'French Department', type: 'Language', agents: 12, supervisors: 2, leads: 320, conversion: '10%', status: 'Active', color: '#8a2be2', languages: ['French'] }
  ],
  queues: [
    { id: 1, name: 'EN Sales Queue', section: 'English Department', language: 'English', type: 'Sales', capacity: 100, currentWorkload: 85, agents: 20, sla: '15m', status: 'High Volume' },
    { id: 2, name: 'ES Support Queue', section: 'Spanish Department', language: 'Spanish', type: 'Support', capacity: 50, currentWorkload: 20, agents: 15, sla: '2h', status: 'Active' },
    { id: 3, name: 'FR Retention', section: 'French Department', language: 'French', type: 'Retention', capacity: 30, currentWorkload: 5, agents: 5, sla: '24h', status: 'Active' }
  ],

  // VISITORS (rich, relational)
  visitors: [
    { id:'V-1001', name:'James Wilson',    company:'TechVista Inc.',        contact:'+1 555-291-0012',    purpose:'General Inquiry',     host:'Unassigned',       hostDept:'Front Desk', type:'Walk-In',     status:'Waiting',     priority:'Normal', timeIn:'10:15 AM', timeOut:null,       badge:'B-301', date:'Today', appointmentId:null },
    { id:'V-1002', name:'Sarah Connor',    company:'Nexus Corp',            contact:'sarah@nexus.io',     purpose:'Consultation',        host:'Elena Vasquez',    hostDept:'Sales',      type:'Appointment', status:'Checked In',  priority:'High',   timeIn:'10:30 AM', timeOut:null,       badge:'B-302', date:'Today', appointmentId:'A-001' },
    { id:'V-1003', name:'Michael Chang',   company:'FastShip Logistics',    contact:'+1 555-882-4490',    purpose:'Package Drop-off',    host:'Front Desk',       hostDept:'Reception',  type:'Delivery',    status:'Checked Out', priority:'Low',    timeIn:'09:00 AM', timeOut:'09:25 AM', badge:'B-303', date:'Today', appointmentId:null },
    { id:'V-1004', name:'Linda Martinez',  company:'Orion Analytics',       contact:'l.martinez@orion.com',purpose:'Account Support',    host:'Priya Sharma',     hostDept:'Support',    type:'Walk-In',     status:'Waiting',     priority:'Normal', timeIn:'10:45 AM', timeOut:null,       badge:'B-304', date:'Today', appointmentId:null },
    { id:'V-1005', name:'Robert Fox',      company:'Vertex Partners',       contact:'+1 555-001-7742',    purpose:'Contract Renewal',    host:'James Harrington', hostDept:'Exec',       type:'VIP',         status:'Checked In',  priority:'VIP',    timeIn:'11:00 AM', timeOut:null,       badge:'B-305', date:'Today', appointmentId:'A-003' },
    { id:'V-1006', name:'Aisha Patel',     company:'Quantum AI',            contact:'a.patel@qai.io',     purpose:'Sales Demo',          host:'Elena Vasquez',    hostDept:'Sales',      type:'Appointment', status:'Scheduled',   priority:'High',   timeIn:null,       timeOut:null,       badge:null,    date:'Today', appointmentId:'A-002' },
    { id:'V-1007', name:'Carlos Rivera',   company:'BlueSky Media',         contact:'+1 555-774-3310',    purpose:'Job Interview',       host:'HR Team',          hostDept:'HR',         type:'Interview',   status:'Checked Out', priority:'Normal', timeIn:'09:30 AM', timeOut:'10:15 AM', badge:'B-306', date:'Today', appointmentId:null },
    { id:'V-1008', name:'Emma Johnson',    company:'Pinnacle Consulting',   contact:'e.j@pinnacle.com',   purpose:'Product Demo',        host:'David Mitchell',   hostDept:'Product',    type:'Appointment', status:'Scheduled',   priority:'Normal', timeIn:null,       timeOut:null,       badge:null,    date:'Today', appointmentId:'A-004' },
  ],

  // APPOINTMENTS TIMELINE
  receptionAppointments: [
    { id:'A-001', time:'09:00 AM', endTime:'09:45 AM', visitorName:'Sarah Connor',   visitorCo:'Nexus Corp',           host:'Elena Vasquez',    dept:'Sales',    type:'Consultation',    status:'In Progress', meetingRoom:'Conf A',   notes:'Bring brochures' },
    { id:'A-002', time:'10:00 AM', endTime:'10:45 AM', visitorName:'Aisha Patel',    visitorCo:'Quantum AI',           host:'Elena Vasquez',    dept:'Sales',    type:'Sales Demo',      status:'Upcoming',    meetingRoom:'Demo Lab',  notes:'Set up projector' },
    { id:'A-003', time:'11:00 AM', endTime:'12:00 PM', visitorName:'Robert Fox',     visitorCo:'Vertex Partners',      host:'James Harrington', dept:'Exec',     type:'Contract Review', status:'In Progress', meetingRoom:'Board Rm',  notes:'VIP — prepare refreshments' },
    { id:'A-004', time:'12:30 PM', endTime:'01:15 PM', visitorName:'Emma Johnson',   visitorCo:'Pinnacle Consulting',  host:'David Mitchell',   dept:'Product',  type:'Product Demo',    status:'Upcoming',    meetingRoom:'Demo Lab',  notes:'' },
    { id:'A-005', time:'02:00 PM', endTime:'02:30 PM', visitorName:'Tom Bradley',    visitorCo:'Atlas Insurance',      host:'Priya Sharma',     dept:'Support',  type:'Account Review',  status:'Upcoming',    meetingRoom:'Conf B',   notes:'' },
    { id:'A-006', time:'03:00 PM', endTime:'03:45 PM', visitorName:'Nina Okafor',    visitorCo:'Bloom Ventures',       host:'Raj Patel',        dept:'Finance',  type:'Investment Brief',status:'Upcoming',    meetingRoom:'Board Rm',  notes:'Prepare NDA' },
    { id:'A-007', time:'09:30 AM', endTime:'09:55 AM', visitorName:'Carlos Rivera',  visitorCo:'BlueSky Media',        host:'HR Team',          dept:'HR',       type:'Job Interview',   status:'Completed',   meetingRoom:'HR Room',   notes:'' },
    { id:'A-008', time:'08:30 AM', endTime:'08:55 AM', visitorName:'Grace Kim',      visitorCo:'Self',                 host:'Michael Chang',    dept:'IT',       type:'IT Support',      status:'Completed',   meetingRoom:'IT Desk',   notes:'Password reset' },
  ],

  // RECEPTION CALLS
  receptionCalls: [
    { id:'RC-01', caller:'+1 (555) 019-2831', status:'Missed',    time:'10:42 AM', type:'Incoming',  duration:null,     notes:'Logistics partner — call back required' },
    { id:'RC-02', caller:'John Smith',          status:'Connected', time:'10:15 AM', type:'Incoming',  duration:'4m 12s', notes:'Asked about appointment schedule' },
    { id:'RC-03', caller:'+1 (555) 102-9482',  status:'Voicemail', time:'09:30 AM', type:'Incoming',  duration:'0m 45s', notes:'Left voicemail — vendor inquiry' },
    { id:'RC-04', caller:'Emma Johnson',        status:'Connected', time:'09:05 AM', type:'Outgoing',  duration:'2m 08s', notes:'Confirmed afternoon appointment' },
    { id:'RC-05', caller:'+1 (555) 348-1192',  status:'Missed',    time:'08:58 AM', type:'Incoming',  duration:null,     notes:'No voicemail left' },
    { id:'RC-06', caller:'FedEx Courier',       status:'Connected', time:'08:45 AM', type:'Incoming',  duration:'1m 30s', notes:'Delivery confirmation' },
  ],

  // RECEPTION TASKS
  receptionTasks: [
    { id:'RT-01', title:'Call back logistics company',       priority:'High',   status:'Pending',     time:'12:00 PM', tag:'Calls',        linkedId:'RC-01' },
    { id:'RT-02', title:'Prepare VIP meeting room',          priority:'High',   status:'In Progress', time:'10:30 AM', tag:'Facility',     linkedId:'A-003' },
    { id:'RT-03', title:'Check incoming mail',               priority:'Medium', status:'Completed',   time:'09:00 AM', tag:'Admin',        linkedId:null },
    { id:'RT-04', title:'Print visitor pass for Robert Fox', priority:'High',   status:'Done',        time:'10:55 AM', tag:'Visitors',     linkedId:'V-1005' },
    { id:'RT-05', title:'Confirm afternoon appointments',    priority:'Medium', status:'Pending',     time:'01:00 PM', tag:'Appointments', linkedId:null },
    { id:'RT-06', title:'Order refreshments for Board Rm',   priority:'Medium', status:'In Progress', time:'10:45 AM', tag:'Facility',     linkedId:'A-003' },
    { id:'RT-07', title:'Send welcome email to Aisha Patel', priority:'Low',    status:'Pending',     time:'10:00 AM', tag:'Comms',        linkedId:'V-1006' },
  ],

  // MESSAGES (WhatsApp / SMS / Email)
  receptionMessages: [
    { id:'M-01', from:'Sarah Connor',          channel:'WhatsApp', text:'Running 5 mins late, is that okay?',            time:'10:22 AM', read:true,  tag:'Visitor' },
    { id:'M-02', from:'+1 (555) 019-2831',     channel:'SMS',      text:'Can I reschedule to 3 PM?',                      time:'10:40 AM', read:false, tag:'Inquiry' },
    { id:'M-03', from:'Robert Fox',            channel:'WhatsApp', text:'Please have the boardroom ready with projector.', time:'10:48 AM', read:false, tag:'VIP' },
    { id:'M-04', from:'delivery@fedex.com',    channel:'Email',    text:'Your package EX-1248 is out for delivery today.', time:'09:12 AM', read:true,  tag:'Delivery' },
    { id:'M-05', from:'hr@acme.io',            channel:'Email',    text:'Carlos Rivera interview rescheduled to 09:30.',   time:'08:55 AM', read:true,  tag:'Internal' },
    { id:'M-06', from:'Tom Bradley',           channel:'SMS',      text:'Confirming my 2 PM appointment.',                 time:'11:10 AM', read:false, tag:'Visitor' },
  ],

  // NOTIFICATIONS
  receptionNotifications: [
    { id:'N-01', title:'VIP Visitor Arrived',          body:'Robert Fox (Vertex Partners) checked in — VIP treatment required.', time:'11:00 AM', type:'vip',     read:false },
    { id:'N-02', title:'Missed Call',                  body:'Unidentified caller (+1 555-019-2831) — follow up needed.',          time:'10:42 AM', type:'call',    read:false },
    { id:'N-03', title:'Appointment In 30 Minutes',    body:'Aisha Patel is expected at 10:00 AM for Sales Demo.',               time:'09:30 AM', type:'appt',    read:true },
    { id:'N-04', title:'Walk-In Customer Waiting',     body:'James Wilson has been waiting since 10:15 AM.',                     time:'10:15 AM', type:'queue',   read:true },
    { id:'N-05', title:'New WhatsApp Message',         body:'Robert Fox: "Please have the boardroom ready with projector."',     time:'10:48 AM', type:'message', read:false },
    { id:'N-06', title:'Appointment Completed',        body:'Job interview with Carlos Rivera completed successfully.',           time:'10:15 AM', type:'done',    read:true },
  ],

  // ACTIVITY TIMELINE
  receptionActivity: [
    { id:'ACT-01', time:'11:02 AM', action:'VIP check-in processed',              actor:'Emma Watson', icon:'star',    detail:'Robert Fox — Badge B-305 issued' },
    { id:'ACT-02', time:'10:48 AM', action:'WhatsApp message received',           actor:'System',      icon:'msg',     detail:'From Robert Fox re boardroom setup' },
    { id:'ACT-03', time:'10:45 AM', action:'Walk-in registered',                  actor:'Emma Watson', icon:'user',    detail:'Linda Martinez — Account Support' },
    { id:'ACT-04', time:'10:42 AM', action:'Missed call — follow-up task created',actor:'System',      icon:'phone',   detail:'+1 (555) 019-2831 — RT-01 created' },
    { id:'ACT-05', time:'10:30 AM', action:'Visitor checked in',                  actor:'Emma Watson', icon:'check',   detail:'Sarah Connor — Conf A' },
    { id:'ACT-06', time:'10:15 AM', action:'Walk-in registered',                  actor:'Emma Watson', icon:'user',    detail:'James Wilson — General Inquiry' },
    { id:'ACT-07', time:'09:30 AM', action:'Interview room prepared',             actor:'Emma Watson', icon:'flag',    detail:'Carlos Rivera — HR Room' },
    { id:'ACT-08', time:'09:05 AM', action:'Outbound call made',                  actor:'Emma Watson', icon:'phone',   detail:'Emma Johnson — Appointment confirmed' },
    { id:'ACT-09', time:'09:00 AM', action:'Package received & logged',           actor:'Emma Watson', icon:'pkg',     detail:'Michael Chang — FastShip drop-off' },
    { id:'ACT-10', time:'08:45 AM', action:'Day started — desk opened',           actor:'Emma Watson', icon:'sun',     detail:'Reception active' },
  ],

  // HOURLY TRAFFIC DATA FOR CHARTS
  receptionHourly: [
    { hour:'8 AM',  visitors:2, calls:3, appointments:1 },
    { hour:'9 AM',  visitors:5, calls:4, appointments:2 },
    { hour:'10 AM', visitors:8, calls:6, appointments:3 },
    { hour:'11 AM', visitors:4, calls:2, appointments:2 },
    { hour:'12 PM', visitors:3, calls:1, appointments:1 },
    { hour:'1 PM',  visitors:2, calls:3, appointments:1 },
    { hour:'2 PM',  visitors:4, calls:2, appointments:2 },
    { hour:'3 PM',  visitors:3, calls:1, appointments:1 },
    { hour:'4 PM',  visitors:1, calls:2, appointments:0 },
  ],
};
