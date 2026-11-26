import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  Droplet,
  Droplets,
  Edit3,
  Flame,
  HelpCircle,
  Layers,
  MapPin,
  Mountain,
  RotateCcw,
  Search,
  SkipForward,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  CropFormData,
  LanguageCode,
  RainfallLevel,
  SeasonType,
  SoilType,
  TemperatureCategory,
  WaterAvailability,
} from '../types/bhoomi';
import type { TranslationDictionary } from '../data/translations';
import { formatStepLabel } from '../data/translations';
import { INDIA_LOCATIONS } from '../data/locations';
import { SampleResultsView } from './SampleResultsView';

interface CropWizardProps {
  formData: CropFormData;
  onChangeFormData: (updater: (prev: CropFormData) => CropFormData) => void;
  onResetForm: () => void;
  language: LanguageCode;
  t: TranslationDictionary;
}

const TOTAL_STEPS = 7;

const POPULAR_DISTRICTS_BY_STATE: Record<string, string[]> = {
  karnataka: ['mysuru', 'mandya', 'belagavi', 'hassan', 'shivamogga', 'raichur'],
  maharashtra: ['pune', 'nashik', 'nagpur', 'kolhapur'],
  tamil_nadu: ['coimbatore', 'thanjavur', 'erode', 'madurai'],
  andhra_pradesh: ['guntur', 'krishna', 'anantapur', 'kurnool'],
  telangana: ['nizamabad', 'warangal', 'karimnagar', 'nalgonda'],
};

export function CropWizard({
  formData,
  onChangeFormData,
  onResetForm,
  language,
  t,
}: CropWizardProps) {
  const [phase, setPhase] = useState<'steps' | 'summary' | 'results'>('steps');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [districtSearch, setDistrictSearch] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedState =
    INDIA_LOCATIONS.find((s) => s.id === formData.stateId) ?? INDIA_LOCATIONS[0];
  const districts = selectedState.districts;

  const filteredDistricts = useMemo(() => {
    const query = districtSearch.trim().toLowerCase();
    if (!query) return districts;
    return districts.filter(
      (d) =>
        d.name.en.toLowerCase().includes(query) ||
        d.name.kn.toLowerCase().includes(query) ||
        d.name.hi.toLowerCase().includes(query)
    );
  }, [districts, districtSearch]);

  const popularDistrictIds =
    POPULAR_DISTRICTS_BY_STATE[selectedState.id] ??
    districts.slice(0, 4).map((d) => d.id);
  const popularDistricts = districts.filter((d) =>
    popularDistrictIds.includes(d.id)
  );

  const validateStep = (step: number): string => {
    switch (step) {
      case 1:
        if (!formData.districtId) {
          return t.wizard.validation.selectDistrict;
        }
        return '';
      case 2:
        if (!formData.soilType) {
          return t.wizard.validation.selectSoil;
        }
        return '';
      case 3:
        if (!formData.season) {
          return t.wizard.validation.selectSeason;
        }
        return '';
      case 4:
        if (!formData.rainfall) {
          return t.wizard.validation.selectRainfall;
        }
        return '';
      case 5: {
        if (!formData.temperatureCategory) {
          return t.wizard.validation.selectTemperature;
        }
        const tempStr = formData.temperatureCelsius.trim();
        if (tempStr !== '') {
          const val = Number(tempStr);
          if (Number.isNaN(val) || val < 0 || val > 55) {
            return t.wizard.validation.invalidTemperature;
          }
        }
        return '';
      }
      case 6:
        if (!formData.waterAvailability) {
          return t.wizard.validation.selectWater;
        }
        return '';
      case 7: {
        const { nitrogen, phosphorus, potassium, ph } = formData.nutrients;
        for (const raw of [nitrogen, phosphorus, potassium]) {
          if (raw.trim() !== '') {
            const num = Number(raw);
            if (Number.isNaN(num) || num < 0) {
              return t.wizard.validation.invalidNutrient;
            }
          }
        }
        if (ph.trim() !== '') {
          const phNum = Number(ph);
          if (Number.isNaN(phNum) || phNum < 0 || phNum > 14) {
            return t.wizard.validation.invalidPh;
          }
        }
        return '';
      }
      default:
        return '';
    }
  };

  const handleNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      setErrorMessage(err);
      return;
    }
    setErrorMessage('');
    setDirection(1);
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxReachedStep((prev) => Math.max(prev, nextStep));
    } else {
      setPhase('summary');
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    setDirection(-1);
    if (phase === 'summary') {
      setPhase('steps');
      setCurrentStep(TOTAL_STEPS);
      return;
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleJumpToStep = (step: number) => {
    setErrorMessage('');
    setDirection(step >= currentStep ? 1 : -1);
    setPhase('steps');
    setCurrentStep(step);
  };

  const handleClear = () => {
    onResetForm();
    setDistrictSearch('');
    setDirection(-1);
    setPhase('steps');
    setCurrentStep(1);
    setMaxReachedStep(1);
    setErrorMessage('');
  };

  const handleFillExample = () => {
    setErrorMessage('');
    setDistrictSearch('');
    onChangeFormData(() => ({
      stateId: 'karnataka',
      districtId: 'mandya',
      soilType: 'loamy',
      season: 'kharif',
      rainfall: 'normal',
      temperatureCategory: 'moderate',
      temperatureCelsius: '27',
      waterAvailability: 'medium',
      nutrients: {
        nitrogen: '80',
        phosphorus: '40',
        potassium: '40',
        ph: '6.5',
      },
    }));
    setMaxReachedStep(TOTAL_STEPS);
    setDirection(1);
    setPhase('summary');
  };

  const handleSubmitSummary = () => {
    for (let s = 1; s <= TOTAL_STEPS; s++) {
      const err = validateStep(s);
      if (err) {
        setPhase('steps');
        setCurrentStep(s);
        setErrorMessage(err);
        return;
      }
    }
    setErrorMessage('');
    setPhase('results');
  };

  if (phase === 'results') {
    return (
      <SampleResultsView
        formData={formData}
        language={language}
        t={t}
        onTryAgain={handleClear}
        onChangeInputs={() => {
          setPhase('summary');
        }}
      />
    );
  }

  const progressPercent =
    phase === 'summary'
      ? 100
      : Math.round(((currentStep - 1) / TOTAL_STEPS) * 100 + 100 / TOTAL_STEPS);

  const soilOptions: Array<{
    id: SoilType;
    swatch: string;
    icon: typeof Layers;
  }> = [
    { id: 'red', swatch: 'bg-[#B8523A]', icon: Mountain },
    { id: 'black', swatch: 'bg-[#2E2D2B]', icon: Layers },
    { id: 'sandy', swatch: 'bg-[#D6B472]', icon: Wind },
    { id: 'loamy', swatch: 'bg-[#6F523B]', icon: Sprout },
    { id: 'clay', swatch: 'bg-[#8F6D52]', icon: Droplet },
    { id: 'not_sure', swatch: 'bg-[#949E92]', icon: HelpCircle },
  ];

  const seasonOptions: Array<{ id: SeasonType; icon: typeof Sun }> = [
    { id: 'kharif', icon: CloudRain },
    { id: 'rabi', icon: Snowflake },
    { id: 'summer', icon: Sun },
    { id: 'not_sure', icon: HelpCircle },
  ];

  const rainfallOptions: Array<{ id: RainfallLevel; icon: typeof CloudRain }> = [
    { id: 'low', icon: CloudDrizzle },
    { id: 'normal', icon: CloudRain },
    { id: 'heavy', icon: CloudRainWind },
    { id: 'not_sure', icon: HelpCircle },
  ];

  const temperatureOptions: Array<{
    id: TemperatureCategory;
    icon: typeof Thermometer;
  }> = [
    { id: 'cool', icon: Snowflake },
    { id: 'moderate', icon: Thermometer },
    { id: 'hot', icon: Flame },
    { id: 'not_sure', icon: HelpCircle },
  ];

  const waterOptions: Array<{ id: WaterAvailability; icon: typeof Droplets }> = [
    { id: 'low', icon: Droplet },
    { id: 'medium', icon: Droplets },
    { id: 'good', icon: Waves },
    { id: 'not_sure', icon: HelpCircle },
  ];

  const selectedDistrictObj = districts.find((d) => d.id === formData.districtId);

  const nutrientParts: string[] = [];
  if (formData.nutrients.nitrogen.trim()) {
    nutrientParts.push(`N: ${formData.nutrients.nitrogen.trim()}`);
  }
  if (formData.nutrients.phosphorus.trim()) {
    nutrientParts.push(`P: ${formData.nutrients.phosphorus.trim()}`);
  }
  if (formData.nutrients.potassium.trim()) {
    nutrientParts.push(`K: ${formData.nutrients.potassium.trim()}`);
  }
  if (formData.nutrients.ph.trim()) {
    nutrientParts.push(`pH: ${formData.nutrients.ph.trim()}`);
  }

  const selectionTrail: Array<{ step: number; label: string }> = [];
  if (selectedDistrictObj) {
    selectionTrail.push({ step: 1, label: selectedDistrictObj.name[language] });
  }
  if (formData.soilType) {
    selectionTrail.push({
      step: 2,
      label: t.wizard.steps.soil.options[formData.soilType].label,
    });
  }
  if (formData.season) {
    selectionTrail.push({
      step: 3,
      label: t.wizard.steps.season.options[formData.season].label,
    });
  }
  if (formData.rainfall) {
    selectionTrail.push({
      step: 4,
      label: t.wizard.steps.rainfall.options[formData.rainfall].label,
    });
  }
  if (formData.temperatureCategory) {
    selectionTrail.push({
      step: 5,
      label: t.wizard.steps.temperature.options[formData.temperatureCategory].label,
    });
  }
  if (formData.waterAvailability) {
    selectionTrail.push({
      step: 6,
      label: t.wizard.steps.water.options[formData.waterAvailability].label,
    });
  }

  const sliderTempValue = formData.temperatureCelsius.trim()
    ? Math.min(55, Math.max(0, Number(formData.temperatureCelsius) || 26))
    : 26;

  return (
    <div className="max-w-4xl space-y-5 pb-20 sm:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E241E]">
            {t.wizard.title}
          </h1>
          <p className="text-sm sm:text-base text-[#4E584D]">{t.wizard.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleFillExample}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#EEF5EE] hover:bg-[#DFEBDF] border border-[#B9D6BC] text-sm font-semibold text-[#236B45] transition-all duration-150 active:scale-[0.98] min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#236B45]"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{t.wizard.fillExample}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F1F2E8] border border-[#C9CEBD] text-sm font-semibold text-[#3A4339] transition-all duration-150 active:scale-[0.98] min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#236B45]"
          >
            <RotateCcw className="w-4 h-4 text-[#236B45]" aria-hidden="true" />
            <span>{t.wizard.clearForm}</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator + Selection Trail */}
      <div className="bg-white border border-[#E2E5D9] rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-display font-bold text-[#236B45] tabular-nums">
            {phase === 'summary'
              ? t.wizard.summaryLabel
              : formatStepLabel(t.wizard.stepOf, currentStep, TOTAL_STEPS)}
          </span>
          <span className="text-xs sm:text-sm font-medium text-[#556054] tabular-nums">
            {progressPercent}%
          </span>
        </div>

        <div
          className="h-2 w-full rounded-full bg-[#EEF2E4] overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-[#73A942] rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-0.5">
          {t.wizard.stepLabels.map((label, index) => {
            const stepNum = index + 1;
            const isCurrent = phase === 'steps' && currentStep === stepNum;
            const isReachable = stepNum <= maxReachedStep || phase === 'summary';
            const isCompleted =
              (phase === 'summary' || stepNum < currentStep) &&
              validateStep(stepNum) === '';

            return (
              <button
                key={label}
                type="button"
                disabled={!isReachable}
                onClick={() => isReachable && handleJumpToStep(stepNum)}
                className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-colors duration-150 min-h-[38px] truncate focus-visible:outline-2 focus-visible:outline-[#236B45] ${
                  isCurrent
                    ? 'bg-[#236B45] text-white'
                    : isCompleted
                    ? 'bg-[#EEF5EE] text-[#236B45] hover:bg-[#DFEBDF]'
                    : isReachable
                    ? 'bg-[#F8F8F1] text-[#3A4339] hover:bg-[#F1F2E8]'
                    : 'bg-[#F8F8F1] text-[#9BA398] cursor-not-allowed'
                }`}
              >
                {label}
              </button>
            );
          })}

          <button
            type="button"
            disabled={maxReachedStep < TOTAL_STEPS && phase !== 'summary'}
            onClick={() => {
              if (maxReachedStep >= TOTAL_STEPS || phase === 'summary') {
                setErrorMessage('');
                setPhase('summary');
              }
            }}
            className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-colors duration-150 min-h-[38px] truncate focus-visible:outline-2 focus-visible:outline-[#236B45] ${
              phase === 'summary'
                ? 'bg-[#236B45] text-white'
                : maxReachedStep >= TOTAL_STEPS
                ? 'bg-[#EEF5EE] text-[#236B45] hover:bg-[#DFEBDF]'
                : 'bg-[#F8F8F1] text-[#9BA398] cursor-not-allowed'
            }`}
          >
            {t.wizard.summaryLabel}
          </button>
        </div>

        {selectionTrail.length > 0 && phase === 'steps' && (
          <div className="pt-2.5 border-t border-[#F1F2E8] flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4E584D]">
            <span className="font-medium text-[#6C756A]">
              {t.wizard.yourProfileTrail}:
            </span>
            {selectionTrail.map((item, idx) => (
              <span key={item.step} className="inline-flex items-center gap-2">
                {idx > 0 && <span aria-hidden="true">·</span>}
                <button
                  type="button"
                  onClick={() => handleJumpToStep(item.step)}
                  className="font-medium text-[#236B45] hover:underline focus-visible:outline-2 focus-visible:outline-[#236B45] rounded"
                >
                  {item.label}
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Step or Summary Container */}
      <div className="bg-white border border-[#E2E5D9] rounded-2xl p-5 sm:p-8 space-y-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={phase === 'summary' ? 'summary' : `step-${currentStep}`}
            initial={{ opacity: 0, x: direction * 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -14 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {phase === 'steps' && (
              <>
                {/* STEP 1: LOCATION */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#236B45]">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        <span>{t.wizard.stepLabels[0]}</span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]">
                        {t.wizard.steps.location.question}
                      </h2>
                      <p className="text-sm sm:text-base text-[#4E584D]">
                        {t.wizard.steps.location.helper}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="state-select"
                          className="block text-sm font-semibold text-[#1E241E]"
                        >
                          {t.wizard.steps.location.stateLabel}
                        </label>
                        <select
                          id="state-select"
                          value={formData.stateId}
                          onChange={(e) => {
                            const newStateId = e.target.value;
                            setErrorMessage('');
                            setDistrictSearch('');
                            onChangeFormData((prev) => ({
                              ...prev,
                              stateId: newStateId,
                              districtId: '',
                            }));
                          }}
                          className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base font-medium focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                        >
                          {INDIA_LOCATIONS.map((state) => (
                            <option key={state.id} value={state.id}>
                              {state.name[language]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="district-search"
                          className="block text-sm font-semibold text-[#1E241E]"
                        >
                          {t.wizard.steps.location.districtLabel}
                        </label>
                        <div className="relative">
                          <Search
                            className="w-4 h-4 text-[#6C756A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            aria-hidden="true"
                          />
                          <input
                            id="district-search"
                            type="search"
                            value={districtSearch}
                            onChange={(e) => setDistrictSearch(e.target.value)}
                            placeholder={t.wizard.steps.location.searchPlaceholder}
                            className="w-full min-h-[48px] pl-10 pr-4 py-3 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Select Popular Districts */}
                    {!districtSearch.trim() && popularDistricts.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-[#6C756A]">
                          {t.wizard.steps.location.popularDistricts}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularDistricts.map((dist) => {
                            const active = formData.districtId === dist.id;
                            return (
                              <button
                                key={dist.id}
                                type="button"
                                onClick={() => {
                                  setErrorMessage('');
                                  onChangeFormData((prev) => ({
                                    ...prev,
                                    districtId: dist.id,
                                  }));
                                }}
                                aria-pressed={active}
                                className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-150 active:scale-[0.97] min-h-[40px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#236B45] ${
                                  active
                                    ? 'bg-[#236B45] border-[#236B45] text-white'
                                    : 'bg-[#F8F8F1] border-[#E2E5D9] text-[#1E241E] hover:border-[#236B45]/50'
                                }`}
                              >
                                {dist.name[language]}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Searchable Clickable District Grid */}
                    <div className="space-y-2">
                      {filteredDistricts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1 py-0.5">
                          {filteredDistricts.map((dist) => {
                            const selected = formData.districtId === dist.id;
                            return (
                              <button
                                key={dist.id}
                                type="button"
                                onClick={() => {
                                  setErrorMessage('');
                                  onChangeFormData((prev) => ({
                                    ...prev,
                                    districtId: dist.id,
                                  }));
                                }}
                                aria-pressed={selected}
                                className={`px-3 py-2.5 rounded-xl border text-left text-sm font-medium transition-all duration-150 active:scale-[0.98] flex items-center justify-between gap-2 min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#236B45] ${
                                  selected
                                    ? 'bg-[#EEF5EE] border-[#236B45] text-[#236B45] font-semibold'
                                    : 'bg-white border-[#E2E5D9] text-[#1E241E] hover:bg-[#F8F8F1] hover:border-[#236B45]/40'
                                }`}
                              >
                                <span className="truncate">{dist.name[language]}</span>
                                {selected && (
                                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-[#556054] py-4">
                          {t.wizard.steps.location.noDistrictMatches}
                        </p>
                      )}
                    </div>

                    {formData.stateId === 'karnataka' && (
                      <p className="text-xs sm:text-sm text-[#236B45] font-medium">
                        {t.wizard.steps.location.karnatakaNote}
                      </p>
                    )}
                  </div>
                )}

                {/* STEP 2: SOIL INFORMATION */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#236B45]">
                        <Layers className="w-4 h-4" aria-hidden="true" />
                        <span>{t.wizard.stepLabels[1]}</span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]">
                        {t.wizard.steps.soil.question}
                      </h2>
                      <p className="text-sm sm:text-base text-[#4E584D]">
                        {t.wizard.steps.soil.helper}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {soilOptions.map((item) => {
                        const Icon = item.icon;
                        const optionCopy = t.wizard.steps.soil.options[item.id];
                        const selected = formData.soilType === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                soilType: item.id,
                              }));
                            }}
                            aria-pressed={selected}
                            className={`relative p-5 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] flex flex-col gap-3 min-h-[124px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                              selected
                                ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                                : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`w-9 h-9 rounded-xl ${item.swatch} text-white flex items-center justify-center shrink-0`}
                                >
                                  <Icon className="w-4 h-4" aria-hidden="true" />
                                </span>
                                <span className="font-display font-bold text-base text-[#1E241E]">
                                  {optionCopy.label}
                                </span>
                              </div>
                              {selected && (
                                <span className="w-6 h-6 rounded-full bg-[#236B45] text-white flex items-center justify-center shrink-0">
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#4E584D] leading-relaxed">
                              {optionCopy.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 3: SEASON */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#236B45]">
                        <Sun className="w-4 h-4" aria-hidden="true" />
                        <span>{t.wizard.stepLabels[2]}</span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]">
                        {t.wizard.steps.season.question}
                      </h2>
                      <p className="text-sm sm:text-base text-[#4E584D]">
                        {t.wizard.steps.season.helper}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {seasonOptions.map((item) => {
                        const Icon = item.icon;
                        const optionCopy = t.wizard.steps.season.options[item.id];
                        const selected = formData.season === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                season: item.id,
                              }));
                            }}
                            aria-pressed={selected}
                            className={`p-5 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] flex flex-col gap-3 min-h-[116px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                              selected
                                ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                                : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    selected
                                      ? 'bg-[#236B45] text-white'
                                      : 'bg-[#EEF5EE] text-[#236B45]'
                                  }`}
                                >
                                  <Icon className="w-5 h-5" aria-hidden="true" />
                                </span>
                                <span className="font-display font-bold text-base sm:text-lg text-[#1E241E]">
                                  {optionCopy.label}
                                </span>
                              </div>
                              {selected && (
                                <span className="w-6 h-6 rounded-full bg-[#236B45] text-white flex items-center justify-center shrink-0">
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#4E584D] leading-relaxed">
                              {optionCopy.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 4: RAINFALL */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#236B45]">
                        <CloudRain className="w-4 h-4" aria-hidden="true" />
                        <span>{t.wizard.stepLabels[3]}</span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]">
                        {t.wizard.steps.rainfall.question}
                      </h2>
                      <p className="text-sm sm:text-base text-[#4E584D]">
                        {t.wizard.steps.rainfall.helper}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rainfallOptions.map((item) => {
                        const Icon = item.icon;
                        const optionCopy = t.wizard.steps.rainfall.options[item.id];
                        const selected = formData.rainfall === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                rainfall: item.id,
                              }));
                            }}
                            aria-pressed={selected}
                            className={`p-5 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] flex flex-col gap-3 min-h-[116px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                              selected
                                ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                                : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    selected
                                      ? 'bg-[#236B45] text-white'
                                      : 'bg-[#EEF5EE] text-[#236B45]'
                                  }`}
                                >
                                  <Icon className="w-5 h-5" aria-hidden="true" />
                                </span>
                                <span className="font-display font-bold text-base sm:text-lg text-[#1E241E]">
                                  {optionCopy.label}
                                </span>
                              </div>
                              {selected && (
                                <span className="w-6 h-6 rounded-full bg-[#236B45] text-white flex items-center justify-center shrink-0">
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#4E584D] leading-relaxed">
                              {optionCopy.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 5: TEMPERATURE */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#236B45]">
                        <Thermometer className="w-4 h-4" aria-hidden="true" />
                        <span>{t.wizard.stepLabels[4]}</span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]">
                        {t.wizard.steps.temperature.question}
                      </h2>
                      <p className="text-sm sm:text-base text-[#4E584D]">
                        {t.wizard.steps.temperature.helper}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {temperatureOptions.map((item) => {
                        const Icon = item.icon;
                        const optionCopy = t.wizard.steps.temperature.options[item.id];
                        const selected = formData.temperatureCategory === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                temperatureCategory: item.id,
                              }));
                            }}
                            aria-pressed={selected}
                            className={`p-5 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] flex flex-col gap-3 min-h-[112px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                              selected
                                ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                                : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    selected
                                      ? 'bg-[#236B45] text-white'
                                      : 'bg-[#EEF5EE] text-[#236B45]'
                                  }`}
                                >
                                  <Icon className="w-5 h-5" aria-hidden="true" />
                                </span>
                                <span className="font-display font-bold text-base sm:text-lg text-[#1E241E]">
                                  {optionCopy.label}
                                </span>
                              </div>
                              {selected && (
                                <span className="w-6 h-6 rounded-full bg-[#236B45] text-white flex items-center justify-center shrink-0">
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#4E584D] leading-relaxed">
                              {optionCopy.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-[#E2E5D9] max-w-md space-y-3">
                      <label
                        htmlFor="temp-celsius-input"
                        className="block text-sm font-semibold text-[#1E241E]"
                      >
                        {t.wizard.steps.temperature.optionalNumericLabel}
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          aria-label={t.wizard.steps.temperature.optionalNumericLabel}
                          min="5"
                          max="50"
                          step="1"
                          value={sliderTempValue}
                          onChange={(e) => {
                            setErrorMessage('');
                            onChangeFormData((prev) => ({
                              ...prev,
                              temperatureCelsius: e.target.value,
                            }));
                          }}
                          className="flex-1 h-2 rounded-lg accent-[#236B45] cursor-pointer"
                        />
                        <input
                          id="temp-celsius-input"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          max="55"
                          step="0.5"
                          value={formData.temperatureCelsius}
                          onChange={(e) => {
                            setErrorMessage('');
                            onChangeFormData((prev) => ({
                              ...prev,
                              temperatureCelsius: e.target.value,
                            }));
                          }}
                          placeholder={
                            t.wizard.steps.temperature.optionalNumericPlaceholder
                          }
                          className="w-28 min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                        />
                      </div>
                      <p className="text-xs text-[#6C756A]">
                        {t.wizard.steps.temperature.optionalNumericHint}
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 6: WATER AVAILABILITY */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#236B45]">
                        <Droplets className="w-4 h-4" aria-hidden="true" />
                        <span>{t.wizard.stepLabels[5]}</span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]">
                        {t.wizard.steps.water.question}
                      </h2>
                      <p className="text-sm sm:text-base text-[#4E584D]">
                        {t.wizard.steps.water.helper}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {waterOptions.map((item) => {
                        const Icon = item.icon;
                        const optionCopy = t.wizard.steps.water.options[item.id];
                        const selected = formData.waterAvailability === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                waterAvailability: item.id,
                              }));
                            }}
                            aria-pressed={selected}
                            className={`p-5 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] flex flex-col gap-3 min-h-[116px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                              selected
                                ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                                : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    selected
                                      ? 'bg-[#236B45] text-white'
                                      : 'bg-[#EEF5EE] text-[#236B45]'
                                  }`}
                                >
                                  <Icon className="w-5 h-5" aria-hidden="true" />
                                </span>
                                <span className="font-display font-bold text-base sm:text-lg text-[#1E241E]">
                                  {optionCopy.label}
                                </span>
                              </div>
                              {selected && (
                                <span className="w-6 h-6 rounded-full bg-[#236B45] text-white flex items-center justify-center shrink-0">
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#4E584D] leading-relaxed">
                              {optionCopy.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 7: SOIL NUTRIENTS (OPTIONAL) */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#236B45]">
                          <Sprout className="w-4 h-4" aria-hidden="true" />
                          <span>
                            {t.wizard.stepLabels[6]} · {t.wizard.optionalBadge}
                          </span>
                        </div>
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]">
                          {t.wizard.steps.nutrients.question}
                        </h2>
                        <p className="text-sm sm:text-base text-[#4E584D]">
                          {t.wizard.steps.nutrients.helper}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage('');
                          setDirection(1);
                          setPhase('summary');
                        }}
                        className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8F8F1] hover:bg-[#EEF2E4] border border-[#C9CEBD] text-sm font-semibold text-[#236B45] transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#236B45]"
                      >
                        <SkipForward className="w-4 h-4" aria-hidden="true" />
                        <span>{t.wizard.skipOptional}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="nutrient-n"
                          className="block text-sm font-semibold text-[#1E241E]"
                        >
                          {t.wizard.steps.nutrients.nitrogenLabel}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            aria-label={t.wizard.steps.nutrients.nitrogenLabel}
                            min="0"
                            max="200"
                            step="5"
                            value={Number(formData.nutrients.nitrogen) || 0}
                            onChange={(e) => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                nutrients: { ...prev.nutrients, nitrogen: e.target.value },
                              }));
                            }}
                            className="flex-1 h-2 rounded-lg accent-[#236B45] cursor-pointer"
                          />
                          <input
                            id="nutrient-n"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            value={formData.nutrients.nitrogen}
                            onChange={(e) => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                nutrients: { ...prev.nutrients, nitrogen: e.target.value },
                              }));
                            }}
                            placeholder={t.wizard.steps.nutrients.nitrogenPlaceholder}
                            className="w-24 min-h-[46px] px-3 py-2.5 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="nutrient-p"
                          className="block text-sm font-semibold text-[#1E241E]"
                        >
                          {t.wizard.steps.nutrients.phosphorusLabel}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            aria-label={t.wizard.steps.nutrients.phosphorusLabel}
                            min="0"
                            max="200"
                            step="5"
                            value={Number(formData.nutrients.phosphorus) || 0}
                            onChange={(e) => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                nutrients: {
                                  ...prev.nutrients,
                                  phosphorus: e.target.value,
                                },
                              }));
                            }}
                            className="flex-1 h-2 rounded-lg accent-[#236B45] cursor-pointer"
                          />
                          <input
                            id="nutrient-p"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            value={formData.nutrients.phosphorus}
                            onChange={(e) => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                nutrients: {
                                  ...prev.nutrients,
                                  phosphorus: e.target.value,
                                },
                              }));
                            }}
                            placeholder={t.wizard.steps.nutrients.phosphorusPlaceholder}
                            className="w-24 min-h-[46px] px-3 py-2.5 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="nutrient-k"
                          className="block text-sm font-semibold text-[#1E241E]"
                        >
                          {t.wizard.steps.nutrients.potassiumLabel}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            aria-label={t.wizard.steps.nutrients.potassiumLabel}
                            min="0"
                            max="250"
                            step="5"
                            value={Number(formData.nutrients.potassium) || 0}
                            onChange={(e) => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                nutrients: {
                                  ...prev.nutrients,
                                  potassium: e.target.value,
                                },
                              }));
                            }}
                            className="flex-1 h-2 rounded-lg accent-[#236B45] cursor-pointer"
                          />
                          <input
                            id="nutrient-k"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            value={formData.nutrients.potassium}
                            onChange={(e) => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                nutrients: {
                                  ...prev.nutrients,
                                  potassium: e.target.value,
                                },
                              }));
                            }}
                            placeholder={t.wizard.steps.nutrients.potassiumPlaceholder}
                            className="w-24 min-h-[46px] px-3 py-2.5 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="nutrient-ph"
                          className="block text-sm font-semibold text-[#1E241E]"
                        >
                          {t.wizard.steps.nutrients.phLabel}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            aria-label={t.wizard.steps.nutrients.phLabel}
                            min="3.5"
                            max="10"
                            step="0.1"
                            value={Number(formData.nutrients.ph) || 6.5}
                            onChange={(e) => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                nutrients: { ...prev.nutrients, ph: e.target.value },
                              }));
                            }}
                            className="flex-1 h-2 rounded-lg accent-[#236B45] cursor-pointer"
                          />
                          <input
                            id="nutrient-ph"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            max="14"
                            step="0.1"
                            value={formData.nutrients.ph}
                            onChange={(e) => {
                              setErrorMessage('');
                              onChangeFormData((prev) => ({
                                ...prev,
                                nutrients: { ...prev.nutrients, ph: e.target.value },
                              }));
                            }}
                            placeholder={t.wizard.steps.nutrients.phPlaceholder}
                            className="w-24 min-h-[46px] px-3 py-2.5 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-[#236B45] font-medium">
                      {t.wizard.steps.nutrients.noReportNote}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* SUMMARY REVIEW SCREEN */}
            {phase === 'summary' && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E241E]">
                    {t.wizard.summary.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-[#4E584D]">
                    {t.wizard.summary.subheading}
                  </p>
                </div>

                <div className="divide-y divide-[#E2E5D9] border-t border-b border-[#E2E5D9]">
                  {[
                    {
                      step: 1,
                      label: t.wizard.summary.locationField,
                      value: selectedDistrictObj
                        ? `${selectedDistrictObj.name[language]}, ${selectedState.name[language]}`
                        : selectedState.name[language],
                    },
                    {
                      step: 2,
                      label: t.wizard.summary.soilField,
                      value: formData.soilType
                        ? t.wizard.steps.soil.options[formData.soilType].label
                        : t.wizard.summary.notProvided,
                    },
                    {
                      step: 3,
                      label: t.wizard.summary.seasonField,
                      value: formData.season
                        ? t.wizard.steps.season.options[formData.season].label
                        : t.wizard.summary.notProvided,
                    },
                    {
                      step: 4,
                      label: t.wizard.summary.rainfallField,
                      value: formData.rainfall
                        ? t.wizard.steps.rainfall.options[formData.rainfall].label
                        : t.wizard.summary.notProvided,
                    },
                    {
                      step: 5,
                      label: t.wizard.summary.temperatureField,
                      value: formData.temperatureCategory
                        ? `${
                            t.wizard.steps.temperature.options[
                              formData.temperatureCategory
                            ].label
                          }${
                            formData.temperatureCelsius.trim()
                              ? ` · ${formData.temperatureCelsius.trim()} ${
                                  t.wizard.summary.celsiusUnit
                                }`
                              : ''
                          }`
                        : t.wizard.summary.notProvided,
                    },
                    {
                      step: 6,
                      label: t.wizard.summary.waterField,
                      value: formData.waterAvailability
                        ? t.wizard.steps.water.options[formData.waterAvailability]
                            .label
                        : t.wizard.summary.notProvided,
                    },
                    {
                      step: 7,
                      label: t.wizard.summary.nutrientsField,
                      value:
                        nutrientParts.length > 0
                          ? nutrientParts.join(' · ')
                          : t.wizard.summary.notProvided,
                    },
                  ].map((row) => (
                    <div
                      key={row.step}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-xs font-medium text-[#6C756A]">
                          {row.label}
                        </div>
                        <div className="text-sm sm:text-base font-semibold text-[#1E241E] tabular-nums">
                          {row.value}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleJumpToStep(row.step)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#236B45] hover:bg-[#EEF5EE] transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-[#236B45]"
                      >
                        <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.wizard.edit}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Validation Error Feedback */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FDF2F2] border border-[#F5C2C2] text-sm font-medium text-[#9B1C1C]"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Footer Actions (Desktop + Sticky Mobile Bar) */}
        <div className="fixed bottom-0 inset-x-0 z-20 sm:static bg-white/95 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border-t border-[#E2E5D9] sm:border-t-0 px-4 py-3 sm:p-0 sm:pt-2 flex items-center justify-between gap-3">
          <div>
            {(currentStep > 1 || phase === 'summary') && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-[#F8F8F1] hover:bg-[#EEF2E4] active:scale-[0.98] border border-[#C9CEBD] text-sm sm:text-base font-semibold text-[#1E241E] transition-all duration-150 min-h-[46px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#236B45]"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>{t.wizard.back}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {phase === 'steps' && currentStep === TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-[#236B45] hover:bg-[#1B5536] active:scale-[0.98] text-white text-sm sm:text-base font-semibold transition-all duration-150 min-h-[46px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
              >
                <span>{t.wizard.reviewAnswers}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : phase === 'steps' ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-[#236B45] hover:bg-[#1B5536] active:scale-[0.98] text-white text-sm sm:text-base font-semibold transition-all duration-150 min-h-[46px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
              >
                <span>{t.wizard.next}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitSummary}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-[#236B45] hover:bg-[#1B5536] active:scale-[0.98] text-white text-sm sm:text-base font-semibold transition-all duration-150 min-h-[46px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
              >
                <Sprout className="w-5 h-5" aria-hidden="true" />
                <span>{t.wizard.findCrops}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
