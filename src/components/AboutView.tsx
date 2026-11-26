import { ArrowRight, CheckCircle2, Layers, Sprout } from 'lucide-react';
import type { TranslationDictionary } from '../data/translations';

interface AboutViewProps {
  t: TranslationDictionary;
  onStartRecommendation: () => void;
}

export function AboutView({ t, onStartRecommendation }: AboutViewProps) {
  const pillarIcons = [Sprout, CheckCircle2, Layers];

  return (
    <div className="space-y-8 max-w-4xl">
      <section className="bg-white border border-[#E2E5D9] rounded-2xl p-6 sm:p-8 space-y-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E241E]">
          {t.about.heading}
        </h1>
        <p className="text-base sm:text-lg text-[#4E584D] leading-relaxed max-w-2xl">
          {t.about.description}
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {t.about.pillars.map((pillar, idx) => {
          const Icon = pillarIcons[idx] ?? Sprout;
          return (
            <div
              key={pillar.title}
              className="bg-white border border-[#E2E5D9] rounded-2xl p-6 space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EEF5EE] text-[#236B45] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-lg font-bold text-[#1E241E]">
                {pillar.title}
              </h2>
              <p className="text-sm sm:text-base text-[#4E584D] leading-relaxed">
                {pillar.body}
              </p>
            </div>
          );
        })}
      </div>

      <section className="bg-[#EEF5EE] border border-[#B9D6BC] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#1E241E]">
            {t.about.roadmapTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#2D4735] leading-relaxed">
            {t.about.roadmapBody}
          </p>
        </div>

        <button
          type="button"
          onClick={onStartRecommendation}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#236B45] hover:bg-[#1B5536] text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
        >
          <span>{t.about.exploreCta}</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
