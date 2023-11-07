# SmartWeaver

A collection of code intended to help you build your steezy SmartWeave tooling and workflows

## Explore

View SmartWeaver projects at https://github.com/smartweaver.

## Codebases

The SmartWeaver ecosystem is made up of the following codebases:

- Core (included in this module)
- Standard (included in this module)
- Modules (found at https://github.com/smartweaver)

These codebases are explained in further detail below.

### Core

This part of the codebase provides types, interfaces, and classes (with minimal implementation). It contains the lowest level APIs and is intended to help build the Standard and Modules codebases.

To separate concerns, Core does not import code from Standard or Modules.

### Standard

This part of the codebase is similar to Deno's Standard Library and Go's Standard Library, but smaller. Standard code is intended to be used as standalone code and code to help build modules in the Modules codebase (e.g., Slick Contract).

To separate concerns, Standard code only imports from Standard and Core. It does not import from Modules.

### Modules

This part of the codebase is:

- not included in this module;
- is a combination of multiple repositories (found at https://github.com/smartweaver); and
- can contain third-party code.

Modules import the most functionality for things like processing contract interactions, deploying contracts, bundling transactions, etc. Modules import from:

- Core
- Standard
- Third-party code (e.g., `smartweave`, `arweave`)
