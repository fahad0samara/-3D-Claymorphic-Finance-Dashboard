import React, { useState } from 'react';
import {
  Plus,
  ArrowUpRight,
  CheckCircle2,
  SlidersHorizontal,
  Download,
  HelpCircle,
  Mail,
  ShieldCheck,
  Bell,
  Globe,
} from 'lucide-react';
import {
  NavSection,
  NAV_SECTION_LABELS,
  AccountItem,
  TransactionItem,
  SpendingCategory,
  GoalItem,
  INITIAL_MONTHLY_CASHFLOW,
  Language,
  formatINR,
} from '../data/financeData';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { GoalProgressCard } from './GoalProgressCard';

interface SecondaryViewsProps {
  lang: Language;
  onToggleLang: () => void;
  section: NavSection;
  accounts: AccountItem[];
  transactions: TransactionItem[];
  categories: SpendingCategory[];
  goals: GoalItem[];
  celebratingGoalId?: string | null;
  onOpenAddTx: (type: 'expense' | 'income') => void;
  onOpenCreateGoal: () => void;
  onSelectGoalTopUp: (goal: GoalItem) => void;
  onQuickBoostGoal: (goalId: string, amount: number) => void;
  onUpdateBudgetLimit: (categoryId: string, newLimit: number) => void;
  onBackToDashboard: () => void;
}

export const SecondaryViews: React.FC<SecondaryViewsProps> = ({
  lang,
  onToggleLang,
  section,
  accounts,
  transactions,
  categories,
  goals,
  celebratingGoalId,
  onOpenAddTx,
  onOpenCreateGoal,
  onSelectGoalTopUp,
  onQuickBoostGoal,
  onUpdateBudgetLimit,
  onBackToDashboard,
}) => {
  const [txFilter, setTxFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');

  const isRTL = lang === 'ar';

  if (section === 'Accounts') {
    const totalBalance = accounts.reduce((acc, item) => acc + item.balance, 0);
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#1E1B26]">
              {isRTL ? 'الحسابات البنكية المرتبطة' : 'Connected Accounts'}
            </h2>
            <p className="text-[13px] text-[#5A534E]">
              {isRTL ? 'إجمالي السيولة المتاحة: ' : 'Combined Liquidity: '}
              <span dir="ltr" className="font-bold tabular-nums text-[#1E1B26] inline-block">
                {formatINR(totalBalance)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenAddTx('income')}
              className="clay-purple-active px-4 py-2 rounded-[14px] text-[13px] font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {isRTL ? 'إيداع أموال' : 'Deposit Funds'}
            </button>
            <button
              type="button"
              onClick={onBackToDashboard}
              className="clay-pill-btn px-3.5 py-2 rounded-[14px] text-[12px] font-bold text-[#2C2733] cursor-pointer"
            >
              {isRTL ? 'لوحة التحكم' : 'Overview'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="clay-card clay-card-hover rounded-[24px] p-5 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[12px] font-semibold text-[#6E655F]">
                    {isRTL ? `${acc.institutionAr} · ${acc.typeAr}` : `${acc.institution} · ${acc.type}`}
                  </span>
                  <h3 className="text-[17px] font-extrabold text-[#1E1B26] mt-0.5">
                    {isRTL ? acc.nameAr : acc.name}
                  </h3>
                  <p dir="ltr" className="text-[12px] font-medium text-[#7A706A] mt-0.5 tabular-nums inline-block">
                    {acc.numberMasked}
                  </p>
                </div>
                <img
                  src={acc.icon}
                  alt={isRTL ? acc.nameAr : acc.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="mt-5 pt-4 border-t border-[#E6DFD9] flex items-baseline justify-between">
                <span dir="ltr" className="text-[24px] font-extrabold tabular-nums text-[#1E1B26]">
                  {formatINR(acc.balance)}
                </span>
                <span className="text-[12px] font-bold text-[#1F8E5A] tabular-nums">
                  {isRTL
                    ? `↑ ${acc.changePercent}% مقارنة بالشهر الماضي`
                    : `↑ ${acc.changePercent}% vs last month`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'Transactions') {
    const filtered = transactions.filter((t) => {
      if (txFilter === 'income') return t.amount > 0;
      if (txFilter === 'expense') return t.amount < 0;
      return true;
    });

    const filterLabels: Record<'all' | 'expense' | 'income', string> = {
      all: isRTL ? 'الكل' : 'All',
      expense: isRTL ? 'المصروفات' : 'Expense',
      income: isRTL ? 'الدخل' : 'Income',
    };

    return (
      <div className="clay-card rounded-[24px] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-extrabold text-[#1E1B26]">
              {isRTL ? 'جميع المعاملات المالية' : 'All Transactions'}
            </h2>
            <p className="text-[13px] text-[#5A534E]">
              {isRTL
                ? 'سجل كامل لجميع الحركات المالية عبر حساباتك'
                : 'Complete ledger across your connected accounts'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="clay-inner-card p-1 rounded-[14px] flex items-center gap-1">
              {(['all', 'expense', 'income'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTxFilter(f)}
                  className={`px-3 py-1.5 rounded-[11px] text-[12px] font-bold transition-colors cursor-pointer ${
                    txFilter === f
                      ? 'clay-purple-active text-white'
                      : 'text-[#5A534E] hover:text-[#1E1B26]'
                  }`}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onOpenAddTx('expense')}
              className="clay-purple-active px-4 py-2 rounded-[14px] text-[12px] font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {isRTL ? 'إضافة معاملة' : 'Add Entry'}
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#E9E2DC]">
          {filtered.map((tx) => {
            const isIncome = tx.amount > 0;
            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={tx.icon}
                    alt={isRTL ? tx.titleAr : tx.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-contain shrink-0"
                  />
                  <div>
                    <p className="text-[15px] font-bold text-[#1E1B26]">
                      {isRTL ? tx.titleAr : tx.title}
                    </p>
                    <p className="text-[12px] text-[#6E655F]">
                      {isRTL
                        ? `${tx.categoryAr} · ${tx.accountAr}`
                        : `${tx.category} · ${tx.account}`}
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <p
                    dir="ltr"
                    className={`text-[15px] font-extrabold tabular-nums inline-block ${
                      isIncome ? 'text-[#1F8E5A]' : 'text-[#1E1B26]'
                    }`}
                  >
                    {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                  </p>
                  <p className="text-[12px] text-[#6E655F]">
                    {isRTL ? tx.dateLabelAr : tx.dateLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (section === 'Budget') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#1E1B26]">
              {isRTL ? 'ميزانيات الفئات الشهرية' : 'Monthly Category Budgets'}
            </h2>
            <p className="text-[13px] text-[#5A534E]">
              {isRTL
                ? 'اضغط على أي سقف ميزانية لتعديل الحد الشهري المسموح'
                : 'Click any budget cap to adjust your monthly limit'}
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="clay-pill-btn px-3.5 py-2 rounded-[14px] text-[12px] font-bold text-[#2C2733] cursor-pointer"
          >
            {isRTL ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const pct = Math.min(
              100,
              Math.round((cat.amount / cat.budgetLimit) * 100)
            );
            const isEditing = editingBudgetId === cat.id;
            return (
              <div key={cat.id} className="clay-card rounded-[22px] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full clay-dot shrink-0"
                      style={{ background: cat.gradient }}
                    />
                    <span className="text-[16px] font-extrabold text-[#1E1B26]">
                      {isRTL ? cat.nameAr : cat.name}
                    </span>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        className="clay-pill-input w-24 px-2.5 py-1 rounded-[10px] text-[12px] font-bold tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateBudgetLimit(
                            cat.id,
                            Math.max(1000, Number(budgetInput) || cat.budgetLimit)
                          );
                          setEditingBudgetId(null);
                        }}
                        className="clay-purple-active px-2.5 py-1 rounded-[10px] text-[11px] font-bold text-white cursor-pointer"
                      >
                        {isRTL ? 'حفظ' : 'Save'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBudgetId(cat.id);
                        setBudgetInput(String(cat.budgetLimit));
                      }}
                      className="clay-pill-btn px-2.5 py-1 rounded-[10px] text-[12px] font-semibold text-[#5A534E] hover:text-[#1E1B26] flex items-center gap-1 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>{isRTL ? 'الحد:' : 'Cap:'}</span>
                      <span dir="ltr">{formatINR(cat.budgetLimit)}</span>
                    </button>
                  )}
                </div>

                <div className="clay-track h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, background: cat.gradient }}
                  />
                </div>

                <div className="flex items-center justify-between text-[12px] font-semibold text-[#5A534E] tabular-nums">
                  <span>
                    {isRTL ? 'المُنفق: ' : 'Spent: '}
                    <strong dir="ltr" className="inline-block">
                      {formatINR(cat.amount)}
                    </strong>
                  </span>
                  <span>
                    {pct}% {isRTL ? 'من الميزانية الشهرية' : 'of monthly budget'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (section === 'Goals') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#1E1B26]">
              {isRTL ? 'أهداف الادخار' : 'Savings Goals'}
            </h2>
            <p className="text-[13px] text-[#5A534E]">
              {isRTL
                ? 'تتبع إنجازاتك وأضف مساهمات مباشرة نحو أهدافك المالية'
                : 'Track milestones and contribute directly toward your targets'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCreateGoal}
            className="clay-purple-active px-4 py-2 rounded-[14px] text-[13px] font-bold text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {isRTL ? 'إنشاء هدف' : 'Create Goal'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <GoalProgressCard
              key={g.id}
              goal={g}
              lang={lang}
              compact={false}
              isCelebrating={celebratingGoalId === g.id}
              onOpenTopUp={(goal) => onSelectGoalTopUp(goal)}
              onQuickBoost={onQuickBoostGoal}
            />
          ))}
        </div>
      </div>
    );
  }

  if (section === 'Investments' || section === 'Reports') {
    const portfolioItems = [
      {
        name: 'Nifty 50 Index Direct Plan',
        nameAr: 'صندوق مؤشر نيفتي 50 المباشر',
        value: 112400,
        gain: '+16.4%',
        allocation: '48%',
      },
      {
        name: 'Sovereign Gold Tranche VIII',
        nameAr: 'سندات الذهب السيادية - الإصدار الثامن',
        value: 64200,
        gain: '+12.8%',
        allocation: '28%',
      },
      {
        name: 'Flexi-Cap Growth Equity',
        nameAr: 'محفظة الأسهم المرنة للنمو',
        value: 55800,
        gain: '+19.1%',
        allocation: '24%',
      },
    ];
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#1E1B26]">
              {section === 'Investments'
                ? isRTL
                  ? 'المحفظة الاستثمارية'
                  : 'Investment Portfolio'
                : isRTL
                ? 'التقارير المالية الشهرية'
                : 'Monthly Financial Reports'}
            </h2>
            <p className="text-[13px] text-[#5A534E]">
              {isRTL ? 'معدل صافي الادخار: ' : 'Net Savings Rate: '}
              <span className="font-bold text-[#1F8E5A]">
                {isRTL ? '34.7% من الدخل الشهري' : '34.7% of Monthly Income'}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="clay-pill-btn px-3.5 py-2 rounded-[14px] text-[12px] font-bold text-[#2C2733] flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isRTL ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolioItems.map((item) => (
            <div key={item.name} className="clay-card rounded-[22px] p-5 space-y-3">
              <span className="text-[12px] font-semibold text-[#6E655F]">
                {isRTL ? `نسبة التوزيع · ${item.allocation}` : `Allocation · ${item.allocation}`}
              </span>
              <h3 className="text-[16px] font-extrabold text-[#1E1B26]">
                {isRTL ? item.nameAr : item.name}
              </h3>
              <div className="flex items-baseline justify-between pt-2">
                <span dir="ltr" className="text-[22px] font-extrabold tabular-nums text-[#1E1B26]">
                  {formatINR(item.value)}
                </span>
                <span dir="ltr" className="text-[13px] font-bold text-[#1F8E5A] tabular-nums flex items-center gap-0.5">
                  <ArrowUpRight className="w-4 h-4" /> {item.gain}
                </span>
              </div>
            </div>
          ))}
        </div>

        <IncomeExpenseChart
          lang={lang}
          data={INITIAL_MONTHLY_CASHFLOW}
          currentMonthIncome={120850}
          currentMonthExpenses={78900}
        />
      </div>
    );
  }

  return (
    <div className="clay-card rounded-[24px] p-6 space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-extrabold text-[#1E1B26]">
            {NAV_SECTION_LABELS[section][lang]}
          </h2>
          <p className="text-[13px] text-[#5A534E]">
            {section === 'Settings'
              ? isRTL
                ? 'إدارة اللغة، والتنبيهات الذكية، وتفضيلات الادخار التلقائي'
                : 'Manage your language, alerts, and automated savings preferences'
              : isRTL
              ? 'احصل على المساعدة حول حسابات FinTrack وأتمتة الأهداف والأمان'
              : 'Get help with FinTrack accounts, goal automation, and security'}
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToDashboard}
          className="clay-pill-btn px-3.5 py-2 rounded-[14px] text-[12px] font-bold text-[#2C2733] cursor-pointer"
        >
          {isRTL ? 'لوحة التحكم' : 'Dashboard'}
        </button>
      </div>

      {section === 'Settings' ? (
        <div className="space-y-3">
          {/* Language Switcher Row */}
          <div className="clay-inner-card rounded-[18px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#6D50EB]" />
              <div>
                <p className="text-[14px] font-bold text-[#1E1B26]">
                  {isRTL ? 'لغة التطبيق واتجاه العرض' : 'App Language & Direction'}
                </p>
                <p className="text-[12px] text-[#6E655F]">
                  {isRTL
                    ? 'العربية (من اليمين إلى اليسار RTL)'
                    : 'English (Left-to-Right LTR)'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleLang}
              className="clay-purple-active px-3.5 py-1.5 rounded-[12px] text-[12px] font-bold text-white cursor-pointer"
            >
              {isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
            </button>
          </div>

          <div className="clay-inner-card rounded-[18px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#6D50EB]" />
              <div>
                <p className="text-[14px] font-bold text-[#1E1B26]">
                  {isRTL ? 'تنبيهات النصائح الذكية والميزانية' : 'Smart Tip & Budget Alerts'}
                </p>
                <p className="text-[12px] text-[#6E655F]">
                  {isRTL
                    ? 'إرسال إشعار عندما يتجاوز الادخار الشهري نسبة 15%'
                    : 'Notify when monthly savings exceed 15%'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`px-3.5 py-1.5 rounded-[12px] text-[12px] font-bold cursor-pointer ${
                notificationsEnabled
                  ? 'clay-purple-active text-white'
                  : 'clay-pill-btn text-[#5A534E]'
              }`}
            >
              {notificationsEnabled
                ? isRTL
                  ? 'مفعّل'
                  : 'Enabled'
                : isRTL
                ? 'صامت'
                : 'Muted'}
            </button>
          </div>

          <div className="clay-inner-card rounded-[18px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1F8E5A]" />
              <div>
                <p className="text-[14px] font-bold text-[#1E1B26]">
                  {isRTL
                    ? 'تحويل الفائض تلقائياً لهدف عطلة بالي'
                    : 'Auto-Sweep Surplus to Bali Goal'}
                </p>
                <p className="text-[12px] text-[#6E655F]">
                  {isRTL
                    ? 'تحويل المبلغ المتبقي من ميزانية المطاعم تلقائياً نهاية الشهر'
                    : 'Automatically allocate unspent dining budget at month-end'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className={`px-3.5 py-1.5 rounded-[12px] text-[12px] font-bold cursor-pointer ${
                autoSaveEnabled
                  ? 'clay-bar-green text-white'
                  : 'clay-pill-btn text-[#5A534E]'
              }`}
            >
              {autoSaveEnabled
                ? isRTL
                  ? 'نشط'
                  : 'Active'
                : isRTL
                ? 'متوقف'
                : 'Paused'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="clay-inner-card rounded-[18px] p-4 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#6D50EB] shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-bold text-[#1E1B26]">
                {isRTL
                  ? 'كيف يتم احتساب ادخاري الشهري؟'
                  : 'How are my monthly savings calculated?'}
              </p>
              <p className="text-[12px] text-[#5A534E] mt-1">
                {isRTL
                  ? 'يساوي الادخار الشهري إجمالي الدخل مطروحاً منه إجمالي المصروفات للفترة المحددة، مع مقارنة أدائك تلقائياً بالشهر الماضي.'
                  : 'Monthly Savings equals your Total Income minus Total Expenses for the selected period, automatically tracking your progress against last month.'}
              </p>
            </div>
          </div>
          <div className="clay-inner-card rounded-[18px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6D50EB]" />
              <div>
                <p className="text-[14px] font-bold text-[#1E1B26]">
                  {isRTL ? 'دعم فني مالي سريع' : 'Priority Concierge Support'}
                </p>
                <p className="text-[12px] text-[#5A534E]">
                  {isRTL
                    ? 'استجابة خلال ساعتين لجميع استفسارات الحسابات البنكية'
                    : 'Response within 2 hours for connected account inquiries'}
                </p>
              </div>
            </div>
            <span className="text-[12px] font-bold text-[#1F8E5A] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {isRTL ? 'مشمول' : 'Covered'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
