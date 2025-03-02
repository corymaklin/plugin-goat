import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

// originChain: z.string().describe("From chain name (e.g. base, arbitrum)"),
// destinationChain: z.string().describe("To chain name (e.g. base, arbitrum)"),
// destinationAddress: z.string().describe("Recipient address"),
// message: z.string().describe("Message content"),

export interface MessageState {
    originChain: string;
    destinationChain: string;
    destinationAddress: string;
    message: string;
}

export interface emptyMessageState {
    originChain: string;
    destinationChain: string;
    destinationAddress: string;
    message: string;
}

const FIELD_GUIDANCE = {
    originChain: {
        description: "From chain name (e.g. base, arbitrum)",
        valid: "base, arbitrum",
        instructions: "Please provide the origin chain name",
    },
    // destinationChain: "To chain name (e.g. base, arbitrum)",
    // destinationAddress: "Recipient address",
    // message: "Message content",
}

export const isDataComplete = (data: MessageState) => {
    return Object.keys(data).every(key => data[key] !== "");
}

const messageStateProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const cacheKey = "testMessageState";
        const cachedData = await runtime.cacheManager.get<MessageState>(cacheKey) || {};
        
        const knownFields = Object.keys(cachedData).map(key => `${key}: ${cachedData[key]}`);

        const missingFields = Object.keys(FIELD_GUIDANCE).filter(key => !knownFields.includes(key));

        const missingFieldsPrompt = missingFields.map(key => FIELD_GUIDANCE[key].instructions).join("\n");

        let response = "";

        const prompt = `
        
        `
        if (missingFields.length > 0) {
            response += "Missing Information and Extraction Guidelines:\n\n";

                missingFields.forEach(field => {
                    const guidance = FIELD_GUIDANCE[field];
                    response += `${field}: ${guidance.description}\n`;
                    response += `Valid values: ${guidance.valid}\n`;
                    response += `Instructions: ${guidance.instructions}\n\n`;
                });
                response += "Try to extract all the missing information through natural conversation.\n";
                response += "Only extract information when clearly and directly stated by the user\n";
                response += "Verify information is current, not past or future\n";
        } else {
            response += "All necessary information has been collected.\n";
            response += "Continue natural conversation without information gathering.";
        }

        return response;
    },
};

export default messageStateProvider;