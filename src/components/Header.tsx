import { Globe, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import type { ActiveView, LanguageCode } from '../types/bhoomi';
import type { TranslationDictionary } from '../data/translations';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeView: ActiveView;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenMobileMenu: () => void;
  onNavigateHome: () => void;
  t: TranslationDictionary;
}

const LANGUAGES: Array<{ code: LanguageCode; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिन्दी' },
];

export function Header({
  activeView,
  language,
  onLanguageChange,
  onOpenMobileMenu,
  onNavigateHome,
  t,
}: HeaderProps) {
  const viewTitleMap: Record<ActiveView, string> = {
    home: t.nav.home,
    recommend: t.nav.recommend,
    'how-it-works': t.nav.howItWorks,
    about: t.nav.about,
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E2E5D9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label={t.nav.menuLabel}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 -ml-2 rounded-lg text-[#1E241E] hover:bg-[#F1F2E8] active:scale-95 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#236B45]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            className="lg:hidden flex items-center gap-2.5 min-w-0 focus-visible:outline-2 focus-visible:outline-[#236B45] rounded-lg"
          >
            <BrandLogo className="w-8 h-8" />
            <span className="font-display font-bold text-base text-[#1E241E] whitespace-nowrap truncate">
              {t.brand.name}
            </span>
          </button>

          <span className="hidden lg:inline-block font-display font-semibold text-base text-[#1E241E] whitespace-nowrap truncate">
            {viewTitleMap[activeView]}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 shrink-0"
          role="group"
          aria-label={t.nav.languageLabel}
        >
          <Globe className="w-4 h-4 text-[#556054] hidden sm:block mr-1" aria-hidden="true" />
          <div className="inline-flex items-center p-1 rounded-xl bg-[#F1F2E8] border border-[#E2E5D9]">
            {LANGUAGES.map((lang) => {
              const active = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onLanguageChange(lang.code)}
                  aria-pressed={active}
                  className={`relative px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[34px] focus-visible:outline-2 focus-visible:outline-[#236B45] ${
                    active ? 'text-white' : 'text-[#3A4339] hover:text-[#1E241E]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeLanguagePill"
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 rounded-lg bg-[#236B45] shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
