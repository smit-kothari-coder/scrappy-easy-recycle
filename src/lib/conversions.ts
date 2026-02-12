export type ScrapType = 'paper' | 'plastic' | 'metal' | 'glass' | 'rubber' | 'textiles' | 'organic' | 'eWaste';

interface ImpactResult {
  treesSaved: number;
  co2Reduction: number;
  energySaved: number;
}

const scrapConversionFactors: Record<ScrapType, {
  treesPerTon: number;
  co2PerTon: number;
  energyPerTon: number;
}> = {
  paper: {
    treesPerTon: 17,
    co2PerTon: 3000,
    energyPerTon: 7000
  },
  plastic: {
    treesPerTon: 0.7,
    co2PerTon: 2500,
    energyPerTon: 6000
  },
  metal: {
    treesPerTon: 2.5,
    co2PerTon: 1500,
    energyPerTon: 5000
  },
  glass: {
    treesPerTon: 1.2,
    co2PerTon: 300,
    energyPerTon: 1500
  },
  rubber: {
    treesPerTon: 0.3,
    co2PerTon: 1200,
    energyPerTon: 4000
  },
  textiles: {
    treesPerTon: 2.0,
    co2PerTon: 2000,
    energyPerTon: 5500
  },
  organic: {
    treesPerTon: 10,
    co2PerTon: 1500,
    energyPerTon: 3000
  },
  eWaste: {
    treesPerTon: 5,
    co2PerTon: 5000,
    energyPerTon: 8000
  }
};

export function calculateRecyclingImpact(scrapKg: number, scrapType: ScrapType): ImpactResult {
  const scrapTons = scrapKg / 1000;

  const conversion = scrapConversionFactors[scrapType];

  if (!conversion) {
    console.warn(`Unknown scrap type: ${scrapType}`);
    return {
      treesSaved: 0,
      co2Reduction: 0,
      energySaved: 0
    };
  }

  return {
    treesSaved: Math.floor(scrapTons * conversion.treesPerTon),
    co2Reduction: scrapTons * conversion.co2PerTon,
    energySaved: scrapTons * conversion.energyPerTon
  };
}
