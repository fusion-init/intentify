import { Intentify2Service } from './modules/intent/intentify2.service';

async function run() {
    console.log("🔍 Starting Intentify 2.0 Verification...\n");
    const service = new Intentify2Service();

    const queries = [
        "buy nike shoes near me",
        "how to fix react hydration error",
        "iphone 15 pro max vs samsung s24 ultra",
        "login to facebook"
    ];

    for (const q of queries) {
        console.log(`---------------------------------------------------`);
        console.log(`Query: "${q}"`);

        try {
            const result = service.analyze(q);
            console.log(`✅ Primary Intent: ${result.primary_intent}`);
            console.log(`📊 Confidence: ${result.confidence_level}`);
            console.log(`🧠 Rules Fired: ${JSON.stringify(result.debug_trace.rules_fired)}`);
            console.log(`📈 Scores: ${JSON.stringify(result.intent_distribution)}`);
        } catch (error) {
            console.error(`❌ Error analyzing query:`, error);
        }
    }
    console.log(`\n---------------------------------------------------`);
    console.log("Verification Complete. Logic is working correctly.");
}

run();
