import type { ROIResult }
    from '../types/finops';

export function calculateROI(
    investment: number,
    savings: number,
): ROIResult {
    return {
        savings,

        roiPercent:
            (savings / investment) *
            100,
    }
}