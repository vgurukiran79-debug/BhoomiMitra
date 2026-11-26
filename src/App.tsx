/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import type { ActiveView, CropFormData, LanguageCode } from './types/bhoomi';
import { TRANSLATIONS } from './data/translations';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CropWizard } from './components/CropWizard';
import { HowItWorksView } from './components/HowItWorksView';
import { AboutView } from './components/AboutView';

const INITIAL_FORM_DATA: CropFormData = {
  stateId: 'karnataka',
  districtId: '',
  soilType: '',
  season: '',
  rainfall: '',
  temperatureCategory: '',
  temperatureCelsius: '',
  waterAvailability: '',
  nutrients: {
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
  },
};

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<CropFormData>(INITIAL_FORM_DATA);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  return (
    <div className="min-h-screen flex bg-[#F8F8F1] text-[#1E241E]">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        t={t}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeView={activeView}
          language={language}
          onLanguageChange={setLanguage}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateHome={() => handleNavigate('home')}
          t={t}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {activeView === 'home' && (
            <HomeView
              t={t}
              onStartRecommendation={() => handleNavigate('recommend')}
              onViewHowItWorks={() => handleNavigate('how-it-works')}
            />
          )}

          {activeView === 'recommend' && (
            <CropWizard
              formData={formData}
              onChangeFormData={setFormData}
              onResetForm={handleResetForm}
              language={language}
              t={t}
            />
          )}

          {activeView === 'how-it-works' && (
            <HowItWorksView
              t={t}
              onStartRecommendation={() => handleNavigate('recommend')}
            />
          )}

          {activeView === 'about' && (
            <AboutView
              t={t}
              onStartRecommendation={() => handleNavigate('recommend')}
            />
          )}
        </main>

        <footer className="lg:hidden border-t border-[#E2E5D9] bg-white px-4 py-4 text-center text-xs text-[#6C756A]">
          {t.footer.note}
        </footer>
      </div>
    </div>
  );
}
