export interface AnalysisResult {
    intent_type: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
    confidence: 'High' | 'Medium' | 'Low';
    user_goal: string;
    content_suggestions: string[];
    keywords: string[];
    seo_priority: 'High' | 'Medium' | 'Low';
}

export function analyzeQueryLocal(query: string): AnalysisResult {
    const lowerQuery = query.toLowerCase();

    // 1. Keyword Extraction (Basic Tokenization)
    const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 2 && !['the', 'and', 'for', 'with'].includes(w));

    // 2. Intent Detection Logic
    let intent: AnalysisResult['intent_type'] = 'Informational';
    let confidence: AnalysisResult['confidence'] = 'Medium';
    let suggestions: string[] = [];

    // Transactional Indicators
    if (/(buy|price|cheap|deal|coupon|order|purchase|shop|sale)/.test(lowerQuery)) {
        intent = 'Transactional';
        confidence = 'High';
        suggestions = ['Product Page', 'Pricing Table', 'Checkout Flow', 'Discount Landing Page'];
    }
    // Commercial Indicators
    else if (/(best|top|review|vs|comparison|compare|rated|guide to buying)/.test(lowerQuery)) {
        intent = 'Commercial';
        confidence = 'High';
        suggestions = ['Comparison Article', 'Best-of Listicle', 'Product Review', 'Buyer\'s Guide'];
    }
    // Navigational Indicators
    else if (/(login|signin|sign in|site|website|portal|official|facebook|twitter|instagram)/.test(lowerQuery)) {
        intent = 'Navigational';
        confidence = 'High';
        suggestions = ['Homepage', 'Login Page', 'Contact Page'];
    }
    // Informational (Default)
    else {
        intent = 'Informational';
        // Strengthen confidence if explicit question words exist
        if (/(what|how|why|when|where|guide|tutorial|tips|definition)/.test(lowerQuery)) {
            confidence = 'High';
        }
        suggestions = ['How-to Guide', 'Explainer Video', 'Blog Post', 'FAQ Section'];
    }

    // 3. User Goal Construction
    const goalMap = {
        'Informational': `Learn about or find an answer regarding "${query}"`,
        'Commercial': `Compare options or find the best "${query}"`,
        'Transactional': `Complete a purchase or action for "${query}"`,
        'Navigational': `Navigate to a specific site or page related to "${query}"`
    };

    // 4. SEO Priority
    // Transactional/Commercial generally have higher business value
    const priority = (intent === 'Transactional' || intent === 'Commercial') ? 'High' : 'Medium';

    return {
        intent_type: intent,
        confidence: confidence,
        user_goal: goalMap[intent],
        content_suggestions: suggestions,
        keywords: keywords,
        seo_priority: priority
    };
}
