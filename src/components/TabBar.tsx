import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Swords, Trophy, Users, Wallet, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabItem {
  path: string;
  icon: React.ElementType;
  activeIcon: React.ElementType;
  gradient: string;
  glowColor: string;
  translationKey: string;
}

const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tabs: TabItem[] = [
    {
      path: '/',
      icon: Swords,
      activeIcon: Swords,
      gradient: 'from-luxury-rose via-luxury-purple to-luxury-cyan',
      glowColor: 'shadow-luxury-rose/50',
      translationKey: 'nav.arena'
    },
    {
      path: '/tournament',
      icon: Trophy,
      activeIcon: Trophy,
      gradient: 'from-luxury-gold via-luxury-amber to-luxury-rose',
      glowColor: 'shadow-luxury-gold/50',
      translationKey: 'nav.tournament'
    },
    {
      path: '/squad',
      icon: Users,
      activeIcon: Users,
      gradient: 'from-luxury-cyan via-luxury-blue to-luxury-purple',
      glowColor: 'shadow-luxury-cyan/50',
      translationKey: 'nav.squad'
    },
    {
      path: '/wallet',
      icon: Wallet,
      activeIcon: Wallet,
      gradient: 'from-luxury-green via-luxury-cyan to-luxury-gold',
      glowColor: 'shadow-luxury-green/50',
      translationKey: 'nav.wallet'
    }
  ];

  const activeIndex = tabs.findIndex(tab => tab.path === location.pathname);

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      {/* 浮动容器 */}
      <div className="pointer-events-auto relative">
        {/* 外层光晕 */}
        <div className="absolute -inset-4 bg-gradient-to-r from-luxury-purple/20 via-luxury-cyan/20 to-luxury-gold/20 rounded-full blur-2xl opacity-60" />
        
        {/* 主容器 */}
        <div className="relative flex items-center gap-1 p-2 bg-void-panel/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
          {/* 背景渐变装饰 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-luxury-purple/5 via-luxury-cyan/5 to-luxury-gold/5" />
          
          {/* 顶部光线 */}
          <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            const isHovered = index === hoveredIndex;
            const Icon = isActive ? tab.activeIcon : tab.icon;

            return (
              <motion.button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative flex flex-col items-center justify-center min-w-[72px] h-14 rounded-full transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {/* 激活背景 */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} rounded-full`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                {/* 发光效果 */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} rounded-full blur-lg opacity-60`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                {/* 悬停光晕 */}
                {!isActive && isHovered && (
                  <motion.div
                    className="absolute inset-0 bg-white/5 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                {/* 图标容器 */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive
                          ? 'text-white drop-shadow-lg'
                          : 'text-white/50 group-hover:text-white/80'
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.div>

                  {/* 激活时的闪光效果 */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Sparkles className="w-3 h-3 text-white/80 absolute -top-1 -right-1" />
                    </motion.div>
                  )}
                </div>

                {/* 标签文字 */}
                <motion.span
                  className={`mt-1 text-[10px] font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-white/40'
                  }`}
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    y: isActive ? 0 : 2
                  }}
                >
                  {t(tab.translationKey)}
                </motion.span>

                {/* 未读指示器（示例） */}
                {index === 3 && (
                  <div className="absolute top-2 right-3 w-2 h-2 bg-luxury-rose rounded-full animate-pulse" />
                )}
              </motion.button>
            );
          })}

          {/* 装饰性边框 */}
          <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
          
          {/* 内部高光 */}
          <div className="absolute top-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>

        {/* 底部反射效果 */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-luxury-purple/10 to-transparent blur-xl" />
      </div>
    </nav>
  );
};

export default TabBar;
