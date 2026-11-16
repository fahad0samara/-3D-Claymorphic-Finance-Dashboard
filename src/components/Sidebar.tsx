import React, { useState } from 'react';
import {
  Home,
  Wallet,
  ReceiptText,
  PieChart,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { NavSection, NAV_SECTION_LABELS, Language } from '../data/financeData';

interface SidebarProps {
  lang: Language;
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onOpenCreateGoal: () => void;
}

const NAV_ITEMS: { label: NavSection; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Dashboard', icon: Home },
  { label: 'Accounts', icon: Wallet },
  { label: 'Transactions', icon: ReceiptText },
  { label: 'Budget', icon: PieChart },
  { label: 'Goals', icon: Target },
  { label: 'Investments', icon: TrendingUp },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
  { label: 'Help & Support', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({
  lang,
  activeSection,
  onSelectSection,
  onOpenCreateGoal,
}) => {
  const isRTL = lang === 'ar';
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleSelect = (section: NavSection) => {
    onSelectSection(section);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* MOBILE & TABLET COMPACT HEADER + SCROLLABLE PILL NAV (< 1024px) */}
      <div className="lg:hidden clay-sidebar w-full rounded-[24px] p-3.5 flex flex-col gap-3 select-none relative z-40">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Lockup */}
          <button
            type="button"
            onClick={() => handleSelect('Dashboard')}
            className="flex items-center gap-2.5 text-start group focus:outline-none cursor-pointer"
          >
            <div className="clay-purple-logo w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="text-[20px] font-extrabold tracking-tight text-[#1E1B26] whitespace-nowrap">
              FinTrack
            </span>
          </button>

          {/* Quick Create Goal CTA + Drawer Menu Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCreateGoal}
              className="clay-purple-active px-3 py-2 rounded-[13px] text-[12px] font-bold text-white flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.6]" />
              <span>{isRTL ? 'إنشاء هدف' : 'Create Goal'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              aria-label={isRTL ? 'فتح القائمة الجانبية' : 'Toggle navigation drawer'}
              className="clay-pill-btn w-9 h-9 rounded-[12px] flex items-center justify-center text-[#1E1B26] cursor-pointer"
            >
              {mobileDrawerOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Quick-Switch Navigation Bar for Mobile & Tablet */}
        <nav
          aria-label={isRTL ? 'التنقل السريع' : 'Quick Navigation'}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
        >
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = activeSection === label;
            const displayLabel = NAV_SECTION_LABELS[label][lang];
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleSelect(label)}
                className={`flex items-center gap-2 px-3 py-2 rounded-[13px] text-[12.5px] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'clay-purple-active text-white font-bold'
                    : 'clay-inner-card text-[#2C2733] hover:bg-[#EFE9E3] font-semibold'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white stroke-[2.3]' : 'text-[#2C2733] stroke-[1.9]'
                  }`}
                />
                <span>{displayLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Expandable Mobile Drawer with Promo Card */}
        {mobileDrawerOpen && (
          <div className="pt-2 border-t border-[#E6DFD9] space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {NAV_ITEMS.map(({ label, icon: Icon }) => {
                const isActive = activeSection === label;
                const displayLabel = NAV_SECTION_LABELS[label][lang];
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSelect(label)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? 'clay-purple-active text-white font-bold'
                        : 'text-[#2C2733] hover:bg-[#EFE9E3]/70 font-semibold'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{displayLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Promo Banner */}
            <div className="clay-promo-card rounded-[20px] p-4 text-white relative overflow-hidden flex items-center justify-between gap-3">
              <div className="relative z-10">
                <h3 className="text-[15px] font-extrabold text-white">
                  {isRTL ? 'وفّر أكثر، وحقّق أكثر!' : 'Save more, Achieve more!'}
                </h3>
                <p className="text-[12px] text-white/90 mt-0.5">
                  {isRTL
                    ? 'ابدأ رحلتك المالية الذكية اليوم.'
                    : 'Start your financial journey today.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenCreateGoal();
                  }}
                  className="clay-white-btn mt-2.5 px-3 py-1.5 rounded-[11px] text-[12px] font-extrabold text-[#1E1B26] cursor-pointer"
                >
                  {isRTL ? 'إنشاء هدف' : 'Create Goal'}
                </button>
              </div>
              <img
                src="/assets/fintrack/piggy_bank.png"
                alt=""
                referrerPolicy="no-referrer"
                className={`w-[78px] h-[78px] object-contain shrink-0 drop-shadow-[0_6px_10px_rgba(38,18,110,0.3)] ${
                  isRTL ? '-scale-x-100' : ''
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP VERTICAL CLAYMORPHIC SIDEBAR (>= 1024px) */}
      <aside className="hidden lg:flex clay-sidebar w-[216px] xl:w-[224px] shrink-0 rounded-[28px] p-4 flex-col justify-between select-none">
        {/* Top Brand + Nav List */}
        <div>
          {/* FinTrack Brand Lockup */}
          <button
            type="button"
            onClick={() => onSelectSection('Dashboard')}
            className="flex items-center gap-3 px-2 pt-2 pb-5 w-full text-start group focus:outline-none cursor-pointer"
          >
            <div className="clay-purple-logo w-10 h-10 rounded-[13px] flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <span className="text-[22px] font-extrabold tracking-tight text-[#1E1B26] whitespace-nowrap">
              FinTrack
            </span>
          </button>

          {/* Navigation Items */}
          <nav
            className="space-y-1 mt-1"
            aria-label={isRTL ? 'القائمة الرئيسية' : 'Primary Navigation'}
          >
            {NAV_ITEMS.map(({ label, icon: Icon }) => {
              const isActive = activeSection === label;
              const displayLabel = NAV_SECTION_LABELS[label][lang];
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onSelectSection(label)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-[16px] text-[14px] transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'clay-purple-active text-white font-bold'
                      : 'text-[#2C2733] hover:bg-[#EFE9E3]/70 font-semibold'
                  }`}
                >
                  <Icon
                    className={`w-[19px] h-[19px] shrink-0 ${
                      isActive ? 'text-white stroke-[2.3]' : 'text-[#2C2733] stroke-[1.9]'
                    }`}
                  />
                  <span className="truncate">{displayLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom 3D Clay Promo Card */}
        <div className="relative mt-4 pt-1">
          <div className="clay-promo-card rounded-[24px] p-4 pb-5 text-white relative overflow-visible min-h-[214px] flex flex-col justify-between">
            <div className="relative z-10 pe-6">
              {isRTL ? (
                <>
                  <h3 className="text-[17px] font-extrabold leading-[1.35] text-white">
                    وفّر أكثر،
                    <br />
                    وحقّق أكثر!
                  </h3>
                  <p className="text-[12.5px] leading-[1.45] text-white/90 mt-2 font-medium max-w-[122px]">
                    ابدأ رحلتك المالية الذكية اليوم.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-[16px] font-bold leading-[1.25] tracking-tight text-white">
                    Save more,
                    <br />
                    Achieve more!
                  </h3>
                  <p className="text-[12px] leading-[1.35] text-white/90 mt-2 font-medium max-w-[115px]">
                    Start your financial journey today.
                  </p>
                </>
              )}
            </div>

            <div className="relative z-20 mt-6">
              <button
                type="button"
                onClick={onOpenCreateGoal}
                className="clay-white-btn px-3.5 py-2 rounded-[13px] text-[12.5px] font-extrabold text-[#1E1B26] hover:scale-[1.03] active:scale-[0.98] transition-transform whitespace-nowrap cursor-pointer"
              >
                {isRTL ? 'إنشاء هدف' : 'Create Goal'}
              </button>
            </div>

            {/* 3D Clay Pink Piggy Bank & Gold Coins (Mirrored cleanly for RTL) */}
            <img
              src="/assets/fintrack/piggy_bank.png"
              alt={isRTL ? 'حصالة نقود ثلاثية الأبعاد' : '3D Clay Piggy Bank with Gold Coins'}
              referrerPolicy="no-referrer"
              className={`w-[100px] xl:w-[104px] h-auto object-contain absolute -bottom-2.5 z-10 pointer-events-none select-none drop-shadow-[0_8px_12px_rgba(38,18,110,0.32)] ${
                isRTL ? '-left-2.5 -scale-x-100' : '-right-2.5'
              }`}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
