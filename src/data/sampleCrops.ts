import type { CropFormData, SampleCropItem } from '../types/bhoomi';

export const SAMPLE_CROPS_POOL: SampleCropItem[] = [
  {
    id: 'ragi',
    imagePath: '/src/assets/images/crop_ragi_millet_1795707903899.jpg',
    name: {
      en: 'Finger Millet (Ragi)',
      kn: 'ರಾಗಿ (ಫಿಂಗರ್ ಮಿಲೆಟ್)',
      hi: 'रागी (मडुआ / फिंगर मिलेट)',
    },
    subtitle: {
      en: 'Sample Demonstration Crop · Card 1',
      kn: 'ಮಾದರಿ ಪ್ರದರ್ಶನ ಬೆಳೆ · ಕಾರ್ಡ್ 1',
      hi: 'नमूना प्रदर्शन फसल · कार्ड 1',
    },
    explanationPlaceholder: {
      en: 'Placeholder explanation: Once the Machine Learning model and AI guidance are connected, this section will explain in simple terms why Finger Millet (Ragi) aligns with your field conditions.',
      kn: 'ಮಾದರಿ ವಿವರಣೆ: ಯಂತ್ರ ಕಲಿಕೆ (ML) ಮಾದರಿ ಮತ್ತು AI ಮಾರ್ಗದರ್ಶನ ಸಂಪರ್ಕಗೊಂಡ ನಂತರ, ನಿಮ್ಮ ಜಮೀನಿನ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ರಾಗಿ ಏಕೆ ಸೂಕ್ತವಾಗಬಹುದು ಎಂಬುದನ್ನು ಇಲ್ಲಿ ಸರಳವಾಗಿ ವಿವರಿಸಲಾಗುತ್ತದೆ.',
      hi: 'नमूना विवरण: मशीन लर्निंग (ML) मॉडल और AI मार्गदर्शन जुड़ने के बाद, यह अनुभाग सरल भाषा में बताएगा कि रागी आपकी भूमि की परिस्थितियों के लिए क्यों उपयुक्त हो सकती है।',
    },
    soilSuitabilityPlaceholder: {
      en: 'Sample soil suitability note: Placeholder for ML-verified soil texture and pH match summary.',
      kn: 'ಮಾದರಿ ಮಣ್ಣಿನ ಸೂಕ್ತತೆ: ML ಪರಿಶೀಲಿಸಿದ ಮಣ್ಣಿನ ವಿಧ ಮತ್ತು pH ಹೊಂದಾಣಿಕೆಯ ಸಾರಾಂಶದ ಸ್ಥಳ.',
      hi: 'नमूना मिट्टी उपयुक्तता: ML द्वारा सत्यापित मिट्टी के प्रकार और pH मिलान का सारांश स्थान।',
    },
    waterRequirementPlaceholder: {
      en: 'Sample water requirement note: Placeholder for rainfed or supplemental irrigation guidance.',
      kn: 'ಮಾದರಿ ನೀರಿನ ಅವಶ್ಯಕತೆ: ಮಳೆಯಾಶ್ರಿತ ಅಥವಾ ಪೂರಕ ನೀರಾವರಿ ಮಾರ್ಗದರ್ಶನದ ಸ್ಥಳ.',
      hi: 'नमूना पानी की आवश्यकता: वर्षा आधारित या पूरक सिंचाई मार्गदर्शन का स्थान।',
    },
    seasonInfoPlaceholder: {
      en: 'Sample season note: Placeholder for regional sowing window and harvest cycle details.',
      kn: 'ಮಾದರಿ ಹಂಗಾಮು ಮಾಹಿತಿ: ಪ್ರಾದೇಶಿಕ ಬಿತ್ತನೆ ಅವಧಿ ಮತ್ತು ಕೊಯ್ಲು ಚಕ್ರದ ವಿವರಗಳ ಸ್ಥಳ.',
      hi: 'नमूना मौसम जानकारी: क्षेत्रीय बुवाई समय और कटाई चक्र विवरण का स्थान।',
    },
    additionalNotesPlaceholder: {
      en: 'Additional guidance placeholder: Future AI companion tips on intercropping, seed preparation, and local care.',
      kn: 'ಹೆಚ್ಚುವರಿ ಸಲಹೆ ಸ್ಥಳ: ಅಂತರ ಬೆಳೆ, ಬೀಜೋಪಚಾರ ಮತ್ತು ಸ್ಥಳೀಯ ಆರೈಕೆಯ ಕುರಿತು ಭವಿಷ್ಯದ AI ಮಾರ್ಗದರ್ಶನ.',
      hi: 'अतिरिक्त मार्गदर्शन स्थान: अंतरफसल, बीज उपचार और स्थानीय देखभाल पर भविष्य की AI सलाह।',
    },
  },
  {
    id: 'maize',
    imagePath: '/src/assets/images/crop_maize_corn_1795707904056.jpg',
    name: {
      en: 'Maize (Corn)',
      kn: 'ಮೆಕ್ಕೆಜೋಳ (ಮೇಜ್)',
      hi: 'मक्का (मेज़)',
    },
    subtitle: {
      en: 'Sample Demonstration Crop · Card 2',
      kn: 'ಮಾದರಿ ಪ್ರದರ್ಶನ ಬೆಳೆ · ಕಾರ್ಡ್ 2',
      hi: 'नमूना प्रदर्शन फसल · कार्ड 2',
    },
    explanationPlaceholder: {
      en: 'Placeholder explanation: Future ML predictions and AI explanations will describe how Maize fits your selected season, rainfall pattern, and district.',
      kn: 'ಮಾದರಿ ವಿವರಣೆ: ಭವಿಷ್ಯದ ML ಮುನ್ಸೂಚನೆ ಮತ್ತು AI ವಿವರಣೆಯು ನಿಮ್ಮ ಆಯ್ಕೆಯ ಹಂಗಾಮು, ಮಳೆ ಮತ್ತು ಜಿಲ್ಲೆಗೆ ಮೆಕ್ಕೆಜೋಳ ಹೇಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ತಿಳಿಸುತ್ತದೆ.',
      hi: 'नमूना विवरण: भविष्य का ML पूर्वानुमान और AI विवरण बताएगा कि मक्का आपके चुने हुए मौसम, वर्षा और जिले के अनुकूल कैसे है।',
    },
    soilSuitabilityPlaceholder: {
      en: 'Sample soil suitability note: Placeholder for drainage, soil structure, and nutrient readiness notes.',
      kn: 'ಮಾದರಿ ಮಣ್ಣಿನ ಸೂಕ್ತತೆ: ನೀರು ಬಸಿದುಹೋಗುವಿಕೆ, ಮಣ್ಣಿನ ರಚನೆ ಮತ್ತು ಪೋಷಕಾಂಶ ಸಿದ್ಧತೆಯ ಮಾಹಿತಿ ಸ್ಥಳ.',
      hi: 'नमूना मिट्टी उपयुक्तता: जल निकासी, मिट्टी की संरचना और पोषक तत्व तैयारी नोट्स का स्थान।',
    },
    waterRequirementPlaceholder: {
      en: 'Sample water requirement note: Placeholder for stage-by-stage moisture and irrigation notes.',
      kn: 'ಮಾದರಿ ನೀರಿನ ಅವಶ್ಯಕತೆ: ಬೆಳೆಯ ಹಂತವಾರು ತೇವಾಂಶ ಮತ್ತು ನೀರಾವರಿ ಮಾರ್ಗದರ್ಶನದ ಸ್ಥಳ.',
      hi: 'नमूना पानी की आवश्यकता: फसल चरण के अनुसार नमी और सिंचाई मार्गदर्शन का स्थान।',
    },
    seasonInfoPlaceholder: {
      en: 'Sample season note: Placeholder for Kharif, Rabi, or Summer suitability timing.',
      kn: 'ಮಾದರಿ ಹಂಗಾಮು ಮಾಹಿತಿ: ಮುಂಗಾರು, ಹಿಂಗಾರು ಅಥವಾ ಬೇಸಿಗೆ ಹಂಗಾಮಿನ ಸೂಕ್ತ ಸಮಯದ ಸ್ಥಳ.',
      hi: 'नमूना मौसम जानकारी: खरीफ, रबी या जायद/गर्मी के अनुकूल समय का स्थान।',
    },
    additionalNotesPlaceholder: {
      en: 'Additional guidance placeholder: Future AI notes on spacing, organic compost, and field monitoring.',
      kn: 'ಹೆಚ್ಚುವರಿ ಸಲಹೆ ಸ್ಥಳ: ಸಾಲಿನ ಅಂತರ, ಸಾವಯವ ಗೊಬ್ಬರ ಮತ್ತು ಹೊಲದ ನಿರ್ವಹಣೆಯ ಭವಿಷ್ಯದ AI ಸಲಹೆ.',
      hi: 'अतिरिक्त मार्गदर्शन स्थान: पौधों की दूरी, जैविक खाद और खेत निगरानी पर भविष्य की AI सलाह।',
    },
  },
  {
    id: 'chickpea',
    imagePath: '/src/assets/images/crop_chickpea_pulses_1795707906502.jpg',
    name: {
      en: 'Chickpea (Bengal Gram)',
      kn: 'ಕಡಲೆ (ಬೆಂಗಾಲ್ ಗ್ರಾಂ)',
      hi: 'चना (बंगाल ग्राम)',
    },
    subtitle: {
      en: 'Sample Demonstration Crop · Card 3',
      kn: 'ಮಾದರಿ ಪ್ರದರ್ಶನ ಬೆಳೆ · ಕಾರ್ಡ್ 3',
      hi: 'नमूना प्रदर्शन फसल · कार्ड 3',
    },
    explanationPlaceholder: {
      en: 'Placeholder explanation: After ML integration, this card will outline why pulse crops like Chickpea may suit your soil moisture and climate profile.',
      kn: 'ಮಾದರಿ ವಿವರಣೆ: ML ಏಕೀಕರಣದ ನಂತರ, ಕಡಲೆಯಂತಹ ದ್ವಿದಳ ಧಾನ್ಯ ಬೆಳೆಗಳು ನಿಮ್ಮ ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ಏಕೆ ಹೊಂದಬಹುದು ಎಂಬುದನ್ನು ಇಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ.',
      hi: 'नमूना विवरण: ML एकीकरण के बाद, यह कार्ड बताएगा कि चने जैसी दलहन फसलें आपकी मिट्टी की नमी और जलवायु के लिए क्यों उपयुक्त हो सकती हैं।',
    },
    soilSuitabilityPlaceholder: {
      en: 'Sample soil suitability note: Placeholder for soil type compatibility and aeration guidance.',
      kn: 'ಮಾದರಿ ಮಣ್ಣಿನ ಸೂಕ್ತತೆ: ಮಣ್ಣಿನ ವಿಧದ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಗಾಳಿಯಾಡುವಿಕೆಯ ಮಾರ್ಗದರ್ಶನದ ಸ್ಥಳ.',
      hi: 'नमूना मिट्टी उपयुक्तता: मिट्टी के प्रकार की अनुकूलता और वायु-संचार मार्गदर्शन का स्थान।',
    },
    waterRequirementPlaceholder: {
      en: 'Sample water requirement note: Placeholder for low-to-moderate water schedule details.',
      kn: 'ಮಾದರಿ ನೀರಿನ ಅವಶ್ಯಕತೆ: ಕಡಿಮೆ ಅಥವಾ ಮಧ್ಯಮ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿಯ ವಿವರಗಳ ಸ್ಥಳ.',
      hi: 'नमूना पानी की आवश्यकता: कम से मध्यम सिंचाई समय-सारणी विवरण का स्थान।',
    },
    seasonInfoPlaceholder: {
      en: 'Sample season note: Placeholder for post-monsoon or cool-season cultivation timing.',
      kn: 'ಮಾದರಿ ಹಂಗಾಮು ಮಾಹಿತಿ: ಮಳೆಗಾಲದ ನಂತರದ ಅಥವಾ ಚಳಿಗಾಲದ ಕೃಷಿ ಸಮಯದ ಸ್ಥಳ.',
      hi: 'नमूना मौसम जानकारी: मानसून के बाद या सर्दियों की खेती के समय का स्थान।',
    },
    additionalNotesPlaceholder: {
      en: 'Additional guidance placeholder: Future AI notes on soil nitrogen enrichment and crop rotation.',
      kn: 'ಹೆಚ್ಚುವರಿ ಸಲಹೆ ಸ್ಥಳ: ಮಣ್ಣಿನ ಸಾರಜನಕ ಹೆಚ್ಚಳ ಮತ್ತು ಬೆಳೆ ಪರಿವರ್ತನೆಯ ಕುರಿತು ಭವಿಷ್ಯದ AI ಸಲಹೆ.',
      hi: 'अतिरिक्त मार्गदर्शन स्थान: मिट्टी में नाइट्रोजन संवर्धन और फसल चक्र पर भविष्य की AI सलाह।',
    },
  },
  {
    id: 'paddy',
    imagePath: '/src/assets/images/crop_rice_paddy_1795707905989.jpg',
    name: {
      en: 'Paddy (Rice)',
      kn: 'ಭತ್ತ (ಅಕ್ಕಿ)',
      hi: 'धान (चावल)',
    },
    subtitle: {
      en: 'Sample Demonstration Crop · Card 3',
      kn: 'ಮಾದರಿ ಪ್ರದರ್ಶನ ಬೆಳೆ · ಕಾರ್ಡ್ 3',
      hi: 'नमूना प्रदर्शन फसल · कार्ड 3',
    },
    explanationPlaceholder: {
      en: 'Placeholder explanation: Once the ML model is live, Paddy suggestions will reflect higher rainfall or good water availability in your region.',
      kn: 'ಮಾದರಿ ವಿವರಣೆ: ML ಮಾದರಿ ಸಕ್ರಿಯಗೊಂಡ ನಂತರ, ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಉತ್ತಮ ಮಳೆ ಅಥವಾ ನೀರಿನ ಲಭ್ಯತೆ ಇದ್ದಾಗ ಭತ್ತದ ಶಿಫಾರಸುಗಳನ್ನು ಇಲ್ಲಿ ವಿವರಿಸಲಾಗುತ್ತದೆ.',
      hi: 'नमूना विवरण: ML मॉडल सक्रिय होने के बाद, आपके क्षेत्र में अधिक वर्षा या अच्छी जल उपलब्धता होने पर धान के सुझाव यहाँ दिखेंगे।',
    },
    soilSuitabilityPlaceholder: {
      en: 'Sample soil suitability note: Placeholder for water-retaining soil and pH evaluation.',
      kn: 'ಮಾದರಿ ಮಣ್ಣಿನ ಸೂಕ್ತತೆ: ನೀರು ಹಿಡಿದಿಡುವ ಮಣ್ಣು ಮತ್ತು pH ಮೌಲ್ಯಮಾಪನದ ಸ್ಥಳ.',
      hi: 'नमूना मिट्टी उपयुक्तता: जल-धारण करने वाली मिट्टी और pH मूल्यांकन का स्थान।',
    },
    waterRequirementPlaceholder: {
      en: 'Sample water requirement note: Placeholder for irrigation depth and field bunding notes.',
      kn: 'ಮಾದರಿ ನೀರಿನ ಅವಶ್ಯಕತೆ: ನೀರಾವರಿ ಪ್ರಮಾಣ ಮತ್ತು ಗದ್ದೆ ಬದು ನಿರ್ವಹಣೆಯ ಮಾಹಿತಿ ಸ್ಥಳ.',
      hi: 'नमूना पानी की आवश्यकता: सिंचाई गहराई और मेड़ प्रबंधन नोट्स का स्थान।',
    },
    seasonInfoPlaceholder: {
      en: 'Sample season note: Placeholder for nursery preparation and transplanting timeline.',
      kn: 'ಮಾದರಿ ಹಂಗಾಮು ಮಾಹಿತಿ: ಸಸಿ ಮಡಿ ಸಿದ್ಧತೆ ಮತ್ತು ನಾಟಿ ಸಮಯದ ವೇಳಾಪಟ್ಟಿ ಸ್ಥಳ.',
      hi: 'नमूना मौसम जानकारी: नर्सरी तैयारी और रोपाई समय-सारणी का स्थान।',
    },
    additionalNotesPlaceholder: {
      en: 'Additional guidance placeholder: Future AI companion tips on varietal selection and nutrient balance.',
      kn: 'ಹೆಚ್ಚುವರಿ ಸಲಹೆ ಸ್ಥಳ: ತಳಿ ಆಯ್ಕೆ ಮತ್ತು ಪೋಷಕಾಂಶ ಸಮತೋಲನದ ಕುರಿತು ಭವಿಷ್ಯದ AI ಮಾರ್ಗದರ್ಶನ.',
      hi: 'अतिरिक्त मार्गदर्शन स्थान: किस्म चयन और पोषक तत्व संतुलन पर भविष्य की AI सलाह।',
    },
  },
];

/**
 * Returns 3 sample demonstration crop cards for frontend preview purposes only.
 * No ML prediction or scoring is performed in this stage.
 */
export function getDemoCropsForPreview(formData: CropFormData): SampleCropItem[] {
  const highWaterOrHeavyRain =
    formData.waterAvailability === 'good' || formData.rainfall === 'heavy';

  const ragi = SAMPLE_CROPS_POOL[0];
  const maize = SAMPLE_CROPS_POOL[1];
  const chickpea = SAMPLE_CROPS_POOL[2];
  const paddy = SAMPLE_CROPS_POOL[3];

  if (highWaterOrHeavyRain) {
    return [paddy, maize, ragi];
  }
  if (formData.season === 'rabi' || formData.soilType === 'black') {
    return [chickpea, maize, ragi];
  }
  return [ragi, maize, chickpea];
}
