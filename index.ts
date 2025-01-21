import { RpcProvider } from "starknet";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools";
import { type RpcMethodName, validateRpcMethodParams } from "./schema";
import { version } from "./package.json" assert { type: "json" };

const DEFAULT_RPC_URL = "https://starknet-mainnet.public.blastapi.io/rpc/v0_7";
const starknetRpcUrl = process.env.STARKNET_RPC_URL || DEFAULT_RPC_URL;
const starknet = new RpcProvider({ nodeUrl: starknetRpcUrl });

function extractBlockId(params: any) {
    // block ID, use directly
    if (typeof params === "string") {
        return params;
    }

    if ("block_hash" in params) {
        return params.block_hash;
    }

    if ("block_number" in params) {
        return params.block_number;
    }

    throw new Error("Invalid block ID");
}

type RpcHandler = (params: any, starknet: RpcProvider) => Promise<any>;
const handlers: Record<RpcMethodName, RpcHandler> = {
    "starknet_getBlockWithTxHashes": async (params, starknet) => {
        const blockId = extractBlockId(params);
        return await starknet.getBlockWithTxHashes(blockId);
    },
    "starknet_getBlockWithTxs": async (params, starknet) => {
        const blockId = extractBlockId(params);
        return await starknet.getBlockWithTxs(blockId);
    },
    "starknet_getBlockWithReceipts": async (params, starknet) => {
        const blockId = extractBlockId(params);
        return await starknet.getBlockWithReceipts(blockId);
    },
    "starknet_getStateUpdate": async (params, starknet) => {
        const blockId = extractBlockId(params);
        return await starknet.getStateUpdate(blockId);
    },
    "starknet_getStorageAt": async (params, starknet) => {
        const { contract_address, key, block_id } = params;
        const blockId = extractBlockId(block_id);
        return await starknet.getStorageAt(contract_address, key, blockId);
    },
    "starknet_getTransactionStatus": async (params, starknet) => {
        const { transaction_hash } = params;
        return await starknet.getTransactionStatus(transaction_hash);
    },
    "starknet_getTransactionByHash": async (params, starknet) => {
        const { transaction_hash } = params;
        return await starknet.getTransactionByHash(transaction_hash);
    },
    "starknet_getTransactionByBlockIdAndIndex": async (params, starknet) => {
        const { block_id, index } = params;
        const blockId = extractBlockId(block_id);
        return await starknet.getTransactionByBlockIdAndIndex(blockId, index);
    },
    "starknet_getTransactionReceipt": async (params, starknet) => {
        const { transaction_hash } = params;
        return await starknet.getTransactionReceipt(transaction_hash);
    },
    "starknet_getClass": async (params, starknet) => {
        const { block_id, class_hash } = params;
        const blockId = extractBlockId(block_id);
        return await starknet.getClass(class_hash, blockId);
    },
    "starknet_getClassHashAt": async (params, starknet) => {
        const { block_id, contract_address } = params;
        const blockId = extractBlockId(block_id);
        return await starknet.getClassHashAt(contract_address, blockId);
    },
    "starknet_getClassAt": async (params, starknet) => {
        const { block_id, contract_address } = params;
        const blockId = extractBlockId(block_id);
        return await starknet.getClassAt(contract_address, blockId);
    },
    "starknet_getBlockTransactionCount": async (params, starknet) => {
        const blockId = extractBlockId(params);
        return await starknet.getBlockTransactionCount(blockId);
    },
    "starknet_call": async (params, starknet) => {
        const { request, block_id } = params;
        const call = {
            contractAddress: request.contract_address,
            calldata: request.calldata,
            entrypoint: request.entry_point_selector,
        };
        const blockId = extractBlockId(block_id);
        return await starknet.callContract(call, blockId);
    },
    "starknet_getEvents": async (params, starknet) => {
        const { filter } = params;
        return await starknet.getEvents({
            ...filter,
            from_block: extractBlockId(filter.from_block),
            to_block: extractBlockId(filter.to_block),
        });
    },
    "starknet_getNonce": async (params, starknet) => {
        const { block_id, contract_address } = params;
        const blockId = extractBlockId(block_id);
        return await starknet.getNonceForAddress(contract_address, blockId);
    },
    "starknet_blockNumber": async (_params, starknet) => {
        return await starknet.getBlockNumber();
    },
    "starknet_blockHashAndNumber": async (_params, starknet) => {
        return await starknet.getBlockLatestAccepted();
    },
    "starknet_chainId": async (_params, starknet) => {
        return await starknet.getChainId();
    },
    "starknet_syncing": async (_params, starknet) => {
        return await starknet.getSyncingStats();
    },
    "starknet_specVersion": async (_params, starknet) => {
        return await starknet.getSpecVersion();
    },
};

async function handleRpcRequest(
    name: string,
    args: unknown,
    starknet: RpcProvider,
) {
    // Validate method name
    if (!handlers[name as RpcMethodName]) {
        const estr = `Unknown method: ${name}`;
        console.error(estr);
        throw new Error(estr);
    }
    const params = validateRpcMethodParams(name as RpcMethodName, args);
    const handler = handlers[name as RpcMethodName];
    return await handler(params, starknet);
}

const server = new Server(
    {
        name: "starknet-mcp",
        version: version || "0.0.1",
    },
    {
        capabilities: {
            tools: {},
        },
    },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    let { name, arguments: args } = request.params;

    console.error("\nRequest", request);
    try {
        const responseData = await handleRpcRequest(name, args, starknet);
        console.error("Response", responseData);

        return {
            content: [{
                type: "text",
                text: JSON.stringify(responseData),
            }],
        };
    } catch (error) {
        // TODO: error handling can probably be improved
        //       https://spec.modelcontextprotocol.io/specification/2024-11-05/server/tools/#error-handling
        const errorMessage = error instanceof Error
            ? error.message
            : String(error);
        console.error(`Error handling ${name} request: ${errorMessage}`);

        return {
            content: [{
                type: "text",
                text: errorMessage,
            }],
            isError: true,
        };
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`Starknet MCP: Server v${version} running on stdio`);
}

main().catch((error) => {
    console.error("Starknet MCP: Fatal error:", error);
    process.exit(1);
});
