import React, { useState } from 'react';
import { Agent, Rarity } from '../types';
import { useGameStore } from '../store/gameStore';
import PixelAgent from './PixelAgent';
import { 
  Zap, 
  Shield, 
  Heart, 
  Coins, 
  TrendingUp, 
  Skull,
  Plus,
  Minus,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronUp,
  Trophy,
  Target,
  Flame,
  Crosshair,
  Wind,
  Sparkles,
  Gem
} from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

// 稀有度配置
const rarityConfig: Record<Rarity, { name: string; color: string; bgColor: string; borderColor: string; icon: React.ElementType }> = {
  common: { 
    name: '普通', 
    color: '#9ca3af', 
    bgColor: 'bg-gray-500/10', 
    borderColor: 'border-gray-500/30',
    icon: Sparkles
  },
  rare: { 
    name: '稀有', 
    color: '#3b82f6', 
    bgColor: 'bg-blue-500/10', 
    borderColor: 'border-blue-500/30',
    icon: Gem
  },
  epic: { 
    name: '史诗', 
    color: '#a855f7', 
    bgColor: 'bg-purple-500/10', 
    borderColor: 'border-purple-500/30',
    icon: Zap
  },
  legendary: { 
    name: '传说', 
    color: '#f59e0b', 
    bgColor: 'bg-amber-500/10', 
    borderColor: 'border-amber-500/30',
    icon: Trophy
  },
  mythic: { 
    name: '神话', 
    color: '#ef4444', 
    bgColor: 'bg-red-500/10', 
    borderColor: 'border-red-500/30',
    icon: Flame
  },
};

const AgentCard: React.FC<AgentCardProps> = ({ agent, compact = false }) => {
  const [showActions, setShowActions] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  const { allocateFunds, withdrawFunds, joinArena, leaveArena, wallet } = useGameStore();
  
  const handleAllocate = () => {
    const amount = parseFloat(fundAmount);
    if (amount > 0 && amount <= wallet.balance) {
      allocateFunds(agent.id, amount);
      setFundAmount('');
    }
  };
  
  const handleWithdraw = () => {
    const amount = parseFloat(fundAmount);
    if (amount > 0 && amount <= agent.balance) {
      withdrawFunds(agent.id, amount);
      setFundAmount('');
    }
  };
  
  const getStatusConfig = () => {
    switch (agent.status) {
      case 'idle': 
        return { 
          label: '空闲', 
          color: 'text-luxury-cyan',
          bgColor: 'bg-luxury-cyan/10',
          borderColor: 'border-luxury-cyan/30',
          icon: Zap
        };
      case 'in_arena': 
        return { 
          label: '待战', 
          color: 'text-luxury-gold',
          bgColor: 'bg-luxury-gold/10',
          borderColor: 'border-luxury-gold/30',
          icon: Shield
        };
      case 'fighting': 
        return { 
          label: '战斗中', 
          color: 'text-luxury-rose',
          bgColor: 'bg-luxury-rose/10',
          borderColor: 'border-luxury-rose/30',
          icon: Heart,
          animate: true
        };
      case 'dead': 
        return { 
          label: '已阵亡', 
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          icon: Skull
        };
      default: 
        return { 
          label: '未知', 
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/10',
          borderColor: 'border-gray-400/30',
          icon: Zap
        };
    }
  };
  
  const status = getStatusConfig();
  const StatusIcon = status.icon;
  const rarity = rarityConfig[agent.rarity];
  const RarityIcon = rarity.icon;

  if (compact) {
    return (
      <div 
        className="card-luxury rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setShowActions(!showActions)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Agent 头像 */}
            <div className="relative">
              <div 
                className="absolute inset-0 blur-lg rounded-full transition-opacity duration-300"
                style={{ 
                  backgroundColor: rarity.color,
                  opacity: isHovered ? 0.5 : 0.3 
                }}
              />
              <div 
                className="relative w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${rarity.color}20, ${rarity.color}40)`,
                  border: `2px solid ${rarity.color}50`
                }}
              >
                <PixelAgent agent={agent} size={40} />
              </div>
              
              {/* 稀有度指示器 */}
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: rarity.color }}
              >
                <RarityIcon className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* 信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-white truncate">{agent.name}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.bgColor} ${status.color} border ${status.borderColor}`}>
                  {status.label}
                </span>
              </div>
              
              {/* 稀有度和属性点 */}
              <div className="flex items-center gap-3 text-xs">
                <span 
                  className="font-medium"
                  style={{ color: rarity.color }}
                >
                  {rarity.name}
                </span>
                <span className="text-white/40">
                  {agent.totalStats}点
                </span>
              </div>
            </div>
            
            {/* 展开图标 */}
            <div className="text-white/30 group-hover:text-white/60 transition-colors">
              {showActions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
          
          {/* 快捷操作 */}
          {showActions && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-slide-up">
              {/* 资金操作 */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="金额"
                    className="w-full bg-void-light border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-luxury-purple focus:outline-none transition-colors"
                  />
                  <Coins className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
                <button
                  onClick={handleAllocate}
                  disabled={!fundAmount || parseFloat(fundAmount) > wallet.balance}
                  className="px-3 py-2 bg-luxury-green/10 border border-luxury-green/30 rounded-lg text-luxury-green hover:bg-luxury-green/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={!fundAmount || parseFloat(fundAmount) > agent.balance || agent.status !== 'idle'}
                  className="px-3 py-2 bg-luxury-amber/10 border border-luxury-amber/30 rounded-lg text-luxury-amber hover:bg-luxury-amber/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              
              {/* 竞技场操作 */}
              <div className="flex gap-2">
                {agent.status === 'idle' && agent.balance > 0 && (
                  <button
                    onClick={() => joinArena(agent.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-luxury-purple/20 to-luxury-cyan/20 border border-luxury-purple/30 rounded-lg text-white hover:from-luxury-purple/30 hover:to-luxury-cyan/30 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">加入竞技场</span>
                  </button>
                )}
                {agent.status === 'in_arena' && (
                  <button
                    onClick={() => leaveArena(agent.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-luxury-rose/10 border border-luxury-rose/30 rounded-lg text-luxury-rose hover:bg-luxury-rose/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">退出竞技场</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card-luxury rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? rarity.color : undefined,
        borderWidth: isHovered ? '2px' : '1px',
      }}
    >
      {/* 头部 - 稀有度横幅 */}
      <div 
        className="px-5 py-2 flex items-center justify-between"
        style={{ 
          background: `linear-gradient(90deg, ${rarity.color}20, ${rarity.color}10)`,
          borderBottom: `1px solid ${rarity.color}30`
        }}
      >
        <div className="flex items-center gap-2">
          <RarityIcon className="w-4 h-4" style={{ color: rarity.color }} />
          <span className="text-sm font-medium" style={{ color: rarity.color }}>
            {rarity.name}
          </span>
          <span className="text-xs text-white/40">
            {agent.totalStats}属性点
          </span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${status.bgColor} ${status.color} border ${status.borderColor}`}>
          {status.label}
        </span>
      </div>

      {/* Agent信息 */}
      <div className="p-5">
        <div className="flex items-start gap-4 mb-5">
          {/* Agent 头像 */}
          <div className="relative">
            <div 
              className="absolute inset-0 blur-xl rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: rarity.color,
                opacity: isHovered ? 0.6 : 0.3,
                transform: isHovered ? 'scale(1.2)' : 'scale(1)'
              }}
            />
            <div 
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${rarity.color}30, ${rarity.color}50)`,
                border: `3px solid ${rarity.color}`
              }}
            >
              <PixelAgent agent={agent} size={56} />
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-1">{agent.name}</h4>
            
            {/* 核心数据 */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-void-light/50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-white/40 uppercase">余额</p>
                <p className="text-lg font-bold text-luxury-gold font-mono">{agent.balance.toFixed(0)}</p>
              </div>
              <div className="bg-void-light/50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-white/40 uppercase">利润</p>
                <p className={`text-lg font-bold font-mono ${agent.netProfit >= 0 ? 'text-luxury-green' : 'text-luxury-rose'}`}>
                  {agent.netProfit >= 0 ? '+' : ''}{agent.netProfit.toLocaleString()}
                </p>
              </div>
              <div className="bg-void-light/50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-white/40 uppercase">胜率</p>
                <p className={`text-lg font-bold font-mono ${agent.winRate >= 60 ? 'text-luxury-green' : agent.winRate >= 40 ? 'text-luxury-amber' : 'text-luxury-rose'}`}>
                  {agent.winRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 战斗统计 */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="flex items-center gap-2 bg-void-light/30 rounded-lg p-3">
            <Target className="w-4 h-4 text-luxury-cyan" />
            <div>
              <p className="text-[10px] text-white/40">总场次</p>
              <p className="text-sm font-bold text-white font-mono">{agent.totalBattles}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-void-light/30 rounded-lg p-3">
            <Trophy className="w-4 h-4 text-luxury-gold" />
            <div>
              <p className="text-[10px] text-white/40">锦标赛冠军</p>
              <p className="text-sm font-bold text-luxury-gold font-mono">{agent.tournamentWins}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-void-light/30 rounded-lg p-3">
            <TrendingUp className="w-4 h-4 text-luxury-purple" />
            <div>
              <p className="text-[10px] text-white/40">击杀数</p>
              <p className="text-sm font-bold text-luxury-purple font-mono">{agent.kills}</p>
            </div>
          </div>
        </div>

        {/* 属性展示 */}
        <div className="bg-void-light/20 rounded-xl p-4 mb-5">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">属性</p>
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-luxury-rose/20 flex items-center justify-center mb-1">
                <Zap className="w-5 h-5 text-luxury-rose" />
              </div>
              <p className="text-[10px] text-white/40">攻击</p>
              <p className="text-sm font-bold text-luxury-rose font-mono">{agent.attack}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-luxury-cyan/20 flex items-center justify-center mb-1">
                <Shield className="w-5 h-5 text-luxury-cyan" />
              </div>
              <p className="text-[10px] text-white/40">防御</p>
              <p className="text-sm font-bold text-luxury-cyan font-mono">{agent.defense}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-luxury-amber/20 flex items-center justify-center mb-1">
                <Flame className="w-5 h-5 text-luxury-amber" />
              </div>
              <p className="text-[10px] text-white/40">暴击</p>
              <p className="text-sm font-bold text-luxury-amber font-mono">{agent.crit}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-luxury-purple/20 flex items-center justify-center mb-1">
                <Crosshair className="w-5 h-5 text-luxury-purple" />
              </div>
              <p className="text-[10px] text-white/40">命中</p>
              <p className="text-sm font-bold text-luxury-purple font-mono">{agent.hit}</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-luxury-green/20 flex items-center justify-center mb-1">
                <Wind className="w-5 h-5 text-luxury-green" />
              </div>
              <p className="text-[10px] text-white/40">敏捷</p>
              <p className="text-sm font-bold text-luxury-green font-mono">{agent.agility}</p>
            </div>
          </div>
        </div>
        
        {/* 资金操作 */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="输入金额"
                className="w-full bg-void-light border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-luxury-purple focus:outline-none transition-colors"
              />
              <Coins className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAllocate}
              disabled={!fundAmount || parseFloat(fundAmount) > wallet.balance}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-luxury-green/10 border border-luxury-green/30 rounded-xl text-luxury-green hover:bg-luxury-green/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              充值
            </button>
            <button
              onClick={handleWithdraw}
              disabled={!fundAmount || parseFloat(fundAmount) > agent.balance || agent.status !== 'idle'}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-luxury-amber/10 border border-luxury-amber/30 rounded-xl text-luxury-amber hover:bg-luxury-amber/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Minus className="w-4 h-4" />
              提取
            </button>
          </div>
          
          {/* 竞技场操作 */}
          {agent.status === 'idle' && agent.balance > 0 && (
            <button
              onClick={() => joinArena(agent.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
              style={{ 
                background: `linear-gradient(90deg, ${rarity.color}, ${rarity.color}dd)`,
                boxShadow: `0 4px 20px ${rarity.color}40`
              }}
            >
              <LogIn className="w-5 h-5" />
              加入竞技场
            </button>
          )}
          {agent.status === 'in_arena' && (
            <button
              onClick={() => leaveArena(agent.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-luxury-rose/10 border border-luxury-rose/30 rounded-xl text-luxury-rose hover:bg-luxury-rose/20 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              退出竞技场
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
