import { ArrowRight, ClipboardList, Cpu, Sprout } from 'lucide-react';
import type { TranslationDictionary } from '../data/translations';

interface HowItWorksViewProps {
  t: TranslationDictionary;
  onStartRecommendation: () => void;
}

export function HowItWorksView({ t, onStartRecommendation }: HowItWorksViewProps) {
  const stepIcons = [ClipboardList, Cpu, Sprout];

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-2">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E241E]">
          {t.howItWorks.heading}
        </h1>
        <p className="text-base sm:text-lg text-[#4E584D] leading-relaxed">
          {t.howItWorks.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {t.howItWorks.steps.map((step, idx) => {
          const Icon = stepIcons[idx] ?? Sprout;
          return (
            <div
              key={step.number}
              className="bg-white border border-[#E2E5D9] rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#EEF5EE] text-[#236B45] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="font-display text-xl font-bold text-[#73A942] tabular-nums">
                  {step.number}
                </span>
              </div>

              <h2 className="font-display text-lg font-bold text-[#1E241E] leading-snug">
                {step.title}
              </h2>
              <p className="text-sm sm:text-base text-[#4E584D] leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      <section className="bg-white border border-[#E2E5D9] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#1E241E]">
            {t.howItWorks.futureNoteTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#4E584D] leading-relaxed">
            {t.howItWorks.futureNoteBody}
          </p>
        </div>

        <button
          type="button"
          onClick={onStartRecommendation}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#236B45] hover:bg-[#1B5536] text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
        >
          <span>{t.howItWorks.startCta}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
