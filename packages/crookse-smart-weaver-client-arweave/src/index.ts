import { DeployChain, DeployChainCreateOptions } from "./chains/DeployChain.js";
import { WriterChain, WriterChainCreateOptions } from "./chains/WriterChain.js";
import { ReaderChain, ReaderChainCreateOptions } from "./chains/ReaderChain.js";
import { ViewerChain, ViewerChainCreateOptions } from "./chains/ViewerChain.js";
import { ChainWithUseMethod } from "./chains/ChainWithUseMethod.js";

export class Client {
  static builder() {
    return new ChainWithUseMethod();
  }

  /**
   * Relay method for {@linkcode DeployChain.create}.
   *
   * @see {@linkcode DeployChain.create} for more information.
   */
  static deployer(options: DeployChainCreateOptions) {
    return DeployChain.create(options);
  }

  /**
   * Relay method for {@linkcode ReaderChain.create}.
   *
   * @see {@linkcode ReaderChain.create} for more information.
   */
  static reader(options: ReaderChainCreateOptions) {
    return ReaderChain.create(options);
  }

  /**
   * Relay method for {@linkcode ViewerChain.create}.
   *
   * @see {@linkcode ViewerChain.create} for more information.
   */
  static viewer(options: ViewerChainCreateOptions) {
    return ViewerChain.create(options);
  }

  /**
   * Relay method for {@linkcode WriterChain.create}.
   *
   * @see {@linkcode WriterChain.create} for more information.
   */
  static writer(options: WriterChainCreateOptions) {
    return WriterChain.create(options);
  }
}
