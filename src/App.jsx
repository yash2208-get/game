import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuActivity, LuArrowDownToLine, LuArrowUpRight, LuAward, LuBell, LuBookOpen,
  LuChevronDown, LuChevronRight, LuCircleHelp, LuClock3, LuCopy, LuCrown,
  LuDices, LuGamepad2, LuGift, LuGrid2X2, LuHeadphones, LuLayoutDashboard,
  LuMenu, LuMessageCircle, LuEllipsis, LuPlus, LuSearch, LuSettings2,
  LuShieldCheck, LuSparkles, LuSwords, LuTrophy, LuUsers, LuWallet, LuX,
  LuZap, LuCheck, LuStar, LuArrowUp, LuPanelLeftClose, LuLogOut
} from 'react-icons/lu';
import { useForm } from 'react-hook-form';
import { games, tournaments, leaderboard, activity } from './data';

const navPrimary = [
  { label: 'Overview', icon: LuLayoutDashboard },
  { label: 'Games', icon: LuGamepad2, badge: '7' },
  { label: 'Tournaments', icon: LuTrophy, badge: '3' },
  { label: 'Leaderboard', icon: LuCrown },
];
const navSecondary = [
  { label: 'Wallet', icon: LuWallet },
  { label: 'Friends', icon: LuUsers, badge: '2' },
  { label: 'Achievements', icon: LuAward },
];

function App() {
  const dispatch = useDispatch();
  const { activeView, mobileMenuOpen, notificationsOpen } = useSelector((state) => state.ui);
  const wallet = useSelector((state) => state.wallet);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  };
  const navigate = (view) => dispatch({ type: 'ui/setActiveView', payload: view });

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <Sidebar activeView={activeView} mobileMenuOpen={mobileMenuOpen} onNavigate={navigate} onClose={() => dispatch({ type: 'ui/toggleMobileMenu' })} />
      <main className="main-content">
        <Topbar
          activeView={activeView}
          search={search}
          setSearch={setSearch}
          notificationsOpen={notificationsOpen}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          onMenu={() => dispatch({ type: 'ui/toggleMobileMenu' })}
          onNotifications={() => dispatch({ type: 'ui/toggleNotifications' })}
          onAction={notify}
        />
        <AnimatePresence mode="wait">
          <motion.div key={activeView} className="view-wrap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .24 }}>
            {activeView === 'Overview' && <Overview onNavigate={navigate} onAction={notify} wallet={wallet} onAddFunds={() => setShowAddFunds(true)} />}
            {activeView === 'Games' && <GamesView onAction={notify} search={search} />}
            {activeView === 'Tournaments' && <TournamentsView onAction={notify} />}
            {activeView === 'Leaderboard' && <LeaderboardView />}
            {activeView === 'Wallet' && <WalletView wallet={wallet} onAddFunds={() => setShowAddFunds(true)} onAction={notify} />}
            {activeView === 'Friends' && <FriendsView onAction={notify} />}
            {activeView === 'Achievements' && <AchievementsView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>
      <AnimatePresence>{showAddFunds && <AddFundsModal onClose={() => setShowAddFunds(false)} onAction={notify} />}</AnimatePresence>
    </div>
  );
}

function Sidebar({ activeView, mobileMenuOpen, onNavigate, onClose }) {
  return <>
    <AnimatePresence>
      {mobileMenuOpen && <motion.div className="mobile-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />}
    </AnimatePresence>
    <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-top">
        <div className="brand" onClick={() => onNavigate('Overview')} role="button" tabIndex="0">
          <span className="brand-mark"><LuSwords size={19} strokeWidth={2.8} /></span>
          <span className="brand-word">nexora<span>.</span></span>
        </div>
        <button className="icon-btn side-close" onClick={onClose} aria-label="Close menu"><LuX /></button>
      </div>
      <div className="season-pill"><span className="pulse-dot" /> Season 04 <b>•</b> Ascension <LuChevronRight size={13} /></div>
      <nav className="side-nav">
        <p className="nav-label">Workspace</p>
        {navPrimary.map((item) => <NavItem key={item.label} item={item} active={activeView === item.label} onClick={() => onNavigate(item.label)} />)}
        <p className="nav-label nav-label-spaced">Your space</p>
        {navSecondary.map((item) => <NavItem key={item.label} item={item} active={activeView === item.label} onClick={() => onNavigate(item.label)} />)}
      </nav>
      <div className="sidebar-promo">
        <div className="promo-icon"><LuSparkles /></div>
        <strong>Unlock your edge</strong>
        <span>Go Pro and get 2× XP on every match.</span>
        <button onClick={() => onNavigate('Achievements')}>Explore Pro <LuArrowUpRight size={14} /></button>
      </div>
      <div className="sidebar-bottom">
        <button className="side-link" onClick={() => window.alert('Settings are coming soon')}><LuSettings2 /> Settings</button>
        <button className="side-link" onClick={() => window.alert('Help center is available 24/7')}><LuCircleHelp /> Help center</button>
      </div>
    </aside>
  </>;
}

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon size={18} strokeWidth={active ? 2.4 : 1.9} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}
  </button>;
}

function Topbar({ activeView, search, setSearch, notificationsOpen, showProfile, setShowProfile, onMenu, onNotifications, onAction }) {
  return <header className="topbar">
    <div className="topbar-left"><button className="icon-btn menu-btn" onClick={onMenu}><LuMenu /></button><div className="crumb"><span>Workspace</span><LuChevronRight size={13} /><strong>{activeView}</strong></div></div>
    <div className="topbar-actions">
      <div className="search-box"><LuSearch size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search anything" /><kbd>⌘ K</kbd></div>
      <button className="icon-btn notification-btn" onClick={onNotifications} aria-label="Notifications"><LuBell size={19} /><i /></button>
      <div className="profile-wrap">
        <button className="profile-trigger" onClick={() => setShowProfile(!showProfile)}><span className="avatar avatar-small">AX</span><span className="profile-copy"><b>Aiden Xavier</b><small>Level 24 · 10,860 XP</small></span><LuChevronDown size={15} /></button>
        <AnimatePresence>{showProfile && <motion.div className="profile-menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><div className="menu-user"><span className="avatar">AX</span><div><b>Aiden Xavier</b><small>Pro member</small></div></div><button onClick={() => onAction('Profile editor opened')}><LuUsers /> View profile</button><button onClick={() => onAction('Preferences saved')}><LuSettings2 /> Preferences</button><button onClick={() => onAction('You are safely logged out')}><LuLogOut /> Sign out</button></motion.div>}</AnimatePresence>
      </div>
      <AnimatePresence>{notificationsOpen && <NotificationPanel onAction={onAction} />}</AnimatePresence>
    </div>
  </header>;
}

function NotificationPanel({ onAction }) {
  return <motion.div className="notification-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><div className="panel-heading"><b>Notifications</b><button onClick={() => onAction('All notifications marked as read')}>Mark all read</button></div><div className="notice"><span className="notice-dot purple" /><div><b>Royal Clash is starting soon</b><small>Join your quarter-final in 12 minutes.</small></div><time>now</time></div><div className="notice"><span className="notice-dot green" /><div><b>You won ₹120</b><small>Blitz Arena match completed.</small></div><time>2m</time></div><div className="notice"><span className="notice-dot gold" /><div><b>New achievement unlocked</b><small>Sharp Mind · +250 XP</small></div><time>1h</time></div></motion.div>;
}

function Overview({ onNavigate, onAction, wallet, onAddFunds }) {
  return <div className="dashboard page-pad">
    <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" /> TUESDAY, 24 JUNE 2025</div><h1>Good evening, <span>Aiden</span></h1><p className="muted">Your arena is waiting. Make your next move count.</p></div><button className="outline-btn" onClick={() => onAction('Invite link copied to clipboard')}><LuCopy size={16} /> Invite friends <span className="kbd-dot">⌘ I</span></button></section>
    <section className="hero-card">
      <div className="hero-copy"><div className="live-label"><span /> SEASON 04 · ASCENSION</div><h2>Play sharp.<br /><span>Rise higher.</span></h2><p>Climb the ranks, outplay the competition<br className="desktop-only" /> and make your mark on the leaderboard.</p><button className="primary-btn" onClick={() => onNavigate('Games')}>Explore games <LuArrowUpRight size={16} /></button></div>
      <div className="hero-orbit orbit-a" /><div className="hero-orbit orbit-b" /><div className="hero-grid" /><div className="hero-emblem"><LuSwords size={30} /><span>04</span></div><div className="hero-stats"><span><b>128K</b> players online</span><span><b>2.4M</b> matches played</span></div>
    </section>
    <section className="stats-grid">
      <StatCard icon={LuWallet} label="Total balance" value={`₹${wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} foot="+12.8% this month" positive color="purple" onClick={onAddFunds} chart="balance" />
      <StatCard icon={LuCrown} label="Current rank" value="#184" foot="↑ 26 places this week" positive color="gold" chart="rank" />
      <StatCard icon={LuActivity} label="Win rate" value="74.2%" foot="+5.4% vs last month" positive color="green" chart="win" />
      <StatCard icon={LuClock3} label="Play time" value="18h 42m" foot="This season" color="blue" chart="time" />
    </section>
    <div className="content-grid">
      <section className="panel continue-panel"><SectionHeading title="Continue playing" subtitle="Pick up where you left off" action="View all" onAction={() => onNavigate('Games')} /><div className="continue-list"><GameResumeCard game={games[0]} progress="68%" matches="12 matches" onPlay={() => onAction('Royal Ludo room found — matchmaking started')} /><GameResumeCard game={games[1]} progress="42%" matches="8 matches" onPlay={() => onAction('Blitz Arena room found — matchmaking started')} /></div></section>
      <section className="panel tournament-panel"><SectionHeading title="Live tournaments" subtitle="Compete for glory" action="See all" onAction={() => onNavigate('Tournaments')} /><div className="tournament-list">{tournaments.slice(0, 3).map((t) => <TournamentRow key={t.title} tournament={t} onJoin={() => onAction(`${t.title} details opened`)} />)}</div></section>
    </div>
    <div className="content-grid bottom-grid"><section className="panel activity-panel"><SectionHeading title="Recent activity" subtitle="Your latest moves" action="Full history" onAction={() => onNavigate('Wallet')} />{activity.map((item) => <ActivityRow key={item.title} item={item} />)}</section><section className="panel rank-panel"><SectionHeading title="Top players" subtitle="This week's legends" action="Leaderboard" onAction={() => onNavigate('Leaderboard')} /><div className="mini-leaderboard">{leaderboard.slice(0, 4).map((player) => <LeaderboardRow key={player.rank} player={player} />)}</div></section></div>
  </div>;
}

function StatCard({ icon: Icon, label, value, foot, positive, color, chart, onClick }) {
  return <button className="stat-card" onClick={onClick}><div className="stat-head"><span className={`stat-icon ${color}`}><Icon size={17} /></span><LuEllipsis size={18} className="more-icon" /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className={`stat-foot ${positive ? 'positive' : ''}`}>{positive && <LuArrowUp size={13} />}{foot}</div><MiniChart type={chart} color={color} /></button>;
}

function MiniChart({ type, color }) {
  const paths = { balance: 'M0 28 C15 30, 19 20, 31 24 S45 25, 53 17 S66 18, 75 11 S91 15, 105 4', rank: 'M0 25 C12 28, 16 24, 28 26 S40 14, 51 18 S65 12, 73 15 S91 7, 105 4', win: 'M0 25 C11 20, 18 23, 29 18 S42 23, 52 15 S65 18, 75 10 S91 13, 105 4', time: 'M0 28 C13 28, 17 23, 29 26 S42 20, 52 22 S65 12, 75 16 S92 5, 105 8' };
  return <svg className={`mini-chart ${color}`} viewBox="0 0 105 32" preserveAspectRatio="none"><path d={paths[type]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d={`${paths[type]} L105 32 L0 32 Z`} fill="currentColor" opacity=".09" stroke="none" /></svg>;
}

function SectionHeading({ title, subtitle, action, onAction }) { return <div className="section-heading"><div><h3>{title}</h3><p>{subtitle}</p></div><button className="text-btn" onClick={onAction}>{action} <LuArrowUpRight size={14} /></button></div>; }

function GameResumeCard({ game, progress, matches, onPlay }) { return <div className={`resume-card ${game.art}`}><div className="card-art-icon">{game.icon}</div><div className="resume-overlay" /><div className="resume-content"><div className="tiny-tag"><span className="tiny-live" /> {game.type}</div><h4>{game.title}</h4><div className="resume-meta"><span>{matches}</span><span>•</span><span>Ranked</span></div><div className="progress-row"><div className="progress-track"><i style={{ width: progress }} /></div><span>{progress}</span></div><button className="play-btn" onClick={onPlay}>Play now <LuArrowUpRight size={14} /></button></div></div>; }

function TournamentRow({ tournament, onJoin }) { return <div className="tournament-row"><div className={`tourney-icon ${tournament.color}`}>{tournament.icon}</div><div className="tourney-main"><b>{tournament.title}</b><span>{tournament.game} <i>•</i> {tournament.players} playing</span></div><div className="tourney-prize"><small>Prize pool</small><b>{tournament.prize}</b></div><div className="tourney-time"><span className={tournament.status === 'live' ? 'live-time' : ''}>{tournament.status === 'live' && <i />} {tournament.time}</span><button onClick={onJoin}>{tournament.status === 'live' ? 'Watch' : 'Join'} <LuChevronRight size={13} /></button></div></div>; }

function ActivityRow({ item }) { return <div className="activity-row"><div className={`activity-icon ${item.color}`}>{item.icon}</div><div><b>{item.title}</b><span>{item.meta}</span></div><strong className={item.value === 'NEW' ? 'new-label' : item.value === 'LIVE' ? 'live-label-small' : ''}>{item.value}</strong></div>; }
function LeaderboardRow({ player }) { return <div className={`leader-row ${player.tone === 'you' ? 'is-you' : ''}`}><span className={`rank-number ${player.tone}`}>{player.rank}</span><span className={`avatar avatar-${player.tone}`}>{player.avatar}</span><div className="leader-name"><b>{player.name}</b><small>{player.handle}</small></div><div className="leader-score"><b>{player.score}</b><small>{player.wins} win rate</small></div></div>; }

function GamesView({ onAction, search }) {
  const filtered = games.filter((g) => `${g.title} ${g.type}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="page-pad inner-page"><PageIntro eyebrow="THE ARCADE" title="Choose your arena" description="Every game is a chance to outthink, outplay, and level up." action={<button className="primary-btn" onClick={() => onAction('Quick matchmaking started')}><LuZap size={16} /> Quick match</button>} />
    <div className="filter-row"><div className="filter-pills"><button className="filter-active">All games <span>7</span></button><button>Strategy</button><button>Board</button><button>Arcade</button><button>Trivia</button></div><button className="sort-btn"><LuGrid2X2 size={15} /> Grid view <LuChevronDown size={14} /></button></div>
    <div className="games-grid">{filtered.map((game, index) => <GameTile key={game.id} game={game} index={index} onAction={onAction} />)}</div>
  </div>;
}
function GameTile({ game, index, onAction }) { return <motion.article className="game-tile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}><div className={`tile-art ${game.art}`}><span className="tile-symbol">{game.icon}</span><span className="tile-rating"><LuStar size={12} fill="currentColor" /> {game.accent}</span><div className="tile-art-lines" /></div><div className="tile-copy"><div><h3>{game.title}</h3><p>{game.type} <i>•</i> {game.players}</p></div><button className="round-arrow" onClick={() => onAction(`${game.title} matchmaking started`)}><LuArrowUpRight size={17} /></button></div><div className="tile-foot"><span><span className="online-dot" /> {Math.floor(Math.random() * 800 + 120).toLocaleString()} playing now</span><span className="tag-new">{index < 2 ? 'POPULAR' : 'SKILL'}</span></div></motion.article>; }

function TournamentsView({ onAction }) { return <div className="page-pad inner-page"><PageIntro eyebrow="THE CIRCUIT" title="Prove your skill" description="Live brackets, real stakes, unforgettable wins." action={<button className="primary-btn" onClick={() => onAction('Tournament creation flow opened')}><LuPlus size={17} /> Create tournament</button>} /><div className="tourney-feature"><div><div className="live-label"><span /> LIVE NOW</div><h2>Midnight<br /><em>Blitz.</em></h2><p>1,248 players are battling across 64 brackets.</p><button className="primary-btn" onClick={() => onAction('Spectator mode opened')}>Enter spectator mode <LuArrowUpRight size={16} /></button></div><div className="bracket-art"><div className="bracket-line l1" /><div className="bracket-line l2" /><div className="bracket-line l3" /><span className="bracket-node n1">♞</span><span className="bracket-node n2">AR</span><span className="bracket-node n3">MK</span><span className="bracket-node n4">?</span><span className="bracket-node n5">AX</span></div></div><div className="tournaments-table panel"><div className="table-head"><b>Upcoming tournaments</b><span>Entry</span><span>Prize pool</span><span>Players</span><span>Starts</span><span /></div>{tournaments.map((t) => <div className="table-row" key={t.title}><div className="table-game"><span className={`tourney-icon ${t.color}`}>{t.icon}</span><div><b>{t.title}</b><small>{t.game}</small></div></div><span>{t.entry}</span><strong>{t.prize}</strong><span>{t.players}</span><span>{t.time}</span><button className="join-btn" onClick={() => onAction(`${t.title} details opened`)}>View <LuArrowUpRight size={13} /></button></div>)}</div></div>; }

function LeaderboardView() { return <div className="page-pad inner-page"><PageIntro eyebrow="THE HALL OF FAME" title="Lead the pack" description="The sharpest minds in Nexora, ranked." action={<button className="outline-btn"><LuShare2Fallback /> Share rank</button>} /><div className="leaderboard-layout"><section className="panel full-leaderboard"><div className="leader-tabs"><button className="active">Global</button><button>Friends</button><button>Season 04</button><span className="leader-period">This week <LuChevronDown size={14} /></span></div>{leaderboard.map((p) => <LeaderboardRow key={p.rank} player={p} />)}</section><aside className="rank-card"><div className="rank-badge"><LuCrown size={26} /></div><span className="eyebrow">YOUR POSITION</span><strong>#184</strong><p>You're in the <b>top 4.8%</b><br />of all players.</p><div className="rank-progress"><span style={{ width: '74%' }} /></div><small>260 XP to #183</small><button className="primary-btn">View my stats <LuArrowUpRight size={15} /></button></aside></div></div>; }
function LuShare2Fallback() { return <LuCopy size={16} />; }

function WalletView({ wallet, onAddFunds, onAction }) { const txns = [{ name: 'Blitz Arena win', date: 'Today, 7:42 PM', amount: '+ ₹120.00', positive: true, icon: LuTrophy }, { name: 'Royal Clash entry', date: 'Today, 6:18 PM', amount: '− ₹25.00', icon: LuSwords }, { name: 'Weekly cashback', date: 'Yesterday, 11:02 AM', amount: '+ ₹48.50', positive: true, icon: LuGift }, { name: 'Added via UPI', date: '18 Jun, 4:20 PM', amount: '+ ₹1,000.00', positive: true, icon: LuArrowDownToLine }]; return <div className="page-pad inner-page"><PageIntro eyebrow="YOUR ECONOMY" title="Wallet" description="Keep your balance ready for the next big play." action={<button className="primary-btn" onClick={onAddFunds}><LuPlus size={17} /> Add funds</button>} /><div className="wallet-layout"><div className="balance-card"><div className="balance-top"><span>Total balance <LuShieldCheck size={14} /></span><button onClick={() => onAction('Balance visibility toggled')}><LuEllipsis /></button></div><strong>₹{wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong><span className="balance-id">NEXORA WALLET · •••• 4821</span><div className="balance-actions"><button onClick={onAddFunds}><LuArrowDownToLine /> Deposit</button><button onClick={() => onAction('Withdrawal flow opened')}><LuArrowUpRight /> Withdraw</button></div></div><div className="wallet-subcards"><MiniWallet icon={LuTrophy} title="Winning wallet" value={`₹${wallet.winning.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} color="gold" /><MiniWallet icon={LuGift} title="Bonus wallet" value={`₹${wallet.bonus.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} color="purple" /></div></div><section className="panel transactions"><SectionHeading title="Recent transactions" subtitle="Your money, in motion" action="Export CSV" onAction={() => onAction('Transaction report exported')} />{txns.map((t) => <div className="transaction-row" key={t.name}><span className="transaction-icon"><t.icon size={16} /></span><div><b>{t.name}</b><small>{t.date}</small></div><strong className={t.positive ? 'positive' : ''}>{t.amount}</strong><span className="complete"><LuCheck size={13} /> Completed</span></div>)}</section></div>; }
function MiniWallet({ icon: Icon, title, value, color }) { return <div className="mini-wallet"><span className={`mini-wallet-icon ${color}`}><Icon /></span><small>{title}</small><strong>{value}</strong><span className="wallet-up">+8.4% <LuArrowUp size={11} /></span></div>; }

function FriendsView({ onAction }) { const friends = [{ name: 'Mira Kapoor', handle: '@miraknight', status: 'In a match', initials: 'MK', online: true }, { name: 'Arjun Rao', handle: '@arjunplays', status: 'Online', initials: 'AR', online: true }, { name: 'Leo Dsouza', handle: '@leodash', status: 'Last seen 12m ago', initials: 'LD' }, { name: 'Nova Shah', handle: '@novaskill', status: 'Offline', initials: 'NS' }]; return <div className="page-pad inner-page"><PageIntro eyebrow="YOUR SQUAD" title="Friends" description="Your best games are better together." action={<button className="primary-btn" onClick={() => onAction('Friend invite link copied')}><LuPlus size={17} /> Add friend</button>} /><div className="social-layout"><section className="panel friends-panel"><div className="friends-head"><div className="filter-pills"><button className="filter-active">All <span>24</span></button><button>Online <span>8</span></button><button>Requests <span className="orange-count">2</span></button></div><button className="icon-btn"><LuSearch size={17} /></button></div>{friends.map((f) => <div className="friend-row" key={f.handle}><span className="avatar avatar-blue friend-avatar">{f.initials}<i className={f.online ? 'is-online' : ''} /></span><div><b>{f.name}</b><small>{f.handle}</small></div><span className={f.online ? 'friend-status online' : 'friend-status'}>{f.status}</span><button className="outline-small" onClick={() => onAction(`Invite sent to ${f.name}`)}>{f.online ? 'Invite' : 'Message'} <LuArrowUpRight size={13} /></button></div>)}</section><aside className="invite-card"><div className="invite-orb"><LuUsers size={26} /></div><h3>Build your squad</h3><p>Invite friends and both of you get ₹50 in bonus credits.</p><button className="primary-btn" onClick={() => onAction('Invite link copied')}>Copy invite link <LuCopy size={14} /></button><small>nexora.gg/aidenx</small></aside></div></div>; }

function AchievementsView() { const achievements = [{ icon: '⚡', title: 'Sharp Mind', text: 'Win 10 strategy games', progress: '10 / 10', done: true }, { icon: '♞', title: 'Checkmate', text: 'Win a chess game in under 5 min', progress: '7 / 10', done: false }, { icon: '✦', title: 'Lucky Seven', text: 'Win 7 games in a row', progress: '5 / 7', done: false }, { icon: '◈', title: 'Social Butterfly', text: 'Play with 10 different friends', progress: '8 / 10', done: false }, { icon: '◉', title: 'Early Bird', text: 'Play before 8 AM', progress: '1 / 1', done: true }, { icon: '◆', title: 'Tournament Titan', text: 'Finish in the top 3', progress: '2 / 5', done: false }]; return <div className="page-pad inner-page"><PageIntro eyebrow="YOUR PROGRESSION" title="Achievements" description="Every milestone tells part of your story." action={<div className="xp-pill"><LuZap size={15} /> 10,860 XP</div>} /><div className="achievement-summary"><div><span className="summary-icon"><LuAward /></span><div><small>SEASON PROGRESS</small><strong>Level 24 <em>· 68%</em></strong></div></div><div className="big-progress"><span style={{ width: '68%' }} /></div><p>1,340 XP to Level 25</p></div><div className="achievements-grid">{achievements.map((a) => <div className={`achievement-card ${a.done ? 'done' : ''}`} key={a.title}><span className="achievement-icon">{a.icon}</span><div><h3>{a.title}{a.done && <LuCheck size={15} />}</h3><p>{a.text}</p></div><div className="achievement-progress"><span><i style={{ width: `${a.done ? 100 : parseInt(a.progress) / parseInt(a.progress.split(' / ')[1]) * 100}%` }} /></span><small>{a.progress}</small></div></div>)}</div></div>; }

function PageIntro({ eyebrow, title, description, action }) { return <section className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</div><h1>{title}</h1><p className="muted">{description}</p></div>{action}</section>; }
function Toast({ message, type }) { return <motion.div className={`toast ${type}`} initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}><span><LuCheck size={15} /></span>{message}</motion.div>; }
function AddFundsModal({ onClose, onAction }) { const { register, handleSubmit, setValue } = useForm({ defaultValues: { amount: '500' } }); const submit = (data) => { onClose(); onAction(`₹${Number(data.amount).toLocaleString('en-IN')} deposit initiated securely`); }; const chooseAmount = (amount) => setValue('amount', String(amount), { shouldValidate: true, shouldDirty: true }); return <div className="modal-backdrop" onClick={onClose}><motion.div className="funds-modal" initial={{ opacity: 0, scale: .96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={onClose}><LuX /></button><span className="modal-icon"><LuWallet /></span><div className="eyebrow">SECURE CHECKOUT</div><h2>Add funds</h2><p>Top up your Nexora wallet and get back in the game.</p><form onSubmit={handleSubmit(submit)}><label>Amount</label><div className="amount-input"><span>₹</span><input type="number" min="50" step="50" {...register('amount', { required: true })} /></div><div className="amount-options"><button type="button" onClick={() => chooseAmount(500)}>₹500</button><button type="button" onClick={() => chooseAmount(1000)}>₹1,000</button><button type="button" onClick={() => chooseAmount(2000)}>₹2,000</button></div><button className="primary-btn modal-submit" type="submit">Continue to payment <LuArrowUpRight size={16} /></button></form><small className="secure-note"><LuShieldCheck size={14} /> Secured by Nexora Pay · 256-bit encryption</small></motion.div></div>; }

export default App;
