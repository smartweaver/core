# Publishing

_Note: This process is manual since publishing keys do not exist yet._

## Assumptions

This package assumes you can run commands like `cd`.

## Steps

### Dry Run

1. Build the entire package to push to the registries.

    ```
    deno task build:libs
    ```

1. Go into the `dist` directory.

    ```
    cd dist
    ```

1. Do a dry run and verify the Tarball Contents that will be published to the registries.

    ```
    npm publish --dry-run
    ```

### Actual

1. Go through the dry run process.

1. After completing the dry run process, update the version in `package.json` (the repo one, not that `dist/package.json` one).

1. Build the entire package to push to the registries.

    ```
    deno task build:libs
    ```

1. Go into the `dist` directory.

    ```
    cd dist
    ```

1. Do the actual publish.

    ```
    npm publish
    ```
