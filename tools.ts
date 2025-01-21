import * as schema from "./schema";

const toJsonSchema = schema.toJsonSchema;

export const tools = [
  {
    name: "starknet_specVersion",
    description:
      "Returns the version of the Starknet JSON-RPC specification being used",
    inputSchema: toJsonSchema(schema.SpecVersionRequestSchema),
  },
  {
    name: "starknet_getBlockWithTxHashes",
    description:
      "Get block information with transaction hashes given the block id",
    inputSchema: toJsonSchema(schema.GetBlockWithTxHashesRequestSchema),
  },
  {
    name: "starknet_getBlockWithTxs",
    description:
      "Get block information with full transactions given the block id",
    inputSchema: toJsonSchema(schema.GetBlockWithTxsRequestSchema),
  },
  {
    name: "starknet_getBlockWithReceipts",
    description:
      "Get block information with full transactions and receipts given the block id",
    inputSchema: toJsonSchema(schema.GetBlockWithReceiptsRequestSchema),
  },
  {
    name: "starknet_getStateUpdate",
    description:
      "Get the information about the result of executing the requested block",
    inputSchema: toJsonSchema(schema.GetStateUpdateRequestSchema),
  },
  {
    name: "starknet_getStorageAt",
    description: "Get the value of the storage at the given address and key",
    inputSchema: toJsonSchema(schema.GetStorageAtRequestSchema),
  },
  {
    name: "starknet_getTransactionStatus",
    description:
      "Gets the transaction status (possibly reflecting that the tx is still in the mempool, or dropped from it)",
    inputSchema: toJsonSchema(schema.GetTransactionStatusRequestSchema),
  },
  {
    name: "starknet_getTransactionByHash",
    description: "Get the details and status of a submitted transaction",
    inputSchema: toJsonSchema(schema.GetTransactionByHashRequestSchema),
  },
  {
    name: "starknet_getTransactionByBlockIdAndIndex",
    description:
      "Get the details of a transaction by a given block id and index",
    inputSchema: toJsonSchema(
      schema.GetTransactionByBlockIdAndIndexRequestSchema,
    ),
  },
  {
    name: "starknet_getTransactionReceipt",
    description: "Get the transaction receipt by the transaction hash",
    inputSchema: toJsonSchema(schema.GetTransactionReceiptRequestSchema),
  },
  {
    name: "starknet_getClass",
    description:
      "Get the contract class definition in the given block associated with the given hash",
    inputSchema: toJsonSchema(schema.GetClassRequestSchema),
  },
  {
    name: "starknet_getClassHashAt",
    description:
      "Get the contract class hash in the given block for the contract deployed at the given address",
    inputSchema: toJsonSchema(schema.GetClassHashAtRequestSchema),
  },
  {
    name: "starknet_getClassAt",
    description:
      "Get the contract class definition in the given block at the given address",
    inputSchema: toJsonSchema(schema.GetClassAtRequestSchema),
  },
  {
    name: "starknet_getBlockTransactionCount",
    description: "Get the number of transactions in a block given a block id",
    inputSchema: toJsonSchema(schema.GetBlockTransactionCountRequestSchema),
  },
  {
    name: "starknet_call",
    description:
      "call a starknet function without creating a StarkNet transaction",
    inputSchema: toJsonSchema(schema.CallRequestSchema),
  },
  {
    name: "starknet_blockNumber",
    description: "Get the most recent accepted block number",
    inputSchema: toJsonSchema(schema.BlockNumberRequestSchema),
  },
  {
    name: "starknet_blockHashAndNumber",
    description: "Get the most recent accepted block hash and number",
    inputSchema: toJsonSchema(schema.BlockHashAndNumberRequestSchema),
  },
  {
    name: "starknet_chainId",
    description: "Return the currently configured StarkNet chain id",
    inputSchema: toJsonSchema(schema.ChainIdRequestSchema),
  },
  {
    name: "starknet_syncing",
    description:
      "Returns an object about the sync status, or false if the node is not synching",
    inputSchema: toJsonSchema(schema.SyncingRequestSchema),
  },
  {
    name: "starknet_getEvents",
    description: "Returns all events matching the given filter",
    inputSchema: toJsonSchema(schema.GetEventsRequestSchema),
  },
  {
    name: "starknet_getNonce",
    description:
      "Get the nonce associated with the given address in the given block",
    inputSchema: toJsonSchema(schema.GetNonceRequestSchema),
  },
];
