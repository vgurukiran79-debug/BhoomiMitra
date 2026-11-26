import { BookOpen, Home, Info, Sprout, X } from 'lucide-react';
import type { ActiveView } from '../types/bhoomi';
import type { TranslationDictionary } from '../data/translations';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  t: TranslationDictionary;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeView,
  onNavigate,
  t,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems: Array<{
    id: ActiveView;
    label: string;
    icon: typeof Home;
  }> = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'recommend', label: t.nav.recommend, icon: Sprout },
    { id: 'how-it-works', label: t.nav.howItWorks, icon: BookOpen },
    { id: 'about', label: t.nav.about, icon: Info },
  ];

  const handleSelect = (view: ActiveView) => {
    onNavigate(view);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E2E5D9]">
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-[#E2E5D9]">
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="flex items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] rounded-lg"
        >
          <BrandLogo className="w-10 h-10" />
          <div className="min-w-0">
            <div className="font-display text-lg font-bold text-[#1E241E] leading-tight truncate">
              {t.brand.name}
            </div>
            <div className="text-xs text-[#556054] truncate">
              {t.brand.tagline}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label={t.nav.closeMenu}
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#4E584D] hover:bg-[#F1F2E8] focus-visible:outline-2 focus-visible:outline-[#236B45]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors duration-150 min-h-[44px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                isActive
                  ? 'bg-[#236B45] text-white'
                  : 'text-[#3A4339] hover:bg-[#F1F2E8] hover:text-[#1E241E]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-white' : 'text-[#236B45]'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[#E2E5D9] text-xs text-[#6C756A] leading-relaxed">
        {t.footer.note}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {navContent}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="fixed inset-0 bg-[#1E241E]/40 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
