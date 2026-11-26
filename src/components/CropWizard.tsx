import { useState } from 'react';
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
  Snowflake,
  Sprout,
  Sun,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';
import type {
  CropFormData,
  LanguageCode,
  RainfallLevel,
  SeasonType,
  SoilType,
  TemperatureCategory,
  WaterAvailability,
  WizardPhase,
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

export function CropWizard({
  formData,
  onChangeFormData,
  onResetForm,
  language,
  t,
}: CropWizardProps) {
  const [phase, setPhase] = useState<WizardPhase>('steps');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedState =
    INDIA_LOCATIONS.find((s) => s.id === formData.stateId) ?? INDIA_LOCATIONS[0];
  const districts = selectedState.districts;

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
    setPhase('steps');
    setCurrentStep(step);
  };

  const handleClear = () => {
    onResetForm();
    setPhase('steps');
    setCurrentStep(1);
    setMaxReachedStep(1);
    setErrorMessage('');
  };

  const handleSubmitSummary = () => {
    // Re-validate all mandatory steps before showing results
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

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E241E]">
            {t.wizard.title}
          </h1>
          <p className="text-sm sm:text-base text-[#4E584D]">{t.wizard.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F1F2E8] border border-[#C9CEBD] text-sm font-semibold text-[#3A4339] transition-colors min-h-[44px] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#236B45]"
        >
          <RotateCcw className="w-4 h-4 text-[#236B45]" aria-hidden="true" />
          <span>{t.wizard.clearForm}</span>
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border border-[#E2E5D9] rounded-2xl p-4 sm:p-5 space-y-4">
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
            className="h-full bg-[#73A942] rounded-full transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
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
                className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-colors min-h-[38px] truncate focus-visible:outline-2 focus-visible:outline-[#236B45] ${
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
            className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-colors min-h-[38px] truncate focus-visible:outline-2 focus-visible:outline-[#236B45] ${
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
      </div>

      {/* Main Step or Summary Container */}
      <div className="bg-white border border-[#E2E5D9] rounded-2xl p-6 sm:p-8 space-y-6">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      htmlFor="district-select"
                      className="block text-sm font-semibold text-[#1E241E]"
                    >
                      {t.wizard.steps.location.districtLabel}
                    </label>
                    <select
                      id="district-select"
                      value={formData.districtId}
                      onChange={(e) => {
                        const newDistrict = e.target.value;
                        setErrorMessage('');
                        onChangeFormData((prev) => ({
                          ...prev,
                          districtId: newDistrict,
                        }));
                      }}
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base font-medium focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                    >
                      <option value="">
                        {t.wizard.steps.location.districtPlaceholder}
                      </option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.name[language]}
                        </option>
                      ))}
                    </select>
                  </div>
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
                        className={`relative p-5 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-3 min-h-[124px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
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
                        className={`p-5 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-3 min-h-[116px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                          selected
                            ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                            : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
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
                        className={`p-5 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-3 min-h-[116px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                          selected
                            ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                            : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
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
                        className={`p-5 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-3 min-h-[112px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                          selected
                            ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                            : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
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

                <div className="pt-4 border-t border-[#E2E5D9] max-w-sm space-y-2">
                  <label
                    htmlFor="temp-celsius-input"
                    className="block text-sm font-semibold text-[#1E241E]"
                  >
                    {t.wizard.steps.temperature.optionalNumericLabel}
                  </label>
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
                    placeholder={t.wizard.steps.temperature.optionalNumericPlaceholder}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                  />
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
                        className={`p-5 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-3 min-h-[116px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45] ${
                          selected
                            ? 'bg-[#EEF5EE] border-[#236B45] ring-2 ring-[#236B45]/20'
                            : 'bg-[#F8F8F1]/60 border-[#E2E5D9] hover:border-[#236B45]/50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="nutrient-n"
                      className="block text-sm font-semibold text-[#1E241E]"
                    >
                      {t.wizard.steps.nutrients.nitrogenLabel}
                    </label>
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
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="nutrient-p"
                      className="block text-sm font-semibold text-[#1E241E]"
                    >
                      {t.wizard.steps.nutrients.phosphorusLabel}
                    </label>
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
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="nutrient-k"
                      className="block text-sm font-semibold text-[#1E241E]"
                    >
                      {t.wizard.steps.nutrients.potassiumLabel}
                    </label>
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
                          nutrients: { ...prev.nutrients, potassium: e.target.value },
                        }));
                      }}
                      placeholder={t.wizard.steps.nutrients.potassiumPlaceholder}
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="nutrient-ph"
                      className="block text-sm font-semibold text-[#1E241E]"
                    >
                      {t.wizard.steps.nutrients.phLabel}
                    </label>
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
                      className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#F8F8F1] border border-[#C9CEBD] text-[#1E241E] text-base tabular-nums focus:outline-none focus:border-[#236B45] focus:ring-2 focus:ring-[#236B45]/20"
                    />
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
                  className="py-4 flex items-center justify-between gap-4"
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

        {/* Navigation Footer Actions */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            {(currentStep > 1 || phase === 'summary') && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F8F8F1] hover:bg-[#EEF2E4] border border-[#C9CEBD] text-sm sm:text-base font-semibold text-[#1E241E] transition-colors min-h-[48px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#236B45]"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>{t.wizard.back}</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {phase === 'steps' && currentStep === TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#236B45] hover:bg-[#1B5536] text-white text-sm sm:text-base font-semibold transition-colors min-h-[48px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
              >
                <span>{t.wizard.reviewAnswers}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : phase === 'steps' ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#236B45] hover:bg-[#1B5536] text-white text-sm sm:text-base font-semibold transition-colors min-h-[48px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
              >
                <span>{t.wizard.next}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitSummary}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#236B45] hover:bg-[#1B5536] text-white text-base font-semibold transition-colors min-h-[48px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
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
