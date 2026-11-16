import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  formatINR,
  GoalItem,
  Language,
  CATEGORY_AR_MAP,
} from '../data/financeData';

interface CreateGoalModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: {
    title: string;
    titleAr: string;
    saved: number;
    target: number;
    icon: string;
    barColor: 'purple' | 'green';
    deadline: string;
    deadlineAr: string;
  }) => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  lang,
  isOpen,
  onClose,
  onCreateGoal,
}) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('100000');
  const [saved, setSaved] = useState('15000');
  const [iconChoice, setIconChoice] = useState<'bali' | 'laptop'>('bali');
  const [barColor, setBarColor] = useState<'purple' | 'green'>('purple');

  if (!isOpen) return null;
  const isRTL = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle =
      title.trim() || (isRTL ? 'صندوق الطوارئ' : 'Emergency Reserve');
    const targetNum = Math.max(1000, Number(target) || 100000);
    const savedNum = Math.min(targetNum, Math.max(0, Number(saved) || 0));

    onCreateGoal({
      title: cleanTitle,
      titleAr: cleanTitle,
      saved: savedNum,
      target: targetNum,
      icon:
        iconChoice === 'bali'
          ? '/assets/fintrack/goal_bali.png'
          : '/assets/fintrack/goal_laptop.png',
      barColor,
      deadline: 'Dec 2026',
      deadlineAr: 'ديسمبر 2026',
    });
    setTitle('');
    onClose();
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B26]/35 backdrop-blur-[2px] p-4"
    >
      <div className="clay-card w-full max-w-[420px] rounded-[26px] p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[19px] font-extrabold text-[#1E1B26]">
            {isRTL ? 'إنشاء هدف ادخار جديد' : 'Create Financial Goal'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="clay-pill-btn w-8 h-8 rounded-full flex items-center justify-center text-[#5A534E] hover:text-[#1E1B26] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
              {isRTL ? 'اسم الهدف' : 'Goal Title'}
            </label>
            <input
              type="text"
              required
              placeholder={
                isRTL ? 'مثال: رحلة خريف اليابان' : 'e.g., Japan Autumn Trip'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="clay-pill-input w-full px-4 py-2.5 rounded-[14px] text-[14px] text-[#1E1B26] focus:outline-none focus:ring-2 focus:ring-[#7357F6]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
                {isRTL ? 'المبلغ المستهدف (₹)' : 'Target Amount (₹)'}
              </label>
              <input
                type="number"
                min={1000}
                step={500}
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="clay-pill-input w-full px-3.5 py-2.5 rounded-[14px] text-[14px] font-semibold tabular-nums text-[#1E1B26] focus:outline-none focus:ring-2 focus:ring-[#7357F6]/40"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
                {isRTL ? 'المبلغ المدّخر حالياً (₹)' : 'Initial Saved (₹)'}
              </label>
              <input
                type="number"
                min={0}
                step={500}
                required
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                className="clay-pill-input w-full px-3.5 py-2.5 rounded-[14px] text-[14px] font-semibold tabular-nums text-[#1E1B26] focus:outline-none focus:ring-2 focus:ring-[#7357F6]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
                {isRTL ? 'أيقونة ثلاثية الأبعاد' : '3D Clay Icon'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIconChoice('bali')}
                  className={`flex-1 py-2 px-3 rounded-[14px] flex items-center justify-center gap-2 text-[12px] font-semibold cursor-pointer ${
                    iconChoice === 'bali'
                      ? 'ring-2 ring-[#7357F6] bg-white'
                      : 'clay-inner-card text-[#5A534E]'
                  }`}
                >
                  <img
                    src="/assets/fintrack/goal_bali.png"
                    alt="Travel"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 object-contain"
                  />
                  {isRTL ? 'سفر' : 'Travel'}
                </button>
                <button
                  type="button"
                  onClick={() => setIconChoice('laptop')}
                  className={`flex-1 py-2 px-3 rounded-[14px] flex items-center justify-center gap-2 text-[12px] font-semibold cursor-pointer ${
                    iconChoice === 'laptop'
                      ? 'ring-2 ring-[#7357F6] bg-white'
                      : 'clay-inner-card text-[#5A534E]'
                  }`}
                >
                  <img
                    src="/assets/fintrack/goal_laptop.png"
                    alt="Tech"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 object-contain"
                  />
                  {isRTL ? 'تقنية' : 'Gadget'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
                {isRTL ? 'لون المؤشر' : 'Bar Color'}
              </label>
              <div className="flex items-center gap-2 h-[40px]">
                <button
                  type="button"
                  onClick={() => setBarColor('purple')}
                  className={`flex-1 h-full rounded-[14px] text-[12px] font-bold text-white clay-bar-purple cursor-pointer ${
                    barColor === 'purple'
                      ? 'ring-2 ring-offset-2 ring-[#7357F6]'
                      : 'opacity-70'
                  }`}
                >
                  {isRTL ? 'بنفسجي' : 'Purple'}
                </button>
                <button
                  type="button"
                  onClick={() => setBarColor('green')}
                  className={`flex-1 h-full rounded-[14px] text-[12px] font-bold text-white clay-bar-green cursor-pointer ${
                    barColor === 'green'
                      ? 'ring-2 ring-offset-2 ring-[#3AA969]'
                      : 'opacity-70'
                  }`}
                >
                  {isRTL ? 'أخضر' : 'Green'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="clay-pill-btn px-4 py-2.5 rounded-[14px] text-[13px] font-semibold text-[#4A433E] cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="clay-purple-active px-5 py-2.5 rounded-[14px] text-[13px] font-bold text-white cursor-pointer"
            >
              {isRTL ? 'حفظ الهدف' : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddTransactionModalProps {
  lang: Language;
  isOpen: boolean;
  initialType?: 'expense' | 'income';
  onClose: () => void;
  onAddTransaction: (tx: {
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
  }) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  lang,
  isOpen,
  initialType = 'expense',
  onClose,
  onAddTransaction,
}) => {
  const [type, setType] = useState<'expense' | 'income'>(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('850');
  const [category, setCategory] = useState('Food & Dining');

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
    }
  }, [initialType, isOpen]);

  if (!isOpen) return null;
  const isRTL = lang === 'ar';

  const iconForCategory = (cat: string, txType: 'expense' | 'income') => {
    if (txType === 'income') return '/assets/fintrack/tx_wallet.png';
    if (cat === 'Food & Dining') return '/assets/fintrack/tx_coffee.png';
    if (cat === 'Transport') return '/assets/fintrack/tx_car.png';
    if (cat === 'Shopping') return '/assets/fintrack/tx_bag.png';
    return '/assets/fintrack/tx_wallet.png';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Math.max(1, Number(amount) || 500);
    const signedAmount = type === 'income' ? numeric : -numeric;
    const finalCategory = type === 'income' ? 'Income' : category;
    const defaultEn = type === 'income' ? 'Bonus Deposit' : 'Coffee & Snacks';
    const defaultAr = type === 'income' ? 'مكافأة إيداع' : 'قهوة ووجبات خفيفة';
    const finalTitle = title.trim() || (isRTL ? defaultAr : defaultEn);

    onAddTransaction({
      title: finalTitle,
      titleAr: finalTitle,
      category: finalCategory,
      categoryAr: CATEGORY_AR_MAP[finalCategory] || finalCategory,
      amount: signedAmount,
      dateLabel: 'Just now',
      dateLabelAr: 'الآن',
      icon: iconForCategory(finalCategory, type),
      account: 'HDFC Platinum',
      accountAr: 'بطاقة HDFC بلاتينوم',
    });
    setTitle('');
    onClose();
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B26]/35 backdrop-blur-[2px] p-4"
    >
      <div className="clay-card w-full max-w-[420px] rounded-[26px] p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[19px] font-extrabold text-[#1E1B26]">
            {isRTL ? 'تسجيل معاملة جديدة' : 'Record Transaction'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="clay-pill-btn w-8 h-8 rounded-full flex items-center justify-center text-[#5A534E] hover:text-[#1E1B26] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 rounded-[16px] clay-inner-card">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-[13px] text-[13px] font-bold transition-all cursor-pointer ${
                type === 'expense'
                  ? 'clay-purple-active text-white'
                  : 'text-[#5A534E] hover:text-[#1E1B26]'
              }`}
            >
              {isRTL ? 'مصروف (-)' : 'Expense (-)'}
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-[13px] text-[13px] font-bold transition-all cursor-pointer ${
                type === 'income'
                  ? 'clay-bar-green text-white'
                  : 'text-[#5A534E] hover:text-[#1E1B26]'
              }`}
            >
              {isRTL ? 'دخل (+)' : 'Income (+)'}
            </button>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
              {isRTL ? 'الوصف' : 'Description'}
            </label>
            <input
              type="text"
              required
              placeholder={
                type === 'income'
                  ? isRTL
                    ? 'مثال: استشارات تقنية'
                    : 'e.g., Client Consulting'
                  : isRTL
                  ? 'مثال: قهوة ستاربكس'
                  : 'e.g., Starbucks Coffee'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="clay-pill-input w-full px-4 py-2.5 rounded-[14px] text-[14px] text-[#1E1B26] focus:outline-none focus:ring-2 focus:ring-[#7357F6]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
                {isRTL ? 'المبلغ (₹)' : 'Amount (₹)'}
              </label>
              <input
                type="number"
                min={1}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="clay-pill-input w-full px-3.5 py-2.5 rounded-[14px] text-[14px] font-bold tabular-nums text-[#1E1B26] focus:outline-none focus:ring-2 focus:ring-[#7357F6]/40"
              />
            </div>

            {type === 'expense' ? (
              <div>
                <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
                  {isRTL ? 'الفئة' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="clay-pill-input w-full px-3 py-2.5 rounded-[14px] text-[13px] font-semibold text-[#1E1B26] focus:outline-none"
                >
                  <option value="Food & Dining">
                    {isRTL ? 'الطعام والمطاعم' : 'Food & Dining'}
                  </option>
                  <option value="Transport">
                    {isRTL ? 'المواصلات' : 'Transport'}
                  </option>
                  <option value="Shopping">
                    {isRTL ? 'التسوق' : 'Shopping'}
                  </option>
                  <option value="Housing">
                    {isRTL ? 'السكن والإيجار' : 'Housing'}
                  </option>
                  <option value="Entertainment">
                    {isRTL ? 'الترفيه' : 'Entertainment'}
                  </option>
                  <option value="Others">{isRTL ? 'أخرى' : 'Others'}</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
                  {isRTL ? 'حساب الإيداع' : 'Deposit Account'}
                </label>
                <div className="clay-pill-input px-3.5 py-2.5 rounded-[14px] text-[13px] font-semibold text-[#1E1B26]">
                  {isRTL ? 'حساب راتب ICICI' : 'ICICI Salary Vault'}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="clay-pill-btn px-4 py-2.5 rounded-[14px] text-[13px] font-semibold text-[#4A433E] cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="clay-purple-active px-5 py-2.5 rounded-[14px] text-[13px] font-bold text-white cursor-pointer"
            >
              {isRTL
                ? type === 'income'
                  ? 'إضافة دخل'
                  : 'إضافة مصروف'
                : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface TopUpGoalModalProps {
  lang: Language;
  goal: GoalItem | null;
  onClose: () => void;
  onConfirmTopUp: (goalId: string, addAmount: number) => void;
}

export const TopUpGoalModal: React.FC<TopUpGoalModalProps> = ({
  lang,
  goal,
  onClose,
  onConfirmTopUp,
}) => {
  const [amount, setAmount] = useState('5000');

  if (!goal) return null;
  const isRTL = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Math.max(500, Number(amount) || 5000);
    onConfirmTopUp(goal.id, numeric);
    onClose();
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1B26]/35 backdrop-blur-[2px] p-4"
    >
      <div className="clay-card w-full max-w-[380px] rounded-[26px] p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={goal.icon}
              alt={isRTL ? goal.titleAr : goal.title}
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h3 className="text-[17px] font-extrabold text-[#1E1B26]">
                {isRTL ? goal.titleAr : goal.title}
              </h3>
              <p className="text-[12px] text-[#5A534E] tabular-nums">
                <span dir="ltr">
                  {formatINR(goal.saved)} / {formatINR(goal.target)}
                </span>{' '}
                {isRTL ? 'تم ادخاره' : 'saved'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="clay-pill-btn w-8 h-8 rounded-full flex items-center justify-center text-[#5A534E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#5A534E] mb-1.5">
              {isRTL ? 'مبلغ الإضافة للهدف (₹)' : 'Contribution Amount (₹)'}
            </label>
            <input
              type="number"
              min={100}
              step={500}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="clay-pill-input w-full px-4 py-2.5 rounded-[14px] text-[15px] font-bold tabular-nums text-[#1E1B26] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {[2500, 5000, 10000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                dir="ltr"
                className="clay-pill-btn flex-1 py-1.5 rounded-[11px] text-[12px] font-bold tabular-nums text-[#3B3542] hover:bg-white cursor-pointer"
              >
                +{formatINR(preset)}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="clay-pill-btn px-4 py-2 rounded-[13px] text-[13px] font-semibold text-[#4A433E] cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="clay-purple-active px-5 py-2 rounded-[13px] text-[13px] font-bold text-white cursor-pointer"
            >
              {isRTL ? 'إضافة للهدف' : 'Add to Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
