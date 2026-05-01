---
title: Overview
description: ghostcall is a zero-deployment batching program for CREATE-style eth_call requests.
---

`ghostcall` batches contract reads without relying on a deployed Multicall contract.

Instead of calling a contract that already exists onchain, the client sends the bundled ghostcall initcode plus an appended binary payload through an `eth_call` request with no `to` field. The EVM executes the bytes as CREATE initcode, runs each requested subcall, packs the result entries, and returns those bytes to the RPC caller. Because the transport is `eth_call`, no contract is persisted.

## What ghostcall provides

- A compact Yul initcode program in `src/Ghostcall.yul`.
- A TypeScript SDK that encodes call batches, sends CREATE-style `eth_call` requests, and decodes packed results.
- Real execution tests against an ephemeral Anvil chain.
- Explicit size and wire-format limits instead of hidden ABI or provider abstractions.

## When it fits

Use ghostcall when you want a small provider-agnostic batching primitive for read-only contract calls, especially when you do not want to depend on a specific deployed multicall address.

The SDK stays deliberately narrow. It accepts raw `0x` hex call data, returns raw `0x` hex result data, and leaves ABI encoding or decoding to your application.

## Current scope

- Zero-value `CALL` for each subcall.
- Compact binary input and output formats.
- Per-call success flags and return data.
- SDK-side strict failure policy with per-call `allowFailure`.
- CREATE-style request and response size constraints.

The implementation intentionally keeps higher-level provider, ABI, retry, and transport policy out of the protocol.
