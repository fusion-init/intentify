export interface AnalysisResult {
    query: string;
    primary_intent: 'Informational' | 'Navigational' | 'Transactional' | 'Commercial_Investigation';
    secondary_intents: string[];
    is_question: boolean;
    user_goal: string;
    action_intent: 'learn' | 'compare' | 'buy' | 'visit' | 'download' | 'sign_up' | 'fix' | 'find_location' | 'watch';
    funnel_stage: 'top_of_funnel' | 'middle_of_funnel' | 'bottom_of_funnel';
    commercial_value: 'low' | 'medium' | 'high';
    local_intent: boolean;
    content_type_required: 'blog_article' | 'product_page' | 'category_page' | 'comparison_page' | 'landing_page' | 'video' | 'tool' | 'faq' | 'download';
    industry_domain: 'seo' | 'marketing' | 'ecommerce' | 'saas' | 'finance' | 'health' | 'education' | 'travel' | 'real_estate' | 'technology' | 'general';
}

export function analyzeQueryLocal(query: string): AnalysisResult {
    const lowerQuery = query.toLowerCase().trim();
    const words = lowerQuery.split(/\s+/);

    // 1. IS QUESTION
    const isQuestion = /^(what|how|why|when|where|who|which)\b/.test(lowerQuery) || lowerQuery.endsWith('?');

    // 2. PRIMARY INTENT
    let primaryIntent: AnalysisResult['primary_intent'] = 'Informational';

    const transactionalRegex = /\b(buy|price|order|purchase|shop|sale|checkout|pricing|cheap|discount|deal|coupon|sign up|subscribe)\b/;
    const commercialRegex = /\b(best|top|review|vs|comparison|compare|rated|guide|alternatives)\b/;
    const navigationalRegex = /\b(login|signin|sign in|site|website|portal|official|facebook|twitter|instagram|linkedin|youtube|amazon|reddit)\b/;

    if (transactionalRegex.test(lowerQuery)) {
        primaryIntent = 'Transactional';
    } else if (commercialRegex.test(lowerQuery)) {
        primaryIntent = 'Commercial_Investigation';
    } else if (navigationalRegex.test(lowerQuery)) { // Naive brand check
        primaryIntent = 'Navigational';
    } else {
        primaryIntent = 'Informational';
    }

    // 3. SECONDARY INTENTS
    const secondaryIntents: string[] = [];
    if (isQuestion) secondaryIntents.push('Question');
    if (/\b(vs|compare|comparison|difference)\b/.test(lowerQuery)) secondaryIntents.push('Comparison');
    if (/\b(buy|purchase|order|cart)\b/.test(lowerQuery)) secondaryIntents.push('Purchase');
    if (/\b(near me|location|address|map|directions)\b/.test(lowerQuery)) secondaryIntents.push('Location');
    if (/\b(fix|broken|error|issue|problem|help)\b/.test(lowerQuery)) secondaryIntents.push('Troubleshooting');
    if (/\b(download|install|apk|pdf)\b/.test(lowerQuery)) secondaryIntents.push('Download');
    if (/\b(sign up|register|join|login)\b/.test(lowerQuery)) secondaryIntents.push('Signup');
    if (/\b(watch|video|youtube|tutorial)\b/.test(lowerQuery)) secondaryIntents.push('Watch');

    // 4. USER GOAL
    let userGoal = `Understand or find info about "${query}"`;
    if (primaryIntent === 'Transactional') userGoal = `Complete a purchase or action for "${query}"`;
    if (primaryIntent === 'Commercial_Investigation') userGoal = `Compare options or find the best "${query}"`;
    if (primaryIntent === 'Navigational') userGoal = `Navigate to a specific site related to "${query}"`;

    // 5. ACTION INTENT
    let actionIntent: AnalysisResult['action_intent'] = 'learn';
    if (primaryIntent === 'Transactional') actionIntent = 'buy';
    if (primaryIntent === 'Commercial_Investigation') actionIntent = 'compare';
    if (primaryIntent === 'Navigational') actionIntent = 'visit';
    if (secondaryIntents.includes('Download')) actionIntent = 'download';
    if (secondaryIntents.includes('Signup')) actionIntent = 'sign_up';
    if (secondaryIntents.includes('Troubleshooting')) actionIntent = 'fix';
    if (secondaryIntents.includes('Location')) actionIntent = 'find_location';
    if (secondaryIntents.includes('Watch')) actionIntent = 'watch';

    // 6. FUNNEL STAGE
    let funnelStage: AnalysisResult['funnel_stage'] = 'top_of_funnel';
    if (primaryIntent === 'Commercial_Investigation') funnelStage = 'middle_of_funnel';
    if (primaryIntent === 'Transactional') funnelStage = 'bottom_of_funnel';

    // 7. COMMERCIAL VALUE
    let commercialValue: AnalysisResult['commercial_value'] = 'low';
    if (primaryIntent === 'Transactional') commercialValue = 'high';
    if (primaryIntent === 'Commercial_Investigation') commercialValue = 'medium';

    // 8. LOCAL INTENT
    const localIntent = /\b(near me|city|town|location|address|st|ave|road)\b/.test(lowerQuery); // Simplified check

    // 9. CONTENT TYPE REQUIRED
    let contentType: AnalysisResult['content_type_required'] = 'blog_article';
    if (primaryIntent === 'Transactional') contentType = 'product_page';
    if (primaryIntent === 'Commercial_Investigation') contentType = 'comparison_page'; // Default for commercial
    if (/best .*/.test(lowerQuery)) contentType = 'blog_article'; // "Best X" is often a listicle/blog
    if (primaryIntent === 'Navigational') contentType = 'landing_page';
    if (secondaryIntents.includes('Watch')) contentType = 'video';
    if (secondaryIntents.includes('Download')) contentType = 'download';
    if (secondaryIntents.includes('Question') && words.length < 5) contentType = 'faq';
    if (/\b(calculator|checker|generator)\b/.test(lowerQuery)) contentType = 'tool';

    // 10. INDUSTRY DOMAIN
    let industry: AnalysisResult['industry_domain'] = 'general';
    if (/\b(seo|keyword|rank|google|search)\b/.test(lowerQuery)) industry = 'seo';
    else if (/\b(marketing|social media|ad|brand|campaign)\b/.test(lowerQuery)) industry = 'marketing';
    else if (/\b(buy|shop|store|product|price|cart)\b/.test(lowerQuery)) industry = 'ecommerce';
    else if (/\b(software|app|platform|cloud|saas)\b/.test(lowerQuery)) industry = 'saas';
    else if (/\b(finance|money|bank|loan|credit|invest|stock)\b/.test(lowerQuery)) industry = 'finance';
    else if (/\b(health|doctor|medicine|pain|symptom|diet)\b/.test(lowerQuery)) industry = 'health';
    else if (/\b(course|learn|study|school|university|tutorial)\b/.test(lowerQuery)) industry = 'education';
    else if (/\b(travel|fight|hotel|vacation|trip|booking)\b/.test(lowerQuery)) industry = 'travel';
    else if (/\b(house|home|apartment|rent|mortgage|estate)\b/.test(lowerQuery)) industry = 'real_estate';
    else if (/\b(computer|phone|laptop|tech|code|developer)\b/.test(lowerQuery)) industry = 'technology';

    return {
        query: query,
        primary_intent: primaryIntent,
        secondary_intents: secondaryIntents,
        is_question: isQuestion,
        user_goal: userGoal,
        action_intent: actionIntent,
        funnel_stage: funnelStage,
        commercial_value: commercialValue,
        local_intent: localIntent,
        content_type_required: contentType,
        industry_domain: industry
    };
}
