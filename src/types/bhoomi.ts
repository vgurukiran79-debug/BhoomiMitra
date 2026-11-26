export type LanguageCode = 'en' | 'kn' | 'hi';

export type ActiveView = 'home' | 'recommend' | 'how-it-works' | 'about';

export type SoilType = 'red' | 'black' | 'sandy' | 'loamy' | 'clay' | 'not_sure';

export type SeasonType = 'kharif' | 'rabi' | 'summer' | 'not_sure';

export type RainfallLevel = 'low' | 'normal' | 'heavy' | 'not_sure';

export type TemperatureCategory = 'cool' | 'moderate' | 'hot' | 'not_sure';

export type WaterAvailability = 'low' | 'medium' | 'good' | 'not_sure';

export interface SoilNutrients {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
}

export interface CropFormData {
  stateId: string;
  districtId: string;
  soilType: SoilType | '';
  season: SeasonType | '';
  rainfall: RainfallLevel | '';
  temperatureCategory: TemperatureCategory | '';
  temperatureCelsius: string;
  waterAvailability: WaterAvailability | '';
  nutrients: SoilNutrients;
}

export type WizardPhase = 'steps' | 'summary' | 'results';

export interface LocalizedText {
  en: string;
  kn: string;
  hi: string;
}

export interface DistrictOption {
  id: string;
  name: LocalizedText;
}

export interface StateOption {
  id: string;
  name: LocalizedText;
  districts: DistrictOption[];
}

export interface SampleCropItem {
  id: string;
  imagePath: string;
  name: LocalizedText;
  subtitle: LocalizedText;
  explanationPlaceholder: LocalizedText;
  soilSuitabilityPlaceholder: LocalizedText;
  waterRequirementPlaceholder: LocalizedText;
  seasonInfoPlaceholder: LocalizedText;
  additionalNotesPlaceholder: LocalizedText;
}
