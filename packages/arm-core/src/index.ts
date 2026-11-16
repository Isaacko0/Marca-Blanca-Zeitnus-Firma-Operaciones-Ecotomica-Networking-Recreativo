// ARM Core - Main entry point
// Pure TypeScript domain logic for Agent Relationship Management
// Zero dependencies. Consumable by CLI, MCP, API, UI, and non-Node runtimes.

// Types - Single source of truth for all domain types
export * from "./types.js";

// Core vocabulary - stages, sources, priorities, labels, utilities
export * from "./core/model.js";

// The one write path - operations, proposals, review, activity
export * from "./core/ops.js";

// Structural and referential validation
export * from "./core/validate.js";

// Claims as source of truth; legacy needs/risks derived
export * from "./core/claims.js";

// Account memory: grounding, committee, gaps, since, commitments, questions, lint, table
export * from "./core/memory.js";

// Daily brief: ranked attention items
export * from "./core/brief.js";

// Cross-account pattern detection and signals bundle
export * from "./core/patterns.js";

// Generated Markdown views with record IDs
export * from "./core/markdown.js";

// Jev: line-by-line investigation of pasted notes/transcripts
export * from "./core/investigation.js";

// Call providers (Granola/TypeSafe) and batch import
export * from "./core/calls.js";

// Synthetic workspace generator with injected clock
export * from "./core/demo.js";

// Amphibious monetary layer: dual-mode calculations (postmonetario/conectado)
export * from "./lib/valueDual.js";