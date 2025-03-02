import type { Plugin } from "@elizaos/core";
import { getOnChainActions } from "./actions.js";
import { getWalletClient, getWalletProvider } from "./wallet.js";
import { messageEvaluator } from "./actions/messageEvaluator.js";
import messageStateProvider from "./providers/messageState.js";

async function createGoatPlugin(
    getSetting: (key: string) => string | undefined
): Promise<Plugin> {
    const walletClient = getWalletClient(getSetting);
    if (!walletClient) {
        throw new Error("Failed to initialize wallet client");
    }
    const actions = await getOnChainActions(walletClient);

    return {
        name: "[GOAT] Onchain Actions",
        description: "Mode integration plugin",
        providers: [getWalletProvider(walletClient), messageStateProvider],
        evaluators: [messageEvaluator],
        services: [],
        actions: actions,
    };
}

export default createGoatPlugin;
