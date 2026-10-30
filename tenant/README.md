# Tenant overlay

This directory is reserved for provider-owned, non-secret customization that must survive platform upgrades. Platform releases must not modify this directory.

Prefer CMS, PMS, Convex data, and environment configuration over source-code overrides. Secrets never belong here.
