#!/usr/bin/env node
/**
 * Gratifieria CLI - Gift economy matchmaking commands
 * 
 * Usage:
 *   gratiferia listing create --type offer --title "Tomates" --quantity 5 --unit kg
 *   gratiferia listing list --type need --community my-gratiferia
 *   gratiferia match propose --offer lst_123 --need lst_456
 *   gratiferia match accept mtch_789
 *   gratiferia swipe --session
 *   gratiferia karma balance
 *   gratiferia matchmaker run
 */

import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createInMemoryRepositories } from "@hscsg/arm-gratiferia/core/repository.js";
import { createMatchmaker } from "@hscsg/arm-gratiferia/agents/matchmaker.js";
import { createKarmaSystem } from "@hscsg/arm-gratiferia/core/karma.js";
import { createGratiferiaDualConfig, formatKarma } from "@hscsg/arm-gratiferia/core/valueDual.js";
import type { Listing, Match, MatchWeights, ListingType, MatchStatus } from "@hscsg/arm-gratiferia/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize repositories
const repos = createInMemoryRepositories();
const matchmaker = createMatchmaker({
  listingRepo: repos.listingsRepoImpl,
  matchRepo: repos.matchesRepoImpl,
  transparencyRepo: repos.transparencyRepoImpl,
  karmaSystem: undefined, // Will be set after karma init
});
const karmaSystem = createKarmaSystem(repos.karmaRepoImpl);
matchmaker["karmaSystem"] = karmaSystem; // Hack for now

// CLI Commands
async function main() {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      help: { type: "boolean", short: "h" },
      json: { type: "boolean" },
      community: { type: "string", short: "c" },
      user: { type: "string", short: "u" },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    printHelp();
    return;
  }

  const [command, subcommand] = positionals;

  try {
    switch (command) {
      case "listing":
        await handleListing(subcommand, positionals.slice(2), values);
        break;
      case "match":
        await handleMatch(subcommand, positionals.slice(2), values);
        break;
      case "swipe":
        await handleSwipe(subcommand, positionals.slice(2), values);
        break;
      case "karma":
        await handleKarma(subcommand, positionals.slice(2), values);
        break;
      case "matchmaker":
        await handleMatchmaker(subcommand, positionals.slice(2), values);
        break;
      case "gratiferia":
        await handleGratiferia(subcommand, positionals.slice(2), values);
        break;
      case "weights":
        await handleWeights(subcommand, positionals.slice(2), values);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        printHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Listing commands
async function handleListing(subcommand: string, args: string[], flags: any) {
  const communityId = flags.community || "default";
  const userId = flags.user || "anonymous";

  switch (subcommand) {
    case "create": {
      const { values: opts } = parseArgs({
        args,
        options: {
          type: { type: "string" },
          title: { type: "string" },
          quantity: { type: "string" },
          unit: { type: "string" },
          resource: { type: "string" },
          description: { type: "string" },
          location: { type: "string" },
          available_from: { type: "string" },
          available_until: { type: "string" },
          anonymous: { type: "boolean" },
        },
      });

      if (!opts.type || !opts.title || !opts.quantity || !opts.unit || !opts.resource) {
        console.error("Required: --type offer|need --title <title> --quantity <num> --unit <unit> --resource <resource_spec_id>");
        process.exit(1);
      }

      const listing: Listing = {
        id: `lst_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        listing_type: opts.type as ListingType,
        resource_spec_id: opts.resource,
        agent_id: userId === "anonymous" ? undefined : userId,
        anonymous: opts.anonymous ?? false,
        location_id: opts.location,
        quantity: parseFloat(opts.quantity),
        unit: opts.unit as any,
        available_from: opts.available_from,
        available_until: opts.available_until,
        title: opts.title,
        description: opts.description,
        status: "active",
        community_id: communityId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await repos.listingsRepoImpl.create(listing);
      console.log(flags.json ? JSON.stringify(listing, null, 2) : `Created ${listing.listing_type}: ${listing.id} - ${listing.title}`);
      break;
    }

    case "list": {
      const { values: opts } = parseArgs({
        args,
        options: {
          type: { type: "string" },
          status: { type: "string" },
          limit: { type: "string" },
        },
      });

      const filter: any = { community_id: communityId };
      if (opts.type) filter.listing_type = opts.type;
      if (opts.status) filter.status = opts.status;
      if (opts.limit) filter.limit = parseInt(opts.limit);

      const listings = await repos.listingsRepoImpl.search(filter);
      console.log(flags.json 
        ? JSON.stringify(listings, null, 2)
        : listings.map(l => `${l.id} [${l.listing_type}] ${l.title} - ${l.quantity} ${l.unit} (${l.status})`).join("\n")
      );
      break;
    }

    case "show": {
      if (!args[0]) { console.error("Usage: gratiferia listing show <id>"); process.exit(1); }
      const listing = await repos.listingsRepoImpl.getById(args[0]);
      if (!listing) { console.error("Listing not found"); process.exit(1); }
      console.log(flags.json ? JSON.stringify(listing, null, 2) : formatListing(listing));
      break;
    }

    case "update-status": {
      if (!args[0] || !args[1]) { console.error("Usage: gratiferia listing update-status <id> <status>"); process.exit(1); }
      await repos.listingsRepoImpl.updateStatus(args[0], args[1] as any);
      console.log(`Updated ${args[0]} status to ${args[1]}`);
      break;
    }

    default:
      console.error(`Unknown listing command: ${subcommand}`);
      break;
  }
}

// Match commands
async function handleMatch(subcommand: string, args: string[], flags: any) {
  switch (subcommand) {
    case "propose": {
      const { values: opts } = parseArgs({
        args,
        options: {
          offer: { type: "string" },
          need: { type: "string" },
          score: { type: "string" },
        },
      });

      if (!opts.offer || !opts.need) {
        console.error("Required: --offer <offer_id> --need <need_id>");
        process.exit(1);
      }

      const offer = await repos.listingsRepoImpl.getById(opts.offer);
      const need = await repos.listingsRepoImpl.getById(opts.need);
      if (!offer || !need) { console.error("Offer or need not found"); process.exit(1); }

      // Quick score
      const scoreResult = await matchmaker["scoreMatch"](offer, need);
      const match = await matchmaker["createMatchProposal"]({ 
        score: parseFloat(opts.score || scoreResult.score.toFixed(2)), 
        offer, need, 
        match_data: scoreResult.match_data 
      });

      if (match) {
        await repos.matchesRepoImpl.create(match);
        console.log(flags.json ? JSON.stringify(match, null, 2) : `Proposed match: ${match.id} (score: ${match.score.toFixed(2)})`);
      }
      break;
    }

    case "accept": {
      if (!args[0]) { console.error("Usage: gratiferia match accept <match_id>"); process.exit(1); }
      await repos.matchesRepoImpl.updateStatus(args[0], "accepted", flags.user);
      console.log(`Accepted match ${args[0]}`);
      break;
    }

    case "reject": {
      if (!args[0]) { console.error("Usage: gratiferia match reject <match_id>"); process.exit(1); }
      await repos.matchesRepoImpl.updateStatus(args[0], "rejected", flags.user);
      console.log(`Rejected match ${args[0]}`);
      break;
    }

    case "fulfill": {
      if (!args[0]) { console.error("Usage: gratiferia match fulfill <match_id>"); process.exit(1); }
      await repos.matchesRepoImpl.updateStatus(args[0], "fulfilled", flags.user);
      
      // Award karma
      const match = await repos.matchesRepoImpl.getById(args[0]);
      if (match && flags.user) {
        await karmaSystem.rewardFulfillment(flags.user, args[0]);
        console.log(`Match fulfilled! Karma rewarded.`);
      }
      break;
    }

    case "list": {
      const { values: opts } = parseArgs({
        args,
        options: {
          status: { type: "string" },
          user: { type: "string" },
        },
      });

      let matches: Match[];
      if (opts.user) {
        matches = await repos.matchesRepoImpl.getByAgent(opts.user);
      } else if (opts.status) {
        matches = await repos.matchesRepoImpl.getByStatus(opts.status as MatchStatus);
      } else {
        matches = Array.from((repos.matchesRepoImpl as any).matches.values());
      }

      console.log(flags.json 
        ? JSON.stringify(matches, null, 2)
        : matches.map(m => `${m.id} [${m.status}] ${m.offer_id} → ${m.need_id} (score: ${m.score.toFixed(2)})`).join("\n")
      );
      break;
    }

    case "show": {
      if (!args[0]) { console.error("Usage: gratiferia match show <id>"); process.exit(1); }
      const match = await repos.matchesRepoImpl.getById(args[0]);
      if (!match) { console.error("Match not found"); process.exit(1); }
      console.log(flags.json ? JSON.stringify(match, null, 2) : formatMatch(match));
      break;
    }

    default:
      console.error(`Unknown match command: ${subcommand}`);
      break;
  }
}

// Swipe commands (Tinder-like)
async function handleSwipe(subcommand: string, args: string[], flags: any) {
  const userId = flags.user || "anonymous";

  switch (subcommand) {
    case "session": {
      const { values: opts } = parseArgs({
        args,
        options: {
          type: { type: "string" },
          community: { type: "string" },
        },
      });

      const filter: any = { community_id: opts.community || flags.community || "default" };
      if (opts.type) filter.listing_type = opts.type;

      const listings = await repos.listingsRepoImpl.search(filter);
      if (listings.length === 0) {
        console.log("No listings found for swipe session");
        return;
      }

      console.log(`Swipe session started - ${listings.length} listings`);
      console.log("Commands: like, pass, super_like, quit");
      
      // In real CLI, this would be interactive
      // For now, just show the listings
      listings.forEach((l, i) => {
        console.log(`${i + 1}. [${l.listing_type}] ${l.title} - ${l.quantity} ${l.unit} (${l.status})`);
      });
      break;
    }

    case "like": {
      if (!args[0]) { console.error("Usage: gratiferia swipe like <listing_id>"); process.exit(1); }
      // Record swipe
      const swipe = {
        id: `swp_${Date.now()}`,
        user_id: userId,
        listing_id: args[0],
        action: "like" as const,
        created_at: new Date().toISOString(),
      };
      await repos.swipesRepoImpl.create(swipe);
      console.log("Liked!");
      break;
    }

    case "pass": {
      if (!args[0]) { console.error("Usage: gratiferia swipe pass <listing_id>"); process.exit(1); }
      const swipe = {
        id: `swp_${Date.now()}`,
        user_id: userId,
        listing_id: args[0],
        action: "pass" as const,
        created_at: new Date().toISOString(),
      };
      await repos.swipesRepoImpl.create(swipe);
      console.log("Passed.");
      break;
    }

    default:
      console.error(`Unknown swipe command: ${subcommand}`);
      break;
  }
}

// Karma commands
async function handleKarma(subcommand: string, args: string[], flags: any) {
  const userId = flags.user || args[0] || "anonymous";

  switch (subcommand) {
    case "balance": {
      const balance = await karmaSystem.getBalance(userId);
      console.log(flags.json ? JSON.stringify(balance, null, 2) : `Karma balance: ${formatKarma(balance.primary, karmaSystem["dualConfig"])}`);
      break;
    }

    case "transfer": {
      if (!args[0] || !args[1]) { console.error("Usage: gratiferia karma transfer <from> <to> <amount> [note]"); process.exit(1); }
      const amount = parseFloat(args[2]);
      const note = args[3] || "Gratitude";
      await karmaSystem.transfer(args[0], args[1], amount, note);
      console.log(`Transferred ${amount} ZNU from ${args[0]} to ${args[1]}`);
      break;
    }

    case "history": {
      const txs = await karmaSystem.getTransactions(userId, 20);
      console.log(flags.json ? JSON.stringify(txs, null, 2) : txs.map(t => `${t.created_at} ${t.type} ${t.amount_znu} ZNU (${t.from_user} → ${t.to_user})`).join("\n"));
      break;
    }

    default:
      console.error(`Unknown karma command: ${subcommand}`);
      break;
  }
}

// Matchmaker commands
async function handleMatchmaker(subcommand: string, args: string[], flags: any) {
  switch (subcommand) {
    case "run": {
      console.log("Running matchmaker analysis...");
      const proposals = await matchmaker.analyze();
      console.log(`Created ${proposals.length} match proposals`);
      proposals.forEach(p => console.log(`  ${p.id}: ${p.offer_id} → ${p.need_id} (score: ${p.score.toFixed(2)})`));
      break;
    }

    case "weights": {
      const weights = matchmaker.getWeights();
      console.log(flags.json ? JSON.stringify(weights, null, 2) : formatWeights(weights));
      break;
    }

    default:
      console.error(`Unknown matchmaker command: ${subcommand}`);
      break;
  }
}

// Gratiferia community commands
async function handleGratiferia(subcommand: string, args: string[], flags: any) {
  switch (subcommand) {
    case "create": {
      const { values: opts } = parseArgs({
        args,
        options: {
          name: { type: "string" },
          description: { type: "string" },
        },
      });

      if (!opts.name) { console.error("Required: --name <name>"); process.exit(1); }

      const gratiferia = {
        id: `grtf_${Date.now()}`,
        name: opts.name,
        description: opts.description,
        admin_ids: [flags.user || "anonymous"],
        sharing_preference: "my_community" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await repos.gratiferiaRepoImpl.create(gratiferia);
      console.log(flags.json ? JSON.stringify(gratiferia, null, 2) : `Created gratiferia: ${gratiferia.id} - ${gratiferia.name}`);
      break;
    }

    case "list": {
      const gratiferias = await repos.gratiferiaRepoImpl.getAll();
      console.log(flags.json ? JSON.stringify(gratiferias, null, 2) : gratiferias.map(g => `${g.id} - ${g.name}`).join("\n"));
      break;
    }

    default:
      console.error(`Unknown gratiferia command: ${subcommand}`);
      break;
  }
}

// Weights commands
async function handleWeights(subcommand: string, args: string[], flags: any) {
  const communityId = flags.community || "default";

  switch (subcommand) {
    case "show": {
      const weights = await repos.transparencyRepoImpl.getActiveWeights(communityId);
      console.log(flags.json ? JSON.stringify(weights, null, 2) : formatWeights(weights));
      break;
    }

    case "set": {
      const { values: opts } = parseArgs({
        args,
        options: {
          category: { type: "string" },
          location: { type: "string" },
          time: { type: "string" },
          quantity: { type: "string" },
          threshold: { type: "string" },
        },
      });

      const current = await repos.transparencyRepoImpl.getActiveWeights(communityId);
      const updated = {
        ...current,
        category_weight: opts.category ? parseFloat(opts.category) : current.category_weight,
        location_weight: opts.location ? parseFloat(opts.location) : current.location_weight,
        time_weight: opts.time ? parseFloat(opts.time) : current.time_weight,
        quantity_weight: opts.quantity ? parseFloat(opts.quantity) : current.quantity_weight,
        min_match_score: opts.threshold ? parseFloat(opts.threshold) : current.min_match_score,
        updated_at: new Date().toISOString(),
      };

      await repos.transparencyRepoImpl.upsertWeights(updated);
      console.log("Weights updated");
      break;
    }

    default:
      console.error(`Unknown weights command: ${subcommand}`);
      break;
  }
}

// Helpers
function formatListing(l: Listing): string {
  return `${l.id} [${l.listing_type.toUpperCase()}] ${l.title}
  Resource: ${l.resource_spec_id} | Qty: ${l.quantity} ${l.unit}
  Status: ${l.status} | Community: ${l.community_id || "none"}
  Available: ${l.available_from || "anytime"} to ${l.available_until || "indefinite"}
  ${l.description ? `Description: ${l.description}` : ""}`;
}

function formatMatch(m: Match): string {
  return `${m.id} [${m.status.toUpperCase()}] Score: ${m.score.toFixed(2)}
  Offer: ${m.offer_id} → Need: ${m.need_id}
  Suggested: ${m.suggested_quantity} ${m.suggested_unit}
  Handoff: ${m.suggested_handoff_time || "coordinate"} @ ${m.suggested_handoff_location || "coordinate"}
  Match Data: ${JSON.stringify(m.match_data, null, 2)}`;
}

function formatWeights(w?: MatchWeights): string {
  if (!w) return "No weights loaded";
  return `Weights (${w.id}):
  Category: ${w.category_weight}
  Location: ${w.location_weight}
  Time: ${w.time_weight}
  Quantity: ${w.quantity_weight}
  Min Match Score: ${w.min_match_score}
  Active: ${w.is_active}`;
}

function printHelp() {
  console.log(`
Gratifieria CLI - Gift Economy Matchmaking

Usage: gratiferia <command> [subcommand] [options]

Commands:
  listing       Manage listings (offers/needs)
    create      Create a new listing
    list        List listings
    show        Show listing details
    update-status  Update listing status

  match         Manage matches
    propose     Propose a match between offer and need
    accept      Accept a match
    reject      Reject a match
    fulfill     Mark match as fulfilled
    list        List matches
    show        Show match details

  swipe         Tinder-like swipe interface
    session     Start a swipe session
    like        Like a listing
    pass        Pass on a listing

  karma         Karma/reputation system
    balance     Check karma balance
    transfer    Transfer karma between users
    history     View transaction history

  matchmaker    AI matchmaker
    run         Run matchmaking analysis
    weights     Show current weights

  gratiferia    Community management
    create      Create a new gratiferia community
    list        List communities

  weights       Matching weights configuration
    show        Show current weights
    set         Update weights

Options:
  -c, --community <id>   Community/gratiferia ID
  -u, --user <id>        User ID
  --json                 Output as JSON
  -h, --help             Show help
`);
}

// Type imports for CLI
import type { Listing, Match, MatchWeights, ListingType, MatchStatus } from "@hscsg/arm-gratiferia/types.js";

main();