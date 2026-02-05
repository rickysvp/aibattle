import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Plus, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  RefreshCw,
  Image,
  Users,
  Gift,
  ChevronRight
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'mint' | 'battle_win' | 'battle_loss' | 'deposit' | 'withdraw' | 'swap';
  amount: number;
  timestamp: number;
  description: string;
}

interface NFT {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  value: number;
}

const WalletPage: React.FC = () => {
  const { wallet, myAgents, connectWallet } = useGameStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  
  // 模拟交易记录
  const transactions: Transaction[] = [
    { id: '1', type: 'swap', amount: -100, timestamp: Date.now() - 1800000, description: 'SWAP: ETH → $MON' },
    { id: '2', type: 'mint', amount: -100, timestamp: Date.now() - 3600000, description: '铸造 Agent #1' },
    { id: '3', type: 'battle_win', amount: 50, timestamp: Date.now() - 7200000, description: '战斗胜利奖励' },
    { id: '4', type: 'battle_loss', amount: -30, timestamp: Date.now() - 10800000, description: '战斗失败损失' },
    { id: '5', type: 'deposit', amount: 500, timestamp: Date.now() - 86400000, description: '充值' },
  ];

  // Monad RealNads NFT 数据
  const nfts: NFT[] = [
    { 
      id: '1', 
      name: 'RealNads #001', 
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=monad1&backgroundColor=6366f1', 
      rarity: 'legendary', 
      value: 5000 
    },
    { 
      id: '2', 
      name: 'RealNads #002', 
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=monad2&backgroundColor=f59e0b', 
      rarity: 'epic', 
      value: 2000 
    },
    { 
      id: '3', 
      name: 'RealNads #003', 
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=monad3&backgroundColor=8b5cf6', 
      rarity: 'rare', 
      value: 800 
    },
  ];
  
  const totalAssets = wallet.balance + wallet.lockedBalance;
  const agentsTotalBalance = myAgents.reduce((sum, a) => sum + a.balance, 0);
  
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'mint': return { icon: Plus, color: 'text-luxury-purple', bgColor: 'bg-luxury-purple' };
      case 'battle_win': return { icon: TrendingUp, color: 'text-luxury-green', bgColor: 'bg-luxury-green' };
      case 'battle_loss': return { icon: TrendingDown, color: 'text-luxury-rose', bgColor: 'bg-luxury-rose' };
      case 'deposit': return { icon: ArrowDownRight, color: 'text-luxury-cyan', bgColor: 'bg-luxury-cyan' };
      case 'withdraw': return { icon: ArrowUpRight, color: 'text-luxury-amber', bgColor: 'bg-luxury-amber' };
      case 'swap': return { icon: RefreshCw, color: 'text-luxury-gold', bgColor: 'bg-luxury-gold' };
    }
  };

  const getRarityColor = (rarity: NFT['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'from-luxury-gold to-luxury-amber';
      case 'epic': return 'from-luxury-purple to-luxury-rose';
      case 'rare': return 'from-luxury-cyan to-luxury-blue';
      case 'common': return 'from-white/40 to-white/20';
    }
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
  };

  return (
    <div className="min-h-screen bg-void pt-24 pb-24">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-luxury-green/20 to-luxury-cyan/20 border border-luxury-green/30 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-luxury-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-display">钱包</h1>
              <p className="text-white/40 text-lg">管理你的资产和交易记录</p>
            </div>
          </div>
        </div>
        
        {!wallet.connected ? (
          <div className="card-luxury rounded-2xl p-16 text-center">
            <div className="w-24 h-24 rounded-3xl bg-void-light/50 border border-white/5 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-12 h-12 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">请先连接钱包</h2>
            <button
              onClick={() => connectWallet('wallet')}
              className="group relative px-8 py-4 rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-purple via-luxury-purple-light to-luxury-cyan" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative flex items-center gap-2 text-white font-semibold">
                <Wallet className="w-5 h-5" />
                连接钱包
              </span>
            </button>
          </div>
        ) : (
          <>
            {/* 资产概览卡片 */}
            <div className="card-luxury rounded-2xl overflow-hidden mb-6 border-luxury-gold/20">
              <div className="px-8 py-6 bg-gradient-to-br from-luxury-gold/5 to-transparent">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-white/40 uppercase tracking-wider mb-1">总资产</p>
                    <p className="text-5xl font-bold text-gradient-gold font-display">{totalAssets.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">钱包地址</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-luxury-cyan font-mono bg-void-light/50 px-3 py-1.5 rounded-lg">
                        {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                      </code>
                      <button 
                        onClick={copyAddress}
                        className="p-2 rounded-lg bg-void-light/50 text-white/40 hover:text-white hover:bg-void-light transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-void-light/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                      <Wallet className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">可用余额</span>
                    </div>
                    <p className="text-2xl font-bold text-luxury-green font-mono">{wallet.balance.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-void-light/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">锁定资产</span>
                    </div>
                    <p className="text-2xl font-bold text-luxury-amber font-mono">{agentsTotalBalance.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-void-light/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                      <PieChart className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Agents</span>
                    </div>
                    <p className="text-2xl font-bold text-luxury-purple font-mono">{myAgents.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 操作按钮 - 改为3列，增加SWAP */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button className="group p-6 card-luxury rounded-2xl text-left transition-all hover:border-luxury-green/30">
                <div className="w-14 h-14 rounded-2xl bg-luxury-green/10 border border-luxury-green/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ArrowDownRight className="w-7 h-7 text-luxury-green" />
                </div>
                <p className="text-lg font-semibold text-white mb-1">充值</p>
                <p className="text-sm text-white/40">从外部钱包转入</p>
              </button>
              
              <button className="group p-6 card-luxury rounded-2xl text-left transition-all hover:border-luxury-gold/30">
                <div className="w-14 h-14 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-7 h-7 text-luxury-gold" />
                </div>
                <p className="text-lg font-semibold text-white mb-1">SWAP</p>
                <p className="text-sm text-white/40">代币兑换</p>
              </button>

              <button className="group p-6 card-luxury rounded-2xl text-left transition-all hover:border-luxury-amber/30">
                <div className="w-14 h-14 rounded-2xl bg-luxury-amber/10 border border-luxury-amber/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-7 h-7 text-luxury-amber" />
                </div>
                <p className="text-lg font-semibold text-white mb-1">提现</p>
                <p className="text-sm text-white/40">转出到外部钱包</p>
              </button>
            </div>

            {/* NFT 展示模块 */}
            <div className="card-luxury rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-luxury-purple" />
                  我的 NFT
                </h3>
                <button className="text-sm text-luxury-cyan hover:text-luxury-cyan-light flex items-center gap-1">
                  查看全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {nfts.map((nft) => (
                  <div key={nft.id} className="group relative bg-void-light rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(nft.rarity)} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity`} />
                    <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-void">
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-white text-center mb-1">{nft.name}</p>
                    <p className="text-xs text-white/40 text-center capitalize">{nft.rarity}</p>
                    <p className="text-sm font-bold text-luxury-gold font-mono text-center mt-2">{nft.value} $MON</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 邀请好友模块 */}
            <div className="card-luxury rounded-2xl p-6 mb-6 bg-gradient-to-br from-luxury-purple/10 to-luxury-cyan/10 border-luxury-purple/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-luxury-purple flex items-center justify-center">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-luxury-cyan" />
                      邀请好友
                    </h3>
                    <p className="text-sm text-white/60">邀请好友加入，双方各得 <span className="text-luxury-gold font-bold">100 $MON</span></p>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-luxury-cyan text-white font-semibold hover:bg-luxury-cyan/90 transition-colors">
                  立即邀请
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-void-light rounded-xl px-4 py-3 border border-white/10">
                    <p className="text-xs text-white/40 mb-1">你的邀请码</p>
                    <p className="text-lg font-mono text-white">AI2024VIP</p>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText('AI2024VIP')}
                    className="px-6 py-3 rounded-xl bg-void-light border border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    复制
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-void-light/50 rounded-xl">
                    <p className="text-2xl font-bold text-luxury-cyan">0</p>
                    <p className="text-xs text-white/40">已邀请</p>
                  </div>
                  <div className="text-center p-3 bg-void-light/50 rounded-xl">
                    <p className="text-2xl font-bold text-luxury-gold">0</p>
                    <p className="text-xs text-white/40">获得奖励</p>
                  </div>
                  <div className="text-center p-3 bg-void-light/50 rounded-xl">
                    <p className="text-2xl font-bold text-luxury-green">0</p>
                    <p className="text-xs text-white/40">好友充值</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 交易记录入口 */}
            <div className="card-luxury rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-luxury-purple" />
                  交易记录
                </h3>
                <button className="text-sm text-luxury-cyan hover:text-luxury-cyan-light flex items-center gap-1">
                  查看全部 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="divide-y divide-white/5">
                {transactions.slice(0, 5).map(tx => {
                  const config = getTransactionIcon(tx.type);
                  const Icon = config.icon;
                  
                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-void-light/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{tx.description}</p>
                          <p className="text-xs text-white/40">{formatTime(tx.timestamp)}</p>
                        </div>
                      </div>
                      <span className={`font-bold font-mono ${tx.amount >= 0 ? 'text-luxury-green' : 'text-luxury-rose'}`}>
                        {tx.amount >= 0 ? '+' : ''}{tx.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {transactions.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-void-light/50 border border-white/5 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40">暂无交易记录</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
