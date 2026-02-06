import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent, Rarity, BattleRecord } from '../types';
import PixelAgent from './PixelAgent';
import {
  X,
  Zap,
  Shield,
  Flame,
  Crosshair,
  Wind,
  Trophy,
  Target,
  TrendingUp,
  Wallet,
  Swords,
  Calendar,
  Skull,
  Crown,
  Medal,
  Sparkles,
  Gem,
  Sword
} from 'lucide-react';

interface AgentDetailModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

// 稀有度配置
const rarityConfig: Record<Rarity, { name: string; color: string; icon: React.ElementType }> = {
  common: { name: '普通', color: '#9ca3af', icon: Sparkles },
  rare: { name: '稀有', color: '#3b82f6', icon: Gem },
  epic: { name: '史诗', color: '#a855f7', icon: Zap },
  legendary: { name: '传说', color: '#f59e0b', icon: Trophy },
  mythic: { name: '神话', color: '#ef4444', icon: Flame },
};

const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, isOpen, onClose }) => {
  if (!agent) return null;

  const rarity = rarityConfig[agent.rarity];
  const RarityIcon = rarity.icon;

  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取结果图标
  const getResultIcon = (result: string) => {
    switch (result) {
      case 'win':
        return <Crown className="w-4 h-4 text-luxury-gold" />;
      case 'loss':
        return <Skull className="w-4 h-4 text-luxury-rose" />;
      default:
        return <Medal className="w-4 h-4 text-white/40" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* 弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-void-panel rounded-2xl border border-white/10 overflow-hidden z-50 flex flex-col"
          >
            {/* 头部 */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: `linear-gradient(90deg, ${rarity.color}30, ${rarity.color}10)` }}
            >
              <div className="flex items-center gap-3">
                <RarityIcon className="w-6 h-6" style={{ color: rarity.color }} />
                <div>
                  <h2 className="text-xl font-bold text-white">{agent.name}</h2>
                  <p className="text-sm text-white/50">NFT #{agent.nftId}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 基本信息 */}
              <div className="flex gap-6 mb-6">
                {/* 头像 */}
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${rarity.color}40, ${rarity.color}60)`,
                    border: `3px solid ${rarity.color}`
                  }}
                >
                  <PixelAgent agent={agent} size={72} />
                </div>

                {/* 核心数据 */}
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="bg-void-light/50 rounded-xl p-3 text-center">
                    <Wallet className="w-5 h-5 mx-auto text-luxury-gold mb-1" />
                    <p className="text-lg font-bold text-luxury-gold font-mono">{agent.balance.toFixed(0)}</p>
                    <p className="text-xs text-white/40">余额</p>
                  </div>
                  <div className="bg-void-light/50 rounded-xl p-3 text-center">
                    <TrendingUp className={`w-5 h-5 mx-auto mb-1 ${agent.netProfit >= 0 ? 'text-luxury-green' : 'text-luxury-rose'}`} />
                    <p className={`text-lg font-bold font-mono ${agent.netProfit >= 0 ? 'text-luxury-green' : 'text-luxury-rose'}`}>
                      {agent.netProfit >= 0 ? '+' : ''}{agent.netProfit.toLocaleString()}
                    </p>
                    <p className="text-xs text-white/40">净利润</p>
                  </div>
                  <div className="bg-void-light/50 rounded-xl p-3 text-center">
                    <Target className={`w-5 h-5 mx-auto mb-1 ${agent.winRate >= 60 ? 'text-luxury-green' : agent.winRate >= 40 ? 'text-luxury-amber' : 'text-luxury-rose'}`} />
                    <p className={`text-lg font-bold font-mono ${agent.winRate >= 60 ? 'text-luxury-green' : agent.winRate >= 40 ? 'text-luxury-amber' : 'text-luxury-rose'}`}>
                      {agent.winRate}%
                    </p>
                    <p className="text-xs text-white/40">胜率</p>
                  </div>
                </div>
              </div>

              {/* 属性 */}
              <div className="bg-void-light/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white">属性</h3>
                  <span className="text-xs text-white/40">{agent.totalStats} pts</span>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center">
                    <Zap className="w-6 h-6 mx-auto text-luxury-rose mb-1" />
                    <p className="text-lg font-bold text-luxury-rose font-mono">{agent.attack}</p>
                    <p className="text-xs text-white/40">攻击</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-6 h-6 mx-auto text-luxury-cyan mb-1" />
                    <p className="text-lg font-bold text-luxury-cyan font-mono">{agent.defense}</p>
                    <p className="text-xs text-white/40">防御</p>
                  </div>
                  <div className="text-center">
                    <Flame className="w-6 h-6 mx-auto text-luxury-amber mb-1" />
                    <p className="text-lg font-bold text-luxury-amber font-mono">{agent.crit}</p>
                    <p className="text-xs text-white/40">暴击</p>
                  </div>
                  <div className="text-center">
                    <Crosshair className="w-6 h-6 mx-auto text-luxury-purple mb-1" />
                    <p className="text-lg font-bold text-luxury-purple font-mono">{agent.hit}</p>
                    <p className="text-xs text-white/40">命中</p>
                  </div>
                  <div className="text-center">
                    <Wind className="w-6 h-6 mx-auto text-luxury-green mb-1" />
                    <p className="text-lg font-bold text-luxury-green font-mono">{agent.agility}</p>
                    <p className="text-xs text-white/40">敏捷</p>
                  </div>
                </div>
              </div>

              {/* 统计 */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-void-light/30 rounded-lg p-3 text-center">
                  <Swords className="w-4 h-4 mx-auto text-luxury-cyan mb-1" />
                  <p className="text-lg font-bold text-white font-mono">{agent.totalBattles}</p>
                  <p className="text-xs text-white/40">总场次</p>
                </div>
                <div className="bg-void-light/30 rounded-lg p-3 text-center">
                  <Trophy className="w-4 h-4 mx-auto text-luxury-gold mb-1" />
                  <p className="text-lg font-bold text-luxury-gold font-mono">{agent.tournamentWins}</p>
                  <p className="text-xs text-white/40">冠军</p>
                </div>
                <div className="bg-void-light/30 rounded-lg p-3 text-center">
                  <Medal className="w-4 h-4 mx-auto text-luxury-purple mb-1" />
                  <p className="text-lg font-bold text-luxury-purple font-mono">{agent.tournamentTop3}</p>
                  <p className="text-xs text-white/40">前三</p>
                </div>
                <div className="bg-void-light/30 rounded-lg p-3 text-center">
                  <Sword className="w-4 h-4 mx-auto text-luxury-rose mb-1" />
                  <p className="text-lg font-bold text-luxury-rose font-mono">{agent.kills}</p>
                  <p className="text-xs text-white/40">击杀</p>
                </div>
              </div>

              {/* 战斗历史 */}
              <div>
                <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-luxury-cyan" />
                  战斗历史 ({agent.battleHistory.length}场)
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {agent.battleHistory.map((record, index) => (
                    <div
                      key={record.id}
                      className="bg-void-light/20 rounded-lg p-3 flex items-center gap-3"
                    >
                      {getResultIcon(record.result)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            record.result === 'win' ? 'text-luxury-gold' : 'text-luxury-rose'
                          }`}>
                            {record.result === 'win' ? '胜利' : '失败'}
                          </span>
                          {record.isTournament && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-luxury-gold/20 text-luxury-gold">
                              锦标赛
                            </span>
                          )}
                          {record.rank && record.rank <= 3 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-luxury-purple/20 text-luxury-purple">
                              #{record.rank}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 truncate">
                          vs {record.opponent}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-mono ${record.earnings >= 0 ? 'text-luxury-green' : 'text-luxury-rose'}`}>
                          {record.earnings >= 0 ? '+' : ''}{record.earnings}
                        </p>
                        <p className="text-xs text-white/30">
                          {formatDate(record.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AgentDetailModal;
