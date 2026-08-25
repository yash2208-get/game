export const games = [
  { id: 'ludo', title: 'Royal Ludo', type: 'Board classic', players: '2–4 players', color: 'violet', icon: '✦', art: 'ludo-art', accent: '4.9', recent: '2h ago' },
  { id: 'chess', title: 'Blitz Arena', type: 'Strategy', players: '1v1', color: 'blue', icon: '♞', art: 'chess-art', accent: '4.8', recent: 'Yesterday' },
  { id: 'snake', title: 'Neon Snakes', type: 'Arcade', players: '2–8 players', color: 'green', icon: '↝', art: 'snake-art', accent: '4.7', recent: 'Mon' },
  { id: 'quiz', title: 'Quiz Rush', type: 'Trivia battle', players: '2–6 players', color: 'orange', icon: '?', art: 'quiz-art', accent: '4.9', recent: 'Sun' },
  { id: 'memory', title: 'Mind Flip', type: 'Memory', players: '1–4 players', color: 'pink', icon: '◈', art: 'memory-art', accent: '4.6', recent: 'Sat' },
  { id: 'puzzle', title: 'Block Theory', type: 'Puzzle', players: 'Solo', color: 'cyan', icon: '▦', art: 'puzzle-art', accent: '4.8', recent: 'Fri' }
];

export const tournaments = [
  { title: 'Midnight Blitz', game: 'Chess', entry: '₹25', prize: '₹18,500', players: '1,248', time: 'Starts in 12m', status: 'live', icon: '♞', color: 'blue' },
  { title: 'Royal Clash', game: 'Ludo', entry: 'Free', prize: '₹10,000', players: '2,904', time: 'Starts in 42m', status: 'open', icon: '✦', color: 'violet' },
  { title: 'Quiz Masters', game: 'Quiz Rush', entry: '₹49', prize: '₹32,000', players: '816', time: 'Today, 9:00 PM', status: 'open', icon: '?', color: 'orange' },
  { title: 'Snake Sprint', game: 'Neon Snakes', entry: '₹10', prize: '₹7,500', players: '384', time: 'Tomorrow, 7:30 PM', status: 'upcoming', icon: '↝', color: 'green' }
];

export const leaderboard = [
  { rank: 1, name: 'Mira K.', handle: '@miraknight', score: '12,840', wins: '86%', avatar: 'MK', tone: 'gold' },
  { rank: 2, name: 'Arjun R.', handle: '@arjunplays', score: '12,190', wins: '82%', avatar: 'AR', tone: 'silver' },
  { rank: 3, name: 'Nova S.', handle: '@novaskill', score: '11,745', wins: '79%', avatar: 'NS', tone: 'bronze' },
  { rank: 4, name: 'You', handle: '@aidenx', score: '10,860', wins: '74%', avatar: 'AX', tone: 'you' },
  { rank: 5, name: 'Leo D.', handle: '@leodash', score: '10,420', wins: '71%', avatar: 'LD', tone: 'blue' }
];

export const activity = [
  { icon: '♞', color: 'blue', title: 'Won a Blitz Arena match', meta: 'vs. Arjun R. · 2 min ago', value: '+₹120' },
  { icon: '✦', color: 'violet', title: 'Joined Royal Clash', meta: 'Quarter-finals · 1h ago', value: 'LIVE' },
  { icon: '◈', color: 'pink', title: 'Unlocked Sharp Mind', meta: 'Achievement · Yesterday', value: 'NEW' }
];
