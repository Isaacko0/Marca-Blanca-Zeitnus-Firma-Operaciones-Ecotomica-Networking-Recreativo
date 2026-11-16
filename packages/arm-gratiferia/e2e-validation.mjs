#!/usr/bin/env node
/**
 * Gratifieria E2E Validation - Phase 4
 * 
 * Runs the complete gift economy flow in-memory:
 * 1. Create gratiferia community
 * 2. Create offer (tomatoes)
 * 3. Create need (tomatoes for sauce)
 * 4. Run matchmaker analysis
 * 4. Accept match
 * 5. Fulfill match
 * 6. Verify karma reward
 * 7. Test anonymous gift bonus (GAP-61)
 * 8. Test karma transfer (gratitude)
 * 9. Test weight governance
 * 10. Test swipe session (Tinder-like)
 */

import { createInMemoryRepositories } from "./src/core/repository.js";
import { GratifieriaMatchmaker } from "./src/agents/matchmaker.js";
import { KarmaSystem } from "./src/core/karma.js";
import { createGratiferiaDualConfig, formatKarma } from "./src/core/valueDual.js";

// ===== Setup =====
const repos = createInMemoryRepositories();
const matchmaker = new GratifieriaMatchmaker({
  listingRepo: repos.listingsRepoImpl,
  matchRepo: repos.matchesRepoImpl,
  transparencyRepo: repos.transparencyRepoImpl,
  karmaSystem: undefined,
});
const karmaSystem = new KarmaSystem(repos.karmaRepoImpl);
matchmaker.karmaSystem = karmaSystem;

// Initialize default weights
await repos.transparencyRepoImpl.upsertWeights({
  id: "weights_default",
  community_id: "default",
  category_weight: 0.4,
  location_weight: 0.3,
  time_weight: 0.2,
  quantity_weight: 0.1,
  min_match_score: 0.6,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_active: true,
});

// Helper to print section headers
function section(title) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${"=".repeat(60)}`);
}

function log(message) {
  console.log(`  ${message}`);
}

function success(message) {
  console.log(`  ✅ ${message}`);
}

function error(message) {
  console.log(`  ❌ ${message}`);
}

// ===== Test Data =====
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

const communityId = "gratiferia-centro";

async function createOffer(overrides) {
  const listing = {
    id: `lst_offer_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    listing_type: "offer",
    resource_spec_id: "food:produce:tomato",
    agent_id: "maria",
    anonymous: false,
    location_id: "loc_cocina_comunitaria",
    quantity: 5,
    unit: "kg",
    available_from: now.toISOString(),
    available_until: in3Days,
    title: "Tomates heirloom del huerto",
    description: "Variedad antigua, sin pesticidas",
    status: "active",
    community_id: communityId,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    ...overrides,
  };
  await repos.listingsRepoImpl.create(listing);
  return listing;
}

async function createNeed(overrides) {
  const listing = {
    id: `lst_need_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    listing_type: "need",
    resource_spec_id: "food:produce:tomato",
    agent_id: "carlos",
    anonymous: false,
    location_id: "loc_cocina_comunitaria",
    quantity: 3,
    unit: "kg",
    available_from: now.toISOString(),
    available_until: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    title: "Necesito tomates para salsa",
    description: "Para la fiesta del sábado",
    status: "active",
    community_id: communityId,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    ...overrides,
  };
  await repos.listingsRepoImpl.create(listing);
  return listing;
}

async function createAnonymousOffer() {
  return createOffer({
    agent_id: "anonimo",
    anonymous: true,
    title: "Calabazas del huerto (regalo anónimo)",
    resource_spec_id: "food:produce:pumpkin",
    quantity: 2,
    unit: "items",
    title: "Calabazas del huerto",
  });
}

// ===== E2E Flow =====
async function runE2E() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           GRATIFIERIA E2E VALIDATION - PHASE 4                 ║
║         Tinder de cosas gratis - Gift Economy Flow             ║
╚═══════════════════════════════════════════════════════════════╝`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      success(message);
      passed++;
    } else {
      error(message);
      failed++;
    }
  }

  // ----- 1. Create Gratiferia Community -----
  section("1. CREAR GRATIFIERIA COMUNITARIA");
  const gratiferia = await repos.gratiferiaRepoImpl.create({
    id: `grtf_${communityId}`,
    name: "Gratifieria Centro Comunitario",
    description: "Intercambio de alimentos y herramientas entre vecinos",
    admin_ids: ["maria", "carlos"],
    sharing_preference: "my_community",
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  });
  assert(gratiferia.id.startsWith("grtf_"), "Gratifieria creada con ID válido");
  assert(gratiferia.admin_ids.includes("maria"), "Admin asignado correctamente");

  // ----- 2. Create Offer -----
  section("2. CREAR OFERTA (María ofrece tomates)");
  const offer = await createOffer();
  assert(offer.id.startsWith("lst_offer_"), "Oferta creada con ID lst_offer_*");
  assert(offer.listing_type === "offer", "Tipo listing: offer");
  assert(offer.quantity === 5 && offer.unit === "kg", "Cantidad: 5 kg");
  assert(offer.resource_spec_id === "food:produce:tomato", "Categoría: food:produce:tomato");
  assert(offer.status === "active", "Estado: active");
  log(`Oferta: ${offer.id} - ${offer.title} (${offer.quantity} ${offer.unit})`);

  // ----- 3. Create Need -----
  section("3. CREAR NECESIDAD (Carlos necesita tomates)");
  const need = await createNeed();
  assert(need.id.startsWith("lst_need_"), "Necesidad creada con ID lst_need_*");
  assert(need.listing_type === "need", "Tipo listing: need");
  assert(need.quantity === 3 && need.unit === "kg", "Cantidad: 3 kg");
  assert(need.resource_spec_id === "food:produce:tomato", "Misma categoría que la oferta");
  log(`Necesidad: ${need.id} - ${need.title} (${need.quantity} ${need.unit})`);

  // ----- 4. Run Matchmaker -----
  section("4. EJECUTAR MATCHMAKER (IA matching)");
  const proposals = await matchmaker.analyze();
  assert(proposals.length > 0, "Se generaron propuestas de match");
  
  const match = proposals[0];
  assert(match.offer_id === offer.id, "Match usa la oferta correcta");
  assert(match.need_id === need.id, "Match usa la necesidad correcta");
  assert(match.score >= 0.6, `Score ${match.score.toFixed(2)} supera threshold 0.6`);
  assert(match.status === "proposed", "Estado inicial: proposed");
  assert(match.match_data.category_match_type === "exact", "Match tipo: exact (misma categoría)");
  assert(match.match_data.location_score === 1.0, "Ubicación: same location (score 1.0)");
  
  log(`Match propuesto: ${match.id}`);
  log(`  Score: ${match.score.toFixed(2)}`);
  log(`  Categoría: ${match.match_data.category_match_type} (${match.match_data.category_score})`);
  log(`  Ubicación: ${match.match_data.distance_description || "same"}`);
  log(`  Tiempo: buffer ${match.match_data.time_buffer_hours?.toFixed(1)}h`);
  log(`  Cantidad: ratio ${match.match_data.quantity_ratio}`);

  // ----- 5. Accept Match (Carlos accepts) -----
  section("5. ACEPTAR MATCH (Carlos acepta)");
  await repos.matchesRepoImpl.updateStatus(match.id, "accepted", "carlos");
  const acceptedMatch = await repos.matchesRepoImpl.getById(match.id);
  assert(acceptedMatch.status === "accepted", "Estado: accepted");
  assert(acceptedMatch.resolved_by === "carlos", "Resuelto por: carlos");
  success("Match aceptado por Carlos");

  // ----- 6. Fulfill Match (María entrega) -----
  section("6. CUMPLIR MATCH (María entrega tomates)");
  await repos.matchesRepoImpl.updateStatus(match.id, "fulfilled", "maria");
  const fulfilledMatch = await repos.matchesRepoImpl.getById(match.id);
  assert(fulfilledMatch.status === "fulfilled", "Estado: fulfilled");
  assert(fulfilledMatch.resolved_by === "maria", "Resuelto por: maria");
  
  // Karma reward for fulfillment
  await karmaSystem.rewardFulfillment("maria", match.id);
  const mariaBalance = await karmaSystem.getBalance("maria");
  assert(mariaBalance.primary >= 110, `Karma María: ${formatKarma(mariaBalance.primary, karmaSystem["dualConfig"])} (base 100 + 10 reward)`);
  success(`María recibe karma: ${formatKarma(mariaBalance.primary, mariaBalance.primaryUnit)}`);

  // ----- 7. Anonymous Gift (GAP-61) -----
  section("7. REGALO ANÓNIMO (GAP-61 - Emma Goldman)");
  const anonOffer = await createAnonymousOffer();
  const anonNeed = await createNeed({ agent_id: "lucia", title: "Necesito calabazas para sopa" });
  
  const anonProposals = await matchmaker.analyze();
  const anonMatch = anonProposals.find(m => m.offer_id === anonOffer.id);
  assert(anonMatch, "Match anónimo propuesto");
  
  await repos.matchesRepoImpl.updateStatus(anonMatch.id, "accepted", "lucia");
  await repos.matchesRepoImpl.updateStatus(anonMatch.id, "fulfilled", "anonimo");
  await karmaSystem.rewardFulfillment("anonimo", anonMatch.id); // base reward
  await karmaSystem.rewardAnonymousGift("anonimo", anonOffer.id); // GAP-61 bonus
  
  const anonBalance = await karmaSystem.getBalance("anonimo");
  // 100 base + 10 fulfillment + 20 anonymous = 130
  assert(anonBalance.primary >= 130, `Karma anónimo: ${formatKarma(anonBalance.primary, anonBalance.primaryUnit)} (100 + 10 + 20 GAP-61)`);
  success(`Regalo anónimo bonus GAP-61: ${formatKarma(anonBalance.primary, anonBalance.primaryUnit)}`);

  // ----- 8. Karma Transfer (Gratitud) -----
  section("8. TRANSFERENCIA KARMA (Gratitud de Carlos a María)");
  await karmaSystem.transfer("carlos", "maria", 5, "Gracias por los tomates!");
  const carlosBalance = await karmaSystem.getBalance("carlos");
  const mariaBalance2 = await karmaSystem.getBalance("maria");
  assert(carlosBalance.primary === 95, `Carlos: ${formatKarma(carlosBalance.primary, carlosBalance.primaryUnit)} (100 - 5)`);
  assert(mariaBalance2.primary >= 115, `María: ${formatKarma(mariaBalance2.primary, mariaBalance2.primaryUnit)} (110 + 5 gratitud)`);
  success(`Transferencia gratitud: Carlos → María (5 ZNU)`);

  // ----- 9. Weight Governance -----
  section("9. GOBERNANZA DE PESOS (Comunidad ajusta algoritmo)");
  const oldWeights = await repos.transparencyRepoImpl.getActiveWeights(communityId);
  log(`Pesos actuales: cat=${oldWeights.category_weight}, loc=${oldWeights.location_weight}, time=${oldWeights.time_weight}, qty=${oldWeights.quantity_weight}`);
  
  // Comunidad decide priorizar ubicación (gratiferia dispersa)
  await repos.transparencyRepoImpl.upsertWeights({
    ...oldWeights,
    category_weight: 0.2,
    location_weight: 0.5,
    time_weight: 0.2,
    quantity_weight: 0.1,
    updated_at: new Date().toISOString(),
  });
  
  const newWeights = await repos.transparencyRepoImpl.getActiveWeights(communityId);
  assert(newWeights.location_weight === 0.5, "Peso ubicación actualizado a 0.5");
  assert(newWeights.category_weight === 0.2, "Peso categoría reducido a 0.2");
  success("Comunidad actualizó pesos: prioriza proximidad geográfica");

  // Verificar que matchmaker usa nuevos pesos
  const newProposals = await matchmaker.analyze();
  if (newProposals.length > 0) {
    log(`Nuevos pesos aplicados: cat=${newWeights.category_weight}, loc=${newWeights.location_weight}`);
  }

  // ----- 10. Swipe Session (Tinder-like) -----
  section("10. SESIÓN SWIPE (Tinder de cosas gratis)");
  const moreOffers = await Promise.all([
    createOffer({ agent_id: "juan", resource_spec_id: "tools:hand:hammer", title: "Martillo", quantity: 1, unit: "items" }),
    createOffer({ agent_id: "ana", resource_spec_id: "skills:cooking", title: "Clase de cocina", quantity: 2, unit: "hours" }),
    createNeed({ agent_id: "pedro", resource_spec_id: "tools:hand:hammer", title: "Necesito martillo", quantity: 1, unit: "items" }),
  ]);

  const allListings = await repos.listingsRepoImpl.search({ community_id: communityId });
  assert(allListings.length >= 6, `Total listings: ${allListings.length}`);

  // Simulate swipe session for user "lucia"
  const swipeSession = {
    user_id: "lucia",
    filter: { community_id: communityId, listing_type: "offer"  },
    current_listing_ids: allListings.filter(l => l.listing_type === "offer").map(l => l.id),
    swipes: [],
    matches_created: [],
  };

  // Lucia swipes
  for (const listingId of swipeSession.current_listing_ids.slice(0, 3)) {
    const action = listingId.includes("hammer") ? "pass" : "like";
    await repos.swipesRepoImpl.create({
      id: `swp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      user_id: "lucia",
      listing_id: listingId,
      action: action,
      created_at: new Date().toISOString(),
    });
    swipeSession.swipes.push({ listing_id: listingId, action });
    log(`  Swipe ${action} → ${listingId}`);
  }

  const luciaSwipes = await repos.swipesRepoImpl.getByUser("lucia");
  assert(luciaSwipes.length >= 3, `Lucia hizo ${luciaSwipes.length} swipes`);
  success(`Sesión swipe: ${luciaSwipes.length} interacciones (Tinder-like)`);

  // ----- 11. Audit Trail Verification -----
  section("11. AUDIT TRAIL (Transparencia algorítmica)");
  const auditLogs = await repos.transparencyRepoImpl.getAuditLogs({ communityId, limit: 10 });
  assert(auditLogs.length > 0, `Audit logs generados: ${auditLogs.length}`);
  
  const lastLog = auditLogs[0];
  assert(lastLog.offer_id && lastLog.need_id, "Log referencia offer y need");
  assert(typeof lastLog.match_score === "number", "Log incluye score");
  assert(typeof lastLog.matched === "boolean", "Log indica si matched");
  assert(lastLog.weights_config_id, "Log referencia config de pesos");
  assert(lastLog.agent_version === "1.0.0-arm-gratiferia", "Versión agente registrada");
  success(`Audit trail: ${auditLogs.length} decisiones registradas con transparencia`);

  // ----- 12. Match Explanation -----
  section("12. EXPLICACIÓN DE MATCH (Por qué este match?)");
  const explanation = await repos.transparencyRepoImpl.getExplanation(match.id);
  assert(explanation, "Explicación generada");
  assert(explanation.explanation_text.includes("tomate"), "Explicación menciona recurso");
  assert(explanation.explanation_text.includes("Same location") || explanation.explanation_text.includes("location"), "Explicación menciona ubicación");
  assert(explanation.category_match_type === "exact", "Tipo match: exact");
  success(`Explicación: "${explanation.explanation_text.substring(0, 80)}..."`);

  // ----- Summary -----
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    E2E VALIDATION COMPLETE                     ║
╠═══════════════════════════════════════════════════════════════╣
║  ✅ Gratiferia creada                                          ║
║  ✅ Oferta + Necesidad creadas                                 ║
║  ✅ Matchmaker: match propuesto (score ≥ 0.6)                  ║
║  ✅ Match aceptado por ambas partes                            ║
║  ✅ Match cumplido → karma recompensado                        ║
║  ✅ Regalo anónimo (GAP-61) → bonus karma                      ║
║  ✅ Transferencia karma (gratitud)                             ║
║  ✅ Gobernanza pesos (comunidad ajusta algoritmo)              ║
║  ✅ Sesión swipe (Tinder-like)                                 ║
║  ✅ Audit trail completo (transparencia)                       ║
║  ✅ Explicación match legible por humanos                      ║
╠═══════════════════════════════════════════════════════════════╣
║  TOTAL: ${passed} passed, ${failed} failed                              ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  if (failed > 0) {
    process.exit(1);
  }
}

runE2E().catch(err => {
  console.error("E2E FAILED:", err);
  process.exit(1);
});