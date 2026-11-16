import React from 'react';
import { Sparkles, Trophy, Flame, Plus } from 'lucide-react';
import { GoalItem, Language, formatINR } from '../data/financeData';

export type MilestoneTier = 100 | 75 | 50 | null;

export function getMilestoneTier(pct: number): MilestoneTier {
  if (pct >= 100) return 100;
  if (pct >= 75) return 75;
  if (pct >= 50) return 50;
  return null;
}

interface GoalProgressCardProps {
  goal: GoalItem;
  lang: Language;
  isCelebrating?: boolean;
  compact?: boolean;
  onOpenTopUp: (goal: GoalItem) => void;
  onQuickBoost: (goalId: string, amount: number) => void;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  goal,
  lang,
  isCelebrating = false,
  compact = true,
  onOpenTopUp,
  onQuickBoost,
}) => {
  const isRTL = lang === 'ar';
  const pct = Math.min(100, Math.round((goal.saved / Math.max(1, goal.target)) * 100));
  const milestone = getMilestoneTier(pct);

  // Determine 3D clay bar fill class based on milestone & goal preference
  const barFillClass =
    milestone === 100
      ? 'clay-bar-gold'
      : goal.barColor === 'purple'
      ? 'clay-bar-purple'
      : 'clay-bar-green';

  // Milestone highlight ring when celebrating or at 100%
  const cardHighlightClass = isCelebrating
    ? 'clay-milestone-celebrate ring-2 ring-[#F5B638] bg-[#FFFDF8]'
    : milestone === 100
    ? 'ring-1 ring-[#F5B638]/60'
    : milestone === 75
    ? 'ring-1 ring-[#6D50EB]/30'
    : '';

  const milestoneLabel =
    milestone === 100
      ? isRTL
        ? 'اكتمل الهدف 100%'
        : '100% Goal Reached'
      : milestone === 75
      ? isRTL
        ? 'محطة 75% المتقدمة'
        : '75% Milestone'
      : milestone === 50
      ? isRTL
        ? 'تجاوزت 50%'
        : '50% Milestone'
      : null;

  return (
    <div
      onClick={() => onOpenTopUp(goal)}
      title={
        isRTL
          ? 'اضغط لإضافة مساهمة لهذا الهدف'
          : 'Click to contribute toward this goal'
      }
      className={`clay-inner-card rounded-[18px] ${
        compact ? 'p-3.5' : 'p-5'
      } hover:scale-[1.01] transition-all duration-200 cursor-pointer relative ${cardHighlightClass}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={goal.icon}
            alt={isRTL ? goal.titleAr : goal.title}
            referrerPolicy="no-referrer"
            className={`${
              compact ? 'w-[52px] h-[56px]' : 'w-[58px] h-[62px]'
            } object-contain`}
          />
          {milestone && (
            <span
              title={milestoneLabel || ''}
              className={`w-5 h-5 rounded-full flex items-center justify-center absolute -top-1 -end-1 shadow-sm ${
                milestone === 100
                  ? 'clay-bar-gold text-[#1E1B26]'
                  : milestone === 75
                  ? 'clay-purple-active text-white'
                  : 'clay-bar-green text-white'
              }`}
            >
              {milestone === 100 ? (
                <Trophy className="w-3 h-3 stroke-[2.5]" />
              ) : milestone === 75 ? (
                <Flame className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <Sparkles className="w-3 h-3 stroke-[2.5]" />
              )}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <p
              className={`${
                compact ? 'text-[13.5px]' : 'text-[16px]'
              } font-bold text-[#1E1B26] truncate`}
            >
              {isRTL ? goal.titleAr : goal.title}
            </p>

            {/* Quick Milestone Boost Button */}
            {pct < 100 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Boost by 10,000 so users can easily cross 50%, 75%, or 100% milestones
                  onQuickBoost(goal.id, 10000);
                }}
                title={
                  isRTL
                    ? 'دفعة سريعة (+₹10,000) للوصول للمحطة التالية'
                    : 'Quick boost (+₹10,000) toward next milestone'
                }
                className="clay-pill-btn px-2 py-0.5 rounded-[8px] text-[10.5px] font-extrabold text-[#6D50EB] hover:bg-white transition-transform active:scale-95 flex items-center gap-0.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5 stroke-[2.8]" />
                <span dir="ltr">₹10k</span>
              </button>
            )}
          </div>

          {/* 3D Clay Progress Bar with 50% and 75% Milestone Markers */}
          <div className="clay-track h-[13px] rounded-full overflow-hidden mt-2.5 p-[1.5px] relative">
            {/* Subtle 50% and 75% milestone notch lines on the recessed track */}
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-[1.5px] bg-[#1E1B26]/15 z-10 pointer-events-none"
              style={{ insetInlineStart: '50%' }}
            />
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-[1.5px] bg-[#1E1B26]/15 z-10 pointer-events-none"
              style={{ insetInlineStart: '75%' }}
            />

            {/* Animated 3D Clay Fill Bar */}
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${barFillClass} ${
                milestone !== null ? 'clay-milestone-shimmer' : ''
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Amount + Milestone Status + Percentage */}
      <div className="flex items-center justify-between mt-2.5 ps-[64px] text-[11.5px] tabular-nums gap-2">
        <span
          dir="ltr"
          className="font-semibold text-[#3B3532] inline-block truncate"
        >
          <strong className="font-bold text-[#1E1B26]">
            {formatINR(goal.saved)}
          </strong>{' '}
          / {formatINR(goal.target)}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {milestoneLabel && (
            <span
              className={`text-[10.5px] font-bold ${
                milestone === 100
                  ? 'text-[#B87300]'
                  : milestone === 75
                  ? 'text-[#6D50EB]'
                  : 'text-[#1F8E5A]'
              }`}
            >
              {milestoneLabel} ·
            </span>
          )}
          <span
            className={`font-extrabold ${
              milestone === 100 ? 'text-[#B87300]' : 'text-[#1E1B26]'
            }`}
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
};
