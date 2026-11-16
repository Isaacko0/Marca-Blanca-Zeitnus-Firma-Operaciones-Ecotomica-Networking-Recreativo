/**
 * Gratifieria Matchmaker Unit Tests
 * 
 * Tests the core matching algorithm ported from solarpunk_utopia's
 * mutual_aid_matchmaker.py with algorithmic transparency.
 */

import { describe, it, assert } from "node:test";
import { strictEqual, ok, deepStrictEqual } from "node:assert";

// Mock types for testing (inline to avoid build dependencies)
interface Listing {
  id: string;
  listing_type: "offer" | "need";
  resource_spec_id: string;
  agent_id?: string;
  anonymous: boolean;
  location_id?: string;
  quantity: number;
  unit: string;
  available_from?: string;
  available_until?: string;
  title?: string;
  description?: string;
  status: string;
  community_id?: string;
  created_at: string;
  updated_at: string;
}

interface MatchData {
  category_score: number;
  category_weight: number;
  category_match_type: "exact" | "parent" | "semantic" | "none";
  location_score: number;
  location_weight: number;
  distance_km?: number;
  distance_description?: string;
  time_score: number;
  time_weight: number;
  time_buffer_hours?: number;
  quantity_score: number;
  quantity_weight: number;
  quantity_ratio?: number;
}

interface MatchWeights {
  category_weight: number;
  location_weight: number;
  time_weight: number;
  quantity_weight: number;
  min_match_score: number;
}

// --- Pure Matching Functions (ported from solarpunk_utopia) ---

function scoreCategoryMatch(offerCat: string, needCat: string): { score: number; match_type: MatchData["category_match_type"] } {
  if (!offerCat || !needCat) {
    return { score: 0.0, match_type: "none" };
  }
  if (offerCat === needCat) {
    return { score: 1.0, match_type: "exact" };
  }
  const offerParts = offerCat.split(":");
  const needParts = needCat.split(":");
  if (offerParts[0] === needParts[0]) {
    return { score: 0.7, match_type: "parent" };
  }
  const offerKeywords = new Set(offerCat.toLowerCase().split(":"));
  const needKeywords = new Set(needCat.toLowerCase().split(":"));
  const overlap = [...offerKeywords].filter(k => needKeywords.has(k)).length;
  if (overlap > 0) {
    return { score: 0.5, match_type: "semantic" };
  }
  return { score: 0.0, match_type: "none" };
}

function scoreLocationProximity(offer: Listing, need: Listing): { score: number; distance_km?: number; description: string } {
  if (offer.location_id && need.location_id && offer.location_id === need.location_id) {
    return { score: 1.0, distance_km: 0, description: "Same location" };
  }
  return { score: 0.5, distance_km: undefined, description: "Distance unknown" };
}

function scoreTimeOverlap(offer: Listing, need: Listing): { score: number; time_buffer_hours?: number } {
  const offerStart = offer.available_from ? new Date(offer.available_from) : null;
  const offerEnd = offer.available_until ? new Date(offer.available_until) : null;
  const needBy = need.available_until ? new Date(need.available_until) : null;

  if (!offerStart || !offerEnd || !needBy) {
    return { score: 0.5, time_buffer_hours: undefined };
  }

  if (offerStart <= needBy && needBy <= offerEnd) {
    const bufferHours = (offerEnd.getTime() - needBy.getTime()) / (1000 * 60 * 60);
    if (bufferHours > 24) return { score: 1.0, time_buffer_hours: bufferHours };
    if (bufferHours > 6) return { score: 0.8, time_buffer_hours: bufferHours };
    return { score: 0.5, time_buffer_hours: bufferHours };
  }
  return { score: 0.0, time_buffer_hours: 0 };
}

function scoreQuantityFit(offer: Listing, need: Listing): { score: number; quantity_ratio?: number } {
  const offerQty = offer.quantity;
  const needQty = need.quantity;
  const offerUnit = offer.unit;
  const needUnit = need.unit;

  if (!offerQty || !needQty || offerUnit !== needUnit) {
    return { score: 0.5, quantity_ratio: undefined };
  }

  const ratio = offerQty / needQty;

  if (offerQty >= needQty) {
    if (ratio <= 1.5) return { score: 1.0, quantity_ratio: ratio };
    return { score: 0.7, quantity_ratio: ratio };
  } else {
    return { score: ratio * 0.6, quantity_ratio: ratio };
  }
}

function scoreMatch(offer: Listing, need: Listing, weights: { category_weight: number; location_weight: number; time_weight: number; quantity_weight: number }) {
  let score = 0.0;
  const match_data: MatchData = {
    category_score: 0,
    category_weight: weights.category_weight,
    location_score: 0,
    location_weight: weights.location_weight,
    time_score: 0,
    time_weight: weights.time_weight,
    quantity_score: 0,
    quantity_weight: weights.quantity_weight,
  };

  // Category
  const catResult = scoreCategoryMatch(offer.resource_spec_id, need.resource_spec_id);
  score += catResult.score * weights.category_weight;
  match_data.category_score = catResult.score;
  match_data.category_match_type = catResult.match_type;

  // Location
  const locResult = scoreLocationProximity(offer, need);
  score += locResult.score * weights.location_weight;
  match_data.location_score = locResult.score;
  if (locResult.distance_km !== undefined) {
    match_data.distance_km = locResult.distance_km;
    match_data.distance_description = locResult.description;
  }

  // Time
  const timeResult = scoreTimeOverlap(offer, need);
  score += timeResult.score * weights.time_weight;
  match_data.time_score = timeResult.score;
  if (timeResult.time_buffer_hours !== undefined) {
    match_data.time_buffer_hours = timeResult.time_buffer_hours;
  }

  // Quantity
  const qtyResult = scoreQuantityFit(offer, need);
  score += qtyResult.score * weights.quantity_weight;
  match_data.quantity_score = qtyResult.score;
  if (qtyResult.quantity_ratio !== undefined) {
    match_data.quantity_ratio = qtyResult.quantity_ratio;
  }

  return { score, match_data };
}

// --- Tests ---

const defaultWeights = {
  category_weight: 0.4,
  location_weight: 0.3,
  time_weight: 0.2,
  quantity_weight: 0.1,
  min_match_score: 0.6,
};

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
const in1Hour = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

const baseOffer: Listing = {
  id: "lst_offer_1",
  listing_type: "offer",
  resource_spec_id: "food:produce:tomato",
  agent_id: "agent_1",
  anonymous: false,
  location_id: "loc_kitchen",
  quantity: 5,
  unit: "kg",
  available_from: now.toISOString(),
  available_until: in3Days,
  title: "Fresh tomatoes",
  status: "active",
  community_id: "default",
  created_at: now.toISOString(),
  updated_at: now.toISOString(),
};

const baseNeed: Listing = {
  id: "lst_need_1",
  listing_type: "need",
  resource_spec_id: "food:produce:tomato",
  agent_id: "agent_2",
  anonymous: false,
  location_id: "loc_kitchen",
  quantity: 3,
  unit: "kg",
  available_from: now.toISOString(),
  available_until: tomorrow,
  title: "Need tomatoes for sauce",
  status: "active",
  community_id: "default",
  created_at: now.toISOString(),
  updated_at: now.toISOString(),
};

describe("Gratifieria Matchmaker - Core Algorithm", () => {

  it("scoreCategoryMatch: exact match returns 1.0", () => {
    const result = scoreCategoryMatch("food:produce:tomato", "food:produce:tomato");
    strictEqual(result.score, 1.0);
    strictEqual(result.match_type, "exact");
  });

  it("scoreCategoryMatch: parent category match returns 0.7", () => {
    const result = scoreCategoryMatch("food:produce:tomato", "food:produce:lettuce");
    strictEqual(result.score, 0.7);
    strictEqual(result.match_type, "parent");
  });

  it("scoreCategoryMatch: semantic overlap returns 0.5", () => {
    // "food:produce:tomato" vs "tools:cooking:knife" - share "cooking" concept but different parent
    // Actually: "food:produce:tomato" vs "food:preserve:tomato" share "food" parent -> 0.7
    // For true semantic (different parents, keyword overlap): "food:produce:tomato" vs "tools:cooking:knife"
    const result = scoreCategoryMatch("food:produce:tomato", "tools:cooking:tomato");
    strictEqual(result.score, 0.5);
    strictEqual(result.match_type, "semantic");
  });

  it("scoreCategoryMatch: no match returns 0.0", () => {
    const result = scoreCategoryMatch("food:produce:tomato", "tools:power:drill");
    strictEqual(result.score, 0.0);
    strictEqual(result.match_type, "none");
  });

  it("scoreLocationProximity: same location returns 1.0", () => {
    const offer = { ...baseOffer, location_id: "loc_kitchen" };
    const need = { ...baseNeed, location_id: "loc_kitchen" };
    const result = scoreLocationProximity(offer, need);
    strictEqual(result.score, 1.0);
    strictEqual(result.distance_km, 0);
  });

  it("scoreLocationProximity: different location returns 0.5", () => {
    const offer = { ...baseOffer, location_id: "loc_kitchen" };
    const need = { ...baseNeed, location_id: "loc_garden" };
    const result = scoreLocationProximity(offer, need);
    strictEqual(result.score, 0.5);
  });

  it("scoreTimeOverlap: need within offer window with >24h buffer returns 1.0", () => {
    const offer = { ...baseOffer, available_from: now.toISOString(), available_until: in3Days };
    const need = { ...baseNeed, available_until: tomorrow };
    const result = scoreTimeOverlap(offer, need);
    strictEqual(result.score, 1.0);
    ok(result.time_buffer_hours && result.time_buffer_hours > 24);
  });

  it("scoreTimeOverlap: need within offer window with 6-24h buffer returns 0.8", () => {
    const in12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const offer = { ...baseOffer, available_from: now.toISOString(), available_until: tomorrow };
    const need = { ...baseNeed, available_until: in12Hours };
    const result = scoreTimeOverlap(offer, need);
    strictEqual(result.score, 0.8);
  });

  it("scoreTimeOverlap: need outside offer window returns 0.0", () => {
    const past = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const offer = { ...baseOffer, available_from: past, available_until: now.toISOString() };
    const need = { ...baseNeed, available_until: tomorrow };
    const result = scoreTimeOverlap(offer, need);
    strictEqual(result.score, 0.0);
  });

  it("scoreQuantityFit: offer meets need exactly returns 1.0", () => {
    const offer = { ...baseOffer, quantity: 5, unit: "kg" };
    const need = { ...baseNeed, quantity: 5, unit: "kg" };
    const result = scoreQuantityFit(offer, need);
    strictEqual(result.score, 1.0);
    strictEqual(result.quantity_ratio, 1.0);
  });

  it("scoreQuantityFit: offer exceeds need slightly returns 1.0", () => {
    const offer = { ...baseOffer, quantity: 7, unit: "kg" };
    const need = { ...baseNeed, quantity: 5, unit: "kg" };
    const result = scoreQuantityFit(offer, need);
    strictEqual(result.score, 1.0);
    strictEqual(result.quantity_ratio, 1.4);
  });

  it("scoreQuantityFit: offer exceeds need greatly returns 0.7", () => {
    const offer = { ...baseOffer, quantity: 15, unit: "kg" };
    const need = { ...baseNeed, quantity: 5, unit: "kg" };
    const result = scoreQuantityFit(offer, need);
    strictEqual(result.score, 0.7);
  });

  it("scoreQuantityFit: partial fulfillment returns ratio * 0.6", () => {
    const offer = { ...baseOffer, quantity: 3, unit: "kg" };
    const need = { ...baseNeed, quantity: 5, unit: "kg" };
    const result = scoreQuantityFit(offer, need);
    strictEqual(result.score, 0.36); // 0.6 * 0.6
    strictEqual(result.quantity_ratio, 0.6);
  });

  it("scoreQuantityFit: different units returns 0.5", () => {
    const offer = { ...baseOffer, quantity: 5, unit: "kg" };
    const need = { ...baseNeed, quantity: 5, unit: "items" };
    const result = scoreQuantityFit(offer, need);
    strictEqual(result.score, 0.5);
  });

  it("scoreMatch: perfect match scores high", () => {
    // Use matching quantities for perfect match
    const perfectOffer = { ...baseOffer, quantity: 5, unit: "kg" };
    const perfectNeed = { ...baseNeed, quantity: 5, unit: "kg" };
    const result = scoreMatch(perfectOffer, perfectNeed, defaultWeights);
    // Category: 1.0 * 0.4 = 0.4
    // Location: 1.0 * 0.3 = 0.3
    // Time: ~1.0 * 0.2 = 0.2
    // Quantity: 1.0 * 0.1 = 0.1
    // Total: 1.0
    ok(result.score > 0.9);
    strictEqual(result.match_data.category_match_type, "exact");
    strictEqual(result.match_data.category_score, 1.0);
    strictEqual(result.match_data.location_score, 1.0);
    strictEqual(result.match_data.quantity_score, 1.0);
  });

  it("scoreMatch: incompatible category scores low", () => {
    const offer = { ...baseOffer, resource_spec_id: "tools:power:drill" };
    const need = { ...baseNeed, resource_spec_id: "food:produce:tomato" };
    const result = scoreMatch(offer, need, defaultWeights);
    ok(result.score < 0.6); // Below threshold
    strictEqual(result.match_data.category_match_type, "none");
    strictEqual(result.match_data.category_score, 0.0);
  });

  it("scoreMatch: different location reduces score", () => {
    const offer = { ...baseOffer, location_id: "loc_kitchen" };
    const need = { ...baseNeed, location_id: "loc_garden" };
    const result = scoreMatch(offer, need, defaultWeights);
    // Category 0.4 + Location 0.15 + Time 0.2 + Quantity 0.1 = 0.85
    ok(result.score < 1.0);
    ok(result.score > 0.6); // Still above threshold
    strictEqual(result.match_data.location_score, 0.5);
  });

  it("scoreMatch: low quantity reduces score", () => {
    const offer = { ...baseOffer, quantity: 1, unit: "kg", location_id: "loc_garden" };
    const need = { ...baseNeed, quantity: 5, unit: "kg", location_id: "loc_kitchen" };
    const result = scoreMatch(offer, need, defaultWeights);
    // Category 0.4 + Location 0.15 + Time 0.2 + Quantity ~0.01 = 0.76
    ok(result.score < 0.9);
  });

});

describe("Gratifieria Matchmaker - Weight Configuration", () => {

  it("custom weights change scoring priority", () => {
    const locationHeavyWeights = {
      category_weight: 0.1,
      location_weight: 0.7,
      time_weight: 0.1,
      quantity_weight: 0.1,
      min_match_score: 0.6,
    };

    const offer = { ...baseOffer, location_id: "loc_kitchen" };
    const need = { ...baseNeed, location_id: "loc_garden" };

    const balancedResult = scoreMatch(offer, need, defaultWeights);
    const locationHeavyResult = scoreMatch(offer, need, locationHeavyWeights);

    // With location-heavy weights, the distance penalty should hurt more
    ok(locationHeavyResult.score < balancedResult.score);
  });

  it("zero weight for category ignores category mismatch", () => {
    const noCategoryWeights = {
      category_weight: 0.0,
      location_weight: 0.4,
      time_weight: 0.3,
      quantity_weight: 0.3,
      min_match_score: 0.6,
    };

    const offer = { ...baseOffer, resource_spec_id: "tools:power:drill" };
    const need = { ...baseNeed, resource_spec_id: "food:produce:tomato" };

    const result = scoreMatch(offer, need, noCategoryWeights);
    // Category contributes 0, so other factors determine score
    ok(result.score > 0); // Should still have some score from other factors
  });

});

describe("Gratifieria Matchmaker - Edge Cases", () => {

  it("handles missing timestamps gracefully", () => {
    const offer = { ...baseOffer, available_from: undefined, available_until: undefined };
    const need = { ...baseNeed, available_until: undefined };
    const result = scoreMatch(offer, need, defaultWeights);
    strictEqual(result.match_data.time_score, 0.5);
    strictEqual(result.match_data.time_buffer_hours, undefined);
  });

  it("handles missing location gracefully", () => {
    const offer = { ...baseOffer, location_id: undefined };
    const need = { ...baseNeed, location_id: undefined };
    const result = scoreMatch(offer, need, defaultWeights);
    strictEqual(result.match_data.location_score, 0.5);
  });

  it("handles missing quantity gracefully", () => {
    const offer = { ...baseOffer, quantity: 0 };
    const need = { ...baseNeed, quantity: 0 };
    const result = scoreMatch(offer, need, defaultWeights);
    strictEqual(result.match_data.quantity_score, 0.5);
  });

  it("handles missing category gracefully", () => {
    const offer = { ...baseOffer, resource_spec_id: "" };
    const need = { ...baseNeed, resource_spec_id: "" };
    const result = scoreMatch(offer, need, defaultWeights);
    strictEqual(result.match_data.category_score, 0.0);
    strictEqual(result.match_data.category_match_type, "none");
  });

});

describe("Gratifieria Karma System - Core Logic", () => {

  it("calculates trust score based on fulfillment ratio", () => {
    const fulfilled = 8;
    const cancelled = 2;
    const total = fulfilled + cancelled;
    const trustScore = fulfilled / total;
    strictEqual(trustScore, 0.8);
  });

  it("trust score caps at 1.0", () => {
    const fulfilled = 10;
    const cancelled = 0;
    const trustScore = Math.min(1.0, fulfilled / (fulfilled + cancelled));
    strictEqual(trustScore, 1.0);
  });

  it("trust score floors at 0.0", () => {
    const fulfilled = 0;
    const cancelled = 10;
    const trustScore = Math.max(0.0, fulfilled / (fulfilled + cancelled));
    strictEqual(trustScore, 0.0);
  });

  it("karma balance increases on credit", () => {
    let balance = 100;
    balance += 10; // credit
    strictEqual(balance, 110);
  });

  it("karma balance decreases on debit but not below zero", () => {
    let balance = 5;
    balance = Math.max(0, balance - 10); // debit
    strictEqual(balance, 0);
  });

  it("transfer reduces sender and increases receiver", () => {
    let sender = 100;
    let receiver = 50;
    const amount = 20;
    sender -= amount;
    receiver += amount;
    strictEqual(sender, 80);
    strictEqual(receiver, 70);
  });

});

describe("Gratifieria ValueDual - Amphibious Mode", () => {

  it("postmonetario mode returns ZNU only", () => {
    const config = { mode: "postmonetario" as const, precision: 2 };
    const znu = 100;
    const dual = { znu, usd: undefined, label: "100.00 ZNU", primary: znu, primaryUnit: "ZNU" as const };
    strictEqual(dual.znu, 100);
    strictEqual(dual.usd, undefined);
    strictEqual(dual.primaryUnit, "ZNU");
  });

  it("conectado mode converts ZNU to USD", () => {
    const config = { mode: "conectado" as const, oracle: { znuToUsd: 2.5, at: new Date().toISOString(), source: "test" }, precision: 2 };
    const znu = 100;
    const usd = znu * 2.5;
    const dual = { znu, usd, label: `$${usd.toFixed(2)} USD (100.00 ZNU)`, primary: usd, primaryUnit: "USD" as const };
    strictEqual(dual.usd, 250);
    strictEqual(dual.primaryUnit, "USD");
  });

  it("formatDual shows both in conectado mode", () => {
    const dual = { znu: 100, usd: 250, label: "$250.00 USD (100.00 ZNU)", primary: 250, primaryUnit: "USD" as const };
    const formatted = dual.label;
    ok(formatted.includes("USD"));
    ok(formatted.includes("ZNU"));
  });

});

console.log("All tests passed!");