import React, { useState, useEffect } from 'react';
import {
  Plus, Search, MoreVertical, Zap, MessageCircle, Mail, MessageSquare,
  Clock, GitBranch, Edit3, CheckSquare, Tag, Link2, Activity, Play,
  History, MousePointer2, Hand, ZoomIn, ZoomOut, Maximize, Minimize2,
  Undo2, Redo2, Trash2, ChevronDown, X, Copy, HelpCircle, RotateCcw
} from 'lucide-react';

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const WORKFLOWS = [
  { id: 1, name: 'Registration Workflow',    status: 'Active', color: '#6366f1' },
  { id: 2, name: 'Profile Completion',       status: 'Active', color: '#6366f1' },
  { id: 3, name: 'Creator Activation',       status: 'Active', color: '#6366f1' },
  { id: 4, name: 'Fan Activation',           status: 'Active', color: '#6366f1' },
  { id: 5, name: 'KYC Verification',         status: 'Active', color: '#6366f1' },
  { id: 6, name: 'First Deposit (Fans)',     status: 'Active', color: '#6366f1' },
  { id: 7, name: 'First Content (Creators)', status: 'Active', color: '#6366f1' },
  { id: 8, name: 'Reactivation Workflow',    status: 'Active', color: '#6366f1' },
  { id: 9, name: 'VIP Detection',            status: 'Active', color: '#6366f1' },
  { id: 10, name: 'Escalation & Handoffs',  status: 'Active', color: '#6366f1' },
];

const TOOLS = [
  { name: 'Send WhatsApp',  icon: 'whatsapp',  bg: '#16a34a' },
  { name: 'Send Email',     icon: 'mail',      bg: '#7c3aed' },
  { name: 'Send SMS',       icon: 'sms',       bg: '#2563eb' },
  { name: 'Wait / Delay',   icon: 'clock',     bg: '#d97706' },
  { name: 'Condition / If Else', icon: 'branch', bg: '#ea580c' },
  { name: 'Update Field',   icon: 'edit',      bg: '#7c3aed' },
  { name: 'Create Task',    icon: 'task',      bg: '#4f46e5' },
  { name: 'Add to List / Tag', icon: 'tag',   bg: '#4f46e5' },
  { name: 'Webhook',        icon: 'webhook',   bg: '#64748b' },
];

// ─── SVG ICON HELPERS ──────────────────────────────────────────────────────────
const ToolIcon = ({ type, size = 12, color = '#fff' }) => {
  const s = size;
  switch (type) {
    case 'whatsapp': return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    );
    case 'mail': return <Mail size={s} color={color} />;
    case 'sms': return <MessageSquare size={s} color={color} />;
    case 'clock': return <Clock size={s} color={color} />;
    case 'branch': return <GitBranch size={s} color={color} />;
    case 'edit': return <Edit3 size={s} color={color} />;
    case 'task': return <CheckSquare size={s} color={color} />;
    case 'tag': return <Tag size={s} color={color} />;
    case 'webhook': return <Link2 size={s} color={color} />;
    default: return <Zap size={s} color={color} />;
  }
};

const NodeIcon = ({ type, size = 14 }) => {
  switch (type) {
    case 'trigger': return <Zap size={size} />;
    case 'whatsapp': return <MessageCircle size={size} />;
    case 'email': return <Mail size={size} />;
    case 'clock': return <Clock size={size} />;
    case 'condition': return <GitBranch size={size} />;
    case 'update': return <Edit3 size={size} />;
    case 'task': return <CheckSquare size={size} />;
    case 'tag': return <Tag size={size} />;
    case 'exit': return <X size={size} />;
    case 'end': return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    );
    default: return <Zap size={size} />;
  }
};

// ─── WORKFLOW NODE ─────────────────────────────────────────────────────────────
// Each node: left colored icon square, right text block, small label pill top-right
const WNode = ({ x, y, w = 165, type, label, title, subtitle, accent, selected, onSelect }) => {
  return (
    <g transform={`translate(${x},${y})`} style={{ cursor: 'pointer' }} onClick={() => onSelect && onSelect({ type, label, title, subtitle })}>
      {/* Background card */}
      <rect
        x={0} y={0} width={w} height={52}
        rx={8}
        fill="#0e1420"
        stroke={selected ? '#6366f1' : '#1e2d3d'}
        strokeWidth={selected ? 1.5 : 1}
        filter={selected ? 'url(#glow)' : undefined}
      />
      {/* Left icon square */}
      <rect x={0} y={0} width={44} height={52} rx={8} fill={accent} />
      <rect x={36} y={0} width={8} height={52} fill={accent} />

      {/* Render icon centered in left 44px block */}
      <foreignObject x={0} y={0} width={44} height={52}>
        <div
          style={{
            width: 44, height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <NodeIcon type={type} size={16} />
        </div>
      </foreignObject>

      {/* Text block */}
      <foreignObject x={50} y={0} width={w - 56} height={52}>
        <div style={{ height: 52, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 4 }}>
          <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em', lineHeight: 1, marginBottom: 2, textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontSize: 11, color: '#ffffff', fontWeight: 700, lineHeight: 1.2, marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          <div style={{ fontSize: 9.5, color: '#64748b', lineHeight: 1.2 }}>{subtitle}</div>
        </div>
      </foreignObject>
    </g>
  );
};

// ─── SVG CANVAS ───────────────────────────────────────────────────────────────
const WorkflowCanvas = ({ selectedNode, setSelectedNode }) => {
  // All node positions (x,y) → center-top of node
  const NODE_W = 165;

  // Column center x values
  const CX = 460;  // main vertical chain center
  const YL = 280;  // YES branch left x  
  const NX = 600;  // NO branch right x

  // Y positions for main chain
  const Y0   = 20;   // Trigger
  const Y1   = 108;  // Send WhatsApp (selected)
  const EXIT_R = 108; // User Replied exit (right of Y1)
  const Y2   = 196;  // Wait 15min
  const Y3   = 284;  // Condition

  // YES branch (left)
  const YY1  = 360;  // Update Field
  const YY2  = 430;  // Add to Workflow
  const YY3  = 500;  // End

  // NO branch (right, starts at same Y3+branch)
  const NY1  = 360;  // Reminder: Register
  const NY2  = 430;  // Wait 4h
  const NY3  = 510;  // Need Help
  const NY4  = 590;  // Wait 24h
  const NY5  = 670;  // Complete Registration
  const NY6  = 750;  // Wait 48h
  const NY7  = 830;  // Nast Reminder
  const NY8  = 910;  // Wait 72h
  const NY9  = 990;  // Create Task
  const NY10 = 1070; // Exit

  const plusBtn = (px, py) => (
    <g transform={`translate(${px},${py})`}>
      <circle cx={0} cy={0} r={8} fill="#0e1420" stroke="#2d3f53" strokeWidth={1} />
      <line x1={-4} y1={0} x2={4} y2={0} stroke="#475569" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={0} y1={-4} x2={0} y2={4} stroke="#475569" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  );

  const arrowDown = (px, py) => (
    <g transform={`translate(${px},${py})`}>
      <circle cx={0} cy={0} r={3} fill="#334155" />
    </g>
  );

  const connV = (x, y1, y2) => (
    <line x1={x + NODE_W/2} y1={y1 + 52} x2={x + NODE_W/2} y2={y2} stroke="#1e3a5f" strokeWidth={1.5} />
  );

  const connH = (x1, x2, y) => (
    <line x1={x1} y1={y} x2={x2} y2={y} stroke="#1e3a5f" strokeWidth={1.5} />
  );

  const connBezier = (x1, y1, x2, y2, color = '#1e3a5f') => {
    const midY = y1 + (y2 - y1) * 0.5;
    return (
      <path
        d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
        fill="none" stroke={color} strokeWidth={1.5}
      />
    );
  };

  const branchLabel = (x, y, text, color) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-14} y={-9} width={28} height={18} rx={4}
        fill={color === 'yes' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)'}
        stroke={color === 'yes' ? '#22c55e' : '#ef4444'}
        strokeWidth={1}
      />
      <text x={0} y={4.5} fontSize={9} fontWeight={700}
        fill={color === 'yes' ? '#22c55e' : '#ef4444'}
        textAnchor="middle"
      >{text}</text>
    </g>
  );

  const CXc = CX + NODE_W/2; // center x of main chain nodes

  return (
    <svg
      width="900" height="1200"
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1" fill="#1e293b" />
        </pattern>
      </defs>

      {/* ── MAIN VERTICAL CHAIN ─────────── */}

      {/* Trigger → Send WhatsApp */}
      {connV(CX, Y0, Y1)}
      {plusBtn(CXc, Y0 + 52 + (Y1 - Y0 - 52) / 2)}

      {/* Send WhatsApp → Wait */}
      {connV(CX, Y1, Y2)}
      {plusBtn(CXc, Y1 + 52 + (Y2 - Y1 - 52) / 2)}

      {/* Wait → Condition */}
      {connV(CX, Y2, Y3)}
      {plusBtn(CXc, Y2 + 52 + (Y3 - Y2 - 52) / 2)}

      {/* Horizontal exits from Send WhatsApp */}
      {connH(CX + NODE_W, CX + NODE_W + 80, Y1 + 26)}
      {arrowDown(CX + NODE_W + 40, Y1 + 26)}

      {/* Condition → YES branch */}
      {connBezier(CXc, Y3 + 52, YL + NODE_W/2, YY1, '#22c55e')}
      {branchLabel(CXc - 80, Y3 + 52 + 30, 'Yes', 'yes')}

      {/* Condition → NO branch */}
      {connBezier(CXc, Y3 + 52, NX + NODE_W/2, NY1, '#ef4444')}
      {branchLabel(CXc + 90, Y3 + 52 + 30, 'No', 'no')}

      {/* YES chain */}
      {connV(YL, YY1, YY2)}
      {plusBtn(YL + NODE_W/2, YY1 + 52 + (YY2 - YY1 - 52)/2)}
      {connV(YL, YY2, YY3)}
      {plusBtn(YL + NODE_W/2, YY2 + 52 + (YY3 - YY2 - 52)/2)}

      {/* NO chain */}
      {connV(NX, NY1, NY2)}
      {plusBtn(NX + NODE_W/2, NY1 + 52 + (NY2 - NY1 - 52)/2)}
      {connV(NX, NY2, NY3)}
      {plusBtn(NX + NODE_W/2, NY2 + 52 + (NY3 - NY2 - 52)/2)}
      {connV(NX, NY3, NY4)}
      {plusBtn(NX + NODE_W/2, NY3 + 52 + (NY4 - NY3 - 52)/2)}
      {connV(NX, NY4, NY5)}
      {plusBtn(NX + NODE_W/2, NY4 + 52 + (NY5 - NY4 - 52)/2)}
      {connV(NX, NY5, NY6)}
      {plusBtn(NX + NODE_W/2, NY5 + 52 + (NY6 - NY5 - 52)/2)}
      {connV(NX, NY6, NY7)}
      {plusBtn(NX + NODE_W/2, NY6 + 52 + (NY7 - NY6 - 52)/2)}
      {connV(NX, NY7, NY8)}
      {plusBtn(NX + NODE_W/2, NY7 + 52 + (NY8 - NY7 - 52)/2)}
      {connV(NX, NY8, NY9)}
      {plusBtn(NX + NODE_W/2, NY8 + 52 + (NY9 - NY8 - 52)/2)}
      {connV(NX, NY9, NY10)}
      {plusBtn(NX + NODE_W/2, NY9 + 52 + (NY10 - NY9 - 52)/2)}

      {/* ── NODES ──────────────────────── */}

      {/* Main chain */}
      <WNode x={CX} y={Y0} type="trigger"    label="Trigger"     title="New Lead Captured"   subtitle="Facebook Lead Ads"  accent="#3b82f6" />
      <WNode x={CX} y={Y1} type="whatsapp"   label="Send WhatsApp" title="Welcome Message"   subtitle="Immediately"        accent="#16a34a" selected />
      <WNode x={CX} y={Y2} type="clock"      label="Wait / Delay"  title="15 Minutes"         subtitle=""                  accent="#ca8a04" />
      <WNode x={CX} y={Y3} type="condition"  label="Condition"     title="Registered?"        subtitle=""                  accent="#ea580c" />

      {/* User Replied — exit right of Send WhatsApp */}
      <WNode x={CX + NODE_W + 80} y={Y1} type="exit" label="Exit" title="User Replied" subtitle="Human Handoff" accent="#374151" />

      {/* YES Branch */}
      <WNode x={YL} y={YY1} type="update"  label="Update Field"    title="Mark as Registered"   subtitle="" accent="#7c3aed" />
      <WNode x={YL} y={YY2} type="tag"     label="Add to Workflow" title="Profile Completion"   subtitle="" accent="#4f46e5" />
      <WNode x={YL} y={YY3} type="end"     label="End"             title="Stop This Workflow"   subtitle="" accent="#dc2626" />

      {/* NO Branch */}
      <WNode x={NX} y={NY1}  type="whatsapp" label="Send WhatsApp"  title="Reminder: Register"       subtitle="+15 Minutes" accent="#16a34a" />
      <WNode x={NX} y={NY2}  type="clock"    label="Wait / Delay"   title="4 Hours"                  subtitle=""            accent="#ca8a04" />
      <WNode x={NX} y={NY3}  type="whatsapp" label="Send WhatsApp"  title="Need Help?"               subtitle="+4 Hours"    accent="#16a34a" />
      <WNode x={NX} y={NY4}  type="clock"    label="Wait / Delay"   title="24 Hours"                 subtitle=""            accent="#ca8a04" />
      <WNode x={NX} y={NY5}  type="email"    label="Send Email"     title="Complete Registration"    subtitle="+24 Hours"   accent="#7c3aed" />
      <WNode x={NX} y={NY6}  type="clock"    label="Wait / Delay"   title="48 Hours"                 subtitle=""            accent="#ca8a04" />
      <WNode x={NX} y={NY7}  type="whatsapp" label="Send WhatsApp"  title="Nast Reminder"            subtitle="+48 Hours"   accent="#16a34a" />
      <WNode x={NX} y={NY8}  type="clock"    label="Wait / Delay"   title="72 Hours"                 subtitle=""            accent="#ca8a04" />
      <WNode x={NX} y={NY9}  type="task"     label="Create Task"    title="Call Prospect"            subtitle="High Priority" accent="#4f46e5" />
      <WNode x={NX} y={NY10} type="exit"     label="Exit"           title="Human Follow Up"          subtitle="Agent Task Created" accent="#374151" />
    </svg>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Automations() {
  const [activeTab, setActiveTab] = useState('Configuration');
  const [selectedNode, setSelectedNode] = useState(null);
  const [configOpen, setConfigOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  const [mobileTab, setMobileTab] = useState('canvas'); // 'left' | 'canvas' | 'right'

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    if (isMobile && node) {
      setMobileTab('right');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#060b14', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden', color: '#e2e8f0' }}>

      {/* ── WORKFLOW INFO BAR ─────────────────────────────────── */}
      <div style={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 12px' : '0 20px', background: '#060b14', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, minWidth: 0, flex: 1, marginRight: 8 }}>
          <span style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lead Nurture – Registration to First Deposit</span>
          <Edit3 size={12} color="#64748b" style={{ cursor: 'pointer', flexShrink: 0 }} />
          {!isMobile && <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 4, padding: '2px 8px', flexShrink: 0 }}>Published</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : 8, flexShrink: 0 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: isMobile ? '5px 8px' : '5px 12px', background: 'transparent', border: '1px solid #2d3f53', borderRadius: 6, color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            <History size={12} /> {!isMobile && 'Version History'}
          </button>
          <button style={{ padding: isMobile ? '5px 8px' : '5px 12px', background: 'transparent', border: '1px solid #2d3f53', borderRadius: 6, color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            Save
          </button>
          <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #2d3f53', borderRadius: 6, color: '#64748b', cursor: 'pointer' }}>
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* ── MOBILE TAB SWITCHER (< 1024px) ───────────────────────── */}
      {isMobile && (
        <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', background: '#0e1420', flexShrink: 0 }}>
          {[
            { id: 'left', label: '📁 Workflows' },
            { id: 'canvas', label: '🕸️ Canvas' },
            { id: 'right', label: '⚙️ Config' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setMobileTab(t.id)}
              style={{
                flex: 1, padding: '10px 4px', fontSize: 11, fontWeight: 700,
                background: mobileTab === t.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: mobileTab === t.id ? '#818cf8' : '#64748b',
                border: 'none', borderBottom: mobileTab === t.id ? '2px solid #6366f1' : '2px solid transparent',
                cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* ── THREE-COLUMN MAIN AREA ────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ─ LEFT PANEL ─────────────────────────── */}
        <div style={{
          width: isMobile ? '100%' : 270,
          display: (!isMobile || mobileTab === 'left') ? 'flex' : 'none',
          flexDirection: 'column', background: '#060b14', borderRight: isMobile ? 'none' : '1px solid #1e293b', overflow: 'hidden',
          flexShrink: 0,
        }}>

          {/* WORKFLOWS section */}
          <div style={{ padding: '14px 14px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>WORKFLOWS</span>
              <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                <Plus size={11} /> New Workflow
              </button>
            </div>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <Search size={12} color="#475569" style={{ position: 'absolute', left: 9, top: 8, pointerEvents: 'none' }} />
              <input
                placeholder="Search workflows..."
                style={{ width: '100%', background: '#0e1420', border: '1px solid #1e293b', borderRadius: 6, fontSize: 11, color: '#fff', padding: '6px 8px 6px 28px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {/* All Workflows dropdown row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>All Workflows</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e1420', border: '1px solid #1e293b', borderRadius: 4, cursor: 'pointer' }}><RotateCcw size={10} color="#64748b" /></button>
                <button style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e1420', border: '1px solid #1e293b', borderRadius: 4, cursor: 'pointer' }}><MoreVertical size={10} color="#64748b" /></button>
              </div>
            </div>
          </div>

          {/* Workflow list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
            {WORKFLOWS.map((wf, i) => (
              <div
                key={wf.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 8px', marginBottom: 2, borderRadius: 7, cursor: 'pointer',
                  background: i === 0 ? 'rgba(99,102,241,0.08)' : 'transparent',
                  border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.2)' : 'transparent'}`,
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#4f46e5' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <GitBranch size={12} color={i === 0 ? '#fff' : '#64748b'} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#fff' : '#94a3b8' }}>{wf.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>Active</span>
                  <MoreVertical size={12} color="#334155" />
                </div>
              </div>
            ))}
          </div>

          {/* TOOLS section */}
          <div style={{ padding: '12px 14px 0', borderTop: '1px solid #1e293b', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>TOOLS</span>
          </div>
          <div style={{ overflowY: 'auto', padding: '8px 8px 8px', maxHeight: 280 }}>
            {TOOLS.map(t => (
              <div
                key={t.name}
                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 8px', marginBottom: 3, borderRadius: 7, background: '#0e1420', border: '1px solid #1e293b', cursor: 'grab' }}
              >
                <div style={{ width: 22, height: 22, borderRadius: 5, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ToolIcon type={t.icon} size={11} />
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{t.name}</span>
              </div>
            ))}
            <div style={{ fontSize: 10, color: '#334155', textAlign: 'center', marginTop: 8, paddingBottom: 4 }}>Drag and drop nodes to build your workflow</div>
          </div>

        </div>

        {/* ─ CENTER CANVAS ──────────────────────── */}
        <div style={{
          flex: 1,
          width: isMobile ? '100%' : 'auto',
          display: (!isMobile || mobileTab === 'canvas') ? 'flex' : 'none',
          position: 'relative', background: '#060b14', overflow: 'hidden',
        }}>
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          {/* Canvas toolbar */}
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 2,
            background: '#0e1420', border: '1px solid #1e293b',
            borderRadius: 10, padding: '4px 6px',
          }}>
            {[
              { icon: <MousePointer2 size={15} />, active: true },
              { icon: <Hand size={15} /> },
              null,
              { icon: <ZoomIn size={15} /> },
              { icon: <ZoomOut size={15} /> },
              { icon: <Minimize2 size={15} /> },
              { icon: <Maximize size={15} /> },
              null,
              { icon: <Undo2 size={15} /> },
              { icon: <Redo2 size={15} /> },
            ].map((btn, i) =>
              btn === null ? (
                <div key={i} style={{ width: 1, height: 18, background: '#1e293b', margin: '0 2px' }} />
              ) : (
                <button
                  key={i}
                  style={{
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: btn.active ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: 'none', borderRadius: 6, color: btn.active ? '#818cf8' : '#64748b', cursor: 'pointer',
                  }}
                >
                  {btn.icon}
                </button>
              )
            )}
          </div>

          {/* Scrollable canvas area */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }}>
            <div style={{ padding: '20px 20px 60px', minWidth: 1100, minHeight: 1300 }}>
              <WorkflowCanvas selectedNode={selectedNode} setSelectedNode={handleSelectNode} />
            </div>
          </div>

          {/* Mini map */}
          <div style={{
            position: 'absolute', bottom: 48, left: 16, zIndex: 20,
            width: 110, background: '#0e1420', border: '1px solid #1e293b',
            borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center',
          }}>
            {/* Simplified visual map */}
            {[
              { w: 28, bg: '#3b82f6' },
              null,
              { w: 28, bg: '#16a34a' },
              null,
              { w: 28, bg: '#ca8a04' },
              null,
              { w: 28, bg: '#ea580c' },
            ].map((r, i) =>
              r === null
                ? <div key={i} style={{ width: 1, height: 6, background: '#1e3a5f' }} />
                : <div key={i} style={{ width: r.w, height: 8, borderRadius: 2, background: r.bg, opacity: 0.7 }} />
            )}
            <div style={{ display: 'flex', gap: 20, marginTop: 2 }}>
              <div style={{ width: 1, height: 10, background: '#1e3a5f' }} />
              <div style={{ width: 1, height: 10, background: '#1e3a5f' }} />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[['#7c3aed'], ['#16a34a']].map(([bg], i) => (
                <div key={i} style={{ width: 28, height: 8, borderRadius: 2, background: bg, opacity: 0.6 }} />
              ))}
            </div>
            {/* mini map controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 6 }}>
              <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14 }}>+</button>
              <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14 }}>−</button>
              <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Maximize size={10} /></button>
            </div>
          </div>
        </div>

        {/* ─ RIGHT CONFIG PANEL ─────────────────── */}
        <div style={{
          width: isMobile ? '100%' : 'auto',
          display: (!isMobile || mobileTab === 'right') ? 'flex' : 'none',
          position: 'relative', flexShrink: 0, transition: isMobile ? 'none' : 'width 0.3s ease',
          flex: isMobile ? 1 : 'none',
        }}>

          {/* Toggle Tab Button — visible only on desktop */}
          {!isMobile && (
            <button
              onClick={() => setConfigOpen(o => !o)}
              style={{
                position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)',
                width: 14, height: 56, background: '#0a0f1c',
                border: '1px solid #1e293b', borderRight: 'none',
                borderRadius: '6px 0 0 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 30, color: '#475569',
                transition: 'color 0.2s',
              }}
              title={configOpen ? 'Collapse panel' : 'Expand panel'}
            >
              {/* Chevron arrow — flips direction */}
              <svg
                width="8" height="14"
                viewBox="0 0 8 14"
                style={{ transform: configOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s ease' }}
              >
                <polyline points="6,1 1,7 6,13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <div style={{
            width: isMobile ? '100%' : (configOpen ? 310 : 0),
            flex: isMobile ? 1 : 'none',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            background: '#0a0f1c',
            borderLeft: isMobile ? 'none' : '1px solid #1e293b',
            overflow: 'hidden',
            transition: isMobile ? 'none' : 'width 0.3s ease',
          }}>

          {/* Panel header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 12px rgba(22,163,74,0.25)' }}>
                <MessageCircle size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 3 }}>Send WhatsApp</div>
                <div style={{ fontSize: 10.5, color: '#64748b' }}>Send a WhatsApp message to the lead</div>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', marginTop: 2 }}><X size={15} /></button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
            {['Configuration', 'Conditions', 'Metrics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 0', marginRight: 20, fontSize: 11.5, fontWeight: 700, background: 'none', border: 'none',
                  color: activeTab === tab ? '#818cf8' : '#475569', cursor: 'pointer', position: 'relative', whiteSpace: 'nowrap',
                  borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Node Name</label>
              <input defaultValue="Welcome Message" style={{ width: '100%', background: '#060b14', border: '1px solid #1e293b', borderRadius: 7, fontSize: 12.5, color: '#fff', padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Send To</label>
              <div style={{ position: 'relative' }}>
                <select style={{ width: '100%', background: '#060b14', border: '1px solid #1e293b', borderRadius: 7, fontSize: 12.5, color: '#fff', padding: '8px 30px 8px 10px', outline: 'none', appearance: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <option>Lead Phone (WhatsApp)</option>
                </select>
                <ChevronDown size={13} color="#475569" style={{ position: 'absolute', right: 10, top: 10, pointerEvents: 'none' }} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Message Template</label>
              <div style={{ position: 'relative', marginBottom: 6 }}>
                <select style={{ width: '100%', background: '#060b14', border: '1px solid #1e293b', borderRadius: 7, fontSize: 12.5, color: '#fff', padding: '8px 30px 8px 10px', outline: 'none', appearance: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <option>Welcome - New Lead</option>
                </select>
                <ChevronDown size={13} color="#475569" style={{ position: 'absolute', right: 10, top: 10, pointerEvents: 'none' }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <button style={{ fontSize: 10.5, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Preview Template</button>
              </div>
            </div>

            {/* Message Preview */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Message Preview</label>
              <div style={{ background: '#060b14', border: '1px solid #1e293b', borderRadius: 10, padding: '12px 12px', fontSize: 12, color: '#cbd5e1', lineHeight: 1.65 }}>
                <p style={{ margin: '0 0 5px' }}>Hi <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', borderRadius: 4, padding: '1px 5px' }}>{"{{first_name}}"}</span> 👋</p>
                <p style={{ margin: '0 0 5px' }}>Welcome to PlayGroundX!</p>
                <p style={{ margin: '0 0 5px' }}>Your account is almost ready.</p>
                <p style={{ margin: '0 0 5px' }}>Create your profile here:<br />
                  <span style={{ color: '#60a5fa', textDecoration: 'underline' }}>{"{{registration_link}}"}</span>
                </p>
                <p style={{ margin: '0 0 5px' }}>Choose your username, upload your profile photo and start exploring.</p>
                <p style={{ margin: 0 }}>Need help? Simply reply to this message.</p>
              </div>
            </div>

            {/* Variables */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#6366f1' }}>Variables:</span>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {['{{first_name}}', '{{registration_link}}'].map(v => (
                  <span key={v} style={{ fontSize: 9.5, background: '#0e1420', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: 4, padding: '2px 7px', cursor: 'pointer' }}>{v}</span>
                ))}
                <span style={{ fontSize: 9.5, background: '#0e1420', border: '1px solid #1e293b', color: '#64748b', borderRadius: 4, padding: '2px 7px', cursor: 'pointer' }}>+3 more</span>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Time to Send</label>
              <div style={{ position: 'relative' }}>
                <select style={{ width: '100%', background: '#060b14', border: '1px solid #1e293b', borderRadius: 7, fontSize: 12.5, color: '#fff', padding: '8px 30px 8px 10px', outline: 'none', appearance: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <option>Immediately</option>
                </select>
                <ChevronDown size={13} color="#475569" style={{ position: 'absolute', right: 10, top: 10, pointerEvents: 'none' }} />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Channel</label>
              <div style={{ position: 'relative' }}>
                <select style={{ width: '100%', background: '#060b14', border: '1px solid #1e293b', borderRadius: 7, fontSize: 12.5, color: '#fff', padding: '8px 30px 8px 36px', outline: 'none', appearance: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <option>WhatsApp</option>
                </select>
                <div style={{ position: 'absolute', left: 10, top: 9, pointerEvents: 'none' }}><MessageCircle size={15} color="#22c55e" /></div>
                <ChevronDown size={13} color="#475569" style={{ position: 'absolute', right: 10, top: 10, pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Track Clicks */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Track Clicks</span>
                <HelpCircle size={12} color="#475569" />
              </div>
              {/* Toggle ON */}
              <div style={{ width: 36, height: 20, background: '#4f46e5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 2px', cursor: 'pointer' }}>
                <div style={{ width: 16, height: 16, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
              </div>
            </div>

            {/* Delete Node */}
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: 14 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Trash2 size={13} /> Delete Node
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #1e293b', display: 'flex', gap: 8, flexShrink: 0 }}>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '8px 0', background: 'transparent', border: '1px solid #2d3f53', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              <Play size={13} /> Test Workflow
            </button>
            <button style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #2d3f53', borderRadius: 8, color: '#64748b', cursor: 'pointer' }}>
              <Copy size={14} />
            </button>
            <button style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={14} />
            </button>
          </div>
          </div>    {/* end inner animated width div */}
        </div>    {/* end outer wrapper with toggle button */}
      </div>

      {/* ── BOTTOM STATS BAR ─────────────────────────────── */}
      <div style={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', padding: isMobile ? '0 14px' : '0 24px', background: '#060b14', borderTop: '1px solid #1e293b', gap: 0, overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {[
          { label: 'Workflow Status', value: 'Active', valueColor: '#22c55e' },
          { label: 'Enrolled',        value: '2,431',  valueColor: '#f1f5f9' },
          { label: 'Completed',       value: '1,842',  valueColor: '#f1f5f9' },
          { label: 'In Progress',     value: '589',    valueColor: '#f1f5f9' },
          { label: 'Exited',          value: '320',    valueColor: '#f1f5f9' },
          { label: 'Conversion Rate', value: '24.3%',  valueColor: '#f1f5f9' },
        ].map((s, i) => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column', marginRight: isMobile ? 24 : 48, flexShrink: 0 }}>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: '#475569', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: s.valueColor }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
