import { useState } from 'react';
import { 
  Video, Mic, MicOff, VideoOff, MonitorUp, Paperclip, PhoneOff, User, 
  MoreHorizontal, Maximize, PenTool, CircleDot, Hand, Users, MessageSquare, 
  Bot, FolderSync, X, CheckCircle, ShieldCheck, Share2, Sparkles, Send, 
  Volume2, Wifi, FileText, Download, AlertCircle, Play
} from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

export default function VideoCall() {
  const [leads] = useDataStore('leads');
  const { addToast } = useToast();
  
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [recording, setRecording] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'JS', name: 'Jenna Smith (VIP Lead)', text: 'Hi! Can we review the 80/20 revenue split and KYC checklist?', time: '14:02' },
    { id: 2, sender: 'Me', name: 'You (Host)', text: 'Welcome Jenna! Absolutely, let me open the studio dashboard.', time: '14:03' }
  ]);
  
  const [actionItems, setActionItems] = useState([
    { id: 1, text: 'Verify Government ID photo match for KYC approval', done: true },
    { id: 2, text: 'Confirm payout bank account routing number via Stripe', done: true },
    { id: 3, text: 'Send custom VIP onboarding agreement e-signature link', done: false },
    { id: 4, text: 'Schedule follow-up promotional launch review in 7 days', done: false }
  ]);
  
  const [whiteboardNotes, setWhiteboardNotes] = useState(
    '✨ VIP Creator Studio Setup & KYC Roadmap:\n\n' +
    '1. Revenue Split: Industry-leading 80% Creator / 20% PGX.\n' +
    '2. Payout Schedule: Instant Daily settlements via automated Stripe wire.\n' +
    '3. Studio Equipment: 4K Camera + Ring Light lighting kit verified.\n' +
    '4. Next Immediate Action: Complete e-signature on custom VIP contract.'
  );

  const [filesList, setFilesList] = useState([
    { id: 1, name: 'VIP_80_20_Revenue_Contract.pdf', size: '2.4 MB', time: '14:00' },
    { id: 2, name: 'KYC_ID_Verification_Scan.jpg', size: '1.1 MB', time: '14:01' },
    { id: 3, name: 'Creator_Studio_Guidelines_2026.docx', size: '840 KB', time: '14:05' }
  ]);

  // Use a high-priority VIP lead as the mock video caller
  const activeCaller = leads?.find(l => l.tags?.includes('VIP')) || {
    name: 'Jenna Smith',
    company: 'Alpha Creatives Studio',
    email: 'jenna@alphacreatives.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    type: 'VIP Creator',
    value: '$12,400/mo'
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      { id: Date.now(), sender: 'Me', name: 'You (Host)', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput('');
    addToast('success', 'Message Sent', 'Delivered to live room.');
  };

  if (callEnded) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-[#07080a] animate-fadeIn">
        <div className="max-w-xl w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 bg-neon-green/10 border border-neon-green/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(57,255,20,0.2)]">
            <CheckCircle size={40} className="text-neon-green" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Consultation Ended Successfully</h2>
            <p className="text-xs text-gray-400 mt-1">Session with <strong className="text-white">{activeCaller.name} ({activeCaller.company})</strong> was archived.</p>
          </div>
          
          <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-800 font-bold">
              <span className="text-gray-400">Duration</span>
              <span className="text-white font-mono">18 mins 42 secs</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-800 font-bold">
              <span className="text-gray-400">Recording Status</span>
              <span className="text-neon-green flex items-center gap-1">⚡ Saved to AI Cloud</span>
            </div>
            <div className="flex justify-between items-center font-bold">
              <span className="text-gray-400">Action Items Pending</span>
              <span className="text-neon-blue">{actionItems.filter(i => !i.done).length} Tasks Auto-Created in CRM</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => {
                addToast('success', 'Synced with CRM', 'All notes and tasks attached to lead timeline.');
                setCallEnded(false);
              }}
              className="flex-1 py-3.5 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              Sync & Return to Consultation Room 🚀
            </button>
            <button 
              onClick={() => {
                addToast('info', 'Downloading Transcript', 'AI_Transcript_Jenna_Smith.pdf is downloading...');
              }}
              className="px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl border border-gray-700 transition-colors"
            >
              📥 Export AI Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-900/60 border border-gray-800/80 px-5 py-3 rounded-2xl backdrop-blur-md shrink-0">
        <div className="flex items-start lg:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)] shrink-0">
            <Video size={20} className="text-neon-blue" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-black text-white tracking-tight">VIP Creator Consultation Room</h1>
              <span className="px-2 py-0.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-[10px] font-extrabold uppercase rounded-md tracking-wider">⚡ High Priority</span>
            </div>
            <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-neon-green flex items-center gap-1.5 font-bold">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shrink-0" />
                {recording ? 'Recording & AI Transcribing' : 'Recording Paused'}
              </span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 text-gray-400"><Wifi size={12} className="text-neon-green shrink-0"/> 5G HD Quality (60 FPS)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button 
            onClick={() => {
              navigator.clipboard?.writeText('https://playgroundx.com/meet/vip-jenna-smith-882');
              addToast('success', 'Link Copied', 'VIP Consultation room invite link copied to clipboard.');
            }}
            className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-white text-xs font-bold rounded-xl border border-gray-700 transition-all shadow-sm"
          >
            <Share2 size={14} className="text-neon-blue shrink-0" /> Copy Invite Link
          </button>
          <button 
            onClick={() => {
              setRecording(!recording);
              addToast('info', recording ? 'Recording Paused' : 'Recording Resumed', recording ? 'AI transcription temporarily halted.' : 'AI transcription active.');
            }}
            className={`flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${recording ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-gray-800 text-gray-400'}`}
          >
            <CircleDot size={14} className={recording ? 'text-red-500 animate-ping shrink-0' : 'shrink-0'} /> {recording ? 'REC ON' : 'REC OFF'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-y-auto lg:overflow-hidden custom-scrollbar">
        
        {/* Main Video Presentation Area */}
        <div className="flex-1 bg-[#090b0e] border border-gray-800 rounded-3xl flex flex-col overflow-hidden relative shadow-2xl group min-h-[500px] lg:min-h-0 shrink-0">
          
          {/* Raised Hand Banner Alert */}
          {handRaised && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-yellow-400 text-black font-black text-xs px-5 py-2.5 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.6)] flex items-center gap-2.5 animate-bounce">
              <Hand size={16} className="text-black" /> ✋ {activeCaller.name} raised hand: "Can we clarify the wire transfer schedule?"
              <button onClick={() => setHandRaised(false)} className="ml-2 bg-black/10 hover:bg-black/20 rounded-full p-1"><X size={12} /></button>
            </div>
          )}

          {/* Dynamic Stage: Screen Share OR 2-Grid Video */}
          {screenShare ? (
            /* Screen Share Mode - Showing Studio Revenue Dashboard */
            <div className="flex-1 relative bg-gray-950 flex flex-col p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2.5">
                  <MonitorUp size={18} className="text-neon-blue animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Screen Share: PGX Creator Studio & Revenue Analytics</span>
                </div>
                <span className="text-[10px] bg-neon-blue/10 text-neon-blue px-2.5 py-1 rounded-full font-bold border border-neon-blue/30">Live Presenting</span>
              </div>

              {/* Mock Dashboard UI on Screen Share */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-5 overflow-y-auto custom-scrollbar">
                <div className="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Projected Monthly Revenue</span>
                    <div className="text-2xl font-black text-neon-green mt-1">{activeCaller.value}</div>
                    <span className="text-[10px] text-gray-400">80% Creator Cut ($9,920.00)</span>
                  </div>
                  <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Active Monthly Fans</span>
                    <div className="text-2xl font-black text-white mt-1">48,500</div>
                    <span className="text-[10px] text-neon-blue">↑ 22% growth rate</span>
                  </div>
                  <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">KYC & Studio Verification</span>
                    <div className="text-xl font-black text-neon-purple flex items-center gap-1.5 mt-1"><ShieldCheck size={18} /> Verified VIP</div>
                    <span className="text-[10px] text-gray-400">All documents approved</span>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col justify-center items-center text-center">
                  <Sparkles size={32} className="text-neon-blue mb-2 animate-spin" />
                  <div className="text-xs font-bold text-gray-300">Simulated Real-Time Revenue Chart Stream</div>
                  <div className="w-full h-16 bg-gradient-to-r from-neon-blue/20 via-purple-500/20 to-neon-green/20 rounded-lg mt-3 border border-gray-800" />
                </div>

                <div className="col-span-1 bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                  <div className="text-xs font-bold text-white mb-2">Live Contract Status</div>
                  <div className="p-2 bg-gray-900 rounded text-[10px] text-gray-300">✔ ID Proof Approved</div>
                  <div className="p-2 bg-gray-900 rounded text-[10px] text-gray-300">✔ Wire Routing Confirmed</div>
                  <div className="p-2 bg-neon-green/10 text-neon-green rounded text-[10px] font-bold">⏳ E-Signature Pending</div>
                </div>
              </div>

              {/* Floating PIP Caller View during screen share */}
              <div className="absolute top-16 right-10 w-48 aspect-video bg-gray-900 rounded-2xl border-2 border-neon-blue shadow-2xl overflow-hidden z-20">
                <img src={activeCaller.avatar} alt="Caller" className="w-full h-full object-cover" />
                <div className="absolute bottom-1.5 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold flex items-center gap-1">
                  <Volume2 size={10} className="text-neon-green animate-pulse" /> {activeCaller.name}
                </div>
              </div>
            </div>
          ) : (
            /* Standard 2-Grid VIP Video Consultation Room */
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gradient-to-b from-gray-950 to-[#07090d] overflow-y-auto md:overflow-hidden custom-scrollbar">
              
              {/* Box 1: Caller Stream (Jenna Smith) */}
              <div className="relative bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden flex items-center justify-center shadow-inner group-hover:border-gray-700 transition-all aspect-video md:aspect-auto shrink-0 md:shrink">
                <img src={activeCaller.avatar} alt="Caller" className="w-full h-full object-cover filter brightness-95" />
                
                {/* Audio Equalizer Soundwave overlay */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="flex items-center gap-0.5 h-3">
                    <div className="w-1 bg-neon-green h-full animate-pulse rounded-full" />
                    <div className="w-1 bg-neon-green h-2 animate-bounce rounded-full" />
                    <div className="w-1 bg-neon-green h-3 animate-pulse rounded-full" />
                  </div>
                  <span className="text-white text-xs font-bold">{activeCaller.name}</span>
                  <span className="text-[10px] bg-yellow-400 text-black font-extrabold px-1.5 rounded">VIP</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-200 font-medium">{activeCaller.company}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neon-green font-mono">1080p60 HD</span>
                    <Mic size={14} className="text-neon-green" />
                  </div>
                </div>
              </div>

              {/* Box 2: Host / Self Stream (You) */}
              <div className="relative bg-gray-900 rounded-2xl border border-gray-800/80 overflow-hidden flex items-center justify-center shadow-inner aspect-video md:aspect-auto shrink-0 md:shrink">
                {camOn ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center relative">
                    <div className="w-32 h-32 rounded-full border-4 border-neon-blue/40 flex items-center justify-center bg-gray-800 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                      <User size={56} className="text-neon-blue" />
                    </div>
                    <span className="text-xs text-gray-400 mt-3 font-bold">Camera Live (Studio Cam 1)</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-950 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-2">
                      <VideoOff size={36} className="text-red-400" />
                    </div>
                    <span className="text-xs text-gray-500 font-bold">Camera Turned Off</span>
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="text-white text-xs font-bold">You (PlayGroundX Host)</span>
                  <span className="text-[10px] bg-neon-blue/20 text-neon-blue font-bold px-1.5 rounded border border-neon-blue/30">Host</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400 font-medium">PlayGroundX Headquarters</div>
                  <div className="flex items-center gap-2">
                    {micOn ? <Mic size={14} className="text-neon-green" /> : <MicOff size={14} className="text-red-500" />}
                    {camOn ? <Video size={14} className="text-neon-green" /> : <VideoOff size={14} className="text-red-500" />}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Interactive Controls Toolbar Bar */}
          <div className="bg-gray-950/95 px-6 py-4 border-t border-gray-800 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-3 hidden md:flex">
              <div className="text-sm font-mono text-white font-extrabold bg-gray-900 px-3 py-1 rounded-lg border border-gray-800">14:22</div>
              <span className="text-[11px] text-neon-green flex items-center gap-1 font-bold">
                <ShieldCheck size={14} /> E2E Encrypted
              </span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center flex-1">
              <button 
                onClick={() => {
                  setMicOn(!micOn);
                  addToast('info', micOn ? 'Microphone Muted' : 'Microphone Unmuted', micOn ? 'Your audio is now silenced.' : 'You are now audible.');
                }}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${micOn ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}
                title="Microphone"
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              
              <button 
                onClick={() => {
                  setCamOn(!camOn);
                  addToast('info', camOn ? 'Camera Turned Off' : 'Camera Turned On', camOn ? 'Video feed disabled.' : 'Broadcasting HD video.');
                }}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${camOn ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}
                title="Camera"
              >
                {camOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              
              <button 
                onClick={() => {
                  setScreenShare(!screenShare);
                  addToast('success', !screenShare ? 'Screen Share Started' : 'Screen Share Stopped', !screenShare ? 'Presenting Creator Studio & Revenue Dashboard.' : 'Returned to video room.');
                }}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${screenShare ? 'bg-neon-blue text-black font-black shadow-[0_0_20px_rgba(0,240,255,0.5)] scale-105' : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'}`}
                title="Share Studio Screen"
              >
                <MonitorUp size={20} />
              </button>

              <div className="w-px h-6 bg-gray-800 mx-1"></div>

              <button 
                onClick={() => {
                  setActiveTab('whiteboard');
                  addToast('info', 'Whiteboard Active', 'Opened collaborative studio whiteboard.');
                }} 
                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all border ${activeTab === 'whiteboard' ? 'bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'}`} 
                title="Whiteboard"
              >
                <PenTool size={18} />
              </button>

              <button 
                onClick={() => {
                  setHandRaised(!handRaised);
                  addToast('info', !handRaised ? 'Hand Raised' : 'Hand Lowered', !handRaised ? 'Signaled priority question.' : 'Question resolved.');
                }} 
                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all border ${handRaised ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-bounce' : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'}`} 
                title="Raise Hand"
              >
                <Hand size={18} />
              </button>

              <div className="w-px h-6 bg-gray-800 mx-1 hidden md:block"></div>
              
              <button onClick={() => setActiveTab('chat')} className={`hidden md:flex w-11 h-11 rounded-2xl items-center justify-center transition-all border ${activeTab === 'chat' ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/40' : 'bg-gray-900 text-gray-400 hover:text-white border-gray-800'}`} title="Chat Room">
                <MessageSquare size={18} />
              </button>
              <button onClick={() => setActiveTab('participants')} className={`hidden md:flex w-11 h-11 rounded-2xl items-center justify-center transition-all border ${activeTab === 'participants' ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/40' : 'bg-gray-900 text-gray-400 hover:text-white border-gray-800'}`} title="Participants">
                <Users size={18} />
              </button>
              <button onClick={() => setActiveTab('ai-summary')} className={`hidden md:flex w-11 h-11 rounded-2xl items-center justify-center transition-all border ${activeTab === 'ai-summary' ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/40' : 'bg-gray-900 text-gray-400 hover:text-white border-gray-800'}`} title="AI Live Transcript & Checklist">
                <Bot size={18} />
              </button>

              <button 
                onClick={() => {
                  setCallEnded(true);
                  addToast('info', 'Consultation Concluded', 'Generating post-call AI summary.');
                }}
                className="w-14 md:w-16 h-11 md:h-12 ml-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow-[0_0_20px_rgba(239,68,68,0.6)] font-bold group"
                title="End Video Call"
              >
                <PhoneOff size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
            
            <div className="hidden md:flex gap-2">
              <button onClick={() => addToast('info', 'Full Screen', 'Toggled studio display.')} className="p-2.5 text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 rounded-xl border border-gray-800"><Maximize size={18} /></button>
            </div>
          </div>
        </div>

        {/* Sidebar Tabs (Chat, People, AI Notes, Board, Files) */}
        <div className="lg:w-80 flex flex-col gap-4 shrink-0 h-[500px] lg:h-auto lg:min-h-0">
          
          <div className="flex-1 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl flex flex-col overflow-hidden min-h-0 shadow-xl">
            
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto custom-scrollbar border-b border-gray-800 shrink-0 bg-gray-950/50">
              <button onClick={() => setActiveTab('chat')} className={`flex-1 px-3 py-3.5 text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === 'chat' ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-300'}`}>Chat</button>
              <button onClick={() => setActiveTab('participants')} className={`flex-1 px-3 py-3.5 text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === 'participants' ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-300'}`}>People</button>
              <button onClick={() => setActiveTab('ai-summary')} className={`flex-1 px-3 py-3.5 text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center justify-center gap-1 ${activeTab === 'ai-summary' ? 'text-neon-green border-b-2 border-neon-green bg-neon-green/5' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-300'}`}>
                <Bot size={13} className="text-neon-green" /> AI Notes
              </button>
              <button onClick={() => setActiveTab('whiteboard')} className={`flex-1 px-3 py-3.5 text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === 'whiteboard' ? 'text-neon-purple border-b-2 border-neon-purple bg-neon-purple/5' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-300'}`}>Board</button>
              <button onClick={() => setActiveTab('files')} className={`flex-1 px-3 py-3.5 text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === 'files' ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-300'}`}>Files</button>
            </div>
            
            {/* Tab Content Panels */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
              
              {activeTab === 'chat' && (
                <>
                  <div className="flex-1 p-4 space-y-3.5">
                    <div className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-wider py-1 bg-gray-950/60 rounded-lg">⚡ E2E VIP Consultation Chat</div>
                    
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'Me' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black ${msg.sender === 'Me' ? 'bg-neon-blue text-black' : 'bg-gray-800 text-white border border-gray-700'}`}>
                          {msg.sender === 'Me' ? 'YOU' : 'JS'}
                        </div>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'Me' ? 'bg-neon-blue/15 border border-neon-blue/30 text-gray-100 rounded-tr-none' : 'bg-gray-800 border border-gray-700/80 text-gray-200 rounded-tl-none'}`}>
                          <div className="flex justify-between items-center gap-2 mb-1">
                            <span className="font-extrabold text-[10px] text-gray-400">{msg.name}</span>
                            <span className="text-[9px] text-gray-500">{msg.time}</span>
                          </div>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="p-3 bg-gray-950/90 border-t border-gray-800 flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => addToast('info', 'File Attachment', 'Select a contract or KYC file to send.')} className="text-gray-400 hover:text-white p-2 bg-gray-900 rounded-xl border border-gray-800"><Paperclip size={16} /></button>
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue transition-colors" 
                    />
                    <button type="submit" className="bg-neon-blue text-black p-2 rounded-xl font-bold hover:bg-cyan-400 transition-colors shadow-sm">
                      <Send size={16} />
                    </button>
                  </form>
                </>
              )}

              {activeTab === 'participants' && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Active Participants (2)</h4>
                    <span className="text-[10px] text-neon-green font-bold">● Live Room</span>
                  </div>

                  <div className="flex items-center justify-between bg-gray-950 p-3.5 rounded-2xl border border-gray-800/80 hover:border-gray-700 transition-all">
                    <div className="flex items-center gap-3 truncate pr-2">
                      <img src={activeCaller.avatar} alt="Caller" className="w-9 h-9 rounded-full object-cover border border-neon-blue/40 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-extrabold text-white flex items-center gap-1.5 truncate">
                          {activeCaller.name} <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black">VIP</span>
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">{activeCaller.company}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 text-gray-400 shrink-0">
                       <Mic size={15} className="text-neon-green" />
                       <Video size={15} className="text-neon-green" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-950 p-3.5 rounded-2xl border border-gray-800/80 hover:border-gray-700 transition-all">
                    <div className="flex items-center gap-3 truncate pr-2">
                      <div className="w-9 h-9 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-black text-xs border border-neon-blue/30 shrink-0">ME</div>
                      <div className="truncate">
                        <div className="text-xs font-extrabold text-white truncate">You (Host)</div>
                        <div className="text-[11px] text-gray-400 truncate">PlayGroundX Manager</div>
                      </div>
                    </div>
                    <div className="flex gap-2 text-gray-400 shrink-0">
                       {micOn ? <Mic size={15} className="text-neon-green" /> : <MicOff size={15} className="text-red-500" />}
                       {camOn ? <Video size={15} className="text-neon-green" /> : <VideoOff size={15} className="text-red-500" />}
                    </div>
                  </div>

                  <button onClick={() => addToast('info', 'Invite Sent', 'Sent SMS & Email reminder to co-host.')} className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold text-xs rounded-xl border border-gray-800 transition-colors">+ Invite Another Member</button>
                </div>
              )}

              {activeTab === 'ai-summary' && (
                <div className="p-4 space-y-5">
                  <div className="bg-gradient-to-br from-neon-purple/15 to-transparent border border-neon-purple/30 p-3.5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                          <Bot size={16} className="text-neon-purple animate-bounce" />
                          <span className="text-xs font-black text-white uppercase tracking-wider">Live AI Transcription</span>
                       </div>
                       <span className="text-[9px] bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full font-bold">PGX-GPT 4.1</span>
                    </div>
                    <p className="text-xs text-gray-300 italic leading-relaxed bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/80">
                      "Jenna: The 80/20 revenue split looks great! As soon as my studio lighting verification is confirmed, I'm ready to sign the contract."
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Live Action Checklist</h4>
                      <span className="text-[10px] text-neon-green font-bold">{actionItems.filter(i => i.done).length}/{actionItems.length} Done</span>
                    </div>
                    <ul className="space-y-2">
                       {actionItems.map(item => (
                         <li 
                           key={item.id} 
                           onClick={() => {
                             setActionItems(actionItems.map(i => i.id === item.id ? { ...i, done: !i.done } : i));
                             addToast('success', 'Task Updated', `Marked task as ${!item.done ? 'Completed' : 'Pending'}`);
                           }}
                           className="text-xs text-gray-300 flex items-start gap-2.5 bg-gray-950 p-3 rounded-xl border border-gray-800/80 hover:border-gray-700 cursor-pointer transition-all"
                         >
                           <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${item.done ? 'bg-neon-green text-black border-neon-green font-black text-[10px]' : 'border-gray-600 bg-gray-900'}`}>
                             {item.done ? '✓' : ''}
                           </div>
                           <span className={item.done ? 'line-through text-gray-500 font-medium' : 'font-semibold text-gray-200'}>{item.text}</span>
                         </li>
                       ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => addToast('success', 'Exported to CRM', 'Action items and transcript attached to Jenna Smith lead profile.')}
                    className="w-full py-2.5 bg-neon-green/10 hover:bg-neon-green/20 text-neon-green font-extrabold text-xs rounded-xl border border-neon-green/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Export Checklists to CRM
                  </button>
                </div>
              )}

              {activeTab === 'whiteboard' && (
                <div className="flex-1 flex flex-col p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      <PenTool size={16} className="text-neon-purple" /> Collaborative Studio Board
                    </h4>
                    <span className="text-[10px] text-neon-green font-bold">Live Sync ⚡</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Notes typed below are co-edited by You and Jenna in real-time.</p>
                  
                  <textarea 
                    value={whiteboardNotes}
                    onChange={e => setWhiteboardNotes(e.target.value)}
                    className="flex-1 w-full bg-gray-950 border border-neon-purple/40 rounded-2xl p-4 text-xs text-gray-200 font-mono focus:outline-none focus:border-neon-purple custom-scrollbar leading-relaxed" 
                    placeholder="Type studio notes, contract points, or marketing strategies..."
                  />

                  <button 
                    onClick={() => addToast('success', 'Whiteboard Saved', 'Saved studio notes to consultation archive.')}
                    className="w-full py-2.5 bg-neon-purple text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-purple-600 transition-all"
                  >
                    Save Whiteboard Snapshot 💾
                  </button>
                </div>
              )}
              
              {activeTab === 'files' && (
                <div className="flex-1 flex flex-col p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Shared Files ({filesList.length})</h4>
                    <button 
                      onClick={() => {
                        setFilesList([...filesList, { id: Date.now(), name: 'VIP_Onboarding_Schedule_2026.pdf', size: '1.8 MB', time: 'Just now' }]);
                        addToast('success', 'File Uploaded', 'Shared VIP_Onboarding_Schedule_2026.pdf with participants.');
                      }}
                      className="px-2.5 py-1 bg-neon-blue/10 hover:bg-neon-blue text-neon-blue hover:text-black font-extrabold text-[10px] rounded-lg border border-neon-blue/30 transition-all flex items-center gap-1"
                    >
                      + Upload File
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {filesList.map(file => (
                      <div key={file.id} className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center justify-between hover:border-gray-700 transition-all">
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-neon-blue shrink-0">
                            <FileText size={16} />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">{file.name}</div>
                            <div className="text-[10px] text-gray-500">{file.size} • Shared at {file.time}</div>
                          </div>
                        </div>
                        <button onClick={() => addToast('info', 'Downloading File', `Downloading ${file.name}...`)} className="text-gray-400 hover:text-white p-1.5 bg-gray-900 rounded-lg shrink-0">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gray-950/60 border border-dashed border-gray-800 rounded-2xl text-center mt-auto">
                    <p className="text-[11px] text-gray-400">Drag & drop contracts or KYC scans here to share instantly.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
