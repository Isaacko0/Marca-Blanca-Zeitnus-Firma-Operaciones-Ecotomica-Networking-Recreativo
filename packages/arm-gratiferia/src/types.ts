/**
 * Gratifieria Domain Types
 * 
 * Ported from solarpunk_utopia ValueFlows Listing model + mutual_aid_matchmaker
 * Adapted for ARM architecture with amphibious monetary layer.
 */

import type { Actor } from "@hscsg/arm-core";

/** Type of listing in the gift economy */
export type ListingType = "offer" | "need";

/** Status of a listing */
export type ListingStatus = "active" | "matched" | "fulfilled" | "expired" | "cancelled";

/** Visibility scope for inter-community sharing */
export type VisibilityScope = 
  | "my_cell"           // Only my immediate cell/neighborhood
  | "my_community"      // My community/gratiferia
  | "trusted_network"   // Trusted federated communities
  | "anyone_local"      // Anyone in local geographic area
  | "network_wide";     // Entire mesh network

/** Category hierarchy for matching (parent:child format) */
export type Category = string; // e.g., "food:produce", "tools:power", "skills:carpentry"

/** Unit of measurement */
export type Unit = "items" | "kg" | "g" | "l" | "ml" | "hours" | "days" | "sessions" | "people";

/** A listing represents an offer or need in the gift economy.
 *  UX primitive: simple to create, easy to browse.
 *  Backend stores rich data for agent matching.
 */
export interface Listing {
  id: string;                           // Stable prefixed ID: "lst_*"
  listing_type: ListingType;            // "offer" | "need"
  resource_spec_id: string;             // References ResourceSpec (shared taxonomy)
  
  // Who and where
  agent_id?: string;                    // Who is offering/needing (None for anonymous gifts - GAP-61)
  location_id?: string;                 // Where (references Location)
  
  // Anonymous gift flag (GAP-61: Emma Goldman)
  anonymous: boolean;                   // True for anonymous gifts - no attribution, pure generosity
  
  // What and how much
  quantity: number;
  unit: Unit;
  
  // When
  available_from?: string;              // ISO timestamp
  available_until?: string;             // ISO timestamp
  
  // Optional fields
  title?: string;                       // e.g., "Fresh tomatoes from garden"
  description?: string;                 // Notes, details
  image_url?: string;
  
  // State
  status: ListingStatus;                // active, matched, fulfilled, expired, cancelled
  
  // Links to related objects
  resource_instance_id?: string;        // If offering specific instance
  
  // Community scoping
  community_id?: string;                // Which community/gratiferia this belongs to
  
  // Visibility control (inter-community-sharing)
  visibility?: VisibilityScope;         // If None, uses user's sharing_preference
  
  // Metadata
  created_at?: string;                  // ISO timestamp
  updated_at?: string;                  // ISO timestamp
  
  // Cryptographic provenance
  author?: string;
  signature?: string;
}

/** Resource specification - shared taxonomy for listings */
export interface ResourceSpec {
  id: string;                           // "res_*"
  name: string;                         // Human readable name
  category: Category;                   // e.g., "food:produce:tomato"
  default_unit: Unit;
  description?: string;
  tags?: string[];
  perishable?: boolean;
  shelf_life_days?: number;
}

/** Location with geographic coordinates and zone */
export interface Location {
  id: string;                           // "loc_*"
  name: string;                         // Human readable (e.g., "Community Kitchen")
  address?: string;
  coords?: [number, number];            // [lat, lon]
  zone?: string;                        // Geographic zone for proximity scoring
  community_id?: string;
}

/** A match between an offer and a need */
export interface Match {
  id: string;                           // "mtch_*"
  offer_id: string;
  need_id: string;
  score: number;                        // 0-1 composite score
  match_data: MatchData;                // Detailed breakdown
  status: MatchStatus;                  // proposed, accepted, rejected, fulfilled, cancelled
  created_at: string;                   // ISO timestamp
  resolved_at?: string;                 // ISO timestamp
  resolved_by?: string;                 // Agent/user who resolved
  
  // Coordination details
  suggested_quantity: number;
  suggested_unit: Unit;
  suggested_handoff_time?: string;      // ISO timestamp or human readable
  suggested_handoff_location?: string;
}

/** Match status lifecycle */
export type MatchStatus = "proposed" | "accepted" | "rejected" | "fulfilled" | "cancelled";

/** Detailed match scoring breakdown */
export interface MatchData {
  // Category matching
  category_score: number;               // 0-1
  category_weight: number;
  category_match_type: CategoryMatchType;
  
  // Location proximity
  location_score: number;               // 0-1
  location_weight: number;
  distance_km?: number;
  distance_description?: string;
  
  // Time overlap
  time_score: number;                   // 0-1
  time_weight: number;
  time_buffer_hours?: number;
  
  // Quantity fit
  quantity_score: number;               // 0-1
  quantity_weight: number;
  quantity_ratio?: number;
}

/** Category match type enum */
export type CategoryMatchType = 
  | "exact"      // Exact category match (e.g., "food:produce:tomato" = "food:produce:tomato")
  | "parent"     // Parent category match (e.g., "food:produce" matches "food:*")
  | "semantic"   // Semantic/keyword overlap
  | "none";     // No match

/** Community-configurable matching weights for algorithmic transparency */
export interface MatchWeights {
  id: string;                           // "weights_*"
  community_id?: string;                // Scoped to community
  category_weight: number;              // Default 0.4
  location_weight: number;              // Default 0.3
  time_weight: number;                  // Default 0.2
  quantity_weight: number;              // Default 0.1
  min_match_score: number;              // Threshold for proposals (default 0.6)
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

/** Detailed match explanation for transparency */
export interface MatchExplanation {
  id: string;                           // "expl_*"
  match_id: string;
  category_score: number;
  location_score: number;
  time_score: number;
  quantity_score: number;
  total_score: number;
  category_weight: number;
  location_weight: number;
  time_weight: number;
  quantity_weight: number;
  explanation_text: string;             // Human-readable
  distance_km?: number;
  distance_description?: string;
  category_match_type?: CategoryMatchType;
  time_buffer_hours?: number;
  quantity_ratio?: number;
  created_at: string;
}

/** Audit log entry for bias detection */
export interface MatchingAuditLog {
  id: string;                           // "audit_*"
  match_id?: string;                    // Only if matched
  offer_id: string;
  need_id: string;
  match_score: number;
  threshold_score: number;
  matched: boolean;                     // Whether proposal was created
  weights_config_id: string;            // Which weights config was used
  provider_zone?: string;               // Offer location zone
  receiver_zone?: string;               // Need location zone
  offer_category?: string;
  need_category?: string;
  agent_version: string;                // Agent version for audit trail
  created_at: string;
}

/** Agent configuration for the matchmaker */
export interface MatchmakerConfig {
  community_id?: string;
  min_match_score?: number;             // Override weights threshold
  max_proposals_per_run?: number;       // Limit proposals per analysis run
  enable_audit_logging?: boolean;       // Default true
  enable_explanations?: boolean;        // Default true
  weights_override?: Partial<MatchWeights>; // Temporary weight adjustments
}

/** Swipe action for Tinder-like UI */
export type SwipeAction = "like" | "pass" | "super_like";

/** User swipe record */
export interface SwipeRecord {
  id: string;                           // "swp_*"
  user_id: string;                      // Who swiped
  listing_id: string;                   // What was swiped
  action: SwipeAction;
  created_at: string;
  match_id?: string;                    // If like resulted in match
}

/** Gratifieria community/instance */
export interface Gratiferia {
  id: string;                           // "grtf_*"
  name: string;
  description?: string;
  location_id?: string;
  community_id?: string;
  admin_ids: string[];                  // User IDs with admin rights
  sharing_preference: VisibilityScope;  // Default visibility for members
  matchmaker_config?: MatchmakerConfig;
  created_at: string;
  updated_at: string;
}

/** Karma/reputation in amphibious mode */
export interface KarmaAccount {
  user_id: string;
  znu_balance: number;                  // Postmonetario karma units
  usd_balance?: number;                 // Conectado mode (if oracle active)
  total_given: number;                  // Lifetime given (ZNU)
  total_received: number;               // Lifetime received (ZNU)
  matches_fulfilled: number;
  matches_cancelled: number;
  trust_score: number;                  // 0-1 composite
  last_activity: string;
}

/** Transaction for karma transfer (amphibious) */
export interface KarmaTransaction {
  id: string;                           // "krma_*"
  from_user: string;
  to_user: string;
  amount_znu: number;
  amount_usd?: number;                  // If conectado mode
  listing_id?: string;
  match_id?: string;
  type: "gratitude" | "fulfillment" | "bonus" | "penalty";
  note?: string;
  created_at: string;
  oracle_snapshot?: PriceParityOracle;  // If conectado
}

/** Price parity oracle for amphibious mode */
export interface PriceParityOracle {
  znu_to_usd: number;
  caas_to_usd?: number;
  at: string;
  source: string;
}

/** Resource specification for shared taxonomy */
export interface ResourceSpecInput {
  name: string;
  category: Category;
  default_unit: Unit;
  description?: string;
  tags?: string[];
  perishable?: boolean;
  shelf_life_days?: number;
}

/** Create listing input */
export interface CreateListingInput {
  listing_type: ListingType;
  resource_spec_id: string;
  agent_id?: string;
  anonymous?: boolean;
  location_id?: string;
  quantity: number;
  unit: Unit;
  available_from?: string;
  available_until?: string;
  title?: string;
  description?: string;
  image_url?: string;
  community_id?: string;
  visibility?: VisibilityScope;
}

/** Propose match input (from agent or user) */
export interface ProposeMatchInput {
  offer_id: string;
  need_id: string;
  match_score: number;
  match_data: MatchData;
  suggested_quantity: number;
  suggested_unit: Unit;
  suggested_handoff_time?: string;
  suggested_handoff_location?: string;
  requires_approval: [string, string];  // [offer_agent_id, need_agent_id]
}

/** Resolve match input */
export interface ResolveMatchInput {
  match_id: string;
  decision: "accept" | "reject";
  resolved_by: string;
  note?: string;
}

/** Search/filter listings */
export interface ListingFilter {
  listing_type?: ListingType;
  category?: Category;
  community_id?: string;
  location_zone?: string;
  max_distance_km?: number;
  available_from?: string;
  available_until?: string;
  status?: ListingStatus;
  anonymous?: boolean;
  query?: string;                       // Text search
  limit?: number;
  offset?: number;
}

/** Swipe session for Tinder-like UI */
export interface SwipeSession {
  user_id: string;
  filter: ListingFilter;
  current_listing_ids: string[];
  swipes: SwipeRecord[];
  matches_created: string[];
}

/** Gratifieria events for activity feed */
export interface GratiferiaEvent {
  id: string;                           // "evt_*"
  type: "listing_created" | "match_proposed" | "match_accepted" | "match_fulfilled" | "karma_transferred" | "review_left";
  actor_id: string;
  listing_id?: string;
  match_id?: string;
  karma_transaction_id?: string;
  data: Record<string, unknown>;
  created_at: string;
}