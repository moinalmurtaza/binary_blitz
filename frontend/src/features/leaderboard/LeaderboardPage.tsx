import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const RATING_TIERS = [
  { min: 0,    max: 1199, name: 'Newbie',            text: 'text-gray-400',   bg: 'bg-gray-500/10'   },
  { min: 1200, max: 1399, name: 'Pupil',             text: 'text-green-400',  bg: 'bg-green-500/10'  },
  { min: 1400, max: 1599, name: 'Specialist',        text: 'text-teal-400',   bg: 'bg-teal-500/10'   },
  { min: 1600, max: 1899, name: 'Expert',            text: 'text-[#C4122F]',   bg: 'bg-[rgba(164,16,52,0.10)]'   },
  { min: 1900, max: 2099, name: 'Candidate Master',  text: 'text-purple-400', bg: 'bg-purple-500/10' },
  { min: 2100, max: 2299, name: 'Master',            text: 'text-orange-400', bg: 'bg-orange-500/10' },
  { min: 2300, max: 2399, name: 'Int. Master',       text: 'text-orange-400', bg: 'bg-orange-500/10' },
  { min: 2400, max: 2599, name: 'Grandmaster',       text: 'text-red-400',    bg: 'bg-red-500/10'    },
  { min: 2600, max: 9999, name: 'Legendary GM',      text: 'text-red-500 rating-legendary', bg: 'bg-red-500/10' },
];

function getRatingTier(rating: number) {
  return RATING_TIERS.find(t => rating >= t.min && rating <= t.max) || RATING_TIERS[0];
}

const MEDALS: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/leaderboard?limit=50').then(r => r.data),
    refetchInterval: 60000,
  });

  const leaderboard = data?.leaderboard || [];

  const filteredLeaderboard = leaderboard.filter((user: any) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100">Leaderboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Platform-wide rankings by internal rating — updated after every contest</p>
        </div>
        {!isLoading && leaderboard.length > 0 && (
          <div className="w-full sm:w-64 shrink-0">
            <input
              type="text"
              placeholder="Search participant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#33363B] border border-[#4B4F55] text-xs text-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-[#A41034] transition-all font-sans"
            />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#A41034]" />
        </div>
      )}

      {!isLoading && (
        <>
          {leaderboard.length === 0 ? (
            <div className="text-center py-16 px-6 glass rounded-2xl border border-border/60 max-w-lg mx-auto">
              <h3 className="font-serif text-xl font-medium text-zinc-200 mb-2">No Coders Registered</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Rankings will appear here once participants complete contests and accumulate internal rating.
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 Podium (Only show when not filtering and have at least 3 users) */}
              {searchQuery === '' && filteredLeaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[filteredLeaderboard[1], filteredLeaderboard[0], filteredLeaderboard[2]].map((user: any, podiumIdx: number) => {
                    const realRank = podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2;
                    const tier = getRatingTier(user.rating);
                    const heights = ['h-28', 'h-36', 'h-24'];
                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * podiumIdx }}
                        className="flex flex-col items-center"
                      >
                        <div className={`${heights[podiumIdx]} w-full glass rounded-xl border border-border flex flex-col items-center justify-end pb-4 pt-4 gap-2 glow-hover ${realRank === 0 ? 'border-yellow-500/30 bg-yellow-500/5' : ''}`}>
                          <span className="text-2xl">{MEDALS[realRank]}</span>
                          <img src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60'} alt="avatar" className="w-10 h-10 rounded-full border-2 border-border" />
                          <div className="text-center px-2">
                            <p className="text-xs font-bold text-zinc-200 truncate w-full">{user.name}</p>
                            <p className={`text-[10px] font-bold ${tier.text}`}>{user.rating}</p>
                          </div>
                        </div>
                        <p className={`text-xs font-extrabold mt-2 ${realRank === 0 ? 'text-yellow-400' : 'text-zinc-500'}`}>#{realRank + 1}</p>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {filteredLeaderboard.length === 0 ? (
                <div className="text-center py-16 px-6 glass rounded-2xl border border-border/60 max-w-lg mx-auto">
                  <p className="text-sm text-zinc-500">No participants found matching your search.</p>
                </div>
              ) : (
                /* Full Table */
                <div className="glass rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-zinc-900/40">
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Rank</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Participant</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                        <th className="text-center px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Rating</th>
                        <th className="text-center px-5 py-3.5 text-xs font-bold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Solved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeaderboard.map((user: any, i: number) => {
                        const tier = getRatingTier(user.rating);
                        return (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className="border-b border-border/50 hover:bg-[#26292D]/50 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <span className={`text-sm font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-orange-500' : 'text-zinc-600'}`}>
                                {MEDALS[i] || `#${i + 1}`}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40'} alt="av" className="w-8 h-8 rounded-full border border-border shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold text-zinc-200">{user.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden md:table-cell">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${tier.bg} ${tier.text} border border-current/20`}>
                                {user.category.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="text-center px-5 py-4">
                              <span className={`text-sm font-extrabold font-mono ${tier.text}`}>{user.rating}</span>
                              <p className={`text-[10px] font-semibold ${tier.text} opacity-70`}>{tier.name}</p>
                            </td>
                            <td className="text-center px-5 py-4 hidden md:table-cell">
                              <span className="flex items-center justify-center gap-1 text-sm font-bold text-zinc-300">
                                <CheckCircle2 size={13} className="text-green-500/70" />
                                {user.solvedCount}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
