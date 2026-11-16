#!/usr/bin/env node
/**
 * Gratifieria MCP Server
 * 
 * Model Context Protocol server for gift economy matchmaking.
 * Exposes tools for agents to interact with gratifieria.
 * 
 * Tools:
 * - gratifieria_listing_create: Create offer/need
 * - gratifieria_listing_list: List listings
 * - gratifieria_listing_show: Show listing details
 * - gratifieria_match_propose: Propose match between offer and need
 * - gratifieria_match_accept: Accept a match
 * - gratifieria_match_reject: Reject a match
 * - gratifieria_match_fulfill: Mark match as fulfilled
 * - gratifieria_match_list: List matches
 * - gratifieria_swipe: Swipe on a listing (like/pass)
 * - gratifieria_karma_balance: Check karma balance
 * - gratifieria_karma_transfer: Transfer karma
 * - gratifieria_matchmaker_run: Run matchmaking analysis
 * - gratifieria_weights_show: Show matching weights
 * - gratifieria_weights_set: Update matching weights
 */

import readline from "node:readline";
import type { Actor, Listing, Match, MatchWeights, ListingType, MatchStatus, ListingFilter } from "@hscsg/arm-gratiferia/types.js";
import { createInMemoryRepositories } from "@hscsg/arm-gratiferia/core/repository.js";
import { createMatchmaker } from "@hscsg/arm-gratiferia/agents/matchmaker.js";
import { createKarmaSystem } from "@hscsg/arm-gratiferia/core/karma.js";
import { createGratiferiaDualConfig, formatKarma } from "@hscsg/arm-gratiferia/core/valueDual.js";
import { brand } from "@hscsg/arm-core";

const PROTOCOL = "2025-06-18";

const INSTRUCTIONS = `Gratifieria - Gift economy matchmaking tools.

Create offers and needs, run AI matchmaking, coordinate fulfillments, and manage karma/reputation.

Listings are the primary UX primitive:
- Offer: something you're giving away (food, tools, time, skills)
- Need: something you're looking for

The matchmaker analyzes offers/needs and proposes matches based on:
- Category compatibility (exact, parent, semantic)
- Location proximity
- Time overlap
- Quantity fit

Matches require approval from both parties. On fulfillment, karma is awarded.

Karma is the amphibious reputation currency:
- Postmonetario mode (default): ZNU units
- Conectado mode: USD/USDC via priceParity oracle
- Earned by: fulfilling matches, anonymous gifts (GAP-61 bonus)
- Lost by: cancelling matches
- Transferable between users as gratitude

Weights are configurable per community for algorithmic transparency.
`;

const repos = createInMemoryRepositories();
const matchmaker = createMatchmaker({
  listingRepo: repos.listingsRepoImpl,
  matchRepo: repos.matchesRepoImpl,
  transparencyRepo: repos.transparencyRepoImpl,
  karmaSystem: undefined,
});
const karmaSystem = createKarmaSystem(repos.karmaRepoImpl);

// Initialize default weights
repos.transparencyRepoImpl.upsertWeights({
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

type Json = Record<string, unknown>;
type Tool = { name: string; description: string; inputSchema: Json; run: (args: Json, actor: Actor) => Promise<unknown> };

const str = (description: string, extra: Json = {}) => ({ type: "string", description, ...extra });
const num = (description: string, extra: Json = {}) => ({ type: "number", description, ...extra });
const bool = (description: string, extra: Json = {}) => ({ type: "boolean", description, ...extra });
const enum_ = (description: string, values: string[], extra: Json = {}) => ({ type: "string", description, enum: values, ...extra });
const schema = (properties: Json, required: string[] = []) => ({ type: "object", properties, required, additionalProperties: false });

const s = (args: Json, key: string) => (typeof args[key] === "string" ? args[key] : undefined);
const n = (args: Json, key: string) => (typeof args[key] === "number" ? args[key] : undefined);
const b = (args: Json, key: string) => (typeof args[key] === "boolean" ? args[key] : false);

const tools: Tool[] = [
  {
    name: "gratifieria_listing_create",
    description: "Create a new offer or need listing",
    inputSchema: schema({
      listing_type: enum_("Type of listing", ["offer", "need"]),
      title: str("Short title"),
      resource_spec_id: str("Resource category (e.g., food:produce:tomato, tools:power:drill)"),
      quantity: num("Quantity"),
      unit: enum_("Unit", ["items", "kg", "g", "l", "ml", "hours", "days", "sessions", "people"]),
      description: str("Detailed description"),
      location_id: str("Location ID"),
      available_from: str("Available from (ISO timestamp)"),
      available_until: str("Available until (ISO timestamp)"),
      anonymous: bool("Anonymous gift (GAP-61)"),
      community_id: str("Community/gratiferia ID"),
    }, ["listing_type", "title", "resource_spec_id", "quantity", "unit"]),
    run: async (args, actor) => {
      const listing: any = {
        id: `lst_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        listing_type: args.listing_type,
        resource_spec_id: args.resource_spec_id,
        agent_id: actor.kind === "agent" ? undefined : actor.name,
        anonymous: args.anonymous || false,
        location_id: args.location_id,
        quantity: args.quantity,
        unit: args.unit,
        available_from: args.available_from,
        available_until: args.available_until,
        title: args.title,
        description: args.description,
        status: "active",
        community_id: args.community_id || "default",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await repos.listingsRepoImpl.create(listing);
      return `Created ${listing.listing_type}: ${listing.id} - ${listing.title}`;
    },
  },
  {
    name: "gratifieria_listing_list",
    description: "List listings with optional filters",
    inputSchema: schema({
      listing_type: enum_("Filter by type", ["offer", "need"]),
      status: enum_("Filter by status", ["active", "matched", "fulfilled", "expired", "cancelled"]),
      community_id: str("Community ID"),
      limit: num("Max results", { minimum: 1, maximum: 100 }),
    }),
    run: async (args) => {
      const filter: any = { community_id: args.community_id || "default" };
      if (args.listing_type) filter.listing_type = args.listing_type;
      if (args.status) filter.status = args.status;
      if (args.limit) filter.limit = args.limit;
      const listings = await repos.listingsRepoImpl.search(filter);
      return listings.map((l: any) => `${l.id} [${l.listing_type}] ${l.title} - ${l.quantity} ${l.unit} (${l.status})`).join("\n") || "No listings found";
    },
  },
  {
    name: "gratifieria_listing_show",
    description: "Show listing details",
    inputSchema: schema({ id: str("Listing ID") }, ["id"]),
    run: async (args) => {
      const listing = await repos.listingsRepoImpl.getById(args.id);
      if (!listing) return `Listing ${args.id} not found`;
      return `${listing.id} [${listing.listing_type.toUpperCase()}] ${listing.title}
Resource: ${listing.resource_spec_id} | Qty: ${listing.quantity} ${listing.unit}
Status: ${listing.status} | Community: ${listing.community_id || "none"}
Available: ${listing.available_from || "anytime"} to ${listing.available_until || "indefinite"}
${listing.description ? `Description: ${listing.description}` : ""}`;
    },
  },
  {
    name: "gratifieria_match_propose",
    description: "Propose a match between an offer and a need",
    inputSchema: schema({
      offer_id: str("Offer listing ID"),
      need_id: str("Need listing ID"),
    }, ["offer_id", "need_id"]),
    run: async (args) => {
      const offer = await repos.listingsRepoImpl.getById(args.offer_id);
      const need = await repos.listingsRepoImpl.getById(args.need_id);
      if (!offer || !need) return "Offer or need not found";

      const scoreResult = await matchmaker["scoreMatch"](offer, need);
      const match = await matchmaker["createMatchProposal"]({ 
        score: scoreResult.score, 
        offer, need, 
        match_data: scoreResult.match_data 
      });

      if (match) {
        await repos.matchesRepoImpl.create(match);
        return `Proposed match: ${match.id} (score: ${match.score.toFixed(2)})`;
      }
      return "Could not create match";
    },
  },
  {
    name: "gratifieria_match_accept",
    description: "Accept a proposed match",
    inputSchema: schema({ match_id: str("Match ID") }, ["match_id"]),
    run: async (args, actor) => {
      await repos.matchesRepoImpl.updateStatus(args.match_id, "accepted", actor.name);
      return `Accepted match ${args.match_id}`;
    },
  },
  {
    name: "gratifieria_match_reject",
    description: "Reject a proposed match",
    inputSchema: schema({ match_id: str("Match ID") }, ["match_id"]),
    run: async (args, actor) => {
      await repos.matchesRepoImpl.updateStatus(args.match_id, "rejected", actor.name);
      return `Rejected match ${args.match_id}`;
    },
  },
  {
    name: "gratifieria_match_fulfill",
    description: "Mark a match as fulfilled (awards karma)",
    inputSchema: schema({ match_id: str("Match ID") }, ["match_id"]),
    run: async (args, actor) => {
      await repos.matchesRepoImpl.updateStatus(args.match_id, "fulfilled", actor.name);
      await karmaSystem.rewardFulfillment(actor.name, args.match_id);
      return `Match fulfilled! Karma rewarded to ${actor.name}`;
    },
  },
  {
    name: "gratifieria_match_list",
    description: "List matches",
    inputSchema: schema({
      status: enum_("Filter by status", ["proposed", "accepted", "rejected", "fulfilled", "cancelled"]),
      user: str("Filter by user ID"),
    }),
    run: async (args) => {
      let matches;
      if (args.user) {
        matches = await repos.matchesRepoImpl.getByAgent(args.user);
      } else if (args.status) {
        matches = await repos.matchesRepoImpl.getByStatus(args.status as any);
      } else {
        matches = Array.from((repos.matchesRepoImpl as any).matches.values());
      }
      return matches.map((m: any) => `${m.id} [${m.status}] ${m.offer_id} → ${m.need_id} (score: ${m.score.toFixed(2)})`).join("\n") || "No matches";
    },
  },
  {
    name: "gratifieria_swipe",
    description: "Swipe on a listing (like/pass/super_like)",
    inputSchema: schema({
      listing_id: str("Listing ID"),
      action: enum_("Swipe action", ["like", "pass", "super_like"]),
    }, ["listing_id", "action"]),
    run: async (args, actor) => {
      const swipe = {
        id: `swp_${Date.now()}`,
        user_id: actor.name,
        listing_id: args.listing_id,
        action: args.action,
        created_at: new Date().toISOString(),
      };
      await repos.swipesRepoImpl.create(swipe);
      return `${args.action === "like" ? "Liked" : "Passed"} listing ${args.listing_id}`;
    },
  },
  {
    name: "gratifieria_karma_balance",
    description: "Check karma balance (dual mode: ZNU/USD)",
    inputSchema: schema({ user: str("User ID (defaults to caller)") }),
    run: async (args, actor) => {
      const userId = args.user || actor.name;
      const balance = await karmaSystem.getBalance(userId);
      return `Karma balance: ${formatKarma(balance.primary, karmaSystem["dualConfig"])}`;
    },
  },
  {
    name: "gratifieria_karma_transfer",
    description: "Transfer karma between users (gratitude)",
    inputSchema: schema({
      to_user: str("Recipient user ID"),
      amount: num("Amount in ZNU"),
      note: str("Reason for transfer"),
    }, ["to_user", "amount"]),
    run: async (args, actor) => {
      await karmaSystem.transfer(actor.name, args.to_user, args.amount, args.note || "Gratitude");
      return `Transferred ${args.amount} ZNU to ${args.to_user}`;
    },
  },
  {
    name: "gratifieria_matchmaker_run",
    description: "Run AI matchmaking analysis",
    inputSchema: schema({}),
    run: async () => {
      const proposals = await matchmaker.analyze();
      return `Created ${proposals.length} match proposals:\n` + proposals.map((p: any) => `  ${p.id}: ${p.offer_id} → ${p.need_id} (score: ${p.score.toFixed(2)})`).join("\n");
    },
  },
  {
    name: "gratifieria_weights_show",
    description: "Show current matching weights",
    inputSchema: schema({ community_id: str("Community ID") }),
    run: async (args) => {
      const weights = await repos.transparencyRepoImpl.getActiveWeights(args.community_id || "default");
      return `Weights (${weights.id}):
Category: ${weights.category_weight}
Location: ${weights.location_weight}
Time: ${weights.time_weight}
Quantity: ${weights.quantity_weight}
Min Match Score: ${weights.min_match_score}
Active: ${weights.is_active}`;
    },
  },
  {
    name: "gratifieria_weights_set",
    description: "Update matching weights (community governance)",
    inputSchema: schema({
      community_id: str("Community ID"),
      category: num("Category weight (0-1)"),
      location: num("Location weight (0-1)"),
      time: num("Time weight (0-1)"),
      quantity: num("Quantity weight (0-1)"),
      threshold: num("Min match score (0-1)"),
    }, ["community_id"]),
    run: async (args, actor) => {
      const current = await repos.transparencyRepoImpl.getActiveWeights(args.community_id);
      const updated = {
        ...current,
        category_weight: args.category ?? current.category_weight,
        location_weight: args.location ?? current.location_weight,
        time_weight: args.time ?? current.time_weight,
        quantity_weight: args.quantity ?? current.quantity_weight,
        min_match_score: args.threshold ?? current.min_match_score,
        updated_at: new Date().toISOString(),
      };
      await repos.transparencyRepoImpl.upsertWeights(updated);
      return "Weights updated";
    },
  },
];

function reply(message: Json) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);
}

let actor: Actor = { kind: "agent", name: process.env.GRATIFERIA_ACTOR || "agent" };

readline.createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  let message: { id?: string | number; method?: string; params?: Json };
  try { message = JSON.parse(line); } catch { return reply({ id: null, error: { code: -32700, message: "Parse error" } }); }
  const { id, method, params = {} } = message;
  if (id === undefined || method === undefined) return;
  if (method === "initialize") {
    const client = (params.clientInfo as Json | undefined)?.name;
    if (typeof client === "string" && client && !process.env.GRATIFERIA_ACTOR) actor = { kind: "agent", name: client };
    return reply({ id, result: { protocolVersion: PROTOCOL, capabilities: { tools: {} }, serverInfo: { name: "gratifieria", version: "0.1.0" }, instructions: INSTRUCTIONS } });
  }
  if (method === "ping") return reply({ id, result: {} });
  if (method === "tools/list") return reply({ id, result: { tools: tools.map(({ run: _run, ...tool }) => tool) } });
  if (method === "tools/call") {
    const tool = tools.find((t) => t.name === params.name);
    if (!tool) return reply({ id, error: { code: -32602, message: `Unknown tool: ${String(params.name)}` } });
    try {
      const result = await tool.run(params.arguments as Json, actor);
      return reply({ id, result: { content: [{ type: "text", text: String(result) }] } });
    } catch (error) {
      return reply({ id, result: { isError: true, content: [{ type: "text", text: (error as Error).message }] } });
    }
  }
  return reply({ id, error: { code: -32601, message: `Method not found: ${method}` } });
});

console.error("Gratifieria MCP server running on stdio");