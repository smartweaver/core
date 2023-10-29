# SmartWeaver

Steezy SmartWeave tools and workflows

## Explore

### Clients

These modules enable you to connect to the Arweave network to process smart contracts (e.g., deploy, interact, read, etc.).

- https://github.com/crookse/smart-weaver-client-arweave
- https://github.com/crookse/smart-weaver-client-warp

### Contracts

These modules enable you to write smart contracts. Use them to write a contract and deploy them using one of the [Clients](#clients) above.

- https://github.com/crookse/smart-weaver-contract-slick-contract

## Codebases

The SmartWeaver ecosystem is made up of the following codebases:

- Core (included in this repository)
- Standard (included in this repository)
- Modules (not included in this repository)

These codebases are explained in further detail below.

### Core

This part of the codebase provides types, interfaces, and classes (with minimal
implementation). It contains the lowest level APIs and is intended to help build
the Standard and Modules codebases.

To separate concerns, Core does not import code from Standard or Modules.

### Standard

This part of the codebase is similar to Deno's Standard Library and Go's
Standard Library, but smaller. Standard code is intended to be used as
standalone code and code to help build modules in the Modules codebase (e.g.,
smart-weaver-client-arweave).

To separate concerns, Standard code only imports from Standard and Core. It does
not import from Modules.

### Modules

This part of the codebase is:

- separated from this repository;
- is a combination of multiple repositories (prefixed with `smart-weaver-`); and
- contains third-party code.

Modules import the most functionality for things like processing contract
interactions, deploying contracts, bundling transactions, etc. Modules import
from:

- Core
- Standard
- Third-party code (e.g., `smartweave` and `warp-contracts`)
