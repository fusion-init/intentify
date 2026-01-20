import { AnalyzedIntent } from '@intentify/types';

export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US').format(date);
};

export const isValidIntent = (intent: AnalyzedIntent): boolean => {
    return intent.confidence > 0.5;
};
