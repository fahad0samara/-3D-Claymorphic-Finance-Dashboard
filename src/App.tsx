/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Bell,
  MoreVertical,
  ChevronDown,
  Check,
  Globe,
  Trophy,
  X,
  RotateCcw,
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import {
  CreateGoalModal,
  AddTransactionModal,
  TopUpGoalModal,
} from './components/FinanceModals';
import { SecondaryViews } from './components/SecondaryViews';
import { IncomeExpenseChart } from './components/IncomeExpenseChart';
import { GoalProgressCard, getMilestoneTier } from './components/GoalProgressCard';
import {
  Language,
  NavSection,
  PERIOD_LABELS,
  INITIAL_SPENDING_BY_PERIOD,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
  INITIAL_ACCOUNTS,
  INITIAL_MONTHLY_CASHFLOW,
  INITIAL_NOTIFICATION_ALERTS,
  SMART_TIPS,
  GoalItem,
  formatINR,
} from './data/financeData';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const isRTL = lang === 'ar';

  const [activeSection, setActiveSection] = useState<NavSection>('Dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Month');
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Financial state
  const [spendingByPeriod, setSpendingByPeriod] = useState(
    INITIAL_SPENDING_BY_PERIOD
  );
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [accounts] = useState(INITIAL_ACCOUNTS);
  const [notifications, setNotifications] = useState(
    INITIAL_NOTIFICATION_ALERTS
  );

  // Interactive UI states
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [openKpiMenu, setOpenKpiMenu] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [dismissedTipIds, setDismissedTipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fintrack_dismissed_tips');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSmartTipHidden, setIsSmartTipHidden] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fintrack_smart_tip_hidden') === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Milestone Gamification States
  const [createGoalOpen, setCreateGoalOpen] = useState(false);
  const [addTxModal, setAddTxModal] = useState<{
    open: boolean;
    type: 'expense' | 'income';
  }>({
    open: false,
    type: 'expense',
  });
  const [topUpGoal, setTopUpGoal] = useState<GoalItem | null>(null);
  const [celebratingGoalId, setCelebratingGoalId] = useState<string | null>(
    null
  );
  const [milestoneToast, setMilestoneToast] = useState<{
    goalTitle: string;
    goalTitleAr: string;
    tier: 50 | 75 | 100;
  } | null>(null);

  // Sync document direction & language attribute
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [isRTL, lang]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const currentCategories =
    spendingByPeriod[selectedPeriod] || spendingByPeriod['This Month'];

  const periodTotalExpenses = useMemo(
    () => currentCategories.reduce((sum, item) => sum + item.amount, 0),
    [currentCategories]
  );

  const thisMonthExpenses = useMemo(
    () =>
      (spendingByPeriod['This Month'] || []).reduce(
        (sum, item) => sum + item.amount,
        0
      ),
    [spendingByPeriod]
  );

  const sessionIncomeDelta = useMemo(
    () =>
      transactions
        .slice(0, transactions.length - INITIAL_TRANSACTIONS.length)
        .filter((t) => t.amount > 0)
        .reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalIncome = 120850 + sessionIncomeDelta;
  const totalExpenses = thisMonthExpenses;
  const savingsThisMonth = Math.max(0, totalIncome - totalExpenses);
  const totalBalance = 245680 + sessionIncomeDelta - (totalExpenses - 78900);

  const activeCategory = useMemo(() => {
    const targetId = hoveredCategoryId || selectedCategoryId;
    if (!targetId) return null;
    return currentCategories.find((c) => c.id === targetId) || null;
  }, [hoveredCategoryId, selectedCategoryId, currentCategories]);

  // Filtered recent transactions for dashboard card (supports both Arabic & English search)
  const visibleRecentTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions
      .filter((tx) => {
        const matchesSearch =
          !q ||
          tx.title.toLowerCase().includes(q) ||
          tx.titleAr.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.categoryAr.toLowerCase().includes(q);
        const matchesCategory =
          !selectedCategoryId ||
          currentCategories.find((c) => c.id === selectedCategoryId)?.name ===
            tx.category;
        return matchesSearch && matchesCategory;
      })
      .slice(0, 4);
  }, [transactions, searchQuery, selectedCategoryId, currentCategories]);

  // Visible goals on dashboard card (supports Arabic & English search)
  const visibleGoals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = !q
      ? goals
      : goals.filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.titleAr.toLowerCase().includes(q)
        );
    return list.slice(0, 2);
  }, [goals, searchQuery]);

  // Handlers
  const handleAddTransaction = (newTx: {
    title: string;
    titleAr: string;
    category: string;
    categoryAr: string;
    amount: number;
    dateLabel: string;
    dateLabelAr: string;
    icon: string;
    account: string;
    accountAr: string;
  }) => {
    const txItem = {
      id: `tx-${Date.now()}`,
      ...newTx,
    };
    setTransactions((prev) => [txItem, ...prev]);

    // Also push a live notification to the notification bell
    const isInc = newTx.amount > 0;
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: isInc ? 'New Income Recorded' : 'New Expense Logged',
        titleAr: isInc ? 'تم تسجيل دخل جديد' : 'تم تسجيل مصروف جديد',
        body: `${newTx.title} (${isInc ? '+' : '-'}${formatINR(newTx.amount)})`,
        bodyAr: `${newTx.titleAr} (${isInc ? '+' : '-'}${formatINR(newTx.amount)})`,
        time: 'Just now',
        timeAr: 'الآن',
        unread: true,
      },
      ...prev,
    ]);

    if (newTx.amount < 0) {
      const expenseAbs = Math.abs(newTx.amount);
      setSpendingByPeriod((prev) => {
        const updateList = (list: typeof currentCategories) => {
          const updatedRaw = list.map((cat) =>
            cat.name === newTx.category
              ? { ...cat, amount: cat.amount + expenseAbs }
              : cat
          );
          const newSum = updatedRaw.reduce((s, c) => s + c.amount, 0);
          return updatedRaw.map((cat) => ({
            ...cat,
            percentage: Math.round((cat.amount / newSum) * 100),
          }));
        };

        const nextState: Record<string, typeof currentCategories> = {
          ...prev,
          'This Month': updateList(prev['This Month']),
        };
        if (selectedPeriod !== 'This Month' && prev[selectedPeriod]) {
          nextState[selectedPeriod] = updateList(prev[selectedPeriod]);
        }
        return nextState;
      });
    }
  };

  const handleCreateGoal = (newGoal: {
    title: string;
    titleAr: string;
    saved: number;
    target: number;
    icon: string;
    barColor: 'purple' | 'green';
    deadline: string;
    deadlineAr: string;
  }) => {
    const created: GoalItem = {
      id: `goal-${Date.now()}`,
      ...newGoal,
    };
    setGoals((prev) => [created, ...prev]);
  };

  const handleTopUpGoal = (goalId: string, addAmount: number) => {
    const targetGoal = goals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    const prevPct = Math.min(
      100,
      Math.round((targetGoal.saved / Math.max(1, targetGoal.target)) * 100)
    );
    const nextSaved = Math.min(targetGoal.target, targetGoal.saved + addAmount);
    const nextPct = Math.min(
      100,
      Math.round((nextSaved / Math.max(1, targetGoal.target)) * 100)
    );

    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, saved: nextSaved } : g))
    );

    // Highlight the goal card with 3D pulse animation
    setCelebratingGoalId(goalId);
    window.setTimeout(() => {
      setCelebratingGoalId((curr) => (curr === goalId ? null : curr));
    }, 2000);

    // Check if user crossed a significant milestone (50%, 75%, or 100%)
    const prevTier = getMilestoneTier(prevPct) || 0;
    const nextTier = getMilestoneTier(nextPct);

    if (nextTier && nextTier > prevTier) {
      setMilestoneToast({
        goalTitle: targetGoal.title,
        goalTitleAr: targetGoal.titleAr,
        tier: nextTier,
      });
      window.setTimeout(() => {
        setMilestoneToast(null);
      }, 4200);

      // Push milestone celebration into the Notification Bell
      setNotifications((prev) => [
        {
          id: `notif-ms-${Date.now()}`,
          title:
            nextTier === 100
              ? `Goal Completed: ${targetGoal.title}! 🏆`
              : `${nextTier}% Milestone Reached! 🎉`,
          titleAr:
            nextTier === 100
              ? `اكتمل الهدف بالكامل: ${targetGoal.titleAr}! 🏆`
              : `تم الوصول إلى محطة ${nextTier}% في الهدف! 🎉`,
          body: `You reached ${nextPct}% (${formatINR(nextSaved)} / ${formatINR(
            targetGoal.target
          )}) on ${targetGoal.title}.`,
          bodyAr: `وصلت إلى نسبة ${nextPct}% (${formatINR(
            nextSaved
          )} من أصل ${formatINR(targetGoal.target)}) في هدف "${
            targetGoal.titleAr
          }".`,
          time: 'Just now',
          timeAr: 'الآن',
          unread: true,
        },
        ...prev,
      ]);
    }
  };

  const handleUpdateBudgetLimit = (categoryId: string, newLimit: number) => {
    setSpendingByPeriod((prev) => ({
      ...prev,
      [selectedPeriod]: (prev[selectedPeriod] || prev['This Month']).map((c) =>
        c.id === categoryId ? { ...c, budgetLimit: newLimit } : c
      ),
    }));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Persist user's Smart Tip dismissal preferences in local state & localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'fintrack_dismissed_tips',
        JSON.stringify(dismissedTipIds)
      );
      localStorage.setItem(
        'fintrack_smart_tip_hidden',
        String(isSmartTipHidden)
      );
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [dismissedTipIds, isSmartTipHidden]);

  const availableTips = useMemo(
    () => SMART_TIPS.filter((tip) => !dismissedTipIds.includes(tip.id)),
    [dismissedTipIds]
  );

  const currentTip =
    availableTips.length > 0
      ? availableTips[activeTipIndex % availableTips.length]
      : null;

  const handleDismissCurrentTip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTip) {
      setDismissedTipIds((prev) =>
        prev.includes(currentTip.id) ? prev : [...prev, currentTip.id]
      );
    }
    setIsSmartTipHidden(true);
  };

  const handleRestoreSmartTips = () => {
    if (availableTips.length === 0) {
      setDismissedTipIds([]);
      setActiveTipIndex(0);
    }
    setIsSmartTipHidden(false);
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="clay-canvas min-h-screen w-full flex items-start lg:items-center justify-center p-2.5 sm:p-4 lg:p-6"
      onClick={() => {
        setOpenKpiMenu(null);
        setPeriodMenuOpen(false);
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
      }}
    >
      {/* Main Responsive Workspace Shell with full RTL & LTR support */}
      <div className="w-full max-w-[1340px] flex flex-col lg:flex-row gap-4 lg:gap-5 relative">
        {/* Claymorphic Sidebar (Compact top bar on <1024px, vertical sidebar on >=1024px) */}
        <Sidebar
          lang={lang}
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
          onOpenCreateGoal={() => setCreateGoalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-between relative min-w-0">
          {/* Top Bar: Greeting + Search + Language Switcher + Bell + 3D Avatar */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pt-0.5 pb-4 relative z-40">
            <div className="min-w-0">
              <h1 className="text-[24px] sm:text-[28px] xl:text-[31px] font-extrabold tracking-tight text-[#1B1822] flex items-center gap-2 leading-tight">
                <span>{isRTL ? 'صباح الخير!' : 'Good morning!'}</span>
                <span className="inline-block select-none" aria-hidden="true">
                  👋
                </span>
              </h1>
              <p className="text-[13px] sm:text-[13.5px] font-medium text-[#3F3A37] mt-0.5">
                {isRTL
                  ? 'إليك ملخص حركتك المالية وأدائك اليوم.'
                  : "Here's what's happening with your finances today."}
              </p>
            </div>

            {/* Search, Language Toggle, Notification Bell & Avatar Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Claymorphic Search Pill */}
              <div
                className="clay-pill-input flex-1 md:flex-initial md:w-[205px] xl:w-[225px] h-[44px] sm:h-[46px] rounded-full px-3.5 sm:px-4 flex items-center gap-2 min-w-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Search className="w-[17px] h-[17px] text-[#3B3532] stroke-[2.2] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? 'بحث...' : 'Search...'}
                  aria-label={isRTL ? 'البحث في المعاملات' : 'Search finances'}
                  className="bg-transparent w-full text-[13px] sm:text-[13.5px] font-medium text-[#1E1B26] placeholder-[#8C837D] focus:outline-none min-w-0"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] font-bold text-[#7357F6] cursor-pointer shrink-0"
                  >
                    {isRTL ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Bilingual Direction & Language Switcher Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLanguage();
                  }}
                  title={
                    isRTL
                      ? 'Switch to English (LTR)'
                      : 'التبديل إلى العربية (RTL)'
                  }
                  className="clay-pill-input h-[44px] sm:h-[46px] px-3 sm:px-3.5 rounded-full flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-extrabold text-[#1E1B26] hover:scale-105 transition-transform cursor-pointer shrink-0"
                >
                  <Globe className="w-4 h-4 text-[#6D50EB]" />
                  <span>{isRTL ? 'EN' : 'عربي'}</span>
                </button>

                {/* Claymorphic Notification Bell Button & Full Arabic Popover */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileMenuOpen(false);
                    }}
                    aria-label={isRTL ? 'الإشعارات والتنبيهات' : 'Notifications'}
                    className="clay-pill-input w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] rounded-full flex items-center justify-center relative hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Bell className="w-[20px] h-[20px] sm:w-[21px] sm:h-[21px] text-[#1E1B26] stroke-[2.1]" />
                    {unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E85C4A] text-white text-[10px] font-extrabold flex items-center justify-center absolute -top-0.5 -end-0.5 shadow-sm border border-[#FAF6F3]">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div
                      className={`clay-card w-[calc(100vw-2rem)] max-w-[340px] rounded-[22px] p-4 absolute top-[54px] z-50 space-y-3 border border-white/80 ${
                        isRTL ? 'left-0' : 'right-0'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8E0DA]">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-[#6D50EB]" />
                          <span className="text-[13.5px] sm:text-[14px] font-extrabold text-[#1E1B26]">
                            {isRTL
                              ? 'مركز الإشعارات المالية'
                              : 'Financial Notifications'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleMarkAllNotificationsRead}
                          className="text-[11.5px] font-bold text-[#1F8E5A] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {isRTL ? 'تحديد الكل كمقروء' : 'Mark all read'}
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[260px] overflow-y-auto pe-0.5">
                        {notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              setNotifications((prev) =>
                                prev.map((n) =>
                                  n.id === item.id ? { ...n, unread: false } : n
                                )
                              )
                            }
                            className={`p-3 rounded-[14px] transition-colors cursor-pointer ${
                              item.unread
                                ? 'bg-white/90 ring-1 ring-[#7357F6]/25'
                                : 'bg-white/50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[12.5px] font-extrabold text-[#1E1B26]">
                                {isRTL ? item.titleAr : item.title}
                              </span>
                              <span className="text-[10.5px] font-semibold text-[#7A706A] shrink-0">
                                {isRTL ? item.timeAr : item.time}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#3F3A37] mt-1 leading-relaxed">
                              {isRTL ? item.bodyAr : item.body}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1 border-t border-[#E8E0DA] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSection('Transactions');
                            setNotificationsOpen(false);
                          }}
                          className="text-[12px] font-bold text-[#6D50EB] hover:underline cursor-pointer"
                        >
                          {isRTL
                            ? 'عرض سجل المعاملات الكامل'
                            : 'View all activity'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddTxModal({ open: true, type: 'expense' });
                            setNotificationsOpen(false);
                          }}
                          className="clay-purple-active px-3 py-1 rounded-[10px] text-[11.5px] font-bold text-white cursor-pointer"
                        >
                          {isRTL ? '+ معاملة جديدة' : '+ New Entry'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3D Clay User Avatar Button */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(!profileMenuOpen);
                      setNotificationsOpen(false);
                    }}
                    aria-label={isRTL ? 'الملف الشخصي' : 'Account profile'}
                    className="w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer focus:outline-none"
                  >
                    <img
                      src="/assets/fintrack/avatar.png"
                      alt={isRTL ? 'الصورة الشخصية' : 'User Profile Avatar'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain drop-shadow-[0_6px_10px_rgba(90,65,180,0.28)]"
                    />
                  </button>

                  {profileMenuOpen && (
                    <div
                      className={`clay-card w-[235px] rounded-[20px] p-4 absolute top-[54px] z-50 space-y-2.5 ${
                        isRTL ? 'left-0' : 'right-0'
                      }`}
                    >
                      <div className="pb-2 border-b border-[#E8E0DA]">
                        <p className="text-[14px] font-extrabold text-[#1E1B26]">
                          {isRTL ? 'فهد السمارة' : 'Fahad Samara'}
                        </p>
                        <p className="text-[11.5px] text-[#6E655F]">
                          {isRTL
                            ? 'عضوية FinTrack الذهبية'
                            : 'FinTrack Pro Member'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection('Accounts');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-start px-3 py-1.5 rounded-[10px] text-[12.5px] font-semibold text-[#2C2733] hover:bg-white/70 cursor-pointer"
                      >
                        {isRTL
                          ? 'الحسابات البنكية المرتبطة'
                          : 'Connected Bank Accounts'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection('Settings');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-start px-3 py-1.5 rounded-[10px] text-[12.5px] font-semibold text-[#2C2733] hover:bg-white/70 cursor-pointer"
                      >
                        {isRTL ? 'الإعدادات والتنبيهات' : 'Preferences & Alerts'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Milestone Celebration Floating Clay Banner */}
          {milestoneToast && (
            <div className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="clay-card rounded-[20px] px-5 py-3 flex items-center gap-3.5 border-2 border-[#F5B638] shadow-xl pointer-events-auto max-w-lg">
                <div className="clay-bar-gold w-10 h-10 rounded-[13px] flex items-center justify-center text-[#1E1B26] shrink-0">
                  <Trophy className="w-5 h-5 stroke-[2.4]" />
                </div>
                <div>
                  <p className="text-[13.5px] font-extrabold text-[#1E1B26]">
                    {milestoneToast.tier === 100
                      ? isRTL
                        ? `مبارك! اكتمل هدف "${milestoneToast.goalTitleAr}" بنسبة 100%! 🏆`
                        : `Congratulations! "${milestoneToast.goalTitle}" is 100% funded! 🏆`
                      : isRTL
                      ? `إنجاز جديد! تجاوزت محطة ${milestoneToast.tier}% في "${milestoneToast.goalTitleAr}"! 🎉`
                      : `Milestone Unlocked! Reached ${milestoneToast.tier}% on "${milestoneToast.goalTitle}"! 🎉`}
                  </p>
                  <p className="text-[11.5px] font-semibold text-[#5A534E]">
                    {isRTL
                      ? 'تم تحديث شريط التقدم وإضافة وسام الإنجاز إلى هدفك.'
                      : 'Your progress bar has been upgraded with a milestone badge.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Main Body: Dashboard vs Secondary Views */}
          {activeSection !== 'Dashboard' ? (
            <div className="flex-1 relative z-20">
              <SecondaryViews
                lang={lang}
                onToggleLang={toggleLanguage}
                section={activeSection}
                accounts={accounts}
                transactions={transactions}
                categories={currentCategories}
                goals={goals}
                celebratingGoalId={celebratingGoalId}
                onOpenAddTx={(type) => setAddTxModal({ open: true, type })}
                onOpenCreateGoal={() => setCreateGoalOpen(true)}
                onSelectGoalTopUp={(g) => setTopUpGoal(g)}
                onQuickBoostGoal={handleTopUpGoal}
                onUpdateBudgetLimit={handleUpdateBudgetLimit}
                onBackToDashboard={() => setActiveSection('Dashboard')}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4">
              {/* ROW 1: 4 Claymorphic KPI Cards (Responsive 1 -> 2 -> 4 columns with safe icon padding) */}
              <section
                aria-label={
                  isRTL ? 'المؤشرات المالية الرئيسية' : 'Key Financial Metrics'
                }
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-20"
              >
                {/* Card 1: Total Balance */}
                <div className="clay-card clay-card-hover rounded-[22px] p-4 pb-3.5 relative min-h-[148px] flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[13.5px] font-bold text-[#1E1B26] truncate">
                      {isRTL ? 'إجمالي الرصيد' : 'Total Balance'}
                    </span>
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenKpiMenu(
                            openKpiMenu === 'balance' ? null : 'balance'
                          )
                        }
                        aria-label={
                          isRTL ? 'خيارات إجمالي الرصيد' : 'Total Balance options'
                        }
                        className="p-1 rounded-full text-[#3B3532] hover:bg-black/5 cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openKpiMenu === 'balance' && (
                        <div
                          className={`clay-card rounded-[14px] p-1.5 w-36 absolute top-7 z-40 text-[12px] font-semibold ${
                            isRTL ? 'left-0' : 'right-0'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSection('Accounts');
                              setOpenKpiMenu(null);
                            }}
                            className="w-full text-start px-2.5 py-1.5 rounded-[9px] hover:bg-white/80 cursor-pointer"
                          >
                            {isRTL ? 'عرض الحسابات' : 'View Accounts'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAddTxModal({ open: true, type: 'income' });
                              setOpenKpiMenu(null);
                            }}
                            className="w-full text-start px-2.5 py-1.5 rounded-[9px] hover:bg-white/80 cursor-pointer"
                          >
                            {isRTL ? 'إيداع رصيد' : 'Add Funds'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="my-1 relative z-10 pe-[66px] xl:pe-[74px]">
                    <p
                      dir="ltr"
                      className="text-[20px] xl:text-[23px] font-extrabold tracking-tight text-[#18151F] tabular-nums inline-block"
                    >
                      {formatINR(totalBalance)}
                    </p>
                  </div>

                  <div className="relative z-10 pe-[66px] xl:pe-[74px]">
                    <p
                      dir="ltr"
                      className="text-[12px] font-bold text-[#1F8E5A] tabular-nums inline-flex items-center gap-0.5"
                    >
                      <span>↑ 12.5%</span>
                    </p>
                    <p className="text-[11px] font-medium text-[#4A4440] mt-0.5 truncate">
                      {isRTL ? 'مقارنة بالشهر الماضي' : 'vs last month'}
                    </p>
                  </div>

                  <img
                    src="/assets/fintrack/wallet.png"
                    alt={isRTL ? 'محفظة ثلاثية الأبعاد' : '3D Purple Wallet'}
                    referrerPolicy="no-referrer"
                    className={`w-[68px] xl:w-[76px] h-[82px] xl:h-[90px] object-contain absolute bottom-1.5 pointer-events-none select-none ${
                      isRTL ? 'left-2' : 'right-2'
                    }`}
                  />
                </div>

                {/* Card 2: Total Income */}
                <div className="clay-card clay-card-hover rounded-[22px] p-4 pb-3.5 relative min-h-[148px] flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[13.5px] font-bold text-[#1E1B26] truncate">
                      {isRTL ? 'إجمالي الدخل' : 'Total Income'}
                    </span>
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenKpiMenu(
                            openKpiMenu === 'income' ? null : 'income'
                          )
                        }
                        aria-label={
                          isRTL ? 'خيارات إجمالي الدخل' : 'Total Income options'
                        }
                        className="p-1 rounded-full text-[#3B3532] hover:bg-black/5 cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openKpiMenu === 'income' && (
                        <div
                          className={`clay-card rounded-[14px] p-1.5 w-36 absolute top-7 z-40 text-[12px] font-semibold ${
                            isRTL ? 'left-0' : 'right-0'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setAddTxModal({ open: true, type: 'income' });
                              setOpenKpiMenu(null);
                            }}
                            className="w-full text-start px-2.5 py-1.5 rounded-[9px] hover:bg-white/80 cursor-pointer"
                          >
                            {isRTL ? 'تسجيل دخل جديد' : 'Record Income'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="my-1 relative z-10 pe-[66px] xl:pe-[74px]">
                    <p
                      dir="ltr"
                      className="text-[20px] xl:text-[23px] font-extrabold tracking-tight text-[#18151F] tabular-nums inline-block"
                    >
                      {formatINR(totalIncome)}
                    </p>
                  </div>

                  <div className="relative z-10 pe-[66px] xl:pe-[74px]">
                    <p
                      dir="ltr"
                      className="text-[12px] font-bold text-[#1F8E5A] tabular-nums inline-flex items-center gap-0.5"
                    >
                      <span>↑ 8.3%</span>
                    </p>
                    <p className="text-[11px] font-medium text-[#4A4440] mt-0.5 truncate">
                      {isRTL ? 'مقارنة بالشهر الماضي' : 'vs last month'}
                    </p>
                  </div>

                  <img
                    src="/assets/fintrack/money_bag.png"
                    alt={isRTL ? 'كيس نقود ثلاثي الأبعاد' : '3D Green Rupee Money Bag'}
                    referrerPolicy="no-referrer"
                    className={`w-[66px] xl:w-[74px] h-[84px] xl:h-[92px] object-contain absolute bottom-1.5 pointer-events-none select-none ${
                      isRTL ? 'left-2' : 'right-2'
                    }`}
                  />
                </div>

                {/* Card 3: Total Expenses */}
                <div className="clay-card clay-card-hover rounded-[22px] p-4 pb-3.5 relative min-h-[148px] flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[13.5px] font-bold text-[#1E1B26] truncate">
                      {isRTL ? 'إجمالي المصروفات' : 'Total Expenses'}
                    </span>
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenKpiMenu(
                            openKpiMenu === 'expenses' ? null : 'expenses'
                          )
                        }
                        aria-label={
                          isRTL
                            ? 'خيارات إجمالي المصروفات'
                            : 'Total Expenses options'
                        }
                        className="p-1 rounded-full text-[#3B3532] hover:bg-black/5 cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openKpiMenu === 'expenses' && (
                        <div
                          className={`clay-card rounded-[14px] p-1.5 w-36 absolute top-7 z-40 text-[12px] font-semibold ${
                            isRTL ? 'left-0' : 'right-0'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setAddTxModal({ open: true, type: 'expense' });
                              setOpenKpiMenu(null);
                            }}
                            className="w-full text-start px-2.5 py-1.5 rounded-[9px] hover:bg-white/80 cursor-pointer"
                          >
                            {isRTL ? 'تسجيل مصروف' : 'Log Expense'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSection('Budget');
                              setOpenKpiMenu(null);
                            }}
                            className="w-full text-start px-2.5 py-1.5 rounded-[9px] hover:bg-white/80 cursor-pointer"
                          >
                            {isRTL ? 'تعديل الميزانيات' : 'Adjust Budgets'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="my-1 relative z-10 pe-[66px] xl:pe-[74px]">
                    <p
                      dir="ltr"
                      className="text-[20px] xl:text-[23px] font-extrabold tracking-tight text-[#18151F] tabular-nums inline-block"
                    >
                      {formatINR(totalExpenses)}
                    </p>
                  </div>

                  <div className="relative z-10 pe-[66px] xl:pe-[74px]">
                    <p
                      dir="ltr"
                      className="text-[12px] font-bold text-[#1F8E5A] tabular-nums inline-flex items-center gap-0.5"
                    >
                      <span>↑ 5.2%</span>
                    </p>
                    <p className="text-[11px] font-medium text-[#4A4440] mt-0.5 truncate">
                      {isRTL ? 'مقارنة بالشهر الماضي' : 'vs last month'}
                    </p>
                  </div>

                  <img
                    src="/assets/fintrack/shopping_bag.png"
                    alt={
                      isRTL
                        ? 'حقيبة تسوق ثلاثية الأبعاد'
                        : '3D Coral Pink Shopping Bag'
                    }
                    referrerPolicy="no-referrer"
                    className={`w-[64px] xl:w-[72px] h-[84px] xl:h-[92px] object-contain absolute bottom-1.5 pointer-events-none select-none ${
                      isRTL ? 'left-2' : 'right-2'
                    }`}
                  />
                </div>

                {/* Card 4: Savings This Month */}
                <div className="clay-card clay-card-hover rounded-[22px] p-4 pb-3.5 relative min-h-[148px] flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[13.5px] font-bold text-[#1E1B26] truncate">
                      {isRTL ? 'ادخار هذا الشهر' : 'Savings This Month'}
                    </span>
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenKpiMenu(
                            openKpiMenu === 'savings' ? null : 'savings'
                          )
                        }
                        aria-label={
                          isRTL ? 'خيارات الادخار' : 'Savings options'
                        }
                        className="p-1 rounded-full text-[#3B3532] hover:bg-black/5 cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openKpiMenu === 'savings' && (
                        <div
                          className={`clay-card rounded-[14px] p-1.5 w-36 absolute top-7 z-40 text-[12px] font-semibold ${
                            isRTL ? 'left-0' : 'right-0'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setTopUpGoal(goals[0] || null);
                              setOpenKpiMenu(null);
                            }}
                            className="w-full text-start px-2.5 py-1.5 rounded-[9px] hover:bg-white/80 cursor-pointer"
                          >
                            {isRTL ? 'تخصيص لهدف ادخار' : 'Allocate to Goal'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="my-1 relative z-10 pe-[66px] xl:pe-[74px]">
                    <p
                      dir="ltr"
                      className="text-[20px] xl:text-[23px] font-extrabold tracking-tight text-[#18151F] tabular-nums inline-block"
                    >
                      {formatINR(savingsThisMonth)}
                    </p>
                  </div>

                  <div className="relative z-10 pe-[66px] xl:pe-[74px]">
                    <p
                      dir="ltr"
                      className="text-[12px] font-bold text-[#1F8E5A] tabular-nums inline-flex items-center gap-0.5"
                    >
                      <span>↑ 15.8%</span>
                    </p>
                    <p className="text-[11px] font-medium text-[#4A4440] mt-0.5 truncate">
                      {isRTL ? 'مقارنة بالشهر الماضي' : 'vs last month'}
                    </p>
                  </div>

                  <img
                    src="/assets/fintrack/coins.png"
                    alt={isRTL ? 'عملات ذهبية ثلاثية الأبعاد' : '3D Gold Coins Stack'}
                    referrerPolicy="no-referrer"
                    className={`w-[66px] xl:w-[74px] h-[72px] xl:h-[78px] object-contain absolute bottom-1.5 pointer-events-none select-none ${
                      isRTL ? 'left-2' : 'right-2'
                    }`}
                  />
                </div>
              </section>

              {/* MIDDLE & BOTTOM BENTO STAGE: 8-Col Data Cards + 4-Col 3D Character Desk & Smart Tip */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative z-20">
                {/* START 8 COLUMNS: Spending Overview + Recent Transactions (Top) & Goals Progress (Bottom) */}
                <div className="lg:col-span-8 flex flex-col gap-4 justify-between min-w-0">
                  {/* Top Pair: Spending Overview + Recent Transactions */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 items-stretch">
                    {/* Spending Overview Card (7 of 12 cols inside the 8-col container) */}
                    <div className="md:col-span-7 clay-card rounded-[24px] p-4 sm:p-5 flex flex-col justify-between min-h-[288px]">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-[16px] sm:text-[16.5px] font-extrabold text-[#1E1B26]">
                          {isRTL ? 'نظرة عامة على الإنفاق' : 'Spending Overview'}
                        </h2>

                        {/* Period Dropdown Pill */}
                        <div
                          className="relative shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setPeriodMenuOpen(!periodMenuOpen)}
                            className="clay-pill-btn px-3 py-1 rounded-full text-[11.5px] font-bold text-[#2C2733] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          >
                            <span>
                              {PERIOD_LABELS[selectedPeriod]?.[lang] ||
                                selectedPeriod}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-[#5A534E]" />
                          </button>

                          {periodMenuOpen && (
                            <div
                              className={`clay-card rounded-[14px] p-1.5 w-36 absolute top-8 z-40 space-y-0.5 ${
                                isRTL ? 'left-0' : 'right-0'
                              }`}
                            >
                              {Object.keys(spendingByPeriod).map((period) => (
                                <button
                                  key={period}
                                  type="button"
                                  onClick={() => {
                                    setSelectedPeriod(period);
                                    setPeriodMenuOpen(false);
                                  }}
                                  className={`w-full text-start px-2.5 py-1.5 rounded-[9px] text-[12px] font-semibold cursor-pointer ${
                                    selectedPeriod === period
                                      ? 'clay-purple-active text-white'
                                      : 'text-[#2C2733] hover:bg-white/80'
                                  }`}
                                >
                                  {PERIOD_LABELS[period]?.[lang] || period}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Donut Chart + Category Legend Split */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 my-auto pt-2">
                        {/* 3D Clay Donut Chart with Interactive Center Readout */}
                        <div className="relative w-[158px] xl:w-[172px] h-[168px] xl:h-[184px] shrink-0 flex items-center justify-center select-none">
                          <img
                            src="/assets/fintrack/donut_3d.png"
                            alt={
                              isRTL
                                ? 'مخطط دائري ثلاثي الأبعاد للإنفاق'
                                : '3D Clay Spending Donut Chart'
                            }
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain pointer-events-none"
                          />
                          {/* Dynamic Center Label inside the 3D Donut Ring */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-1">
                            <span className="text-[12px] font-bold text-[#3B3532] leading-tight truncate max-w-[90px]">
                              {activeCategory
                                ? isRTL
                                  ? activeCategory.nameAr
                                  : activeCategory.name
                                : isRTL
                                ? 'الإجمالي'
                                : 'Total'}
                            </span>
                            <span
                              dir="ltr"
                              className="text-[17px] xl:text-[18px] font-extrabold text-[#18151F] tabular-nums tracking-tight mt-0.5"
                            >
                              {formatINR(
                                activeCategory
                                  ? activeCategory.amount
                                  : periodTotalExpenses
                              )}
                            </span>
                            {activeCategory && (
                              <span className="text-[10px] font-bold text-[#6D50EB] tabular-nums">
                                {activeCategory.percentage}%{' '}
                                {isRTL ? 'من الإنفاق' : 'share'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 6 Category Breakdown Rows */}
                        <div className="flex-1 w-full space-y-2 min-w-0">
                          {currentCategories.map((cat) => {
                            const isSelected = selectedCategoryId === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onMouseEnter={() => setHoveredCategoryId(cat.id)}
                                onMouseLeave={() => setHoveredCategoryId(null)}
                                onClick={() =>
                                  setSelectedCategoryId(
                                    isSelected ? null : cat.id
                                  )
                                }
                                className={`w-full flex items-center justify-between gap-2 text-start px-1.5 py-0.5 rounded-[9px] transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#7357F6]/12 ring-1 ring-[#7357F6]/30'
                                    : 'hover:bg-black/[0.03]'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="w-[10.5px] h-[10.5px] rounded-full clay-dot shrink-0"
                                    style={{ background: cat.gradient }}
                                  />
                                  <span className="text-[12px] font-semibold text-[#2C2733] truncate">
                                    {isRTL ? cat.nameAr : cat.name}
                                  </span>
                                </div>

                                <div
                                  dir="ltr"
                                  className="flex items-center gap-2 shrink-0 tabular-nums"
                                >
                                  <span className="text-[11.5px] font-bold text-[#1E1B26]">
                                    {formatINR(cat.amount)}
                                  </span>
                                  <span className="text-[11px] font-medium text-[#5A534E] w-[26px] text-right">
                                    {cat.percentage}%
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Recent Transactions Card (5 of 12 cols inside the 8-col container) */}
                    <div className="md:col-span-5 clay-card rounded-[24px] p-4 sm:p-5 flex flex-col justify-between min-h-[288px]">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h2 className="text-[16px] sm:text-[16.5px] font-extrabold text-[#1E1B26] truncate">
                          {isRTL ? 'أحدث المعاملات' : 'Recent Transactions'}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setActiveSection('Transactions')}
                          className="clay-pill-btn px-3 py-1 rounded-full text-[11.5px] font-bold text-[#2C2733] hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                        >
                          {isRTL ? 'عرض الكل' : 'View All'}
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col justify-around space-y-2">
                        {visibleRecentTransactions.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-[13px] font-semibold text-[#5A534E]">
                              {isRTL
                                ? 'لا توجد معاملات مطابقة للبحث.'
                                : 'No matching transactions found.'}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery('');
                                setSelectedCategoryId(null);
                              }}
                              className="mt-2 text-[12px] font-bold text-[#6D50EB] underline cursor-pointer"
                            >
                              {isRTL ? 'إعادة ضبط التصفية' : 'Reset filters'}
                            </button>
                          </div>
                        ) : (
                          visibleRecentTransactions.map((tx) => {
                            const isIncome = tx.amount > 0;
                            return (
                              <div
                                key={tx.id}
                                onClick={() =>
                                  setAddTxModal({
                                    open: true,
                                    type: isIncome ? 'income' : 'expense',
                                  })
                                }
                                className="flex items-center justify-between gap-2 py-1 px-1 rounded-[14px] hover:bg-white/50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={tx.icon}
                                    alt={isRTL ? tx.titleAr : tx.title}
                                    referrerPolicy="no-referrer"
                                    className="w-[40px] h-[40px] xl:w-[44px] xl:h-[44px] object-contain shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-[12.5px] xl:text-[13px] font-bold text-[#1E1B26] truncate">
                                      {isRTL ? tx.titleAr : tx.title}
                                    </p>
                                    <p className="text-[11px] font-medium text-[#5A534E] truncate">
                                      {isRTL ? tx.categoryAr : tx.category}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-end shrink-0">
                                  <p
                                    dir="ltr"
                                    className={`text-[12.5px] xl:text-[13px] font-extrabold tabular-nums inline-block ${
                                      isIncome
                                        ? 'text-[#1F8E5A]'
                                        : 'text-[#1E1B26]'
                                    }`}
                                  >
                                    {isIncome
                                      ? `+${formatINR(tx.amount)}`
                                      : `-${formatINR(tx.amount)}`}
                                  </p>
                                  <p className="text-[10.5px] font-medium text-[#5A534E]">
                                    {isRTL ? tx.dateLabelAr : tx.dateLabel}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Card: Goals Progress (Spans full 8 columns) */}
                  <div className="clay-card rounded-[24px] p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <h2 className="text-[16px] sm:text-[16.5px] font-extrabold text-[#1E1B26]">
                        {isRTL ? 'تقدم الأهداف' : 'Goals Progress'}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveSection('Goals')}
                        className="clay-pill-btn px-3.5 py-1 rounded-full text-[11.5px] font-bold text-[#2C2733] hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {isRTL ? 'عرض كل الأهداف' : 'View All Goals'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {visibleGoals.map((goal) => (
                        <GoalProgressCard
                          key={goal.id}
                          goal={goal}
                          lang={lang}
                          compact={true}
                          isCelebrating={celebratingGoalId === goal.id}
                          onOpenTopUp={(g) => setTopUpGoal(g)}
                          onQuickBoost={handleTopUpGoal}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* END 4 COLUMNS: 3D Character Desk Scene + Smart Tip Card in front of Wooden Desk */}
                <div className="lg:col-span-4 flex flex-col justify-end relative min-w-0">
                  {/* 3D Clay Character at Wooden Desk with Laptop, Mug, Plant & Framed Art */}
                  <div
                    aria-hidden="true"
                    className="w-full flex justify-center items-end -mb-5 sm:-mb-6 relative z-10 pointer-events-none select-none"
                  >
                    <img
                      src="/assets/fintrack/character_desk.png"
                      alt=""
                      referrerPolicy="no-referrer"
                      className={`w-full max-w-[300px] sm:max-w-[330px] lg:max-w-[355px] h-auto object-contain drop-shadow-[0_14px_24px_rgba(88,68,54,0.16)] ${
                        isRTL ? '-scale-x-100' : ''
                      }`}
                    />
                  </div>

                  {/* Smart Tip Sage-Green Claymorphic Banner layered in front of the desk */}
                  {!isSmartTipHidden && currentTip ? (
                    <div
                      onClick={() => setActiveTipIndex((prev) => prev + 1)}
                      title={
                        isRTL
                          ? 'اضغط لعرض النصيحة الذكية التالية'
                          : 'Click to view next Smart Tip'
                      }
                      className="clay-smart-tip rounded-[24px] px-4 sm:px-5 py-4 flex items-center justify-between gap-3 relative z-20 cursor-pointer hover:scale-[1.01] transition-transform select-none min-h-[116px]"
                    >
                      {/* Small 'x' Button to Hide / Dismiss Current Tip */}
                      <button
                        type="button"
                        onClick={handleDismissCurrentTip}
                        aria-label={
                          isRTL
                            ? 'إخفاء النصيحة الذكية الحالية'
                            : 'Dismiss current Smart Tip'
                        }
                        title={
                          isRTL
                            ? 'إخفاء هذه النصيحة'
                            : 'Dismiss this tip'
                        }
                        className={`w-6 h-6 rounded-full bg-white/65 hover:bg-white text-[#2C2733] flex items-center justify-center shadow-sm transition-all hover:scale-110 active:scale-95 absolute top-2.5 z-30 cursor-pointer ${
                          isRTL ? 'left-2.5' : 'right-2.5'
                        }`}
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src="/assets/fintrack/tip_bulb.png"
                          alt={
                            isRTL ? 'مصباح نصيحة ذكية' : '3D Glowing Lightbulb'
                          }
                          referrerPolicy="no-referrer"
                          className="w-[50px] sm:w-[54px] h-[68px] sm:h-[72px] object-contain shrink-0 drop-shadow-[0_6px_10px_rgba(120,100,40,0.22)]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15.5px] sm:text-[16px] font-extrabold text-[#1E1B26]">
                              {isRTL ? 'نصيحة ذكية' : 'Smart Tip'}
                            </h3>
                          </div>
                          <p className="text-[12.5px] sm:text-[13px] font-semibold text-[#2A2622] mt-1 leading-snug">
                            {isRTL
                              ? currentTip.headlineAr
                              : currentTip.headline}
                          </p>
                          <p className="text-[12.5px] sm:text-[13px] font-medium text-[#2A2622] mt-1">
                            {isRTL ? currentTip.sublineAr : currentTip.subline}
                          </p>
                        </div>
                      </div>

                      <img
                        src="/assets/fintrack/tip_plant.png"
                        alt={
                          isRTL
                            ? 'نبتة مكتب ثلاثية الأبعاد'
                            : '3D Potted Succulent'
                        }
                        referrerPolicy="no-referrer"
                        className="w-[56px] sm:w-[62px] h-[62px] sm:h-[68px] object-contain shrink-0 -mb-2 pe-1"
                      />
                    </div>
                  ) : (
                    <div className="relative z-20 flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={handleRestoreSmartTips}
                        className="clay-smart-tip px-4 py-2.5 rounded-full text-[12px] font-extrabold text-[#1E1B26] flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#3A7D56]" />
                        <span>
                          {isRTL
                            ? 'إظهار النصيحة الذكية'
                            : 'Show Smart Tip'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ROW 4: 6-Month Income vs. Expenses Bar Chart Section (Recharts) */}
              <section
                aria-label={
                  isRTL
                    ? 'الدخل مقابل المصروفات خلال آخر 6 أشهر'
                    : 'Income vs Expenses Over Last 6 Months'
                }
                className="relative z-20"
              >
                <IncomeExpenseChart
                  lang={lang}
                  data={INITIAL_MONTHLY_CASHFLOW}
                  currentMonthIncome={totalIncome}
                  currentMonthExpenses={totalExpenses}
                />
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <CreateGoalModal
        lang={lang}
        isOpen={createGoalOpen}
        onClose={() => setCreateGoalOpen(false)}
        onCreateGoal={handleCreateGoal}
      />

      <AddTransactionModal
        lang={lang}
        isOpen={addTxModal.open}
        initialType={addTxModal.type}
        onClose={() => setAddTxModal((prev) => ({ ...prev, open: false }))}
        onAddTransaction={handleAddTransaction}
      />

      <TopUpGoalModal
        lang={lang}
        goal={topUpGoal}
        onClose={() => setTopUpGoal(null)}
        onConfirmTopUp={handleTopUpGoal}
      />
    </div>
  );
}
