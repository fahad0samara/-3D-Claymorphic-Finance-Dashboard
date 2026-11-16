export type Language = 'ar' | 'en';

export type NavSection =
  | 'Dashboard'
  | 'Accounts'
  | 'Transactions'
  | 'Budget'
  | 'Goals'
  | 'Investments'
  | 'Reports'
  | 'Settings'
  | 'Help & Support';

export const NAV_SECTION_LABELS: Record<NavSection, { ar: string; en: string }> = {
  Dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  Accounts: { ar: 'الحسابات', en: 'Accounts' },
  Transactions: { ar: 'المعاملات', en: 'Transactions' },
  Budget: { ar: 'الميزانية', en: 'Budget' },
  Goals: { ar: 'الأهداف', en: 'Goals' },
  Investments: { ar: 'الاستثمارات', en: 'Investments' },
  Reports: { ar: 'التقارير', en: 'Reports' },
  Settings: { ar: 'الإعدادات', en: 'Settings' },
  'Help & Support': { ar: 'المساعدة والدعم', en: 'Help & Support' },
};

export interface SpendingCategory {
  id: string;
  name: string;
  nameAr: string;
  amount: number;
  percentage: number;
  color: string;
  gradient: string;
  budgetLimit: number;
}

export interface TransactionItem {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  amount: number; // positive for income, negative for expense
  dateLabel: string;
  dateLabelAr: string;
  icon: string;
  account: string;
  accountAr: string;
}

export interface GoalItem {
  id: string;
  title: string;
  titleAr: string;
  saved: number;
  target: number;
  icon: string;
  barColor: 'purple' | 'green';
  deadline: string;
  deadlineAr: string;
}

export interface AccountItem {
  id: string;
  name: string;
  nameAr: string;
  institution: string;
  institutionAr: string;
  numberMasked: string;
  balance: number;
  changePercent: number;
  type: 'Checking' | 'Savings' | 'Credit' | 'Investment';
  typeAr: string;
  icon: string;
}

export interface SmartTipItem {
  id: string;
  headline: string;
  headlineAr: string;
  subline: string;
  sublineAr: string;
}

export interface NotificationAlertItem {
  id: string;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  time: string;
  timeAr: string;
  unread: boolean;
}

export interface MonthlyCashflowItem {
  month: string;
  monthAr: string;
  fullMonth: string;
  fullMonthAr: string;
  income: number;
  expenses: number;
  savings: number;
}

export const PERIOD_LABELS: Record<string, { ar: string; en: string }> = {
  'This Month': { ar: 'هذا الشهر', en: 'This Month' },
  'Last Month': { ar: 'الشهر الماضي', en: 'Last Month' },
  'This Quarter': { ar: 'هذا الربع', en: 'This Quarter' },
};

export const CATEGORY_AR_MAP: Record<string, string> = {
  Housing: 'السكن والإيجار',
  'Food & Dining': 'الطعام والمطاعم',
  Transport: 'المواصلات',
  Shopping: 'التسوق',
  Entertainment: 'الترفيه',
  Others: 'أخرى',
  Income: 'الدخل والراتب',
};

export const INITIAL_NOTIFICATION_ALERTS: NotificationAlertItem[] = [
  {
    id: 'notif-1',
    title: 'Salary Credited',
    titleAr: 'تم إيداع الراتب الشهري',
    body: '+₹85,000 received from ABC Ltd. into Salary Vault.',
    bodyAr: 'تم استلام +₹85,000 من شركة ABC المحدودة في حساب الراتب.',
    time: '2 hours ago',
    timeAr: 'منذ ساعتين',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Savings Milestone Reached',
    titleAr: 'تحقيق إنجاز جديد في الادخار',
    body: "You're saving 15.8% more this month compared to last month!",
    bodyAr: 'لقد ادخرت بنسبة 15.8% أكثر هذا الشهر مقارنة بالشهر الماضي!',
    time: '5 hours ago',
    timeAr: 'منذ 5 ساعات',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Bali Vacation Goal at 60%',
    titleAr: 'هدف عطلة بالي وصل إلى 60%',
    body: '₹60,000 saved out of ₹1,00,000 target.',
    bodyAr: 'تم توفير ₹60,000 من إجمالي الهدف ₹1,00,000.',
    time: 'Yesterday',
    timeAr: 'أمس',
    unread: false,
  },
];

export const INITIAL_MONTHLY_CASHFLOW: MonthlyCashflowItem[] = [
  {
    month: 'Jun',
    monthAr: 'يونيو',
    fullMonth: 'June 2026',
    fullMonthAr: 'يونيو 2026',
    income: 105000,
    expenses: 71200,
    savings: 33800,
  },
  {
    month: 'Jul',
    monthAr: 'يوليو',
    fullMonth: 'July 2026',
    fullMonthAr: 'يوليو 2026',
    income: 108500,
    expenses: 74800,
    savings: 33700,
  },
  {
    month: 'Aug',
    monthAr: 'أغسطس',
    fullMonth: 'August 2026',
    fullMonthAr: 'أغسطس 2026',
    income: 112000,
    expenses: 69500,
    savings: 42500,
  },
  {
    month: 'Sep',
    monthAr: 'سبتمبر',
    fullMonth: 'September 2026',
    fullMonthAr: 'سبتمبر 2026',
    income: 110400,
    expenses: 76300,
    savings: 34100,
  },
  {
    month: 'Oct',
    monthAr: 'أكتوبر',
    fullMonth: 'October 2026',
    fullMonthAr: 'أكتوبر 2026',
    income: 115200,
    expenses: 74900,
    savings: 40300,
  },
  {
    month: 'Nov',
    monthAr: 'نوفمبر',
    fullMonth: 'November 2026',
    fullMonthAr: 'نوفمبر 2026',
    income: 120850,
    expenses: 78900,
    savings: 41950,
  },
];

export function formatINR(value: number): string {
  const abs = Math.abs(Math.round(value));
  return '₹' + abs.toLocaleString('en-IN');
}

export const INITIAL_SPENDING_BY_PERIOD: Record<string, SpendingCategory[]> = {
  'This Month': [
    {
      id: 'housing',
      name: 'Housing',
      nameAr: 'السكن والإيجار',
      amount: 25000,
      percentage: 31,
      color: '#7B61FF',
      gradient: 'linear-gradient(145deg, #9882FF 0%, #684CE6 100%)',
      budgetLimit: 28000,
    },
    {
      id: 'food',
      name: 'Food & Dining',
      nameAr: 'الطعام والمطاعم',
      amount: 18600,
      percentage: 24,
      color: '#46B978',
      gradient: 'linear-gradient(145deg, #62D292 0%, #349E62 100%)',
      budgetLimit: 20000,
    },
    {
      id: 'transport',
      name: 'Transport',
      nameAr: 'المواصلات',
      amount: 12300,
      percentage: 16,
      color: '#F5BE41',
      gradient: 'linear-gradient(145deg, #FFD262 0%, #E0A324 100%)',
      budgetLimit: 15000,
    },
    {
      id: 'shopping',
      name: 'Shopping',
      nameAr: 'التسوق',
      amount: 10500,
      percentage: 13,
      color: '#F47C7C',
      gradient: 'linear-gradient(145deg, #FF9999 0%, #DF5C5C 100%)',
      budgetLimit: 12000,
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      nameAr: 'الترفيه',
      amount: 6500,
      percentage: 8,
      color: '#4F7DF3',
      gradient: 'linear-gradient(145deg, #6E98FF 0%, #3964D8 100%)',
      budgetLimit: 8000,
    },
    {
      id: 'others',
      name: 'Others',
      nameAr: 'أخرى',
      amount: 6000,
      percentage: 8,
      color: '#5E7CE2',
      gradient: 'linear-gradient(145deg, #7C97F5 0%, #4662C7 100%)',
      budgetLimit: 8000,
    },
  ],
  'Last Month': [
    {
      id: 'housing',
      name: 'Housing',
      nameAr: 'السكن والإيجار',
      amount: 25000,
      percentage: 33,
      color: '#7B61FF',
      gradient: 'linear-gradient(145deg, #9882FF 0%, #684CE6 100%)',
      budgetLimit: 28000,
    },
    {
      id: 'food',
      name: 'Food & Dining',
      nameAr: 'الطعام والمطاعم',
      amount: 16900,
      percentage: 23,
      color: '#46B978',
      gradient: 'linear-gradient(145deg, #62D292 0%, #349E62 100%)',
      budgetLimit: 20000,
    },
    {
      id: 'transport',
      name: 'Transport',
      nameAr: 'المواصلات',
      amount: 11400,
      percentage: 15,
      color: '#F5BE41',
      gradient: 'linear-gradient(145deg, #FFD262 0%, #E0A324 100%)',
      budgetLimit: 15000,
    },
    {
      id: 'shopping',
      name: 'Shopping',
      nameAr: 'التسوق',
      amount: 9800,
      percentage: 13,
      color: '#F47C7C',
      gradient: 'linear-gradient(145deg, #FF9999 0%, #DF5C5C 100%)',
      budgetLimit: 12000,
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      nameAr: 'الترفيه',
      amount: 6200,
      percentage: 8,
      color: '#4F7DF3',
      gradient: 'linear-gradient(145deg, #6E98FF 0%, #3964D8 100%)',
      budgetLimit: 8000,
    },
    {
      id: 'others',
      name: 'Others',
      nameAr: 'أخرى',
      amount: 5700,
      percentage: 8,
      color: '#5E7CE2',
      gradient: 'linear-gradient(145deg, #7C97F5 0%, #4662C7 100%)',
      budgetLimit: 8000,
    },
  ],
  'This Quarter': [
    {
      id: 'housing',
      name: 'Housing',
      nameAr: 'السكن والإيجار',
      amount: 75000,
      percentage: 32,
      color: '#7B61FF',
      gradient: 'linear-gradient(145deg, #9882FF 0%, #684CE6 100%)',
      budgetLimit: 84000,
    },
    {
      id: 'food',
      name: 'Food & Dining',
      nameAr: 'الطعام والمطاعم',
      amount: 54200,
      percentage: 23,
      color: '#46B978',
      gradient: 'linear-gradient(145deg, #62D292 0%, #349E62 100%)',
      budgetLimit: 60000,
    },
    {
      id: 'transport',
      name: 'Transport',
      nameAr: 'المواصلات',
      amount: 36800,
      percentage: 16,
      color: '#F5BE41',
      gradient: 'linear-gradient(145deg, #FFD262 0%, #E0A324 100%)',
      budgetLimit: 45000,
    },
    {
      id: 'shopping',
      name: 'Shopping',
      nameAr: 'التسوق',
      amount: 31500,
      percentage: 14,
      color: '#F47C7C',
      gradient: 'linear-gradient(145deg, #FF9999 0%, #DF5C5C 100%)',
      budgetLimit: 36000,
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      nameAr: 'الترفيه',
      amount: 18400,
      percentage: 8,
      color: '#4F7DF3',
      gradient: 'linear-gradient(145deg, #6E98FF 0%, #3964D8 100%)',
      budgetLimit: 24000,
    },
    {
      id: 'others',
      name: 'Others',
      nameAr: 'أخرى',
      amount: 16900,
      percentage: 7,
      color: '#5E7CE2',
      gradient: 'linear-gradient(145deg, #7C97F5 0%, #4662C7 100%)',
      budgetLimit: 24000,
    },
  ],
};

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-1',
    title: 'Starbucks Coffee',
    titleAr: 'قهوة ستاربكس',
    category: 'Food & Dining',
    categoryAr: 'الطعام والمطاعم',
    amount: -450,
    dateLabel: 'Today',
    dateLabelAr: 'اليوم',
    icon: '/assets/fintrack/tx_coffee.png',
    account: 'HDFC Platinum',
    accountAr: 'بطاقة HDFC بلاتينوم',
  },
  {
    id: 'tx-2',
    title: 'Uber Ride',
    titleAr: 'رحلة أوبر',
    category: 'Transport',
    categoryAr: 'المواصلات',
    amount: -320,
    dateLabel: 'Today',
    dateLabelAr: 'اليوم',
    icon: '/assets/fintrack/tx_car.png',
    account: 'HDFC Platinum',
    accountAr: 'بطاقة HDFC بلاتينوم',
  },
  {
    id: 'tx-3',
    title: 'Salary from ABC Ltd.',
    titleAr: 'راتب من شركة ABC المحدودة',
    category: 'Income',
    categoryAr: 'الدخل والراتب',
    amount: 85000,
    dateLabel: 'Yesterday',
    dateLabelAr: 'أمس',
    icon: '/assets/fintrack/tx_wallet.png',
    account: 'ICICI Salary Vault',
    accountAr: 'حساب راتب ICICI',
  },
  {
    id: 'tx-4',
    title: 'Amazon Shopping',
    titleAr: 'تسوق من أمازون',
    category: 'Shopping',
    categoryAr: 'التسوق',
    amount: -1250,
    dateLabel: '18 May 2024',
    dateLabelAr: '18 مايو 2024',
    icon: '/assets/fintrack/tx_bag.png',
    account: 'Axis Rewards Card',
    accountAr: 'بطاقة مكافآت Axis',
  },
  {
    id: 'tx-5',
    title: 'Green Valley Apartments Rent',
    titleAr: 'إيجار شقق الوادي الأخضر',
    category: 'Housing',
    categoryAr: 'السكن والإيجار',
    amount: -25000,
    dateLabel: '15 May 2024',
    dateLabelAr: '15 مايو 2024',
    icon: '/assets/fintrack/tx_wallet.png',
    account: 'ICICI Salary Vault',
    accountAr: 'حساب راتب ICICI',
  },
  {
    id: 'tx-6',
    title: 'Freelance UI Design Retainer',
    titleAr: 'عائد تصميم واجهات مستقل',
    category: 'Income',
    categoryAr: 'الدخل والراتب',
    amount: 35850,
    dateLabel: '12 May 2024',
    dateLabelAr: '12 مايو 2024',
    icon: '/assets/fintrack/tx_wallet.png',
    account: 'HDFC Platinum',
    accountAr: 'بطاقة HDFC بلاتينوم',
  },
  {
    id: 'tx-7',
    title: 'Blue Tokai Roasters',
    titleAr: 'محمصة القهوة المختصة',
    category: 'Food & Dining',
    categoryAr: 'الطعام والمطاعم',
    amount: -680,
    dateLabel: '10 May 2024',
    dateLabelAr: '10 مايو 2024',
    icon: '/assets/fintrack/tx_coffee.png',
    account: 'HDFC Platinum',
    accountAr: 'بطاقة HDFC بلاتينوم',
  },
];

export const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'goal-1',
    title: 'Vacation in Bali',
    titleAr: 'عطلة في بالي',
    saved: 60000,
    target: 100000,
    icon: '/assets/fintrack/goal_bali.png',
    barColor: 'purple',
    deadline: 'Dec 2026',
    deadlineAr: 'ديسمبر 2026',
  },
  {
    id: 'goal-2',
    title: 'Buy New Laptop',
    titleAr: 'شراء حاسوب محمول جديد',
    saved: 45000,
    target: 80000,
    icon: '/assets/fintrack/goal_laptop.png',
    barColor: 'green',
    deadline: 'Aug 2026',
    deadlineAr: 'أغسطس 2026',
  },
];

export const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    id: 'acc-1',
    name: 'ICICI Salary Vault',
    nameAr: 'حساب راتب ICICI',
    institution: 'ICICI Bank',
    institutionAr: 'بنك ICICI',
    numberMasked: '•••• 4829',
    balance: 148200,
    changePercent: 14.2,
    type: 'Checking',
    typeAr: 'حساب جاري',
    icon: '/assets/fintrack/wallet.png',
  },
  {
    id: 'acc-2',
    name: 'HDFC High-Yield Savings',
    nameAr: 'حساب ادخار HDFC بعائد مرتفع',
    institution: 'HDFC Bank',
    institutionAr: 'بنك HDFC',
    numberMasked: '•••• 9104',
    balance: 68480,
    changePercent: 9.6,
    type: 'Savings',
    typeAr: 'حساب توفير',
    icon: '/assets/fintrack/money_bag.png',
  },
  {
    id: 'acc-3',
    name: 'Zerodha Nifty 50 Index',
    nameAr: 'صندوق مؤشر نيفتي 50',
    institution: 'Zerodha Coin',
    institutionAr: 'زيرودا للاستثمار',
    numberMasked: '•••• 3318',
    balance: 29000,
    changePercent: 18.4,
    type: 'Investment',
    typeAr: 'محفظة استثمارية',
    icon: '/assets/fintrack/coins.png',
  },
];

export const SMART_TIPS: SmartTipItem[] = [
  {
    id: 'tip-1',
    headline: "You're saving 15% more this month.",
    headlineAr: 'أنت تدّخر بنسبة 15% أكثر هذا الشهر.',
    subline: 'Keep it up! 🎉',
    sublineAr: 'استمر على هذا الأداء الرائع! 🎉',
  },
  {
    id: 'tip-2',
    headline: 'Vacation in Bali is now 60% funded.',
    headlineAr: 'تم تمويل هدف عطلة بالي بنسبة 60%.',
    subline: 'Just ₹40,000 left to hit your target! 🌴',
    sublineAr: 'يتبقى ₹40,000 فقط للوصول إلى هدفك! 🌴',
  },
  {
    id: 'tip-3',
    headline: 'Dining spend is ₹1,400 under budget.',
    headlineAr: 'الإنفاق على المطاعم أقل من الميزانية بـ ₹1,400.',
    subline: 'Auto-move surplus to Laptop Goal? 💻',
    sublineAr: 'هل ترغب بتحويل الفائض لهدف الحاسوب؟ 💻',
  },
];
