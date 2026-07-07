import { useState } from 'react';
import { Mail, Search, Edit3, Star, Send, Archive, ArrowLeft, MoreVertical, Reply, Trash, Paperclip, Tag } from 'lucide-react';
import EmailModal from '../components/modals/EmailModal';

const dummyEmails = [
  {
    id: 1,
    sender: 'Maria Gonzalez',
    email: 'maria.gonzalez@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    subject: 'KYC Verification Pending – Need Help',
    snippet: 'Hi, I need help completing my KYC process. My documents were rejected...',
    body: `Hi Support Team,

I tried submitting my documents for KYC verification yesterday but I received an email saying they were rejected. Could you please help me understand what went wrong?

I uploaded the following documents:
  • Passport (front and back)
  • Utility bill (dated Oct 2024)

Could you let me know what needs to be corrected? I'm keen to complete this quickly.

Thanks,
Maria Gonzalez`,
    date: '10:30 AM',
    unread: true,
    starred: true,
    label: 'Action Required',
    labelColor: '#ff0055',
    hasAttachment: true,
  },
  {
    id: 2,
    sender: 'Jin Woo',
    email: 'jin.woo@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    subject: 'VIP Upgrade Inquiry – Platinum Creator',
    snippet: 'When can I start earning as a VIP creator? I have over 100k fans...',
    body: `Hello PlayGroundX Team,

I am currently a Platinum tier creator and I've seen that the VIP program offers better revenue splits and dedicated account management.

My current stats:
  • Followers: 103,400
  • Monthly active fans: 8,200
  • Avg. engagement rate: 14.7%

How do I get an invite to the VIP program? I'd love to discuss potential partnership terms.

Best regards,
Jin Woo`,
    date: 'Yesterday',
    unread: true,
    starred: false,
    label: 'VIP Prospect',
    labelColor: '#ffd700',
    hasAttachment: false,
  },
  {
    id: 3,
    sender: 'Sophie Dubois',
    email: 'sophie.d@example.com',
    avatar: 'https://i.pravatar.cc/150?img=9',
    subject: 'Subscription Payment Failed',
    snippet: 'My recent card payment for the subscription was declined...',
    body: `Hi team,

I tried to renew my creator subscription but the payment was declined. My card details haven't changed, so I'm not sure what happened.

Could you please:
1. Send me a direct payment link
2. Check if there are any restrictions on my account

I'd hate to lose access to my creator dashboard mid-month!

Thanks,
Sophie`,
    date: 'Oct 24',
    unread: false,
    starred: false,
    label: 'Billing',
    labelColor: '#8a2be2',
    hasAttachment: false,
  },
  {
    id: 4,
    sender: 'Ahmed Al Mansour',
    email: 'ahmed.m@playstudio.ae',
    avatar: 'https://i.pravatar.cc/150?img=7',
    subject: 'Agency Partnership Proposal – MENA Region',
    snippet: 'We are an agency looking to onboard our creators to your platform...',
    body: `Dear PlayGroundX Partnership Team,

We represent over 50 top-tier content creators across the MENA region, collectively reaching 18M+ followers on various platforms.

We are very interested in your agency partnership program and believe there's strong synergy here. Our creators span categories including fitness, lifestyle, fashion, and gaming.

We would love to schedule an introductory call at your earliest convenience to discuss:
  - Revenue share terms for agencies
  - Onboarding processes for large creator rosters
  - Co-marketing opportunities

Please let us know your availability.

Best regards,
Ahmed Al Mansour
Director of Partnerships | PlayStudio UAE`,
    date: 'Oct 22',
    unread: false,
    starred: false,
    label: 'Partnership',
    labelColor: '#00f0ff',
    hasAttachment: true,
  },
  {
    id: 5,
    sender: 'Priya Sharma',
    email: 'priya.s@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    subject: 'Fan Complaint – Content Access Issue',
    snippet: 'I subscribed to two creators but I cannot access their locked content...',
    body: `Hello Support,

I've been a paying subscriber for the past 3 months. Recently, after your platform update, I can no longer access locked content from creators I subscribe to.

Creators affected:
  • @JinWoo_Official
  • @SophieStyle

I've tried logging out and back in, clearing cache, and using a different browser — nothing helps. This is frustrating given I'm actively paying each month.

Please escalate this as it's been ongoing for 3 days.

Regards,
Priya Sharma`,
    date: 'Oct 20',
    unread: false,
    starred: false,
    label: 'Escalate',
    labelColor: '#ff6b00',
    hasAttachment: false,
  },
  {
    id: 6,
    sender: 'Carlos Mendez',
    email: 'carlos.m@example.com',
    avatar: 'https://i.pravatar.cc/150?img=11',
    subject: 'Re: Monthly Revenue Report – October',
    snippet: 'Attached is our revenue breakdown for October. Overall performance is...',
    body: `Hi,

Please find below the October revenue summary for your reference.

📊 Summary:
  • Total Gross Revenue: $142,800
  • Creator Payouts: $98,400
  • Platform Net: $44,400
  • Refunds Processed: $1,200
  • New Subscriptions: 412
  • Churned Subscriptions: 38

We're seeing a 12% MoM growth in subscriptions which is very positive. Churn rate is at an all-time low of 3.2%.

Full breakdown attached as PDF.

Best,
Carlos`,
    date: 'Oct 18',
    unread: false,
    starred: true,
    label: 'Reports',
    labelColor: '#39ff14',
    hasAttachment: true,
  },
];

const SIDEBAR_LINKS = [
  { label: 'Inbox', icon: Mail, count: 2 },
  { label: 'Starred', icon: Star, count: null },
  { label: 'Sent', icon: Send, count: null },
  { label: 'Archive', icon: Archive, count: null },
  { label: 'Trash', icon: Trash, count: null },
];

export default function Emails({ embedded = false }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Inbox');

  const filteredEmails = dummyEmails.filter(e =>
    e.sender.toLowerCase().includes(search.toLowerCase()) ||
    e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className={`no-scroll flex gap-0 overflow-hidden bg-gray-950/60 backdrop-blur-xl ${
        embedded ? 'h-full border-gray-800/30 w-full' : '-mx-4 md:-mx-6 -mt-4 md:-mt-6 border-t border-gray-800/30'
      }`} 
      style={embedded ? {} : { height: 'calc(100vh - 112px)' }}
    >

      {/* ── FAR LEFT: FOLDER SIDEBAR (hidden on mobile when email open) ── */}
      <div className={`w-14 sm:w-44 flex-col border-r border-gray-800/60 bg-gray-900/50 shrink-0 ${selectedEmail ? 'hidden sm:flex' : 'flex'}`}>
        {/* Logo row */}
        <div className="p-3 sm:p-4 border-b border-gray-800/60">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center sm:justify-start gap-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all text-sm"
          >
            <Edit3 size={15} className="shrink-0" />
            <span className="hidden sm:inline">Compose</span>
          </button>
        </div>

        {/* Folder links */}
        <nav className="flex-1 p-2 space-y-0.5">
          {SIDEBAR_LINKS.map(({ label, icon: Icon, count }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`w-full flex items-center gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === label
                  ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
              }`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="hidden sm:flex flex-1 text-left font-medium text-[13px]">{label}</span>
              {count && (
                <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Tags section */}
        <div className="p-2 sm:p-3 border-t border-gray-800/60">
          <div className="hidden sm:flex items-center gap-2 px-2 mb-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
            <Tag size={10} /> Labels
          </div>
          {[
            { label: 'Action Required', color: '#ff0055' },
            { label: 'VIP Prospect', color: '#ffd700' },
            { label: 'Billing', color: '#8a2be2' },
          ].map(t => (
            <div key={t.label} className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
              <span className="text-[11px] text-gray-400 truncate">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MIDDLE: EMAIL LIST ── */}
      <div className={`w-full sm:w-72 lg:w-80 flex flex-col border-r border-gray-800/60 shrink-0 ${selectedEmail ? 'hidden sm:flex' : 'flex'}`}>
        {/* Search */}
        <div className="px-3 py-3 border-b border-gray-800/60 bg-gray-900/30">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search emails..."
              className="w-full bg-gray-800/80 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Count */}
        <div className="px-4 py-2 border-b border-gray-800/40 flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{activeTab}</span>
          <span className="text-[11px] text-gray-600">{filteredEmails.length} messages</span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-800/40">
          {filteredEmails.map(email => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full text-left p-4 transition-colors hover:bg-white/5 relative ${
                selectedEmail?.id === email.id ? 'bg-neon-blue/10' : ''
              }`}
            >
              {/* Unread dot */}
              {email.unread && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neon-blue" />
              )}

              {/* Avatar + name row */}
              <div className="flex items-center gap-2.5 mb-1.5">
                <img
                  src={email.avatar}
                  alt={email.sender}
                  className="w-8 h-8 rounded-full border border-gray-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-[13px] truncate font-bold ${email.unread ? 'text-white' : 'text-gray-300'}`}>
                      {email.sender}
                    </span>
                    <span className={`text-[10px] shrink-0 ml-1 ${email.unread ? 'text-neon-blue font-bold' : 'text-gray-500'}`}>
                      {email.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className={`text-xs truncate mb-1 ${email.unread ? 'text-gray-100 font-semibold' : 'text-gray-400'}`}>
                {email.subject}
              </div>

              {/* Snippet */}
              <div className="text-[11px] text-gray-500 truncate mb-2">
                {email.snippet}
              </div>

              {/* Tags row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {email.label && (
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border"
                    style={{ color: email.labelColor, borderColor: email.labelColor + '40', background: email.labelColor + '15' }}
                  >
                    {email.label}
                  </span>
                )}
                {email.hasAttachment && (
                  <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                    <Paperclip size={9} /> Attachment
                  </span>
                )}
                {email.starred && <Star size={11} className="text-yellow-400 fill-yellow-400 ml-auto" />}
              </div>
            </button>
          ))}

          {filteredEmails.length === 0 && (
            <div className="p-10 text-center text-sm text-gray-500">
              No emails found
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: READING PANE ── */}
      <div className={`flex-1 flex-col overflow-hidden ${!selectedEmail ? 'hidden sm:flex' : 'flex'}`}>
        {selectedEmail ? (
          <>
            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-gray-800/60 bg-gray-900/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {/* Back button – mobile only */}
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="sm:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors mr-1"
                >
                  <ArrowLeft size={18} />
                </button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" title="Archive">
                  <Archive size={15} />
                </button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10 transition-colors" title="Delete">
                  <Trash size={15} />
                </button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors" title="Star">
                  <Star size={15} className={selectedEmail.starred ? 'text-yellow-400 fill-yellow-400' : ''} />
                </button>
              </div>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <MoreVertical size={15} />
              </button>
            </div>

            {/* Email body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-5 sm:p-8 max-w-3xl">
                {/* Subject */}
                <h2 className="text-xl sm:text-2xl font-black text-white mb-5 leading-tight">
                  {selectedEmail.subject}
                </h2>

                {/* Sender info */}
                <div className="flex items-start gap-3 mb-6 pb-6 border-b border-gray-800/50">
                  <img
                    src={selectedEmail.avatar}
                    alt={selectedEmail.sender}
                    className="w-10 h-10 rounded-full border border-gray-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{selectedEmail.sender}</span>
                      <span className="text-[11px] text-gray-500 shrink-0">{selectedEmail.date}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      from: <span className="text-gray-400">{selectedEmail.email}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      to: <span className="text-gray-400">support@playgroundx.com</span>
                    </div>

                    {/* Label */}
                    {selectedEmail.label && (
                      <span
                        className="inline-flex mt-2 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border"
                        style={{ color: selectedEmail.labelColor, borderColor: selectedEmail.labelColor + '40', background: selectedEmail.labelColor + '15' }}
                      >
                        {selectedEmail.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="text-sm text-gray-300 leading-loose whitespace-pre-wrap font-[400] mb-10">
                  {selectedEmail.body}
                </div>

                {selectedEmail.hasAttachment && (
                  <div className="mb-8 flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50 w-fit">
                    <div className="w-9 h-9 rounded-lg bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center shrink-0">
                      <Paperclip size={15} className="text-neon-blue" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-gray-200">document_attachment.pdf</div>
                      <div className="text-[10px] text-gray-500">2.4 MB · PDF</div>
                    </div>
                  </div>
                )}

                {/* Reply box */}
                <div className="border border-gray-700/60 rounded-2xl overflow-hidden bg-gray-900/30 shadow-lg">
                  {/* Reply header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/60 bg-gray-900/50">
                    <Reply size={15} className="text-neon-blue shrink-0" />
                    <span className="text-sm font-semibold text-gray-300">
                      Reply to <span className="text-white">{selectedEmail.sender}</span>
                    </span>
                  </div>

                  {/* From line */}
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800/40">
                    <span className="text-[11px] text-gray-600 w-10 shrink-0">From:</span>
                    <span className="text-[12px] text-gray-400">support@playgroundx.com</span>
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows="5"
                    placeholder="Type your reply here..."
                    className="w-full bg-transparent px-4 py-3 text-sm text-white focus:outline-none resize-none placeholder:text-gray-600"
                  />

                  {/* Actions */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800/50 bg-gray-900/40">
                    <div className="flex flex-wrap items-center gap-2">
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-700 transition-colors" title="Attach file">
                        <Paperclip size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-700 transition-colors" title="More options">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2 bg-neon-blue text-black font-bold text-sm rounded-xl hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all">
                      <Send size={13} /> Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
            <div className="w-20 h-20 rounded-full bg-gray-900/80 border border-gray-800 flex items-center justify-center mb-5 shadow-inner">
              <Mail size={32} className="text-gray-700" />
            </div>
            <h3 className="text-base font-bold text-gray-400 mb-2">Select an email to read</h3>
            <p className="text-sm text-center max-w-xs">Choose an email from your inbox to view the full conversation here.</p>
          </div>
        )}
      </div>

      <EmailModal open={showCompose} onClose={() => setShowCompose(false)} />
    </div>
  );
}
