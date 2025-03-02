import { type IAgentRuntime, type Memory, type State } from "@elizaos/core";
import { isDataComplete, MessageState } from "../providers/messageState";

export const messageEvaluator = {
    name: "GET_MESSAGE_DATA",
    description: "Get message data from the database",
    similes: [],
    validate: async (runtime: IAgentRuntime, message: Memory, state: State | undefined) => {
        try {
            const cacheKey = "testMessageState";
            // const message = await runtime.getProvider(cacheKey);
            const cacheData = await runtime.cacheManager.get<MessageState>(cacheKey);
            return !isDataComplete(cacheData);
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    handler: async (runtime: IAgentRuntime, message: Memory, state: State | undefined) => {
        // console.log("messageEvaluator", message);
        const cacheKey = "testMessageState";
        const cacheData = await runtime.cacheManager.get<MessageState>(cacheKey);
        if (isDataComplete(cacheData)) {
            console.log(`Message data is complete: ${JSON.stringify(cacheData)}`);
        } else {
            console.log(`Message data is incomplete: ${JSON.stringify(cacheData)}`);
        }
    },
    examples: [],
};