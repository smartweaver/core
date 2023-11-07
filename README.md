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

## Contributing

### Prerequisites

- Install Node (use the Node version in `nvmrc`)
- Install Deno (use the latest v1.x version)

### Tests

Tests are in the `tests` directory. The `tests` directory has a strict structure and naming convention as follows:

- The `tests` directory structure mimics the `src` directory structure:

    ```text
    ▾  src/
      ▾  standard/
        ▸  handlers/
    ▾  tests/
      ▸  core/
      ▾  standard/
        ▸  handlers/
    ```

- Test file names mimic the file they test, include the type of tests they contain, and end of `.test.ts`:

    ```text
    Format:    <file being tested>.<test type>.test.ts

    src file:  IsolatedHandlerChain.ts
    test file: IsolatedHandlerChain.unit.test.ts
    ```

Here is an example of the conventions mentioned above:

```text
▾  src/
  ▸  core/
  ▾  standard/
    ▾  chains/
         IsolatedHandlerChain.ts
    ▸  handlers/
▾  tests/
  ▸  core/
  ▾  standard/
    ▾  chains/
         IsolatedHandlerChain.unit.test.ts
         IsolatedHandlerChain.integration.test.ts
    ▸  handlers/
```

### Development Tips

1. Use Node version in `nvmrc`.

1. Do not add scripts to `package.json`. Add scripts to `deno.json`. This repo uses `deno task <script>`, not `yarn <script>`.

1. Add tests if you can. If you do, follow the conventions mentioned above in the [Tests](#tests) section.

1. Add a summary to your pull request and how to exercise your work. For example:

    ```text
    ## Summary
    
    - Added this
    - Changed that

    ## How to test

    1. Run this script.

    1. Run the tests.

    1. Import this module and check the typings.

    ... etc.
    ```

1. GitHub actions are in place to check pull requests for lint and formatting. Use `deno lint` and `deno fmt` to help you make fixes/changes.