import { Injectable } from '@nestjs/common';

export interface IntentNode {
    id: string;
    parent_id?: string;
    default_weight: number;
    expected_content_types: string[];
}

@Injectable()
export class IntentOntologyService {
    private ontology: Map<string, IntentNode> = new Map();

    constructor() {
        this.initializeOntologyV1();
    }

    private initializeOntologyV1() {
        // --- ROOT INTENTS (LEVEL 0) ---
        this.addIntent('informational', undefined, 0.5, ['general']);
        this.addIntent('navigational', undefined, 0.5, ['link']);
        this.addIntent('commercial', undefined, 0.6, ['comparison', 'listicle']);
        this.addIntent('transactional', undefined, 0.7, ['product_page']);
        this.addIntent('local', undefined, 0.6, ['map', 'local_pack']);

        // --- INFORMATIONAL (30) ---
        const info = 'informational';
        this.addIntent('informational_definition', info, 0.8, ['snippet']);
        this.addIntent('informational_explanation', info, 0.7, ['article']);
        this.addIntent('informational_examples', info, 0.6, ['listBy']);
        this.addIntent('informational_history', info, 0.4, ['wiki']);
        this.addIntent('informational_facts', info, 0.5, ['snippet']);
        this.addIntent('informational_howto', info, 0.9, ['guide', 'video']);
        this.addIntent('informational_tutorial', info, 0.9, ['tutorial', 'video']);
        this.addIntent('informational_guide', info, 0.8, ['guide']);
        this.addIntent('informational_step_by_step', info, 0.9, ['stepper']);
        this.addIntent('informational_beginner', info, 0.7, ['article']);
        this.addIntent('informational_troubleshooting', info, 0.9, ['forum', 'support']);
        this.addIntent('informational_error_fix', info, 0.9, ['support']);
        this.addIntent('informational_problem_solution', info, 0.9, ['support']);
        this.addIntent('informational_debugging', info, 0.8, ['tech_docs']);
        this.addIntent('informational_research', info, 0.6, ['paper']);
        this.addIntent('informational_deep_dive', info, 0.6, ['longform']);
        this.addIntent('informational_case_study', info, 0.7, ['pdf']);
        this.addIntent('informational_analysis', info, 0.6, ['report']);
        this.addIntent('informational_benefits', info, 0.7, ['list']);
        this.addIntent('informational_disadvantages', info, 0.7, ['list']);
        this.addIntent('informational_risks', info, 0.7, ['warning']);
        this.addIntent('informational_limitations', info, 0.6, ['article']);
        this.addIntent('informational_latest', info, 0.8, ['news']);
        this.addIntent('informational_updates', info, 0.8, ['news']);
        this.addIntent('informational_news', info, 0.8, ['news']);
        this.addIntent('informational_trends', info, 0.7, ['report']);
        this.addIntent('informational_difference', info, 0.8, ['table']);
        this.addIntent('informational_vs', info, 0.8, ['table']);
        this.addIntent('informational_alternatives', info, 0.8, ['list']);
        this.addIntent('informational_faq', info, 0.7, ['faq']);

        // --- NAVIGATIONAL (15) ---
        const nav = 'navigational';
        this.addIntent('navigational_brand', nav, 0.9, ['homepage']);
        this.addIntent('navigational_website', nav, 0.9, ['homepage']);
        this.addIntent('navigational_login', nav, 1.0, ['login_form']);
        this.addIntent('navigational_dashboard', nav, 0.9, ['app']);
        this.addIntent('navigational_download_page', nav, 0.9, ['download_btn']);
        this.addIntent('navigational_pricing_page', nav, 0.9, ['pricing_table']);
        this.addIntent('navigational_contact', nav, 0.9, ['contact_form']);
        this.addIntent('navigational_support', nav, 0.8, ['help_center']);
        this.addIntent('navigational_docs', nav, 0.8, ['documentation']);
        this.addIntent('navigational_blog', nav, 0.7, ['blog_index']);
        this.addIntent('navigational_careers', nav, 0.7, ['jobs']);
        this.addIntent('navigational_social_profile', nav, 0.8, ['social']);
        this.addIntent('navigational_app', nav, 0.9, ['app_store']);
        this.addIntent('navigational_portal', nav, 0.9, ['portal']);
        this.addIntent('navigational_account', nav, 0.9, ['profile']);

        // --- COMMERCIAL (30) ---
        const comm = 'commercial';
        this.addIntent('commercial_comparison', comm, 0.9, ['comparison_table']);
        this.addIntent('commercial_best', comm, 0.9, ['curated_list']);
        this.addIntent('commercial_top', comm, 0.9, ['curated_list']);
        this.addIntent('commercial_vs', comm, 0.9, ['comparison_table']);
        this.addIntent('commercial_review', comm, 0.8, ['review']);
        this.addIntent('commercial_price_check', comm, 0.8, ['price']);
        this.addIntent('commercial_budget', comm, 0.8, ['list_by_price']);
        this.addIntent('commercial_under_price', comm, 0.8, ['list_by_price']);
        this.addIntent('commercial_value_for_money', comm, 0.7, ['analysis']);
        this.addIntent('commercial_features', comm, 0.7, ['spec_sheet']);
        this.addIntent('commercial_specifications', comm, 0.7, ['spec_sheet']);
        this.addIntent('commercial_performance', comm, 0.7, ['benchmark']);
        this.addIntent('commercial_quality', comm, 0.7, ['review']);
        this.addIntent('commercial_for_students', comm, 0.8, ['curated_list']);
        this.addIntent('commercial_for_business', comm, 0.8, ['b2b_page']);
        this.addIntent('commercial_for_beginners', comm, 0.8, ['curated_list']);
        this.addIntent('commercial_for_professionals', comm, 0.8, ['pro_models']);
        this.addIntent('commercial_alternatives', comm, 0.9, ['alternatives_grid']);
        this.addIntent('commercial_similar_products', comm, 0.8, ['related_products']);
        this.addIntent('commercial_competitors', comm, 0.7, ['market_map']);
        this.addIntent('commercial_latest_model', comm, 0.9, ['product_launch']);
        this.addIntent('commercial_upcoming', comm, 0.7, ['news']);
        this.addIntent('commercial_new_release', comm, 0.9, ['product_page']);
        this.addIntent('commercial_ratings', comm, 0.8, ['stars']);
        this.addIntent('commercial_testimonials', comm, 0.6, ['quotes']);
        this.addIntent('commercial_expert_opinion', comm, 0.7, ['expert_take']);
        this.addIntent('commercial_buying_guide', comm, 0.9, ['guide']);
        this.addIntent('commercial_recommendation', comm, 0.9, ['quiz']);
        this.addIntent('commercial_long_term_review', comm, 0.6, ['video']);
        this.addIntent('commercial_shortlist', comm, 0.7, ['table']);

        // --- TRANSACTIONAL (25) ---
        const trans = 'transactional';
        this.addIntent('transactional_purchase', trans, 1.0, ['buy_btn']);
        this.addIntent('transactional_buy_now', trans, 1.0, ['buy_btn']);
        this.addIntent('transactional_order', trans, 1.0, ['cart']);
        this.addIntent('transactional_checkout', trans, 1.0, ['checkout']);
        this.addIntent('transactional_price', trans, 0.9, ['price_tag']);
        this.addIntent('transactional_discount', trans, 0.9, ['coupon']);
        this.addIntent('transactional_coupon', trans, 0.9, ['coupon']);
        this.addIntent('transactional_offer', trans, 0.9, ['banner']);
        this.addIntent('transactional_sale', trans, 0.9, ['collection']);
        this.addIntent('transactional_subscribe', trans, 1.0, ['subscription']);
        this.addIntent('transactional_trial', trans, 1.0, ['freetrial']);
        this.addIntent('transactional_upgrade', trans, 0.9, ['plans']);
        this.addIntent('transactional_renew', trans, 0.9, ['renewal']);
        this.addIntent('transactional_download', trans, 1.0, ['download']);
        this.addIntent('transactional_install', trans, 1.0, ['installer']);
        this.addIntent('transactional_activation', trans, 0.9, ['key_input']);
        this.addIntent('transactional_refund', trans, 0.6, ['policy']);
        this.addIntent('transactional_return', trans, 0.6, ['policy']);
        this.addIntent('transactional_cancellation', trans, 0.6, ['settings']);
        this.addIntent('transactional_warranty', trans, 0.5, ['doc']);
        this.addIntent('transactional_signup', trans, 1.0, ['form']);
        this.addIntent('transactional_login_action', trans, 1.0, ['form']);
        this.addIntent('transactional_payment', trans, 1.0, ['gateway']);
        this.addIntent('transactional_billing', trans, 0.8, ['portal']);
        this.addIntent('transactional_account_action', trans, 0.8, ['settings']);

        // --- LOCAL (20) ---
        const loc = 'local';
        this.addIntent('local_near_me', loc, 1.0, ['map']);
        this.addIntent('local_nearby', loc, 1.0, ['map']);
        this.addIntent('local_store_visit', loc, 0.9, ['directions']);
        this.addIntent('local_service_booking', loc, 1.0, ['booking']);
        this.addIntent('local_open_now', loc, 0.9, ['hours']);
        this.addIntent('local_business_hours', loc, 0.8, ['hours']);
        this.addIntent('local_contact', loc, 0.8, ['phone']);
        this.addIntent('local_directions', loc, 1.0, ['route']);
        this.addIntent('local_reviews', loc, 0.8, ['local_reviews']);
        this.addIntent('local_best', loc, 0.9, ['top_rated']);
        this.addIntent('local_price', loc, 0.8, ['menu']);
        this.addIntent('local_availability', loc, 0.9, ['stock']);
        this.addIntent('local_delivery', loc, 1.0, ['order']);
        this.addIntent('local_pickup', loc, 1.0, ['order']);
        this.addIntent('local_emergency', loc, 1.0, ['call']);
        this.addIntent('local_repair', loc, 0.9, ['service']);
        this.addIntent('local_installation', loc, 0.9, ['service']);
        this.addIntent('local_consultation', loc, 0.8, ['appointment']);
        this.addIntent('local_event', loc, 0.7, ['calendar']);
        this.addIntent('local_offer', loc, 0.8, ['local_deal']);
    }

    private addIntent(id: string, parent_id: string | undefined, default_weight: number, expected_content_types: string[]) {
        this.ontology.set(id, { id, parent_id, default_weight, expected_content_types });
    }

    getIntent(id: string): IntentNode | undefined {
        return this.ontology.get(id);
    }

    getAllIntents(): IntentNode[] {
        return Array.from(this.ontology.values());
    }
}
