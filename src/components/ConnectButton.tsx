import React, { useState } from 'react';
import ConnectWalletModal from './ConnectWalletModal';
import { useGameStore } from '../store/gameStore';

interface ConnectButtonProps {
  className?: string;
  showText?: boolean;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ 
  className = '',
  showText = true 
}) => {
  const [showModal, setShowModal] = useState(false);
  const { connectWallet } = useGameStore();

  const handleConnect = (nickname: string, type: 'twitter' | 'google' | 'wallet') => {
    connectWallet(nickname, type);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`
          group relative px-8 py-3 overflow-hidden rounded-xl transition-all duration-300
          ${className}
        `}
      >
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-purple via-luxury-purple-light to-luxury-cyan opacity-90 group-hover:opacity-100 transition-opacity" />
        
        {/* 闪光效果 */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        {/* 内容 */}
        <span className="relative text-white font-semibold font-display tracking-wide">
          {showText ? 'Connect' : ''}
        </span>
      </button>

      <ConnectWalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConnect={handleConnect}
      />
    </>
  );
};

export default ConnectButton;
