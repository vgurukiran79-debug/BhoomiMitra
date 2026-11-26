import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Droplets,
  Edit3,
  Eye,
  Info,
  Layers,
  RotateCcw,
  Sprout,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { CropFormData, LanguageCode } from '../types/bhoomi';
import type { TranslationDictionary } from '../data/translations';
import { INDIA_LOCATIONS } from '../data/locations';
import { getDemoCropsForPreview } from '../data/sampleCrops';

interface SampleResultsViewProps {
  formData: CropFormData;
  language: LanguageCode;
  t: TranslationDictionary;
  onTryAgain: () => void;
  onChangeInputs: () => void;
}

export function SampleResultsView({
  formData,
  language,
  t,
  onTryAgain,
  onChangeInputs,
}: SampleResultsViewProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [focusedCropId, setFocusedCropId] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const demoCrops = getDemoCropsForPreview(formData);
  const visibleCrops =
    focusedCropId === 'all'
      ? demoCrops
      : demoCrops.filter((c) => c.id === focusedCropId);

  const selectedState = INDIA_LOCATIONS.find((s) => s.id === formData.stateId);
  const selectedDistrict = selectedState?.districts.find(
    (d) => d.id === formData.districtId
  );

  const stateName = selectedState?.name[language] ?? formData.stateId;
  const districtName = selectedDistrict?.name[language] ?? formData.districtId;

  const soilLabel = formData.soilType
    ? t.wizard.steps.soil.options[formData.soilType].label
    : t.wizard.summary.notProvided;
  const seasonLabel = formData.season
    ? t.wizard.steps.season.options[formData.season].label
    : t.wizard.summary.notProvided;
  const rainfallLabel = formData.rainfall
    ? t.wizard.steps.rainfall.options[formData.rainfall].label
    : t.wizard.summary.notProvided;
  const tempLabel = formData.temperatureCategory
    ? `${t.wizard.steps.temperature.options[formData.temperatureCategory].label}${
        formData.temperatureCelsius.trim()
          ? ` · ${formData.temperatureCelsius.trim()} ${t.wizard.summary.celsiusUnit}`
          : ''
      }`
    : t.wizard.summary.notProvided;
  const waterLabel = formData.waterAvailability
    ? t.wizard.steps.water.options[formData.waterAvailability].label
    : t.wizard.summary.notProvided;

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
  const nutrientsLabel =
    nutrientParts.length > 0
      ? nutrientParts.join(' · ')
      : t.wizard.summary.notProvided;

  const answerRows = [
    {
      label: t.wizard.summary.locationField,
      value: `${districtName}, ${stateName}`,
    },
    { label: t.wizard.summary.soilField, value: soilLabel },
    { label: t.wizard.summary.seasonField, value: seasonLabel },
    { label: t.wizard.summary.rainfallField, value: rainfallLabel },
    { label: t.wizard.summary.temperatureField, value: tempLabel },
    { label: t.wizard.summary.waterField, value: waterLabel },
    { label: t.wizard.summary.nutrientsField, value: nutrientsLabel },
  ];

  const handleCopySummary = async () => {
    const summaryText = [
      `${t.brand.name} — ${t.results.demoBannerTitle}`,
      t.results.demoBannerBody,
      '',
      ...answerRows.map((row) => `${row.label}: ${row.value}`),
      '',
      `${t.results.heading}: ${demoCrops.map((c) => c.name[language]).join(', ')}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked in some iframe contexts; ignore gracefully
    }
  };

  return (
    <div className="space-y-6">
      <div
        role="status"
        className="bg-[#EEF5EE] border border-[#B9D6BC] rounded-2xl p-5 flex items-start gap-3.5"
      >
        <Info className="w-5 h-5 text-[#236B45] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <div className="font-display font-bold text-sm sm:text-base text-[#1E241E]">
            {t.results.demoBannerTitle}
          </div>
          <p className="text-sm sm:text-base text-[#236B45] font-medium leading-relaxed">
            {t.results.demoBannerBody}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#556054]">
            {t.results.demoOnlyTag}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1E241E]">
            {t.results.heading}
          </h2>
          <p className="text-sm sm:text-base text-[#4E584D] max-w-2xl leading-relaxed">
            {t.results.subheading}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowAnswers((prev) => !prev)}
            aria-expanded={showAnswers}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F1F2E8] active:scale-[0.98] border border-[#C9CEBD] text-sm font-semibold text-[#1E241E] transition-all duration-150 min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#236B45]"
          >
            <Eye className="w-4 h-4 text-[#236B45]" aria-hidden="true" />
            <span>
              {showAnswers
                ? t.results.actions.hideMyAnswers
                : t.results.actions.viewMyAnswers}
            </span>
            {showAnswers ? (
              <ChevronUp className="w-4 h-4 text-[#556054]" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#556054]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F1F2E8] active:scale-[0.98] border border-[#C9CEBD] text-sm font-semibold text-[#1E241E] transition-all duration-150 min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#236B45]"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#236B45]" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4 text-[#236B45]" aria-hidden="true" />
            )}
            <span>
              {copied ? t.results.actions.copiedSummary : t.results.actions.copySummary}
            </span>
          </button>

          <button
            type="button"
            onClick={onChangeInputs}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F1F2E8] active:scale-[0.98] border border-[#C9CEBD] text-sm font-semibold text-[#1E241E] transition-all duration-150 min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#236B45]"
          >
            <Edit3 className="w-4 h-4 text-[#236B45]" aria-hidden="true" />
            <span>{t.results.actions.changeInputs}</span>
          </button>

          <button
            type="button"
            onClick={onTryAgain}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#236B45] hover:bg-[#1B5536] active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150 min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#236B45]"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>{t.results.actions.tryAgain}</span>
          </button>
        </div>
      </div>

      {/* Expandable Submitted Answers Panel */}
      <AnimatePresence initial={false}>
        {showAnswers && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            aria-label={t.results.answersPanelTitle}
            className="bg-white border border-[#E2E5D9] rounded-2xl p-6"
          >
            <h3 className="font-display text-lg font-bold text-[#1E241E] mb-4">
              {t.results.answersPanelTitle}
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {answerRows.map((row) => (
                <div
                  key={row.label}
                  className="pb-3 border-b border-[#F1F2E8] sm:border-b-0"
                >
                  <dt className="text-xs font-medium text-[#6C756A]">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm sm:text-base font-semibold text-[#1E241E] tabular-nums">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Interactive Crop Focus Filter */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F1F2E8] border border-[#E2E5D9] rounded-xl w-fit max-w-full">
        <button
          type="button"
          onClick={() => setFocusedCropId('all')}
          className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap min-h-[38px] focus-visible:outline-2 focus-visible:outline-[#236B45] ${
            focusedCropId === 'all'
              ? 'bg-white text-[#1E241E] shadow-xs font-semibold'
              : 'text-[#4E584D] hover:text-[#1E241E]'
          }`}
        >
          {t.results.actions.showAllCrops}
        </button>
        {demoCrops.map((crop) => (
          <button
            key={crop.id}
            type="button"
            onClick={() => setFocusedCropId(crop.id)}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap min-h-[38px] focus-visible:outline-2 focus-visible:outline-[#236B45] ${
              focusedCropId === crop.id
                ? 'bg-white text-[#236B45] shadow-xs font-semibold'
                : 'text-[#4E584D] hover:text-[#1E241E]'
            }`}
          >
            {crop.name[language]}
          </button>
        ))}
      </div>

      <div
        className={`grid gap-6 ${
          visibleCrops.length === 1
            ? 'grid-cols-1 max-w-2xl'
            : 'grid-cols-1 lg:grid-cols-3'
        }`}
      >
        {visibleCrops.map((crop) => {
          const imgFailed = failedImages[crop.id];
          return (
            <motion.article
              layout
              key={crop.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-[#E2E5D9] hover:border-[#236B45]/40 transition-colors rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] w-full bg-[#EEF5EE] relative overflow-hidden">
                {!imgFailed ? (
                  <img
                    src={crop.imagePath}
                    alt={crop.name[language]}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [crop.id]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EEF5EE]">
                    <Sprout className="w-10 h-10 text-[#236B45] mb-2" />
                    <span className="font-display font-semibold text-sm text-[#236B45]">
                      {crop.name[language]}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col space-y-5">
                <div>
                  <p className="text-xs font-medium text-[#556054]">
                    {crop.subtitle[language]}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-[#1E241E]">
                    {crop.name[language]}
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#236B45]">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{t.results.fields.explanation}</span>
                  </div>
                  <p className="text-sm text-[#4E584D] leading-relaxed">
                    {crop.explanationPlaceholder[language]}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E5D9] space-y-3.5 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1E241E]">
                      <Layers className="w-4 h-4 text-[#73A942] shrink-0" aria-hidden="true" />
                      <span>{t.results.fields.soilSuitability}</span>
                    </div>
                    <p className="text-[#4E584D] leading-relaxed">
                      {crop.soilSuitabilityPlaceholder[language]}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1E241E]">
                      <Droplets className="w-4 h-4 text-[#236B45] shrink-0" aria-hidden="true" />
                      <span>{t.results.fields.waterRequirement}</span>
                    </div>
                    <p className="text-[#4E584D] leading-relaxed">
                      {crop.waterRequirementPlaceholder[language]}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1E241E]">
                      <Calendar className="w-4 h-4 text-[#73A942] shrink-0" aria-hidden="true" />
                      <span>{t.results.fields.seasonInfo}</span>
                    </div>
                    <p className="text-[#4E584D] leading-relaxed">
                      {crop.seasonInfoPlaceholder[language]}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F2E8] space-y-1">
                    <div className="text-xs font-semibold text-[#1E241E]">
                      {t.results.fields.additionalNotes}
                    </div>
                    <p className="text-[#4E584D] leading-relaxed">
                      {crop.additionalNotesPlaceholder[language]}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
