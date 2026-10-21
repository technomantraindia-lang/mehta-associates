/**
 * Mehta Associates - Clean, Premium & Uniform Product Monograph Controller
 * Dynamically loads and renders pharmaceutical product monographs, technical specifications,
 * and uniform related products based on URL parameter.
 */

(function() {
  'use strict';

  // Specific photographic image mappings
  const PRODUCT_IMAGE_MAP = {
    'aspirin-granules-ip': 'assets/images/products/aspirin-granules.jpg',
    'aspirin-powder-ip': 'assets/images/products/aspirin-granules.jpg',
    'ambroxol-hcl-ip': 'assets/images/products/ambroxol-hcl.jpg',
    'glycine-ip': 'assets/images/products/bulk-api-powder.jpg',
    'glycine-usp': 'assets/images/products/bulk-api-powder.jpg',
    'benzyl-alcohol-ip': 'assets/images/products/benzyl-alcohol.jpg',
    'cetrimide-ip': 'assets/images/products/cetrimide.jpg',
    'strong-cetrimide-solution-40': 'assets/images/products/cetrimide.jpg',
    'chlorhexidine-gluconate-20-ip': 'assets/images/products/antiseptic-solution.jpg',
    'chlorhexidine-hcl-ip': 'assets/images/products/antiseptic-solution.jpg',
    'chloroxylenol-bp': 'assets/images/products/antiseptic-solution.jpg',
    'chromium-picolinate-usp': 'assets/images/products/mineral-chelates.jpg',
    'chromium-polynicotinate': 'assets/images/products/mineral-chelates.jpg',
    'chromium-poly-nicotinate': 'assets/images/products/mineral-chelates.jpg',
    'chromium-chloride-usp': 'assets/images/products/mineral-chelates.jpg',
    'chromium-chloride': 'assets/images/products/mineral-chelates.jpg',
    'choline-salicylate-bp': 'assets/images/products/pharma-liquid-solution.jpg',
    'diethyl-carbamazine-citrate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'diphenhydramine-hcl-ip': 'assets/images/products/bulk-api-powder.jpg',
    'doss-bp': 'assets/images/products/benzyl-alcohol.jpg',
    'docusate-sodium-powder-85': 'assets/images/products/bulk-api-powder.jpg',
    'eucalyptus-oil': 'assets/images/products/essential-botanical-oils.jpg',
    'iodoform': 'assets/images/products/iodoform-yellow-powder.jpg',
    'iodoform-usp': 'assets/images/products/iodoform-yellow-powder.jpg',
    'lemongrass-oil': 'assets/images/products/essential-botanical-oils.jpg',
    'methyl-nicotinate-bp': 'assets/images/products/pharma-liquid-solution.jpg',
    'methyl-paraben-ip': 'assets/images/products/paraben-preservatives.jpg',
    'methyl-salicylate-ip': 'assets/images/products/pharma-liquid-solution.jpg',
    'mephenesine-ip': 'assets/images/products/bulk-api-powder.jpg',
    'menthol-bold-crystal': 'assets/images/products/menthol-bold-crystals.jpg',
    'piperazine-citrate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'piperazine-hexahydrate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'piperazine-phosphate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'piperazine-adipate-ip': 'assets/images/products/bulk-api-powder.jpg',
    'piperazine-adipate': 'assets/images/products/bulk-api-powder.jpg',
    'piperazine-dihydrochloride': 'assets/images/products/bulk-api-powder.jpg',
    'propyl-paraben-ip': 'assets/images/products/paraben-preservatives.jpg',
    'salicylic-acid-ip': 'assets/images/products/salicylic-acid-crystals.jpg',
    'technical-salicylic-acid': 'assets/images/products/industrial-chemicals.jpg',
    'salicylamide-usp': 'assets/images/products/salicylic-acid-crystals.jpg',
    'sodium-methyl-paraben-ip': 'assets/images/products/paraben-preservatives.jpg',
    'sodium-propyl-paraben-ip': 'assets/images/products/paraben-preservatives.jpg',
    'sodium-salicylate-ip': 'assets/images/products/salicylic-acid-crystals.jpg',
    'technical-sodium-salicylate': 'assets/images/products/industrial-chemicals.jpg',
    'zinc-picolinate': 'assets/images/products/mineral-chelates.jpg',
    'vitamin-k3-feed': 'assets/images/products/vitamin-k3-feed.jpg',
    'wintergreen-oil': 'assets/images/products/essential-botanical-oils.jpg'
  };

  function formatCategoryShort(cat) {
    const map = {
      'Active Pharmaceutical Ingredients (APIs)': 'Active API',
      'Preservatives & Excipients': 'Preservative',
      'Antiseptics & Disinfectants': 'Antiseptic',
      'Minerals & Nutritional Supplements': 'Nutraceutical',
      'Essential Oils & Botanicals': 'Essential Oil',
      'Technical & Industrial Chemicals': 'Speciality Chemical'
    };
    return map[cat] || cat;
  }

  function formatGradeShort(grade) {
    if (!grade) return 'Pharma Grade';
    if ((grade.includes('I P') || grade.includes('IP')) && grade.includes('BP') && grade.includes('USP')) return 'I P / B P / U S P';
    if ((grade.includes('I P') || grade.includes('IP')) && grade.includes('BP')) return 'I P / B P Grade';
    if (grade.includes('I P') || grade.includes('IP')) return 'I P Monograph';
    if (grade.includes('BP')) return 'BP Monograph';
    if (grade.includes('USP')) return 'USP Monograph';
    if (grade.includes('EP')) return 'EP Monograph';
    if (grade.includes('Nutraceutical')) return 'Food / Nutra';
    if (grade.includes('Technical')) return 'Technical';
    return grade.split('/')[0].trim();
  }

  // Enriched Technical Monograph Database
  const TECHNICAL_SPECS_DB = {
    'aspirin-granules-ip': {
      chemicalName: 'Acetylsalicylic Acid (Granular)',
      formula: 'C₉H₈O₄',
      mw: '180.16 g/mol',
      appearance: 'White free-flowing granules for direct tablet compression',
      assay: '99.5% – 101.0% (Calculated on dried basis)',
      solubility: 'Sparingly soluble in water; freely soluble in alcohol',
      packaging: '25 Kg Fibre / HDPE Drum with polyethylene inner liner',
      storage: 'Store in well-closed, moisture-proof containers below 25°C',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Direct Compression Tablets', 'Chewable Tablets', 'Effervescent Formulations', 'Cardio-Protective Formulations'],
      industries: ['Pharmaceutical Finished Dosage', 'Cardiovascular Therapies', 'OTC Analgesics']
    },
    'aspirin-powder-ip': {
      chemicalName: 'Acetylsalicylic Acid (Powder)',
      formula: 'C₉H₈O₄',
      mw: '180.16 g/mol',
      appearance: 'White crystalline powder or colourless crystals',
      assay: '99.5% – 100.5% (Dried basis)',
      solubility: 'Sparingly soluble in water; freely soluble in ethanol (96%)',
      packaging: '25 Kg Multiwall Kraft Bags / Fibre Drums',
      storage: 'Airtight containers protected from moisture and direct light',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Oral Tablets', 'Combination Analgesic Powders', 'Capsule Blends'],
      industries: ['Pharmaceutical Manufacturing', 'Pain Care & OTC Blends']
    },
    'ambroxol-hcl-ip': {
      chemicalName: 'Ambroxol Hydrochloride',
      formula: 'C₁₃H₁₈Br₂N₂O · HCl',
      mw: '414.56 g/mol',
      appearance: 'White or yellowish crystalline powder',
      assay: '99.0% – 101.0% (HPLC / Dried basis)',
      solubility: 'Sparingly soluble in water; soluble in methanol',
      packaging: '25 Kg Fibre Drum with dual polyethylene liners',
      storage: 'Preserve in tight, light-resistant containers at controlled room temperature',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Expectorant Syrups', 'Oral Drops', 'Effervescent Tablets', 'Inhalation Solutions'],
      industries: ['Respiratory Formulations', 'Pediatric Medicine', 'Pulmonology']
    },
    'benzyl-alcohol-ip': {
      chemicalName: 'Phenylmethanol / Benzyl Alcohol',
      formula: 'C₇H₈O',
      mw: '108.14 g/mol',
      appearance: 'Clear, colourless oily liquid, faint aromatic odour',
      assay: '98.0% – 100.5% v/v (Gas Chromatography)',
      solubility: 'Soluble in water (1 in 25); miscible with ethanol and chloroform',
      packaging: '200 Kg Epoxy-lined Steel Drums / 50 Kg HM-HDPE Carboys',
      storage: 'Store in airtight containers protected from light and oxidation',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Parenteral Injections (Preservative)', 'Topical Creams & Gels', 'Oral Suspensions'],
      industries: ['Injectable Formulation', 'Dermatology & Cosmetics', 'Parenteral Manufacturing']
    },
    'cetrimide-ip': {
      chemicalName: 'Alkyltrimethylammonium Bromide',
      formula: 'C₁₇H₃₈BrN (approx. average)',
      mw: '336.39 g/mol',
      appearance: 'White to creamy-white voluminous free-flowing powder',
      assay: '96.0% – 101.0% (Anhydrous substance)',
      solubility: 'Freely soluble in water and in alcohol',
      packaging: '25 Kg HDPE Drums with moisture-barrier liner',
      storage: 'Keep in well-closed containers at ambient room temperature',
      shelfLife: '48 Months from Manufacturing Date',
      dosageForms: ['Antiseptic Creams & Washes', 'Hospital Disinfectants', 'Pre-operative Skin Cleansers'],
      industries: ['Hospital & Clinical Sanitation', 'Wound Care Formulations', 'Personal Hygiene']
    },
    'strong-cetrimide-solution-40': {
      chemicalName: 'Aqueous Cetrimide Solution 40% w/v',
      formula: 'Aqueous Surfactant Complex',
      mw: 'N/A (Solution)',
      appearance: 'Clear to pale straw-coloured viscous liquid',
      assay: '38.0% – 42.0% w/v Cetrimide content',
      solubility: 'Miscible in all proportions with water and alcohol',
      packaging: '50 Kg HDPE Carboys / 200 Kg Barrels',
      storage: 'Tightly sealed containers away from freezing and sunlight',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Disinfectant Concentrates', 'Surgical Scrubs', 'Sanitizer Blends'],
      industries: ['Institutional Hygiene', 'Hospital Bulk Formulations', 'Formulation Indenting']
    },
    'chlorhexidine-gluconate-20-ip': {
      chemicalName: 'Chlorhexidine Digluconate 20% v/v Solution',
      formula: 'C₂₂H₃₀Cl₂N₁₀ · 2C₆H₁₂O₇',
      mw: '897.76 g/mol',
      appearance: 'Clear or slightly opalescent colourless to pale straw liquid',
      assay: '19.0% – 21.0% w/v Chlorhexidine Digluconate',
      solubility: 'Miscible with water and up to 5 parts of alcohol',
      packaging: '200 Kg HDPE Drums / 25 Kg Carboys',
      storage: 'Preserve in well-closed containers below 25°C. Do not freeze',
      shelfLife: '24 to 36 Months from Manufacturing Date',
      dosageForms: ['Surgical Hand Scrubs', 'Antiseptic Mouthwash', 'Wound Cleansers'],
      industries: ['Hospital Infection Control', 'Dental Formulations', 'Topical Antiseptics']
    },
    'chlorhexidine-hcl-ip': {
      chemicalName: 'Chlorhexidine Dihydrochloride',
      formula: 'C₂₂H₃₀Cl₂N₁₀ · 2HCl',
      mw: '578.37 g/mol',
      appearance: 'White or almost white crystalline powder',
      assay: '98.5% – 101.5% (Dried basis)',
      solubility: 'Sparingly soluble in water; slightly soluble in alcohol',
      packaging: '25 Kg Fibre Drums with inner PE bags',
      storage: 'Store in well-closed containers protected from light',
      shelfLife: '48 Months from Manufacturing Date',
      dosageForms: ['Dusting Powders', 'Medicated Ointments', 'Wound Dressings', 'Lozenges'],
      industries: ['Dermatology & Wound Care', 'Oral Hygiene Manufacturing']
    },
    'chromium-picolinate-usp': {
      chemicalName: 'Chromium Tripicolinate',
      formula: 'C₁₈H₁₂CrN₃O₆',
      mw: '418.30 g/mol',
      appearance: 'Fine reddish-purple crystalline powder',
      assay: '98.0% – 102.0% (USP Assay on dried basis)',
      solubility: 'Slightly soluble in water; practically insoluble in alcohol',
      packaging: '25 Kg Fibre Drum with foil barrier liner',
      storage: 'Tight, light-resistant containers in cool, dry place',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Dietary Supplements', 'Multivitamin Tablets', 'Nutraceutical Capsules'],
      industries: ['Nutraceutical Manufacturing', 'Dietary Supplements', 'Sports Nutrition']
    },
    'chromium-polynicotinate': {
      chemicalName: 'Chromium Polynicotinate (Niacin Chelate)',
      formula: 'Chromium Niacin Chelate Complex',
      mw: 'Chelated Complex',
      appearance: 'Fine purplish-grey to greyish-brown powder',
      assay: 'Elemental Chromium ≥ 10.0%',
      solubility: 'Partially soluble in water',
      packaging: '25 Kg Fibre Drum with double polyethylene bag',
      storage: 'Tightly closed in a cool, ventilated area',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Nutraceutical Tablets', 'Premix Blends', 'Synergy Capsules'],
      industries: ['Functional Foods', 'Nutraceutical Blends', 'Dietary Formulations']
    },
    'choline-salicylate-bp': {
      chemicalName: 'Choline Salicylate',
      formula: 'C₁₂H₁₉NO₄',
      mw: '241.28 g/mol',
      appearance: 'Hygroscopic white mass or clear viscous liquid',
      assay: '98.0% – 101.0% (BP Monograph on anhydrous substance)',
      solubility: 'Very soluble in water and alcohol; insoluble in ether',
      packaging: '50 Kg HDPE Carboys / 25 Kg Drums',
      storage: 'Airtight containers; protect from moisture absorption',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Mouth Ulcer Gels', 'Dental Pain Drops', 'Topical Analgesics'],
      industries: ['Dental Healthcare', 'Oral Mucosal Therapeutics', 'Topical Care']
    },
    'diethyl-carbamazine-citrate-ip': {
      chemicalName: 'Diethylcarbamazine Dihydrogen Citrate (DECC)',
      formula: 'C₁₆H₂₉N₃O₈',
      mw: '391.42 g/mol',
      appearance: 'White crystalline powder; odourless with acid taste',
      assay: '98.0% – 101.0% (Dried basis)',
      solubility: 'Very soluble in water; soluble in alcohol (96%)',
      packaging: '25 Kg Fibre Drum with double polythene liner',
      storage: 'Tightly closed containers protected from moisture and light',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Anthelmintic Tablets', 'Pediatric Syrups & Suspensions'],
      industries: ['Public Health Programs', 'Parasitic Disease Control', 'Pediatrics']
    },
    'diphenhydramine-hcl-ip': {
      chemicalName: 'Diphenhydramine Hydrochloride',
      formula: 'C₁₇H₂₁NO · HCl',
      mw: '291.82 g/mol',
      appearance: 'White crystalline powder, odourless with bitter taste',
      assay: '98.5% – 101.5% (Dried basis)',
      solubility: 'Freely soluble in water and alcohol',
      packaging: '25 Kg Fibre Drum with dual polyethylene bags',
      storage: 'Well-closed, light-resistant containers',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Cough Syrups & Expectorants', 'Anti-Allergy Tablets', 'Motion Sickness Tablets'],
      industries: ['Allergy & Cough Formulations', 'OTC Therapeutics', 'Sedative Blends']
    },
    'doss-bp': {
      chemicalName: 'Dioctyl Sodium Sulfosuccinate BP',
      formula: 'C₂₀H₃₇NaO₇S',
      mw: '444.56 g/mol',
      appearance: 'White or almost white waxy plastic solid',
      assay: '98.5% – 100.5% (Dried basis)',
      solubility: 'Sparingly soluble in water; freely soluble in alcohol',
      packaging: '25 Kg HDPE Drums with protective liners',
      storage: 'Well-closed containers at room temperature',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Oral Stool Softener Capsules', 'Suspension Wetting Agent'],
      industries: ['Gastrointestinal Medicine', 'Pharma Excipient Formulations']
    },
    'docusate-sodium-powder-85': {
      chemicalName: 'Docusate Sodium Powder 85%',
      formula: 'Formulated Excipient Blend',
      mw: 'N/A (Blend)',
      appearance: 'White to off-white free-flowing powder',
      assay: '84.0% – 86.0% Active Docusate Sodium',
      solubility: 'Dispersible in water; suitable for solid dosage blending',
      packaging: '25 Kg Fibre Drum with barrier poly liner',
      storage: 'Tightly closed containers in dry, ventilated space',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Direct Compression Tablets', 'Hard Gelatin Capsules'],
      industries: ['Solid Oral Dosage Manufacturing', 'Contract Formulators']
    },
    'eucalyptus-oil': {
      chemicalName: 'Eucalyptus Globulus Essential Oil (Cineole > 70%)',
      formula: 'Natural Botanical Terpene Complex',
      mw: 'Essential Oil Complex',
      appearance: 'Colourless or pale yellow liquid with camphoraceous aroma',
      assay: '≥ 70.0% Cineole (Eucalyptol) by GC',
      solubility: 'Soluble in 5 volumes of 70% ethanol',
      packaging: '25 Kg / 180 Kg Epoxy-coated Iron Drums',
      storage: 'Airtight containers protected from light in cool place',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Vapor Rubs & Balms', 'Inhalation Capsules', 'Throat Lozenges'],
      industries: ['Ayurvedic & Herbal Pharma', 'Respiratory Care', 'Topical Balms']
    },
    'iodoform': {
      chemicalName: 'Triiodomethane (USP Compendial Grade)',
      formula: 'CHI₃',
      mw: '393.73 g/mol',
      appearance: 'Shining lemon-yellow crystals or lustrous powder with penetrating odor',
      assay: '99.0% – 100.5% (USP Titrimetric on dried basis)',
      solubility: 'Practically insoluble in water; freely soluble in ether and chloroform',
      packaging: '25 Kg Fibre Drums / 5 Kg Airtight Amber Glass or HDPE Containers',
      storage: 'Preserve in tight, light-resistant containers below 25°C',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Dental Root Canal Pastes', 'Medicated Antiseptic Gauze', 'Surgical Dressing Powder'],
      industries: ['Endodontic & Dental Care', 'Surgical Dressing Manufacture', 'Wound Management']
    },
    'iodoform-usp': {
      chemicalName: 'Triiodomethane (USP Compendial Grade)',
      formula: 'CHI₃',
      mw: '393.73 g/mol',
      appearance: 'Lustrous greenish-yellow powder or crystalline scales with characteristic odor',
      assay: '99.0% – 100.5% (USP Titrimetric on dried basis)',
      solubility: 'Practically insoluble in water; freely soluble in ether, chloroform, and warm alcohol',
      packaging: '25 Kg Fibre Drums / 5 Kg Airtight Amber Containers',
      storage: 'Preserve in tight, light-resistant containers away from heat and direct sunlight',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Dental Root Canal Pastes & Pastes', 'Antiseptic Dressing Gauze Packing', 'Surgical Wound Dressings'],
      industries: ['Endodontic & Dental Specialty', 'Hospital Wound Care', 'Surgical Gauze Impregnation']
    },
    'lemongrass-oil': {
      chemicalName: 'Cymbopogon Citratus Essential Oil (Citral rich)',
      formula: 'Natural Botanical Complex',
      mw: 'Essential Oil Complex',
      appearance: 'Yellow to brownish-yellow clear liquid with citrus odor',
      assay: '≥ 75.0% Citral by Gas Chromatography',
      solubility: 'Soluble in alcohol; practically insoluble in water',
      packaging: '25 Kg / 180 Kg Galvanized Iron Drums',
      storage: 'Airtight containers in cool place away from sunlight',
      shelfLife: '24 to 36 Months from Manufacturing Date',
      dosageForms: ['Topical Liniments', 'Herbal Analgesics', 'Aromatherapeutic Rubs'],
      industries: ['Natural Products Formulators', 'Topical Analgesics', 'Cosmeceuticals']
    },
    'methyl-nicotinate-bp': {
      chemicalName: 'Methyl Pyridine-3-Carboxylate',
      formula: 'C₇H₇NO₂',
      mw: '137.14 g/mol',
      appearance: 'White crystalline powder or crystals',
      assay: '98.5% – 101.0% (BP Monograph on dried basis)',
      solubility: 'Freely soluble in water, alcohol, and chloroform',
      packaging: '25 Kg Fibre Drum with inner polyethylene liner',
      storage: 'Tightly closed in cool, well-ventilated dry place',
      shelfLife: '48 Months from Manufacturing Date',
      dosageForms: ['Counter-Irritant Creams', 'Muscle Pain Gels', 'Sports Liniments'],
      industries: ['Topical Analgesic Formulations', 'Sports Medicine']
    },
    'methyl-paraben-ip': {
      chemicalName: 'Methyl 4-Hydroxybenzoate',
      formula: 'C₈H₈O₃',
      mw: '152.15 g/mol',
      appearance: 'Colourless crystals or white crystalline powder',
      assay: '98.0% – 102.0% (Dried basis)',
      solubility: 'Very slightly soluble in water; freely soluble in alcohol',
      packaging: '25 Kg Fibre Drum / Multiwall Kraft Bags',
      storage: 'Well-closed containers at controlled room temperature',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Oral Suspensions', 'Cough Syrups', 'Topical Creams & Lotions'],
      industries: ['Pharmaceutical Preservatives', 'Dermatology & Topicals', 'Personal Care']
    },
    'propyl-paraben-ip': {
      chemicalName: 'Propyl 4-Hydroxybenzoate',
      formula: 'C₁₀H₁₂O₃',
      mw: '180.20 g/mol',
      appearance: 'White crystalline powder or colourless crystals',
      assay: '98.0% – 102.0% (Dried basis)',
      solubility: 'Very slightly soluble in water; freely soluble in alcohol',
      packaging: '25 Kg Fibre Drum with food-grade poly liner',
      storage: 'Well-closed containers away from excessive moisture',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Oral Suspensions (Synergistic with Methylparaben)', 'Topical Ointments'],
      industries: ['Preservative Sourcing', 'Finished Dosage Excipients']
    },
    'sodium-methyl-paraben-ip': {
      chemicalName: 'Sodium Methyl 4-Hydroxybenzoate',
      formula: 'C₈H₇NaO₃',
      mw: '174.13 g/mol',
      appearance: 'White, crystalline, hygroscopic powder',
      assay: '98.0% – 102.0% (Anhydrous basis)',
      solubility: 'Freely soluble in water; soluble in alcohol',
      packaging: '25 Kg Fibre Drums with moisture-barrier liner',
      storage: 'Airtight containers; highly hygroscopic; protect from humidity',
      shelfLife: '48 Months from Manufacturing Date',
      dosageForms: ['Aqueous Liquid Orals', 'Eye Drops & Injections'],
      industries: ['Sterile & Ophthalmic Manufacturing', 'Cold-Process Formulations']
    },
    'sodium-propyl-paraben-ip': {
      chemicalName: 'Sodium Propyl 4-Hydroxybenzoate',
      formula: 'C₁₀H₁₁NaO₃',
      mw: '202.18 g/mol',
      appearance: 'White, crystalline, hygroscopic powder',
      assay: '98.0% – 102.0% (Anhydrous basis)',
      solubility: 'Freely soluble in water; soluble in alcohol',
      packaging: '25 Kg Fibre Drums with sealed inner polythene bag',
      storage: 'Airtight containers in cool, dry place',
      shelfLife: '48 Months from Manufacturing Date',
      dosageForms: ['Aqueous Syrups', 'Suspensions', 'Liquid Formulations'],
      industries: ['Aqueous Preservation', 'Liquid Oral Pharmaceuticals']
    },
    'methyl-salicylate-ip': {
      chemicalName: 'Methyl 2-Hydroxybenzoate (Wintergreen Ester)',
      formula: 'C₈H₈O₃',
      mw: '152.15 g/mol',
      appearance: 'Colourless or slightly yellow liquid with characteristic aroma',
      assay: '99.0% – 100.5% (Gas Chromatography)',
      solubility: 'Very slightly soluble in water; miscible with alcohol',
      packaging: '200 Kg Epoxy-lined Steel Drums / 50 Kg Carboys',
      storage: 'Well-filled, airtight containers protected from light',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Pain Relief Sprays & Aerosols', 'Analgesic Balms & Ointments'],
      industries: ['Pain Management Formulations', 'Topical OTC Pharma']
    },
    'mephenesine-ip': {
      chemicalName: '3-(2-Methylphenoxy)propane-1,2-diol',
      formula: 'C₁₀H₁₄O₃',
      mw: '182.22 g/mol',
      appearance: 'White crystalline aggregates or colourless crystals',
      assay: '99.0% – 101.0% (Dried basis)',
      solubility: 'Soluble in 100 parts water; freely soluble in alcohol',
      packaging: '25 Kg Fibre Drums with poly liner',
      storage: 'Tight, light-resistant containers',
      shelfLife: '48 Months from Manufacturing Date',
      dosageForms: ['Muscle Relaxant Tablets', 'Combination Pain Gels'],
      industries: ['Skeletal Muscle Care', 'Orthopedic Therapeutics']
    },
    'menthol-bold-crystal': {
      chemicalName: 'Natural L-Menthol (Mentha arvensis)',
      formula: 'C₁₀H₂₀O',
      mw: '156.27 g/mol',
      appearance: 'Hexagonal needle-like crystals with intense cooling aroma',
      assay: '≥ 99.5% L-Menthol; Optical Rotation: -49° to -51°',
      solubility: 'Very soluble in alcohol and ether; practically insoluble in water',
      packaging: '25 Kg Fibre Drums with double food-grade liner',
      storage: 'Well-closed containers below 22°C to prevent sublimation',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Throat Lozenges', 'Vapor Inhalants', 'Pain Relief Balms', 'Cough Drops'],
      industries: ['Pharma Confectionery', 'Topical Analgesics', 'Respiratory Care']
    },
    'piperazine-citrate-ip': {
      chemicalName: 'Tripiperazine Dicitrate',
      formula: '(C₄H₁₀N₂)₃ · 2C₆H₈O₇ · xH₂O',
      mw: '642.65 g/mol (anhydrous)',
      appearance: 'White fine granular powder with pleasant acid taste',
      assay: '98.5% – 101.5% (Anhydrous basis)',
      solubility: 'Freely soluble in water; practically insoluble in alcohol',
      packaging: '25 Kg Fibre Drums with inner polythene liners',
      storage: 'Well-closed containers protected from light and moisture',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Anthelmintic Syrups & Solutions', 'Pediatric Deworming Suspensions'],
      industries: ['Pediatric Medicine', 'Public Health Parasitic Programs']
    },
    'piperazine-hexahydrate-ip': {
      chemicalName: 'Piperazine Hexahydrate',
      formula: 'C₄H₁₀N₂ · 6H₂O',
      mw: '194.23 g/mol',
      appearance: 'Colourless, translucent, deliquescent crystals',
      assay: '98.0% – 101.0% (Intact substance)',
      solubility: 'Freely soluble in water and alcohol',
      packaging: '25 Kg Drums with moisture-barrier liner',
      storage: 'Tightly sealed airtight containers in cool dry place',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Anthelmintic Formulations', 'Veterinary Dewormers'],
      industries: ['Veterinary Pharmaceuticals', 'Chemical Intermediates']
    },
    'piperazine-phosphate-ip': {
      chemicalName: 'Piperazine Monophosphate Monohydrate',
      formula: 'C₄H₁₀N₂ · H₃PO₄ · H₂O',
      mw: '202.15 g/mol',
      appearance: 'White crystalline powder; odourless with acid taste',
      assay: '98.5% – 101.5% (Dried basis)',
      solubility: 'Soluble in water (1 in 60); practically insoluble in alcohol',
      packaging: '25 Kg Fibre Drums with poly liner',
      storage: 'Well-closed containers away from light',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Anthelmintic Compressed Tablets', 'Veterinary Boluses'],
      industries: ['Solid Oral Anthelmintics', 'Veterinary Manufacturing']
    },
    'piperazine-adipate-ip': {
      chemicalName: 'Piperazine Hexanedioate (Piperazine Adipate)',
      formula: 'C₄H₁₀N₂ · C₆H₁₀O₄',
      mw: '232.28 g/mol',
      appearance: 'White crystalline powder; odourless; slight acid taste',
      assay: '98.5% – 101.0% (Dried basis)',
      solubility: 'Soluble in water (1 in 18); insoluble in alcohol',
      packaging: '25 Kg Fibre Drums with protective PE liner',
      storage: 'Well-closed containers in dry room',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Deworming Tablets & Granules', 'Livestock Feed Mixes'],
      industries: ['Animal Health', 'Human Anthelmintics']
    },
    'salicylic-acid-ip': {
      chemicalName: '2-Hydroxybenzoic Acid (Salicylic Acid Pure)',
      formula: 'C₇H₆O₃',
      mw: '138.12 g/mol',
      appearance: 'White acicular crystals or white crystalline powder',
      assay: '99.0% – 100.5% (Dried basis)',
      solubility: 'Slightly soluble in water; freely soluble in alcohol (96%)',
      packaging: '25 Kg Paper Bags / Fibre Drums with poly liner',
      storage: 'Well-closed containers protected from light',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Keratolytic Ointments', 'Acne Treatment Gels', 'Corn Removers'],
      industries: ['Dermatology & Skin Care', 'Cosmeceuticals']
    },
    'technical-salicylic-acid': {
      chemicalName: 'Salicylic Acid (Technical Grade)',
      formula: 'C₇H₆O₃',
      mw: '138.12 g/mol',
      appearance: 'Light tan to off-white crystalline flakes / powder',
      assay: '≥ 99.0% Industrial Assay',
      solubility: 'Soluble in ethanol, acetone; sparingly in water',
      packaging: '25 Kg / 50 Kg Poly-lined Bags',
      storage: 'Cool, dry, ventilated area away from oxidizers',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Chemical Intermediate', 'Dye Manufacture', 'Resin Additives'],
      industries: ['Dye & Pigment Manufacturing', 'Speciality Chemical Synthesis']
    },
    'salicylamide-usp': {
      chemicalName: '2-Hydroxybenzamide (Salicylamide)',
      formula: 'C₇H₇NO₂',
      mw: '137.14 g/mol',
      appearance: 'White crystalline powder; almost odourless with bitter taste',
      assay: '98.0% – 102.0% (USP Dried basis)',
      solubility: 'Slightly soluble in water; soluble in alcohol (1 in 10)',
      packaging: '25 Kg Fibre Drums with double poly liner',
      storage: 'Well-closed, light-resistant containers',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Analgesic Combination Tablets', 'Cold & Flu Formulations'],
      industries: ['Pain Relief Therapeutics', 'Combination OTC Pharmaceuticals']
    },
    'sodium-salicylate-ip': {
      chemicalName: 'Sodium 2-Hydroxybenzoate (Sodium Salicylate)',
      formula: 'C₇H₅NaO₃',
      mw: '160.10 g/mol',
      appearance: 'Small colourless crystals or shiny white scales',
      assay: '99.0% – 101.0% (Dried basis)',
      solubility: 'Freely soluble in water (1 in 1); soluble in alcohol',
      packaging: '25 Kg Fibre Drums with poly liner',
      storage: 'Well-closed containers protected from light',
      shelfLife: '60 Months from Manufacturing Date',
      dosageForms: ['Analgesic Oral Liquids & Syrups', 'Diagnostic Reagents'],
      industries: ['Liquid Formulations', 'Analgesic Manufacturing']
    },
    'technical-sodium-salicylate': {
      chemicalName: 'Sodium Salicylate (Technical Grade)',
      formula: 'C₇H₅NaO₃',
      mw: '160.10 g/mol',
      appearance: 'Off-white to light cream crystalline powder',
      assay: '≥ 98.5% Industrial Assay',
      solubility: 'Freely soluble in water',
      packaging: '25 Kg / 50 Kg Poly-lined Bags',
      storage: 'Dry warehouse away from moisture',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Corrosion Inhibitor', 'Chemical Buffer Solution'],
      industries: ['Industrial Chemistry', 'Surface Treatment', 'Metal Finishing']
    },
    'zinc-picolinate': {
      chemicalName: 'Zinc Bis(pyridine-2-carboxylate)',
      formula: 'C₁₂H₈N₂O₄Zn',
      mw: '309.59 g/mol',
      appearance: 'White to off-white fine crystalline powder',
      assay: '≥ 98.5% (Elemental Zinc: 20.5% – 21.5%)',
      solubility: 'Slightly soluble in water; soluble in dilute acids',
      packaging: '25 Kg Fibre Drums with barrier liner',
      storage: 'Tightly closed in cool and dry environment',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Immunity Booster Tablets', 'Chelated Mineral Capsules'],
      industries: ['Nutraceutical Manufacturing', 'Dietary Supplements']
    },
    'vitamin-k3-feed': {
      chemicalName: 'Menadione Feed Grade',
      formula: 'C₁₁H₈O₂',
      mw: '172.18 g/mol',
      appearance: 'White to brownish-yellow crystalline powder',
      assay: '≥ 43.7% – 50.0% Menadione equivalent',
      solubility: 'Insoluble in water; soluble in organic solvents and oils',
      packaging: '25 Kg Multiwall Bags / Drums with moisture liner',
      storage: 'Cool, dry place protected from light and heat',
      shelfLife: '24 Months from Manufacturing Date',
      dosageForms: ['Poultry Feed Premixes', 'Veterinary Nutrition Supplements'],
      industries: ['Animal Nutrition & Feed', 'Veterinary Formulations']
    },
    'wintergreen-oil': {
      chemicalName: 'Wintergreen Essential Oil (> 98% Natural Ester)',
      formula: 'Natural Botanical Ester (C₈H₈O₃ base)',
      mw: '152.15 g/mol',
      appearance: 'Colourless, pale yellow or reddish clear aromatic liquid',
      assay: '≥ 98.0% Natural Methyl Salicylate by GC',
      solubility: 'Slightly soluble in water; miscible with alcohol and ether',
      packaging: '25 Kg / 180 Kg Galvanized Iron Drums',
      storage: 'Tightly sealed containers away from sunlight in cool place',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Ayurvedic Pain Balms', 'Joint Pain Liniments', 'Massage Oils'],
      industries: ['Ayurvedic & Herbal Manufacturing', 'Topical Analgesics']
    },
    'glycine-ip': {
      chemicalName: 'Aminoacetic Acid / 2-Aminoethanoic Acid (I P)',
      formula: 'C₂H₅NO₂',
      mw: '75.07 g/mol',
      appearance: 'White or almost white crystalline powder or colourless crystals',
      assay: '98.5% – 101.5% (Non-aqueous titration on dried basis)',
      solubility: 'Freely soluble in water; very slightly soluble in ethanol (96%)',
      packaging: '25 Kg Fibre Drum / HDPE Drum with polyethylene moisture barrier',
      storage: 'Store in well-closed, light-resistant containers in a dry area below 25°C',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Intravenous Amino Acid Infusions', 'Oral Rehydration Salts (ORS)', 'Antacid Formulations', 'Parenteral Buffering Solutions'],
      industries: ['Pharmaceutical Finished Dosage', 'Parenteral & Infusion Manufacturing', 'Clinical Nutrition']
    },
    'glycine-usp': {
      chemicalName: 'Aminoacetic Acid (USP Compendial Grade)',
      formula: 'C₂H₅NO₂',
      mw: '75.07 g/mol',
      appearance: 'White, odorless, crystalline powder having a sweetish taste',
      assay: '98.5% – 101.5% (USP Titrimetric on dried basis)',
      solubility: 'Freely soluble in water; very slightly soluble in alcohol and ether',
      packaging: '25 Kg Fibre Drum with dual food/pharma grade polyethylene liner',
      storage: 'Preserve in well-closed containers at controlled room temperature',
      shelfLife: '48 Months from Manufacturing Date',
      dosageForms: ['Sterile Urological Irrigating Solutions', 'Total Parenteral Nutrition (TPN)', 'Oral Buffer Tablets', 'Electrolyte Powders'],
      industries: ['Surgical & Irrigation Solutions', 'Parenteral Drug Manufacturing', 'Nutraceutical & Medical Food']
    },
    'chloroxylenol-bp': {
      chemicalName: '4-Chloro-3,5-dimethylphenol (PCMX / BP Grade)',
      formula: 'C₈H₉ClO',
      mw: '156.61 g/mol',
      appearance: 'White to off-white crystalline powder or crystals with phenolic odor',
      assay: '98.0% – 101.5% (Gas Chromatography / BP Monograph)',
      solubility: 'Very slightly soluble in water; freely soluble in ethanol (96%), ether, and alkaline solutions',
      packaging: '25 Kg Multi-wall Paper Bags / Fibre Drums with poly inner liner',
      storage: 'Store in well-closed containers protected from light and excessive heat',
      shelfLife: '48 Months from Manufacturing Date',
      dosageForms: ['Antiseptic Disinfectant Liquids', 'Surgical Scrubs & Hand Washes', 'Medicated Bar Soaps', 'Topical Antibacterial Creams'],
      industries: ['Hospital & Surgical Antisepsis', 'Institutional Hygiene & Disinfectants', 'Personal Care & Medicated Soaps']
    },
    'chromium-chloride-usp': {
      chemicalName: 'Chromium (III) Chloride Hexahydrate (USP Grade)',
      formula: 'CrCl₃ · 6H₂O',
      mw: '266.45 g/mol',
      appearance: 'Dark green crystalline powder or granules, deliquescent',
      assay: '98.0% – 102.0% CrCl₃ · 6H₂O (USP Compendial)',
      solubility: 'Freely soluble in water and in alcohol; practically insoluble in ether',
      packaging: '25 Kg Fibre Drums / HDPE Drums with polyethylene moisture-barrier liner',
      storage: 'Store in tightly closed, corrosion-resistant containers in a dry, well-ventilated area',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Total Parenteral Nutrition (TPN) Additives', 'Trace Mineral Injections', 'Dietary Supplement Tablets', 'Metabolic Mineral Solutions'],
      industries: ['Parenteral Nutrition & Infusion', 'Pharmaceutical Compounding', 'Nutritional Mineral Premixes']
    },
    'chromium-chloride': {
      chemicalName: 'Chromium (III) Chloride Hexahydrate (USP Grade)',
      formula: 'CrCl₃ · 6H₂O',
      mw: '266.45 g/mol',
      appearance: 'Dark green crystalline powder or granules, deliquescent',
      assay: '98.0% – 102.0% CrCl₃ · 6H₂O (USP Compendial)',
      solubility: 'Freely soluble in water and in alcohol; practically insoluble in ether',
      packaging: '25 Kg Fibre Drums / HDPE Drums with polyethylene moisture-barrier liner',
      storage: 'Store in tightly closed, corrosion-resistant containers in a dry, well-ventilated area',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Total Parenteral Nutrition (TPN) Additives', 'Trace Mineral Injections', 'Dietary Supplement Tablets', 'Metabolic Mineral Solutions'],
      industries: ['Parenteral Nutrition & Infusion', 'Pharmaceutical Compounding', 'Nutritional Mineral Premixes']
    },
    'chromium-poly-nicotinate': {
      chemicalName: 'Chromium (III) Polynicotinate (Niacin Chelate)',
      formula: 'Cr(C₆H₄NO₂)₃',
      mw: '418.30 g/mol',
      appearance: 'Fine purplish-grey to greyish-brown powder',
      assay: 'Elemental Chromium ≥ 10.0%',
      solubility: 'Partially soluble in water; soluble in dilute mineral acids',
      packaging: '25 Kg Fibre Drum with double polyethylene bag',
      storage: 'Tightly closed in a cool, ventilated area away from humidity',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Dietary Mineral Tablets', 'Nutraceutical Hard Capsules', 'Metabolic Support Premixes'],
      industries: ['Nutraceutical Manufacturing', 'Sports Nutrition', 'Dietary Supplement Brands']
    },
    'piperazine-dihydrochloride': {
      chemicalName: 'Piperazine Dihydrochloride Monohydrate',
      formula: 'C₄H₁₀N₂ · 2HCl',
      mw: '159.06 g/mol (anhydrous)',
      appearance: 'White crystalline powder or granular flakes, freely soluble',
      assay: '98.0% – 101.5% (Potentiometric on dried basis)',
      solubility: 'Freely soluble in water; sparingly soluble in alcohol (96%)',
      packaging: '25 Kg Fibre Drum with double polyethylene inner liner',
      storage: 'Store in tightly closed, moisture-resistant containers below 25°C',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Soluble Deworming Powders', 'Veterinary Drinking Water Solutions', 'Anthelmintic Tablets', 'Oral Deworming Suspensions'],
      industries: ['Veterinary Pharmaceuticals', 'Poultry & Livestock Health', 'Human Anthelmintic Formulations']
    },
    'piperazine-adipate': {
      chemicalName: 'Piperazine Hexanedioate (Piperazine Adipate)',
      formula: 'C₄H₁₀N₂ · C₆H₁₀O₄',
      mw: '232.28 g/mol',
      appearance: 'White, crystalline powder, odourless or almost odourless',
      assay: '98.5% – 100.5% (Non-aqueous titration on dried basis)',
      solubility: 'Soluble 1 in 18 of water; practically insoluble in alcohol',
      packaging: '25 Kg Fibre Drum with polyethylene inner liner',
      storage: 'Preserve in well-closed containers protected from light and moisture',
      shelfLife: '36 Months from Manufacturing Date',
      dosageForms: ['Oral Anthelmintic Tablets', 'Veterinary Boluses', 'Suspension Powders'],
      industries: ['Human Pharmaceuticals', 'Veterinary Medicine', 'Global Deworming Programs']
    }
  };

  let allProducts = [];
  let currentProduct = null;

  async function initProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');

    try {
      const response = await fetch('data/products.json');
      if (!response.ok) throw new Error('Failed to fetch product data');
      allProducts = await response.json();

      if (!productId && allProducts.length > 0) {
        productId = allProducts[0].id;
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, '', `product-detail.html?id=${productId}`);
        }
      }

      // Alias resolution map for legacy and alternate product links
      const aliasMap = {
        'iodoform': 'iodoform-usp',
        'iodoform-usp': 'iodoform-usp',
        'piperazine-adipate': 'piperazine-adipate-ip',
        'piperazine-adipate-ip': 'piperazine-adipate-ip',
        'chromium-chloride': 'chromium-chloride-usp',
        'chromium-chloride-usp': 'chromium-chloride-usp',
        'chromium-poly-nicotinate': 'chromium-polynicotinate',
        'chromium-polynicotinate': 'chromium-polynicotinate'
      };
      const searchTargetId = (productId && aliasMap[productId]) ? aliasMap[productId] : productId;

      currentProduct = allProducts.find(p => p.id === searchTargetId || p.id === productId);

      if (!currentProduct) {
        renderNotFoundState(productId);
        return;
      }

      renderProductDetail(currentProduct);
      renderRelatedProducts(currentProduct);
      setupEnquiryActions(currentProduct);

      if (window.lucide) {
        window.lucide.createIcons();
      }

    } catch (err) {
      console.error('Error loading product detail:', err);
    }
  }

  function getTechSpecs(product) {
    if (TECHNICAL_SPECS_DB[product.id]) {
      return TECHNICAL_SPECS_DB[product.id];
    }

    const isLiquid = product.name.toLowerCase().includes('oil') || 
                     product.name.toLowerCase().includes('solution') || 
                     product.name.toLowerCase().includes('alcohol');
    
    return {
      chemicalName: product.name,
      formula: 'Standard Compendial Compound',
      mw: 'Monograph Reference',
      appearance: isLiquid ? 'Clear, colourless to pale straw liquid' : 'White to off-white crystalline powder / granules',
      assay: 'Conforms to official pharmacopoeial monograph limits (I P / B P / U S P)',
      solubility: 'Meets official compendial solubility standards',
      packaging: isLiquid ? '200 Kg HDPE Barrels / 50 Kg Carboys' : '25 Kg Fibre Drum / HDPE Drum with polyethylene liner',
      storage: 'Store in well-closed containers at controlled ambient temperature (15°C – 25°C)',
      shelfLife: '36 to 60 Months from Manufacturing Date',
      dosageForms: ['Pharmaceutical Dosage Formulations', 'Finished Compounding'],
      industries: ['Pharmaceutical Manufacturing', 'Healthcare Sourcing']
    };
  }

  function renderProductDetail(product) {
    const specs = getTechSpecs(product);
    const photoUrl = product.image || PRODUCT_IMAGE_MAP[product.id];

    // Document Title & SEO
    document.title = `${product.name} (${product.grade}) | Mehta Associates`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `Source bulk ${product.name} (CAS ${product.cas || 'Monograph'}). Verified ${product.grade} standard with batch COA from Mehta Associates Mumbai.`);
    }

    // Breadcrumbs
    const bcCat = document.getElementById('breadcrumb-category');
    if (bcCat) {
      bcCat.textContent = product.category;
      bcCat.setAttribute('href', `products.html?category=${encodeURIComponent(product.category)}`);
    }
    const bcCurrent = document.getElementById('breadcrumb-current');
    if (bcCurrent) {
      bcCurrent.textContent = product.name;
    }

    // Centered Section Header
    const refEyebrowCat = document.getElementById('ref-eyebrow-cat');
    if (refEyebrowCat) refEyebrowCat.textContent = product.category.toUpperCase();

    const refProdName = document.getElementById('ref-product-name') || document.getElementById('detail-product-name');
    if (refProdName) refProdName.textContent = product.name;

    const refProdSub = document.getElementById('ref-product-subtitle');
    if (refProdSub) {
      refProdSub.textContent = `Compendial ${product.grade} pharmaceutical raw material, verified CAS registry data, and direct bulk indenting parameters from Mehta Associates Mumbai.`;
    }

    // Card Left Column (Identifier)
    const refCasDisplay = document.getElementById('ref-cas-display') || document.getElementById('detail-cas-display');
    if (refCasDisplay) {
      refCasDisplay.textContent = product.cas ? `CAS ${product.cas}` : 'I P Standard';
    }

    const refGradeBadge = document.getElementById('ref-grade-badge') || document.getElementById('detail-grade-badge');
    if (refGradeBadge) {
      refGradeBadge.textContent = formatGradeShort(product.grade);
    }

    // Copy CAS Button
    const copyBtn = document.getElementById('ref-copy-cas-btn') || document.getElementById('copy-cas-btn');
    if (copyBtn && product.cas) {
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(product.cas).then(() => {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = '<i data-lucide="check" style="width: 12px; height: 12px; color: #16A34A;"></i> <span style="color: #16A34A;">Copied!</span>';
          if (window.lucide) window.lucide.createIcons();
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i data-lucide="copy" style="width: 12px; height: 12px;"></i> <span>Copy</span>';
            if (window.lucide) window.lucide.createIcons();
          }, 2000);
        }).catch(() => {});
      };
    }

    // Card Middle Column (Content & Specs)
    const refCatEyebrow = document.getElementById('ref-cat-eyebrow') || document.getElementById('detail-cat-badge');
    if (refCatEyebrow) refCatEyebrow.textContent = product.category.toUpperCase();

    const refChemName = document.getElementById('ref-chemical-name');
    if (refChemName) refChemName.textContent = specs.chemicalName || product.name;

    const refDesc = document.getElementById('ref-product-desc') || document.getElementById('detail-product-desc');
    if (refDesc) refDesc.textContent = product.description;

    // Metrics Row
    const refAssay = document.getElementById('ref-metric-assay') || document.getElementById('metric-assay');
    if (refAssay) refAssay.textContent = specs.assay.split('(')[0].trim();

    const refForm = document.getElementById('ref-metric-form') || document.getElementById('metric-form');
    if (refForm) refForm.textContent = specs.appearance.split(',')[0].split(';')[0].trim();

    const refPack = document.getElementById('ref-metric-pack') || document.getElementById('metric-pack');
    if (refPack) refPack.textContent = specs.packaging.split('/')[0].trim();

    const refGrade = document.getElementById('ref-metric-grade') || document.getElementById('metric-grade');
    if (refGrade) refGrade.textContent = formatGradeShort(product.grade);

    // Card Right Column (Image / Emblem)
    const imageFrame = document.getElementById('ref-image-frame') || document.getElementById('detail-visual-frame');
    if (imageFrame) {
      if (photoUrl) {
        imageFrame.innerHTML = `<img src="${photoUrl}" alt="${escapeHtml(product.name)} - Pharmaceutical Monograph" id="ref-product-img">`;
      } else {
        imageFrame.innerHTML = `
          <div class="ref-emblem-box">
            <div class="ref-emblem-icon">
              <i data-lucide="flask-conical"></i>
            </div>
            <div class="ref-emblem-name">${escapeHtml(product.name)}</div>
            <div class="ref-emblem-formula">${escapeHtml(specs.formula || 'I P Monograph')}</div>
          </div>
        `;
      }
    }

    // Master Specifications Table
    const specsGrid = document.getElementById('specs-table-grid');
    if (specsGrid) {
      specsGrid.innerHTML = `
        <div class="ref-table-row">
          <div class="ref-table-key">Monograph Name</div>
          <div class="ref-table-val" style="font-weight: 700; color: var(--color-primary);">${escapeHtml(product.name)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Chemical / Systematic Name</div>
          <div class="ref-table-val">${escapeHtml(specs.chemicalName)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">CAS Registry Number</div>
          <div class="ref-table-val" style="font-family: var(--font-mono, monospace); font-weight: 600;">
            ${escapeHtml(product.cas || 'Monograph Standard')}
          </div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Pharmacopoeia Standard</div>
          <div class="ref-table-val">${escapeHtml(product.grade)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Classification Category</div>
          <div class="ref-table-val">${escapeHtml(product.category)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Molecular Formula &amp; MW</div>
          <div class="ref-table-val">${escapeHtml(specs.formula)} &bull; ${escapeHtml(specs.mw)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Physical Appearance</div>
          <div class="ref-table-val">${escapeHtml(specs.appearance)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Purity / Assay Standard</div>
          <div class="ref-table-val">${escapeHtml(specs.assay)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Compounding Solubility</div>
          <div class="ref-table-val">${escapeHtml(specs.solubility)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Standard Commercial Pack</div>
          <div class="ref-table-val">${escapeHtml(specs.packaging)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Storage Conditions</div>
          <div class="ref-table-val">${escapeHtml(specs.storage)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Recommended Shelf Life</div>
          <div class="ref-table-val">${escapeHtml(specs.shelfLife)}</div>
        </div>
        <div class="ref-table-row">
          <div class="ref-table-key">Quality Documentation</div>
          <div class="ref-table-val">Batch Certificate of Analysis (COA), HPLC / GC Assay, MSDS &amp; GMP Declarations</div>
        </div>
      `;
    }

    // Pre-fill On-Page Form
    const inlineReq = document.getElementById('detail-form-requirement');
    if (inlineReq) {
      inlineReq.value = `Enquiring for bulk quotation, commercial availability, and batch COA for: ${product.name} (CAS: ${product.cas || 'N/A'}, Grade: ${product.grade}).\nQuantity / Pack size required: `;
    }

    const formHeading = document.getElementById('detail-form-product-heading');
    if (formHeading) {
      formHeading.textContent = `Request Quotation for ${product.name}`;
    }
  }

  function setupEnquiryActions(product) {
    const quoteBtn = document.getElementById('ref-quote-btn') || document.getElementById('hero-quote-btn');
    if (quoteBtn) {
      quoteBtn.onclick = function() {
        if (window.openEnquiryModal) {
          window.openEnquiryModal(product.name);
        }
      };
    }

    const waText = encodeURIComponent(`Hello Mehta Associates, I would like to request bulk pricing, MOQ, and COA for: ${product.name} (Grade: ${product.grade}, CAS: ${product.cas || 'Standard'})`);
    const waUrl = `https://wa.me/918082051218?text=${waText}`;

    const heroWaBtn = document.getElementById('ref-wa-btn') || document.getElementById('hero-wa-btn');
    if (heroWaBtn) {
      heroWaBtn.setAttribute('href', waUrl);
    }
  }

  function renderRelatedProducts(current) {
    const relatedContainer = document.getElementById('related-products-grid');
    if (!relatedContainer) return;

    let related = allProducts.filter(p => p.category === current.category && p.id !== current.id);

    if (related.length < 4) {
      const remaining = allProducts.filter(p => p.id !== current.id && !related.includes(p));
      related = related.concat(remaining.slice(0, 4 - related.length));
    } else {
      related = related.slice(0, 4);
    }

    // Render EXACT UNIFORM product cards matching products.html!
    relatedContainer.innerHTML = related.map(prod => {
      const waText = encodeURIComponent(`Hello Mehta Associates, I would like to enquire about bulk availability, pricing, and COA for: ${prod.name}`);
      const waLink = `https://wa.me/918082051218?text=${waText}`;

      return `
        <div class="product-card reveal-on-scroll">
          <div class="product-card-body">
            <div class="product-card-header">
              <span class="badge-category">${escapeHtml(formatCategoryShort(prod.category))}</span>
              <span class="badge-grade">${escapeHtml(formatGradeShort(prod.grade))}</span>
            </div>

            <h3 class="product-title" title="${escapeHtml(prod.name)}">
              <a href="product-detail.html?id=${encodeURIComponent(prod.id)}" class="product-title-link">
                ${escapeHtml(prod.name)}
              </a>
            </h3>

            <div class="product-meta-row">
              <span class="product-cas-pill">
                <i data-lucide="tag" style="width: 11px; height: 11px;"></i>
                <span>CAS: ${escapeHtml(prod.cas || 'Monograph')}</span>
              </span>
              <span class="product-coa-pill">
                <i data-lucide="shield-check" style="width: 11px; height: 11px;"></i>
                <span>COA Verified</span>
              </span>
            </div>

            <p class="product-desc" title="${escapeHtml(prod.description || '')}">
              ${escapeHtml(prod.description || 'High-purity certified pharmaceutical grade compound.')}
            </p>

            <div class="product-apps-box" title="${escapeHtml(prod.applications || '')}">
              <div class="apps-header">
                <i data-lucide="activity" style="width: 12px; height: 12px;"></i>
                <span class="apps-label">Key Applications</span>
              </div>
              <span class="apps-text">${escapeHtml(prod.applications || 'Pharmaceutical formulations and compounding')}</span>
            </div>
          </div>

          <div class="product-card-footer">
            <a href="product-detail.html?id=${encodeURIComponent(prod.id)}" class="btn-product-view" title="View Full Monograph & Specifications for ${escapeHtml(prod.name)}">
              <i data-lucide="file-text" style="width: 13px; height: 13px;"></i>
              <span>Monograph &amp; Specs</span>
            </a>
            <div class="product-card-action-row">
              <button type="button" class="btn btn-product-enquiry product-action-btn" onclick="openEnquiryModal('${escapeHtml(prod.name)}')">
                <i data-lucide="send" style="width: 13px; height: 13px;"></i>
                <span>Enquire</span>
              </button>
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-product-wa product-wa-btn" title="Enquire on WhatsApp for ${escapeHtml(prod.name)}" data-analytics-wa="Kairav Mehta">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true" style="flex-shrink: 0;"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.55 15.16 4.13 13.56 4.13 11.91C4.13 7.37 7.83 3.67 12.04 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.7C7.02 10.92 7.91 12.09 8.03 12.25C8.16 12.41 9.77 14.9 12.24 15.97C12.83 16.22 13.28 16.37 13.64 16.49C14.23 16.67 14.78 16.65 15.21 16.58C15.69 16.51 16.68 15.98 16.89 15.4C17.09 14.81 17.09 14.31 17.03 14.21C16.97 14.1 16.81 14.04 16.56 13.92C16.32 13.79 15.11 13.2 14.88 13.12C14.66 13.03 14.5 12.99 14.33 13.24C14.17 13.48 13.71 14.04 13.57 14.21C13.43 14.37 13.29 14.39 13.04 14.27C12.8 14.14 12.01 13.89 11.08 13.06C10.36 12.41 9.87 11.61 9.73 11.37C9.59 11.12 9.71 10.99 9.84 10.86C9.95 10.75 10.08 10.57 10.21 10.42C10.33 10.28 10.37 10.17 10.45 10.01C10.54 9.84 10.49 9.7 10.43 9.58C10.37 9.45 9.9 8.31 9.71 7.84C9.52 7.39 9.33 7.45 9.18 7.44C9.05 7.43 8.89 7.43 8.73 7.43C8.57 7.43 8.53 7.33 8.53 7.33Z"/></svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const newItems = relatedContainer.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window && newItems.length > 0) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      newItems.forEach(i => observer.observe(i));
    } else {
      newItems.forEach(i => i.classList.add('is-revealed'));
    }
  }

  function renderNotFoundState(id) {
    const mainContainer = document.getElementById('detail-main-content');
    if (!mainContainer) return;

    mainContainer.innerHTML = `
      <div class="container" style="padding: 5rem 1.5rem; text-align: center;">
        <h2 style="font-family: var(--font-heading); font-size: 1.75rem; color: #0F172A; margin-bottom: 0.75rem;">
          Product Monograph Not Found
        </h2>
        <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 2rem;">
          The requested product identifier <code>${escapeHtml(id || 'unknown')}</code> was not found. Please browse our 43+ active catalogue items.
        </p>
        <a href="products.html" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">Browse Full Catalogue</a>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', initProductDetail);
})();
