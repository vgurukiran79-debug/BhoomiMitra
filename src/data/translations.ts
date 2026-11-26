import type {
  LanguageCode,
  RainfallLevel,
  SeasonType,
  SoilType,
  TemperatureCategory,
  WaterAvailability,
} from '../types/bhoomi';

export interface OptionContent {
  label: string;
  description: string;
}

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
  };
  nav: {
    home: string;
    recommend: string;
    howItWorks: string;
    about: string;
    menuLabel: string;
    closeMenu: string;
    languageLabel: string;
  };
  home: {
    heroHeading: string;
    heroSubheading: string;
    primaryCta: string;
    secondaryCta: string;
    heroImageAlt: string;
    featuresHeading: string;
    features: {
      smartSelection: {
        title: string;
        description: string;
      };
      easyGuidance: {
        title: string;
        description: string;
      };
      aiAssistance: {
        title: string;
        description: string;
      };
    };
  };
  wizard: {
    title: string;
    subtitle: string;
    stepOf: string;
    stepLabels: string[];
    summaryLabel: string;
    back: string;
    next: string;
    clearForm: string;
    reviewAnswers: string;
    findCrops: string;
    edit: string;
    optionalBadge: string;
    skipOptional: string;
    validation: {
      selectDistrict: string;
      selectSoil: string;
      selectSeason: string;
      selectRainfall: string;
      selectTemperature: string;
      invalidTemperature: string;
      selectWater: string;
      invalidPh: string;
      invalidNutrient: string;
    };
    steps: {
      location: {
        question: string;
        helper: string;
        stateLabel: string;
        districtLabel: string;
        districtPlaceholder: string;
        karnatakaNote: string;
      };
      soil: {
        question: string;
        helper: string;
        options: Record<SoilType, OptionContent>;
      };
      season: {
        question: string;
        helper: string;
        options: Record<SeasonType, OptionContent>;
      };
      rainfall: {
        question: string;
        helper: string;
        options: Record<RainfallLevel, OptionContent>;
      };
      temperature: {
        question: string;
        helper: string;
        options: Record<TemperatureCategory, OptionContent>;
        optionalNumericLabel: string;
        optionalNumericPlaceholder: string;
        optionalNumericHint: string;
      };
      water: {
        question: string;
        helper: string;
        options: Record<WaterAvailability, OptionContent>;
      };
      nutrients: {
        question: string;
        helper: string;
        nitrogenLabel: string;
        nitrogenPlaceholder: string;
        phosphorusLabel: string;
        phosphorusPlaceholder: string;
        potassiumLabel: string;
        potassiumPlaceholder: string;
        phLabel: string;
        phPlaceholder: string;
        noReportNote: string;
      };
    };
    summary: {
      heading: string;
      subheading: string;
      locationField: string;
      soilField: string;
      seasonField: string;
      rainfallField: string;
      temperatureField: string;
      waterField: string;
      nutrientsField: string;
      notProvided: string;
      celsiusUnit: string;
    };
  };
  results: {
    demoBannerTitle: string;
    demoBannerBody: string;
    heading: string;
    subheading: string;
    demoOnlyTag: string;
    fields: {
      explanation: string;
      soilSuitability: string;
      waterRequirement: string;
      seasonInfo: string;
      additionalNotes: string;
    };
    actions: {
      tryAgain: string;
      changeInputs: string;
      viewMyAnswers: string;
      hideMyAnswers: string;
    };
    answersPanelTitle: string;
  };
  howItWorks: {
    heading: string;
    subheading: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    futureNoteTitle: string;
    futureNoteBody: string;
    startCta: string;
  };
  about: {
    heading: string;
    description: string;
    pillars: Array<{
      title: string;
      body: string;
    }>;
    roadmapTitle: string;
    roadmapBody: string;
    exploreCta: string;
  };
  footer: {
    note: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brand: {
      name: 'BhoomiMitra',
      tagline: 'Your Smart Farming Companion',
    },
    nav: {
      home: 'Home',
      recommend: 'Crop Recommendation',
      howItWorks: 'How It Works',
      about: 'About',
      menuLabel: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      languageLabel: 'Language',
    },
    home: {
      heroHeading: 'Find the Right Crop for Your Land',
      heroSubheading:
        "Tell us about your soil, weather and water conditions. We'll help you explore suitable crops.",
      primaryCta: 'Get Crop Recommendation',
      secondaryCta: 'How It Works',
      heroImageAlt: 'Lush green agricultural farmland in Karnataka under warm morning sunlight',
      featuresHeading: 'Designed Around Everyday Farming Decisions',
      features: {
        smartSelection: {
          title: 'Smart Crop Selection',
          description:
            'Match your local district, soil type, seasonal weather, and water availability with suitable crop suggestions.',
        },
        easyGuidance: {
          title: 'Easy Farming Guidance',
          description:
            'Answer clear visual questions without needing complex lab numbers or technical weather measurements.',
        },
        aiAssistance: {
          title: 'AI-Powered Assistance',
          description:
            'Built to combine Machine Learning predictions with simple-language AI explanations in the next release.',
        },
      },
    },
    wizard: {
      title: 'Crop Recommendation',
      subtitle: 'Answer seven quick questions about your land to view sample crop suggestions.',
      stepOf: 'Step {current} of {total}',
      stepLabels: [
        'Location',
        'Soil Type',
        'Season',
        'Rainfall',
        'Weather',
        'Water',
        'Nutrients',
      ],
      summaryLabel: 'Review',
      back: 'Back',
      next: 'Next',
      clearForm: 'Clear Form',
      reviewAnswers: 'Review Answers',
      findCrops: 'Find Suitable Crops',
      edit: 'Edit',
      optionalBadge: 'Optional',
      skipOptional: 'Skip to Summary',
      validation: {
        selectDistrict: 'Please select your district before continuing.',
        selectSoil: 'Please choose a soil type (or select Not Sure).',
        selectSeason: 'Please choose your planned farming season (or Not Sure).',
        selectRainfall: 'Please choose the usual rainfall in your area (or Not Sure).',
        selectTemperature: 'Please select how the weather feels in your area (or Not Sure).',
        invalidTemperature: 'Please enter a realistic temperature between 0°C and 55°C.',
        selectWater: 'Please select your water availability (or Not Sure).',
        invalidPh: 'Soil pH should be between 0 and 14.',
        invalidNutrient: 'Please enter a valid non-negative number.',
      },
      steps: {
        location: {
          question: 'Where is your farmland located?',
          helper: 'Started with Karnataka districts. You can switch to another Indian state anytime.',
          stateLabel: 'State',
          districtLabel: 'District',
          districtPlaceholder: 'Select your district',
          karnatakaNote: 'All 31 Karnataka districts are ready to select.',
        },
        soil: {
          question: 'What type of soil do you have?',
          helper: 'Pick the soil that looks and feels closest to your field.',
          options: {
            red: {
              label: 'Red Soil',
              description: 'Reddish, porous soil common across many dryland farms.',
            },
            black: {
              label: 'Black Soil',
              description: 'Deep dark soil that holds moisture well and cracks when dry.',
            },
            sandy: {
              label: 'Sandy Soil',
              description: 'Light, gritty soil that drains water very quickly.',
            },
            loamy: {
              label: 'Loamy Soil',
              description: 'Soft, balanced, dark-brown fertile soil easy to crumble.',
            },
            clay: {
              label: 'Clay Soil',
              description: 'Heavy, sticky soil when wet that holds water for long.',
            },
            not_sure: {
              label: 'Not Sure',
              description: 'Skip guessing if you have not checked your soil type yet.',
            },
          },
        },
        season: {
          question: 'Which season are you planning to grow crops in?',
          helper: 'Choose the main sowing season for your upcoming crop cycle.',
          options: {
            kharif: {
              label: 'Kharif (Rainy Season)',
              description: 'June to October sowing with southwest monsoon rains.',
            },
            rabi: {
              label: 'Rabi (Winter Season)',
              description: 'October to March sowing in cooler post-monsoon weather.',
            },
            summer: {
              label: 'Summer',
              description: 'March to June warm-weather cultivation with irrigation.',
            },
            not_sure: {
              label: 'Not Sure',
              description: 'Not decided on a specific season yet.',
            },
          },
        },
        rainfall: {
          question: 'How much rain does your area usually receive?',
          helper: 'Choose based on your local experience—no millimeter measurements needed.',
          options: {
            low: {
              label: 'Low Rainfall',
              description: 'Less rain than usual; mostly dry spells during the season.',
            },
            normal: {
              label: 'Normal Rainfall',
              description: 'Regular, steady seasonal rainfall typical for your area.',
            },
            heavy: {
              label: 'Heavy Rainfall',
              description: 'Frequent or heavy rain across the growing months.',
            },
            not_sure: {
              label: 'Not Sure',
              description: 'Rainfall pattern varies or is uncertain.',
            },
          },
        },
        temperature: {
          question: 'How is the weather in your area?',
          helper: 'Pick the general temperature feel, and optionally enter °C if you know it.',
          options: {
            cool: {
              label: 'Cool',
              description: 'Pleasant mornings and cool nights during the crop season.',
            },
            moderate: {
              label: 'Moderate',
              description: 'Balanced warm days without extreme heat or cold.',
            },
            hot: {
              label: 'Hot',
              description: 'Strong sunshine and high daytime temperatures.',
            },
            not_sure: {
              label: 'Not Sure',
              description: 'Weather changes often or is not known.',
            },
          },
          optionalNumericLabel: 'Exact Temperature in °C (Optional)',
          optionalNumericPlaceholder: 'e.g. 28',
          optionalNumericHint: 'Leave blank if you do not have a temperature reading.',
        },
        water: {
          question: 'How much water is available for farming?',
          helper: 'Consider borewell, canal, tank, or rainfed water access on your land.',
          options: {
            low: {
              label: 'Low',
              description: 'Limited water; mostly dependent on rain or sparse irrigation.',
            },
            medium: {
              label: 'Medium',
              description: 'Some water available for timely supplemental irrigation.',
            },
            good: {
              label: 'Good',
              description: 'Sufficient water available throughout the growing cycle.',
            },
            not_sure: {
              label: 'Not Sure',
              description: 'Water supply varies or is not yet assessed.',
            },
          },
        },
        nutrients: {
          question: 'Do you have Soil Nutrient details? (Optional)',
          helper: 'If you have a Soil Health Card or lab report, enter NPK and pH below. Otherwise, you can skip straight to review.',
          nitrogenLabel: 'Nitrogen (N) kg/ha',
          nitrogenPlaceholder: 'e.g. 80',
          phosphorusLabel: 'Phosphorus (P) kg/ha',
          phosphorusPlaceholder: 'e.g. 40',
          potassiumLabel: 'Potassium (K) kg/ha',
          potassiumPlaceholder: 'e.g. 40',
          phLabel: 'Soil pH (0–14)',
          phPlaceholder: 'e.g. 6.5',
          noReportNote: 'No soil test report? Leave these blank and continue to review your answers.',
        },
      },
      summary: {
        heading: 'Review Your Farming Details',
        subheading: 'Check your selections below before viewing the sample crop demonstration.',
        locationField: 'Location (State & District)',
        soilField: 'Soil Type',
        seasonField: 'Planned Season',
        rainfallField: 'Usual Rainfall',
        temperatureField: 'Weather & Temperature',
        waterField: 'Water Availability',
        nutrientsField: 'Soil Nutrients (NPK & pH)',
        notProvided: 'Not provided (Optional)',
        celsiusUnit: '°C',
      },
    },
    results: {
      demoBannerTitle: 'Sample Demonstration Result',
      demoBannerBody:
        'Sample demonstration – Actual recommendations will be available after ML integration.',
      heading: 'Sample Crop Suggestions',
      subheading:
        'Below are three demonstration cards illustrating how BhoomiMitra will present tailored crops and plain-language guidance once the ML model and Gemini API are connected.',
      demoOnlyTag: 'DEMO DATA ONLY · Frontend Preview',
      fields: {
        explanation: 'Simple Explanation',
        soilSuitability: 'Soil Suitability',
        waterRequirement: 'Water Requirement',
        seasonInfo: 'Season Information',
        additionalNotes: 'Additional Recommendations',
      },
      actions: {
        tryAgain: 'Try Again',
        changeInputs: 'Change Inputs',
        viewMyAnswers: 'View My Answers',
        hideMyAnswers: 'Hide My Answers',
      },
      answersPanelTitle: 'Your Submitted Farming Inputs',
    },
    howItWorks: {
      heading: 'How BhoomiMitra Works',
      subheading:
        'Three straightforward steps designed so any farmer can check crop ideas quickly on a phone or computer.',
      steps: [
        {
          number: '01',
          title: 'Enter your farming details',
          description:
            'Choose your district, soil type, season, rainfall pattern, weather, and water availability using clear visual cards—plus optional soil test values.',
        },
        {
          number: '02',
          title: 'Our crop recommendation system analyses your information',
          description:
            'In the upcoming full release, a trained Machine Learning model will evaluate your field conditions alongside regional agricultural patterns.',
        },
        {
          number: '03',
          title: 'Explore suitable crop suggestions',
          description:
            'Review clear crop choices paired with easy-to-understand AI explanations covering soil fit, watering needs, and seasonal timing.',
        },
      ],
      futureNoteTitle: 'Built for Future ML & AI Integration',
      futureNoteBody:
        'This current version showcases the interactive frontend workflow using demonstration data only. Future updates will connect a trained Machine Learning prediction engine and Gemini API for plain-language agricultural guidance.',
      startCta: 'Try the Crop Recommendation Form',
    },
    about: {
      heading: 'Technology That Understands Farming',
      description:
        'BhoomiMitra aims to make crop selection simpler by combining agricultural information, machine learning and AI-powered assistance.',
      pillars: [
        {
          title: 'Farmer-First Clarity',
          body: 'Large visual cards, everyday farming language, and support for English, ಕನ್ನಡ, and हिन्दी make the system welcoming across devices.',
        },
        {
          title: 'Flexible Inputs',
          body: 'Farmers never get blocked by missing lab tests or millimeter rainfall charts—qualitative choices and Not Sure options always work.',
        },
        {
          title: 'Transparent Stage-by-Stage Engineering',
          body: 'This frontend release establishes a dependable user experience first, ready to plug cleanly into verified ML models and Gemini guidance.',
        },
      ],
      roadmapTitle: 'Planned Intelligence Architecture',
      roadmapBody:
        'Once integrated, BhoomiMitra will pair a dedicated Machine Learning crop suitability model with AI-powered explanations so farmers understand not just what to grow, but why it fits their land.',
      exploreCta: 'Explore Crop Recommendation',
    },
    footer: {
      note: 'BhoomiMitra · Frontend Prototype Stage · Sample Demonstration Data Only',
    },
  },

  kn: {
    brand: {
      name: 'ಭೂಮಿಮಿತ್ರ',
      tagline: 'ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಂಗಾತಿ',
    },
    nav: {
      home: 'ಮುಖಪುಟ',
      recommend: 'ಬೆಳೆ ಶಿಫಾರಸು',
      howItWorks: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      menuLabel: 'ಮೆನು ತೆರೆಯಿರಿ',
      closeMenu: 'ಮೆನು ಮುಚ್ಚಿರಿ',
      languageLabel: 'ಭಾಷೆ',
    },
    home: {
      heroHeading: 'ನಿಮ್ಮ ಭೂಮಿಗೆ ಸೂಕ್ತವಾದ ಬೆಳೆಯನ್ನು ಹುಡುಕಿ',
      heroSubheading:
        'ನಿಮ್ಮ ಮಣ್ಣು, ಹವಾಮಾನ ಮತ್ತು ನೀರಿನ ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ. ಸೂಕ್ತವಾದ ಬೆಳೆಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
      primaryCta: 'ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ',
      secondaryCta: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
      heroImageAlt: 'ಬೆಳಗಿನ ಸೂರ್ಯನ ಬೆಳಕಿನಲ್ಲಿ ಕರ್ನಾಟಕದ ಹಸಿರು ಕೃಷಿ ಭೂಮಿ',
      featuresHeading: 'ರೈತರ ದೈನಂದಿನ ನಿರ್ಧಾರಗಳಿಗೆ ನೆರವಾಗುವ ವಿನ್ಯಾಸ',
      features: {
        smartSelection: {
          title: 'ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಆಯ್ಕೆ',
          description:
            'ನಿಮ್ಮ ಜಿಲ್ಲೆ, ಮಣ್ಣಿನ ವಿಧ, ಹಂಗಾಮು ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆಗೆ ಹೊಂದುವ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.',
        },
        easyGuidance: {
          title: 'ಸುಲಭ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ',
          description:
            'ಸಂಕೀರ್ಣ ಪ್ರಯೋಗಾಲಯ ಅಂಕಿ-ಅಂಶಗಳಿಲ್ಲದೆ ಸರಳ ಚಿತ್ರ-ಆಧಾರಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.',
        },
        aiAssistance: {
          title: 'AI-ಆಧಾರಿತ ನೆರವು',
          description:
            'ಮುಂದಿನ ಹಂತದಲ್ಲಿ ಯಂತ್ರ ಕಲಿಕೆ (ML) ಮುನ್ಸೂಚನೆ ಮತ್ತು ಸರಳ ಭಾಷೆಯ AI ವಿವರಣೆಯನ್ನು ಒಟ್ಟುಗೂಡಿಸಲು ಸಿದ್ಧವಾಗಿದೆ.',
        },
      },
    },
    wizard: {
      title: 'ಬೆಳೆ ಶಿಫಾರಸು',
      subtitle: 'ಮಾದರಿ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ನೋಡಲು ನಿಮ್ಮ ಜಮೀನಿನ ಕುರಿತು ಏಳು ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.',
      stepOf: 'ಹಂತ {current} / {total}',
      stepLabels: [
        'ಸ್ಥಳ',
        'ಮಣ್ಣಿನ ವಿಧ',
        'ಹಂಗಾಮು',
        'ಮಳೆ',
        'ಹವಾಮಾನ',
        'ನೀರು',
        'ಪೋಷಕಾಂಶ',
      ],
      summaryLabel: 'ಪರಿಶೀಲನೆ',
      back: 'ಹಿಂದೆ',
      next: 'ಮುಂದೆ',
      clearForm: 'ಫಾರ್ಮ್ ತೆರವುಗೊಳಿಸಿ',
      reviewAnswers: 'ಉತ್ತರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
      findCrops: 'ಸೂಕ್ತ ಬೆಳೆಗಳನ್ನು ಹುಡುಕಿ',
      edit: 'ಬದಲಾಯಿಸಿ',
      optionalBadge: 'ಐಚ್ಛಿಕ',
      skipOptional: 'ಸಾರಾಂಶಕ್ಕೆ ಹೋಗಿ',
      validation: {
        selectDistrict: 'ಮುಂದುವರಿಯುವ ಮೊದಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        selectSoil: 'ದಯವಿಟ್ಟು ಮಣ್ಣಿನ ವಿಧವನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಅಥವಾ ಖಚಿತವಿಲ್ಲ ಆಯ್ಕೆಮಾಡಿ).',
        selectSeason: 'ದಯವಿಟ್ಟು ಬೆಳೆ ಹಂಗಾಮನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಅಥವಾ ಖಚಿತವಿಲ್ಲ ಆಯ್ಕೆಮಾಡಿ).',
        selectRainfall: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರದೇಶದ ಮಳೆ ಪ್ರಮಾಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಅಥವಾ ಖಚಿತವಿಲ್ಲ).',
        selectTemperature: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರದೇಶದ ಹವಾಮಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಅಥವಾ ಖಚಿತವಿಲ್ಲ).',
        invalidTemperature: 'ದಯವಿಟ್ಟು 0°C ಮತ್ತು 55°C ನಡುವಿನ ಸರಿಯಾದ ತಾಪಮಾನವನ್ನು ನಮೂದಿಸಿ.',
        selectWater: 'ದಯವಿಟ್ಟು ನೀರಿನ ಲಭ್ಯತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಅಥವಾ ಖಚಿತವಿಲ್ಲ).',
        invalidPh: 'ಮಣ್ಣಿನ pH ಮೌಲ್ಯವು 0 ಮತ್ತು 14 ರ ನಡುವೆ ಇರಬೇಕು.',
        invalidNutrient: 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಶೂನ್ಯ ಅಥವಾ ಧನಾತ್ಮಕ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
      },
      steps: {
        location: {
          question: 'ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿ ಎಲ್ಲಿದೆ?',
          helper: 'ಕರ್ನಾಟಕದ ಜಿಲ್ಲೆಗಳಿಂದ ಪ್ರಾರಂಭಿಸಲಾಗಿದೆ. ನೀವು ಬೇರೆ ರಾಜ್ಯವನ್ನೂ ಬದಲಾಯಿಸಬಹುದು.',
          stateLabel: 'ರಾಜ್ಯ',
          districtLabel: 'ಜಿಲ್ಲೆ',
          districtPlaceholder: 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
          karnatakaNote: 'ಕರ್ನಾಟಕದ ಎಲ್ಲಾ 31 ಜಿಲ್ಲೆಗಳು ಆಯ್ಕೆಗೆ ಲಭ್ಯವಿವೆ.',
        },
        soil: {
          question: 'ನಿಮ್ಮ ಜಮೀನಿನಲ್ಲಿ ಯಾವ ರೀತಿಯ ಮಣ್ಣು ಇದೆ?',
          helper: 'ನಿಮ್ಮ ಹೊಲದ ಮಣ್ಣಿಗೆ ಹತ್ತಿರವಾದ ವಿಧವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
          options: {
            red: {
              label: 'ಕೆಂಪು ಮಣ್ಣು',
              description: 'ಒಣಭೂಮಿ ಕೃಷಿಯಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಕಂಡುಬರುವ ಕೆಂಪು ಮಣ್ಣು.',
            },
            black: {
              label: 'ಕಪ್ಪು ಮಣ್ಣು',
              description: 'ತೇವಾಂಶವನ್ನು ಚೆನ್ನಾಗಿ ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುವ ಆಳವಾದ ಕಪ್ಪು ಮಣ್ಣು.',
            },
            sandy: {
              label: 'ಮರಳು ಮಣ್ಣು',
              description: 'ನೀರನ್ನು ಬೇಗನೆ ಬಸಿದುಹೋಗುವ ಹಗುರವಾದ ಮಣ್ಣು.',
            },
            loamy: {
              label: 'ಗೋಡು ಮಣ್ಣು',
              description: 'ಮೃದುವಾದ, ಸಮತೋಲಿತ ಮತ್ತು ಫಲವತ್ತಾದ ಮಿಶ್ರ ಮಣ್ಣು.',
            },
            clay: {
              label: 'ಜೇಡಿ ಮಣ್ಣು',
              description: 'ಒದ್ದೆಯಾದಾಗ ಅಂಟಿಕೊಳ್ಳುವ ಮತ್ತು ನೀರನ್ನು ಹೆಚ್ಚು ಕಾಲ ಹಿಡಿದಿಡುವ ಮಣ್ಣು.',
            },
            not_sure: {
              label: 'ಖಚಿತವಿಲ್ಲ',
              description: 'ಮಣ್ಣಿನ ವಿಧ ಖಚಿತವಾಗಿ ತಿಳಿದಿಲ್ಲದಿದ್ದರೆ ಇದನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
            },
          },
        },
        season: {
          question: 'ನೀವು ಯಾವ ಹಂಗಾಮಿನಲ್ಲಿ ಬೆಳೆ ಬೆಳೆಯಲು ಯೋಜಿಸುತ್ತಿದ್ದೀರಿ?',
          helper: 'ಮುಂದಿನ ಬಿತ್ತನೆಗೆ ನಿಮ್ಮ ಮುಖ್ಯ ಹಂಗಾಮನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
          options: {
            kharif: {
              label: 'ಖರೀಫ್ (ಮುಂಗಾರು ಮಳೆಗಾಲ)',
              description: 'ಜೂನ್‌ನಿಂದ ಅಕ್ಟೋಬರ್‌ವರೆಗೆ ಮುಂಗಾರು ಮಳೆಯಲ್ಲಿ ಬಿತ್ತನೆ.',
            },
            rabi: {
              label: 'ರಬಿ (ಹಿಂಗಾರು ಚಳಿಗಾಲ)',
              description: 'ಅಕ್ಟೋಬರ್‌ನಿಂದ ಮಾರ್ಚ್‌ವರೆಗೆ ತಂಪಾದ ಹವಾಮಾನದಲ್ಲಿ ಬಿತ್ತನೆ.',
            },
            summer: {
              label: 'ಬೇಸಿಗೆ',
              description: 'ಮಾರ್ಚ್‌ನಿಂದ ಜೂನ್‌ವರೆಗೆ ನೀರಾವರಿ ಆಧಾರಿತ ಬೇಸಿಗೆ ಕೃಷಿ.',
            },
            not_sure: {
              label: 'ಖಚಿತವಿಲ್ಲ',
              description: 'ಹಂಗಾಮು ಇನ್ನೂ ನಿರ್ಧಾರವಾಗದಿದ್ದರೆ ಇದನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
            },
          },
        },
        rainfall: {
          question: 'ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಎಷ್ಟು ಮಳೆಯಾಗುತ್ತದೆ?',
          helper: 'ಮಿಲಿಮೀಟರ್ ಅಳತೆ ಬೇಕಿಲ್ಲ—ನಿಮ್ಮ ಅನುಭವದ ಆಧಾರದಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ.',
          options: {
            low: {
              label: 'ಕಡಿಮೆ ಮಳೆ',
              description: 'ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಕಡಿಮೆ ಮಳೆ; ಹೆಚ್ಚಾಗಿ ಒಣ ಹವಾಮಾನ.',
            },
            normal: {
              label: 'ಸಾಮಾನ್ಯ ಮಳೆ',
              description: 'ಪ್ರದೇಶಕ್ಕೆ ತಕ್ಕಂತೆ ನಿಯಮಿತ ಮತ್ತು ಸಮತೋಲಿತ ಮಳೆ.',
            },
            heavy: {
              label: 'ಹೆಚ್ಚು ಮಳೆ',
              description: 'ಬೆಳೆ ಅವಧಿಯಲ್ಲಿ ನಿರಂತರ ಅಥವಾ ಭಾರೀ ಮಳೆ.',
            },
            not_sure: {
              label: 'ಖಚಿತವಿಲ್ಲ',
              description: 'ಮಳೆಯ ಪ್ರಮಾಣ ಬದಲಾಗುತ್ತಿರುತ್ತದೆ ಅಥವಾ ತಿಳಿದಿಲ್ಲ.',
            },
          },
        },
        temperature: {
          question: 'ನಿಮ್ಮ ಪ್ರದೇಶದ ಹವಾಮಾನ ಹೇಗಿದೆ?',
          helper: 'ಸಾಮಾನ್ಯ ಹವಾಮಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ; ತಿಳಿದಿದ್ದರೆ °C ನಲ್ಲಿ ನಮೂದಿಸಬಹುದು.',
          options: {
            cool: {
              label: 'ತಂಪಾದ ಹವಾಮಾನ',
              description: 'ಬೆಳೆ ಅವಧಿಯಲ್ಲಿ ಹಿತಕರ ಬೆಳಗು ಮತ್ತು ತಂಪಾದ ರಾತ್ರಿಗಳು.',
            },
            moderate: {
              label: 'ಮಧ್ಯಮ ಹವಾಮಾನ',
              description: 'ಅತಿಯಾದ ಬಿಸಿ ಅಥವಾ ಚಳಿಯಿಲ್ಲದ ಸಮತೋಲಿತ ಹವಾಮಾನ.',
            },
            hot: {
              label: 'ಬಿಸಿ ಹವಾಮಾನ',
              description: 'ಬಲವಾದ ಬಿಸಿಲು ಮತ್ತು ಹೆಚ್ಚಿನ ಹಗಲಿನ ತಾಪಮಾನ.',
            },
            not_sure: {
              label: 'ಖಚಿತವಿಲ್ಲ',
              description: 'ಹವಾಮಾನವು ಆಗಾಗ್ಗೆ ಬದಲಾಗುತ್ತದೆ ಅಥವಾ ಖಚಿತವಿಲ್ಲ.',
            },
          },
          optionalNumericLabel: 'ನಿಖರ ತಾಪಮಾನ °C ನಲ್ಲಿ (ಐಚ್ಛಿಕ)',
          optionalNumericPlaceholder: 'ಉದಾ. 28',
          optionalNumericHint: 'ತಾಪಮಾನದ ಅಳತೆ ತಿಳಿದಿಲ್ಲದಿದ್ದರೆ ಖಾಲಿ ಬಿಡಿ.',
        },
        water: {
          question: 'ಕೃಷಿಗೆ ಎಷ್ಟು ನೀರು ಲಭ್ಯವಿದೆ?',
          helper: 'ಬೋರ್‌ವೆಲ್, ಕಾಲುವೆ, ಕೆರೆ ಅಥವಾ ಮಳೆಯಾಶ್ರಿತ ನೀರಿನ ಲಭ್ಯತೆಯನ್ನು ಗಮನಿಸಿ.',
          options: {
            low: {
              label: 'ಕಡಿಮೆ – ಸೀಮಿತ ನೀರು',
              description: 'ಮುಖ್ಯವಾಗಿ ಮಳೆ ಅಥವಾ ಸೀಮಿತ ನೀರಾವರಿ ಮೇಲೆ ಅವಲಂಬಿತ.',
            },
            medium: {
              label: 'ಮಧ್ಯಮ – ಸ್ವಲ್ಪ ನೀರು ಲಭ್ಯ',
              description: 'ಅಗತ್ಯ ಸಮಯದಲ್ಲಿ ಪೂರಕ ನೀರಾವರಿಗೆ ತಕ್ಕಷ್ಟು ನೀರು ಲಭ್ಯ.',
            },
            good: {
              label: 'ಉತ್ತಮ – ಸಾಕಷ್ಟು ನೀರು',
              description: 'ಬೆಳೆಯ ಸಂಪೂರ್ಣ ಅವಧಿಗೆ ಸಾಕಷ್ಟು ನೀರು ಲಭ್ಯವಿದೆ.',
            },
            not_sure: {
              label: 'ಖಚಿತವಿಲ್ಲ',
              description: 'ನೀರಿನ ಲಭ್ಯತೆ ಬದಲಾಗುತ್ತಿರುತ್ತದೆ ಅಥವಾ ಖಚಿತವಿಲ್ಲ.',
            },
          },
        },
        nutrients: {
          question: 'ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳ ವಿವರ ಇದೆಯೇ? (ಐಚ್ಛಿಕ)',
          helper: 'ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಅಥವಾ ಪರೀಕ್ಷಾ ವರದಿ ಇದ್ದರೆ NPK ಮತ್ತು pH ನಮೂದಿಸಿ. ಇಲ್ಲದಿದ್ದರೆ ಮುಂದುವರಿಯಬಹುದು.',
          nitrogenLabel: 'ಸಾರಜನಕ (N) kg/ha',
          nitrogenPlaceholder: 'ಉದಾ. 80',
          phosphorusLabel: 'ರಂಜಕ (P) kg/ha',
          phosphorusPlaceholder: 'ಉದಾ. 40',
          potassiumLabel: 'ಪೊಟ್ಯಾಶಿಯಂ (K) kg/ha',
          potassiumPlaceholder: 'ಉದಾ. 40',
          phLabel: 'ಮಣ್ಣಿನ pH (0–14)',
          phPlaceholder: 'ಉದಾ. 6.5',
          noReportNote: 'ಮಣ್ಣು ಪರೀಕ್ಷಾ ವರದಿ ಇಲ್ಲವೇ? ಇವುಗಳನ್ನು ಖಾಲಿ ಬಿಟ್ಟು ಸಾರಾಂಶಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ.',
        },
      },
      summary: {
        heading: 'ನಿಮ್ಮ ಕೃಷಿ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
        subheading: 'ಮಾದರಿ ಬೆಳೆ ಪ್ರದರ್ಶನವನ್ನು ನೋಡುವ ಮೊದಲು ನಿಮ್ಮ ಆಯ್ಕೆಗಳನ್ನು ಕೆಳಗೆ ಪರಿಶೀಲಿಸಿ.',
        locationField: 'ಸ್ಥಳ (ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ)',
        soilField: 'ಮಣ್ಣಿನ ವಿಧ',
        seasonField: 'ಯೋಜಿತ ಹಂಗಾಮು',
        rainfallField: 'ಸಾಮಾನ್ಯ ಮಳೆ',
        temperatureField: 'ಹವಾಮಾನ ಮತ್ತು ತಾಪಮಾನ',
        waterField: 'ನೀರಿನ ಲಭ್ಯತೆ',
        nutrientsField: 'ಮಣ್ಣಿನ ಪೋಷಕಾಂಶಗಳು (NPK ಮತ್ತು pH)',
        notProvided: 'ನೀಡಲಾಗಿಲ್ಲ (ಐಚ್ಛಿಕ)',
        celsiusUnit: '°C',
      },
    },
    results: {
      demoBannerTitle: 'ಮಾದರಿ ಪ್ರದರ್ಶನ ಫಲಿತಾಂಶ',
      demoBannerBody:
        'ಮಾದರಿ ಪ್ರದರ್ಶನ – ಯಂತ್ರ ಕಲಿಕೆ (ML) ಏಕೀಕರಣದ ನಂತರ ನಿಜವಾದ ಶಿಫಾರಸುಗಳು ಲಭ್ಯವಾಗುತ್ತವೆ.',
      heading: 'ಮಾದರಿ ಬೆಳೆ ಸಲಹೆಗಳು',
      subheading:
        'ML ಮಾದರಿ ಮತ್ತು Gemini API ಸಂಪರ್ಕಗೊಂಡ ನಂತರ ಭೂಮಿಮಿತ್ರ ಹೇಗೆ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ತೋರಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ವಿವರಿಸುವ ಮೂರು ಮಾದರಿ ಕಾರ್ಡ್‌ಗಳು ಕೆಳಗಿವೆ.',
      demoOnlyTag: 'ಕೇವಲ ಮಾದರಿ ಡೇಟಾ · ಫ್ರಂಟ್‌ಎಂಡ್ ಪೂರ್ವವೀಕ್ಷಣೆ',
      fields: {
        explanation: 'ಸರಳ ವಿವರಣೆ',
        soilSuitability: 'ಮಣ್ಣಿನ ಸೂಕ್ತತೆ',
        waterRequirement: 'ನೀರಿನ ಅವಶ್ಯಕತೆ',
        seasonInfo: 'ಹಂಗಾಮು ಮಾಹಿತಿ',
        additionalNotes: 'ಹೆಚ್ಚುವರಿ ಸಲಹೆಗಳು',
      },
      actions: {
        tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
        changeInputs: 'ಮಾಹಿತಿ ಬದಲಾಯಿಸಿ',
        viewMyAnswers: 'ನನ್ನ ಉತ್ತರಗಳನ್ನು ನೋಡಿ',
        hideMyAnswers: 'ಉತ್ತರಗಳನ್ನು ಮರೆಮಾಡಿ',
      },
      answersPanelTitle: 'ನೀವು ಸಲ್ಲಿಸಿದ ಕೃಷಿ ಮಾಹಿತಿ',
    },
    howItWorks: {
      heading: 'ಭೂಮಿಮಿತ್ರ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
      subheading:
        'ಯಾವುದೇ ರೈತರು ತಮ್ಮ ಫೋನ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಸುಲಭವಾಗಿ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ನೋಡಲು ಮೂರು ಸರಳ ಹಂತಗಳು.',
      steps: [
        {
          number: '01',
          title: 'ನಿಮ್ಮ ಕೃಷಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
          description:
            'ಸುಲಭವಾದ ಕಾರ್ಡ್‌ಗಳ ಮೂಲಕ ನಿಮ್ಮ ಜಿಲ್ಲೆ, ಮಣ್ಣಿನ ವಿಧ, ಹಂಗಾಮು, ಮಳೆ, ಹವಾಮಾನ ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        },
        {
          number: '02',
          title: 'ನಮ್ಮ ಬೆಳೆ ಶಿಫಾರಸು ವ್ಯವಸ್ಥೆಯು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ',
          description:
            'ಮುಂಬರುವ ಪೂರ್ಣ ಆವೃತ್ತಿಯಲ್ಲಿ, ತರಬೇತಿ ಪಡೆದ ಯಂತ್ರ ಕಲಿಕೆ (ML) ಮಾದರಿಯು ನಿಮ್ಮ ಜಮೀನಿನ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.',
        },
        {
          number: '03',
          title: 'ಸೂಕ್ತವಾದ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
          description:
            'ಮಣ್ಣಿನ ಹೊಂದಾಣಿಕೆ, ನೀರಿನ ಅವಶ್ಯಕತೆ ಮತ್ತು ಹಂಗಾಮು ಮಾಹಿತಿಯೊಂದಿಗೆ ಸರಳ AI ವಿವರಣೆಯ ಬೆಳೆ ಸಲಹೆಗಳನ್ನು ನೋಡಿ.',
        },
      ],
      futureNoteTitle: 'ಭವಿಷ್ಯದ ML ಮತ್ತು AI ಏಕೀಕರಣಕ್ಕೆ ಸಿದ್ಧ',
      futureNoteBody:
        'ಈ ಪ್ರಸ್ತುತ ಆವೃತ್ತಿಯು ಕೇವಲ ಮಾದರಿ ಡೇಟಾದೊಂದಿಗೆ ಸಂವಾದಾತ್ಮಕ ಫ್ರಂಟ್‌ಎಂಡ್ ಅನುಭವವನ್ನು ತೋರಿಸುತ್ತದೆ. ಮುಂದಿನ ಹಂತದಲ್ಲಿ ML ಮಾದರಿ ಮತ್ತು Gemini API ಜೋಡಿಸಲಾಗುತ್ತದೆ.',
      startCta: 'ಬೆಳೆ ಶಿಫಾರಸು ಫಾರ್ಮ್ ಪ್ರಯತ್ನಿಸಿ',
    },
    about: {
      heading: 'ಕೃಷಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ತಂತ್ರಜ್ಞಾನ',
      description:
        'ಕೃಷಿ ಮಾಹಿತಿ, ಯಂತ್ರ ಕಲಿಕೆ ಮತ್ತು AI-ಆಧಾರಿತ ನೆರವನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ ಬೆಳೆ ಆಯ್ಕೆಯನ್ನು ಸರಳಗೊಳಿಸುವುದು ಭೂಮಿಮಿತ್ರದ ಗುರಿಯಾಗಿದೆ.',
      pillars: [
        {
          title: 'ರೈತ-ಸ್ನೇಹಿ ಸರಳತೆ',
          body: 'ದೊಡ್ಡ ಆಯ್ಕೆ ಕಾರ್ಡ್‌ಗಳು, ದೈನಂದಿನ ಕೃಷಿ ಭಾಷೆ ಮತ್ತು ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಹಾಗೂ ಹಿಂದಿ ಬೆಂಬಲದೊಂದಿಗೆ ಸುಲಭ ಬಳಕೆ.',
        },
        {
          title: 'ಹೊಂದಿಕೊಳ್ಳುವ ಮಾಹಿತಿ',
          body: 'ಪ್ರಯೋಗಾಲಯ ವರದಿ ಇಲ್ಲದಿದ್ದರೂ ತೊಂದರೆಯಿಲ್ಲ—ಸರಳ ಆಯ್ಕೆಗಳು ಮತ್ತು ಖಚಿತವಿಲ್ಲ ಆಯ್ಕೆಗಳೊಂದಿಗೆ ಮುಂದುವರಿಯಬಹುದು.',
        },
        {
          title: 'ಹಂತ-ಹಂತದ ವಿಶ್ವಾಸಾರ್ಹ ಅಭಿವೃದ್ಧಿ',
          body: 'ಈ ಫ್ರಂಟ್‌ಎಂಡ್ ಆವೃತ್ತಿಯು ಭವಿಷ್ಯದ ML ಮಾದರಿಗಳು ಮತ್ತು Gemini ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ಸ್ವಚ್ಛವಾದ ಆಧಾರವನ್ನು ನಿರ್ಮಿಸುತ್ತದೆ.',
        },
      ],
      roadmapTitle: 'ಯೋಜಿತ ಬುದ್ಧಿವಂತ ವ್ಯವಸ್ಥೆ',
      roadmapBody:
        'ಏಕೀಕರಣದ ನಂತರ, ಭೂಮಿಮಿತ್ರವು ಯಂತ್ರ ಕಲಿಕೆ ಬೆಳೆ ಶಿಫಾರಸು ಮಾದರಿಯನ್ನು AI ವಿವರಣೆಯೊಂದಿಗೆ ಜೋಡಿಸಿ ರೈತರಿಗೆ ಸ್ಪಷ್ಟ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.',
      exploreCta: 'ಬೆಳೆ ಶಿಫಾರಸು ನೋಡಿ',
    },
    footer: {
      note: 'ಭೂಮಿಮಿತ್ರ · ಫ್ರಂಟ್‌ಎಂಡ್ ಮಾದರಿ ಹಂತ · ಕೇವಲ ಮಾದರಿ ಪ್ರದರ್ಶನ ಡೇಟಾ',
    },
  },

  hi: {
    brand: {
      name: 'भूमिमित्र',
      tagline: 'आपका स्मार्ट खेती साथी',
    },
    nav: {
      home: 'होम',
      recommend: 'फसल सुझाव',
      howItWorks: 'यह कैसे काम करता है',
      about: 'हमारे बारे में',
      menuLabel: 'नेविगेशन मेनू खोलें',
      closeMenu: 'नेविगेशन मेनू बंद करें',
      languageLabel: 'भाषा',
    },
    home: {
      heroHeading: 'अपनी ज़मीन के लिए सही फसल चुनें',
      heroSubheading:
        'हमें अपनी मिट्टी, मौसम और पानी की स्थिति के बारे में बताएं। हम आपको उपयुक्त फसलें खोजने में मदद करेंगे।',
      primaryCta: 'फसल सुझाव पाएं',
      secondaryCta: 'यह कैसे काम करता है',
      heroImageAlt: 'सुबह की सुनहरी धूप में कर्नाटक के हरे-भरे खेत',
      featuresHeading: 'रोज़मर्रा के खेती निर्णयों के लिए सरल डिज़ाइन',
      features: {
        smartSelection: {
          title: 'स्मार्ट फसल चयन',
          description:
            'अपने जिले, मिट्टी के प्रकार, मौसम और पानी की उपलब्धता के अनुसार उपयुक्त फसल सुझाव देखें।',
        },
        easyGuidance: {
          title: 'सरल खेती मार्गदर्शन',
          description:
            'जटिल लैब रिपोर्ट या तकनीकी आंकड़ों के बिना आसान चित्र-आधारित सवालों के जवाब दें।',
        },
        aiAssistance: {
          title: 'AI-सहायता प्राप्त मार्गदर्शन',
          description:
            'अगले चरण में मशीन लर्निंग (ML) अनुमान और सरल भाषा में AI सलाह को जोड़ने के लिए तैयार।',
        },
      },
    },
    wizard: {
      title: 'फसल सुझाव',
      subtitle: 'नमूना फसल सुझाव देखने के लिए अपनी खेती के बारे में सात आसान सवालों के जवाब दें।',
      stepOf: 'चरण {current} / {total}',
      stepLabels: [
        'स्थान',
        'मिट्टी',
        'मौसम',
        'बारिश',
        'तापमान',
        'पानी',
        'पोषक तत्व',
      ],
      summaryLabel: 'समीक्षा',
      back: 'पीछे',
      next: 'आगे',
      clearForm: 'फ़ॉर्म साफ़ करें',
      reviewAnswers: 'जवाब जांचें',
      findCrops: 'उपयुक्त फसलें खोजें',
      edit: 'बदलें',
      optionalBadge: 'वैकल्पिक',
      skipOptional: 'सारांश पर जाएं',
      validation: {
        selectDistrict: 'आगे बढ़ने से पहले कृपया अपना जिला चुनें।',
        selectSoil: 'कृपया मिट्टी का प्रकार चुनें (या सुनिश्चित नहीं चुनें)।',
        selectSeason: 'कृपया बुवाई का मौसम चुनें (या सुनिश्चित नहीं चुनें)।',
        selectRainfall: 'कृपया अपने क्षेत्र की सामान्य बारिश चुनें (या सुनिश्चित नहीं)।',
        selectTemperature: 'कृपया अपने क्षेत्र का मौसम चुनें (या सुनिश्चित नहीं)।',
        invalidTemperature: 'कृपया 0°C से 55°C के बीच सही तापमान दर्ज करें।',
        selectWater: 'कृपया पानी की उपलब्धता चुनें (या सुनिश्चित नहीं)।',
        invalidPh: 'मिट्टी का pH मान 0 और 14 के बीच होना चाहिए।',
        invalidNutrient: 'कृपया शून्य या उससे अधिक सही संख्या दर्ज करें।',
      },
      steps: {
        location: {
          question: 'आपकी खेती की ज़मीन कहाँ स्थित है?',
          helper: 'कर्नाटक के जिलों से शुरुआत की गई है। आप कभी भी अन्य भारतीय राज्य चुन सकते हैं।',
          stateLabel: 'राज्य',
          districtLabel: 'जिला',
          districtPlaceholder: 'अपना जिला चुनें',
          karnatakaNote: 'कर्नाटक के सभी 31 जिले चयन के लिए उपलब्ध हैं।',
        },
        soil: {
          question: 'आपके खेत में किस प्रकार की मिट्टी है?',
          helper: 'अपने खेत की मिट्टी से सबसे अधिक मेल खाने वाला विकल्प चुनें।',
          options: {
            red: {
              label: 'लाल मिट्टी',
              description: 'हल्की लाल रंग की मिट्टी जो कई बारानी खेतों में पाई जाती है।',
            },
            black: {
              label: 'काली मिट्टी',
              description: 'गहरी काली मिट्टी जो नमी को अच्छी तरह रोके रखती है।',
            },
            sandy: {
              label: 'रेतीली मिट्टी',
              description: 'हल्की दानेदार मिट्टी जिससे पानी जल्दी निकल जाता है।',
            },
            loamy: {
              label: 'दोमट मिट्टी',
              description: 'मुलायम, संतुलित और उपजाऊ मिट्टी जो खेती के लिए उत्तम है।',
            },
            clay: {
              label: 'चिकनी मिट्टी',
              description: 'गीली होने पर चिपचिपी और पानी को देर तक रोकने वाली मिट्टी।',
            },
            not_sure: {
              label: 'सुनिश्चित नहीं',
              description: 'यदि आपको मिट्टी का प्रकार पक्का नहीं पता तो इसे चुनें।',
            },
          },
        },
        season: {
          question: 'आप किस मौसम में फसल उगाने की योजना बना रहे हैं?',
          helper: 'अपनी अगली बुवाई के लिए मुख्य कृषि मौसम चुनें।',
          options: {
            kharif: {
              label: 'खरीफ (बारिश का मौसम)',
              description: 'जून से अक्टूबर तक मानसून की बारिश में बुवाई।',
            },
            rabi: {
              label: 'रबी (सर्दी का मौसम)',
              description: 'अक्टूबर से मार्च तक ठंडे मौसम में बुवाई।',
            },
            summer: {
              label: 'गर्मी (जायद)',
              description: 'मार्च से जून तक सिंचाई के सहारे गर्म मौसम की खेती।',
            },
            not_sure: {
              label: 'सुनिश्चित नहीं',
              description: 'यदि मौसम अभी तय नहीं है तो इसे चुनें।',
            },
          },
        },
        rainfall: {
          question: 'आपके क्षेत्र में आमतौर पर कितनी बारिश होती है?',
          helper: 'मिलीमीटर में नापने की ज़रूरत नहीं—अपने अनुभव के आधार पर चुनें।',
          options: {
            low: {
              label: 'कम बारिश',
              description: 'सामान्य से कम वर्षा; मौसम में अधिकतर सूखे दौर।',
            },
            normal: {
              label: 'सामान्य बारिश',
              description: 'क्षेत्र के अनुसार नियमित और संतुलित वर्षा।',
            },
            heavy: {
              label: 'अधिक बारिश',
              description: 'फसल के महीनों में लगातार या भारी बारिश।',
            },
            not_sure: {
              label: 'सुनिश्चित नहीं',
              description: 'बारिश का पैटर्न बदलता रहता है या निश्चित नहीं है।',
            },
          },
        },
        temperature: {
          question: 'आपके क्षेत्र का मौसम कैसा रहता है?',
          helper: 'सामान्य मौसम चुनें, और यदि पता हो तो °C में तापमान लिख सकते हैं।',
          options: {
            cool: {
              label: 'ठंडा',
              description: 'फसल अवधि के दौरान सुहावने दिन और ठंडी रातें।',
            },
            moderate: {
              label: 'मध्यम',
              description: 'अत्यधिक गर्मी या ठंड के बिना संतुलित मौसम।',
            },
            hot: {
              label: 'गर्म',
              description: 'तेज़ धूप और दिन में अधिक तापमान।',
            },
            not_sure: {
              label: 'सुनिश्चित नहीं',
              description: 'मौसम बदलता रहता है या जानकारी उपलब्ध नहीं है।',
            },
          },
          optionalNumericLabel: 'सटीक तापमान °C में (वैकल्पिक)',
          optionalNumericPlaceholder: 'जैसे 28',
          optionalNumericHint: 'यदि तापमान माप उपलब्ध नहीं है तो खाली छोड़ दें।',
        },
        water: {
          question: 'खेती के लिए कितना पानी उपलब्ध है?',
          helper: 'बोरवेल, नहर, तालाब या बारिश के पानी की उपलब्धता के आधार पर चुनें।',
          options: {
            low: {
              label: 'कम – सीमित पानी',
              description: 'मुख्य रूप से बारिश या बहुत सीमित सिंचाई पर निर्भर।',
            },
            medium: {
              label: 'मध्यम – कुछ पानी उपलब्ध',
              description: 'समय पर पूरक सिंचाई के लिए पर्याप्त पानी।',
            },
            good: {
              label: 'अच्छा – पर्याप्त पानी',
              description: 'पूरी फसल अवधि के दौरान पर्याप्त सिंचाई जल उपलब्ध।',
            },
            not_sure: {
              label: 'सुनिश्चित नहीं',
              description: 'पानी की उपलब्धता बदलती रहती है या तय नहीं है।',
            },
          },
        },
        nutrients: {
          question: 'क्या आपके पास मिट्टी के पोषक तत्वों की जानकारी है? (वैकल्पिक)',
          helper: 'यदि आपके पास मृदा स्वास्थ्य कार्ड या जांच रिपोर्ट है तो NPK और pH दर्ज करें, अन्यथा सीधे समीक्षा पर जाएं।',
          nitrogenLabel: 'नाइट्रोजन (N) kg/ha',
          nitrogenPlaceholder: 'जैसे 80',
          phosphorusLabel: 'फॉस्फोरस (P) kg/ha',
          phosphorusPlaceholder: 'जैसे 40',
          potassiumLabel: 'पोटाश (K) kg/ha',
          potassiumPlaceholder: 'जैसे 40',
          phLabel: 'मिट्टी का pH (0–14)',
          phPlaceholder: 'जैसे 6.5',
          noReportNote: 'मिट्टी जांच रिपोर्ट नहीं है? इन्हें खाली छोड़कर अपने जवाब की समीक्षा करें।',
        },
      },
      summary: {
        heading: 'अपने खेती विवरण की समीक्षा करें',
        subheading: 'नमूना फसल प्रदर्शन देखने से पहले नीचे अपने चुने गए विकल्प जांच लें।',
        locationField: 'स्थान (राज्य और जिला)',
        soilField: 'मिट्टी का प्रकार',
        seasonField: 'नियोजित मौसम',
        rainfallField: 'सामान्य बारिश',
        temperatureField: 'मौसम और तापमान',
        waterField: 'पानी की उपलब्धता',
        nutrientsField: 'मिट्टी के पोषक तत्व (NPK और pH)',
        notProvided: 'प्रदान नहीं किया गया (वैकल्पिक)',
        celsiusUnit: '°C',
      },
    },
    results: {
      demoBannerTitle: 'नमूना प्रदर्शन परिणाम',
      demoBannerBody:
        'नमूना प्रदर्शन – मशीन लर्निंग (ML) एकीकरण के बाद वास्तविक सुझाव उपलब्ध होंगे।',
      heading: 'नमूना फसल सुझाव',
      subheading:
        'नीचे तीन प्रदर्शन कार्ड दिए गए हैं जो दिखाते हैं कि ML मॉडल और Gemini API जुड़ने के बाद भूमिमित्र कैसे फसल सुझाव प्रस्तुत करेगा।',
      demoOnlyTag: 'केवल डेमो डेटा · फ्रंटएंड पूर्वावलोकन',
      fields: {
        explanation: 'सरल विवरण',
        soilSuitability: 'मिट्टी उपयुक्तता',
        waterRequirement: 'पानी की आवश्यकता',
        seasonInfo: 'मौसम की जानकारी',
        additionalNotes: 'अतिरिक्त सुझाव',
      },
      actions: {
        tryAgain: 'फिर से प्रयास करें',
        changeInputs: 'इनपुट बदलें',
        viewMyAnswers: 'मेरे जवाब देखें',
        hideMyAnswers: 'मेरे जवाब छिपाएं',
      },
      answersPanelTitle: 'आपके द्वारा दर्ज खेती विवरण',
    },
    howItWorks: {
      heading: 'भूमिमित्र कैसे काम करता है',
      subheading:
        'तीन सरल चरण ताकि कोई भी किसान अपने फोन या कंप्यूटर पर आसानी से फसल विकल्प देख सके।',
      steps: [
        {
          number: '01',
          title: 'अपनी खेती का विवरण दर्ज करें',
          description:
            'स्पष्ट कार्ड की मदद से अपना जिला, मिट्टी, मौसम, बारिश और पानी की स्थिति चुनें—साथ ही चाहें तो मिट्टी जांच मान जोड़ें।',
        },
        {
          number: '02',
          title: 'हमारी फसल सुझाव प्रणाली आपकी जानकारी का विश्लेषण करती है',
          description:
            'आगामी पूर्ण संस्करण में, एक प्रशिक्षित मशीन लर्निंग मॉडल आपके खेत की स्थितियों का आकलन करेगा।',
        },
        {
          number: '03',
          title: 'उपयुक्त फसल सुझाव देखें',
          description:
            'मिट्टी अनुकूलता, सिंचाई आवश्यकता और बुवाई समय की सरल AI व्याख्या के साथ उपयुक्त फसलें समझें।',
        },
      ],
      futureNoteTitle: 'भविष्य के ML और AI एकीकरण के लिए तैयार',
      futureNoteBody:
        'यह वर्तमान संस्करण केवल नमूना डेटा के साथ इंटरैक्टिव फ्रंटएंड अनुभव दिखाता है। भविष्य में इसमें ML मॉडल और Gemini API जोड़े जाएंगे।',
      startCta: 'फसल सुझाव फ़ॉर्म आज़माएं',
    },
    about: {
      heading: 'ऐसी तकनीक जो खेती को समझती है',
      description:
        'भूमिमित्र का उद्देश्य कृषि जानकारी, मशीन लर्निंग और AI-सहायता को जोड़कर फसल चयन को सरल बनाना है।',
      pillars: [
        {
          title: 'किसान-केंद्रित सरलता',
          body: 'बड़े विकल्प कार्ड, रोज़मर्रा की खेती भाषा और अंग्रेज़ी, कन्नड़ व हिंदी का पूरा समर्थन।',
        },
        {
          title: 'लचीली जानकारी',
          body: 'लैब रिपोर्ट न होने पर भी कोई बाधा नहीं—सामान्य विकल्प और सुनिश्चित नहीं विकल्प हमेशा काम करते हैं।',
        },
        {
          title: 'चरणबद्ध विश्वसनीय निर्माण',
          body: 'यह फ्रंटएंड चरण भविष्य के सत्यापित ML मॉडल और Gemini मार्गदर्शन के लिए मजबूत आधार तैयार करता है।',
        },
      ],
      roadmapTitle: 'योजनाबद्ध स्मार्ट प्रणाली',
      roadmapBody:
        'एकीकरण के बाद भूमिमित्र मशीन लर्निंग फसल मॉडल को AI व्याख्या के साथ जोड़ेगा ताकि किसानों को साफ मार्गदर्शन मिले।',
      exploreCta: 'फसल सुझाव देखें',
    },
    footer: {
      note: 'भूमिमित्र · फ्रंटएंड प्रोटोटाइप चरण · केवल नमूना प्रदर्शन डेटा',
    },
  },
};

export function formatStepLabel(template: string, current: number, total: number): string {
  return template.replace('{current}', String(current)).replace('{total}', String(total));
}
