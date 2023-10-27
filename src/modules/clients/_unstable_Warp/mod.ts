import { ArweaveSigner } from "warp-arbundles";
import { Client as WarpClient } from "./src/Client";
import { DeployPlugin } from "warp-contracts-plugin-deploy";

export class Client {
  static create() {
    return WarpClient
      .builder()
      //
      // Deploy the contract
      //
      .deployer((options) => {
        return options
          .warp_instance
          .use(new DeployPlugin()) // `.deploy()` is callable without this https://academy.warp.cc/docs/sdk/advanced/plugins/deployment
          .deploy({
            src: options.contract.source_code,
            initState: options.contract.initial_state,
            wallet: new ArweaveSigner(options.sender.key),
          });
      })
      //
      // Write to the contract
      //
      .writer((options) => {
        const connection = options
          .warp_instance
          .contract(options.contract_id)
          .connect(new ArweaveSigner(options.sender.key));

        return connection
          .writeInteraction(
            options.interaction.input,
            options.writeInteractionOptions,
          );
      })
      //
      // Read the contract
      //
      .reader((options) => {
        const connection = options
          .warp_instance
          .contract(options.contract_id)
          .connect(new ArweaveSigner(options.sender.key));

        return connection
          .readState(
            options.stop_at_block_id,
            options.caller,
            options.interactions,
          );
      })
      //
      // Evolve the contract
      //
      .evolver((options) => {
        return;
      })
      .build();
  }
}
