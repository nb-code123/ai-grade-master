export interface ScoringFormula {
    useCustom: boolean;
    weights: {
        keywords: number;
        semantic: number;
        diagram: number;
        grammar: number;
    };
}

export const DEFAULT_FORMULA: ScoringFormula = {
    useCustom: false,
    weights: {
        keywords: 30,
        semantic: 40,
        diagram: 20,
        grammar: 10,
    },
};
