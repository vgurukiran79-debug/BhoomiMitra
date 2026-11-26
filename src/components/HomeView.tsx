import { useState } from 'react';
import { ArrowRight, BookOpen, Compass, Cpu, Sprout } from 'lucide-react';
import type { TranslationDictionary } from '../data/translations';

interface HomeViewProps {
  t: TranslationDictionary;
  onStartRecommendation: () => void;
  onViewHowItWorks: () => void;
}

const HERO_IMAGE_PATH = '/src/assets/images/hero_farmland_1795707908298.jpg';

export function HomeView({
  t,
  onStartRecommendation,
  onViewHowItWorks,
}: HomeViewProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const featureCards = [
    {
      id: 'smart-selection',
      icon: Sprout,
      title: t.home.features.smartSelection.title,
      description: t.home.features.smartSelection.description,
    },
    {
      id: 'easy-guidance',
      icon: Compass,
      title: t.home.features.easyGuidance.title,
      description: t.home.features.easyGuidance.description,
    },
    {
      id: 'ai-assistance',
      icon: Cpu,
      title: t.home.features.aiAssistance.title,
      description: t.home.features.aiAssistance.description,
    },
  ];

  return (
    <div className="space-y-10">
      <section className="bg-white border border-[#E2E5D9] rounded-2xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#1E241E] leading-[1.15] tracking-tight">
              {t.home.heroHeading}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#4E584D] leading-relaxed max-w-xl">
              {t.home.heroSubheading}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onStartRecommendation}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#236B45] hover:bg-[#1B5536] text-white font-semibold text-base transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
              >
                <span>{t.home.primaryCta}</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onViewHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#F8F8F1] hover:bg-[#EEF2E4] text-[#1E241E] border border-[#C9CEBD] font-semibold text-base transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
              >
                <BookOpen className="w-4 h-4 text-[#236B45]" aria-hidden="true" />
                <span>{t.home.secondaryCta}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[240px] sm:min-h-[300px] lg:min-h-[380px] bg-[#EEF5EE]">
            {!heroImgFailed ? (
              <img
                src={HERO_IMAGE_PATH}
                alt={t.home.heroImageAlt}
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="w-full h-full object-cover lg:absolute lg:inset-0"
              />
            ) : (
              <div className="w-full h-full min-h-[260px] flex flex-col items-center justify-center p-8 text-center bg-[#EEF5EE]">
                <Sprout className="w-14 h-14 text-[#236B45] mb-3" />
                <p className="font-display font-semibold text-[#236B45] text-lg">
                  {t.brand.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="home-features-heading" className="space-y-5">
        <h2
          id="home-features-heading"
          className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]"
        >
          {t.home.featuresHeading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white border border-[#E2E5D9] rounded-2xl p-6 flex flex-col gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-[#EEF5EE] text-[#236B45] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1E241E]">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-[#4E584D] leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
