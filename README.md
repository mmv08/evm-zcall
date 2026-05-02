# ghostcall

`ghostcall` is a zero-deployment batching SDK for CREATE-style `eth_call` requests.

## Documentation

The docs live at [ghostcall.volga.sh](https://ghostcall.volga.sh).

Start there for installation, examples, the API reference, protocol details, and endpoint limit notes.

## Install

```sh
npm install @volga-sh/evm-ghostcall
```

## Quick Start

```ts
import { aggregateDecodedCalls } from "@volga-sh/evm-ghostcall";

const [totalSupplyReturnData] = await aggregateDecodedCalls(provider, [
	{
		to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		data: "0x18160ddd",
		decodeResult: (returnData) => returnData,
	},
]);
```

See the [Getting Started guide](https://ghostcall.volga.sh/getting-started/) for a complete viem example with ABI encoding and decoding.

## API

- `aggregateDecodedCalls()` sends a strict batch and returns decoded values.
- `aggregateCalls()` sends a batch and returns raw `{ success, returnData }` entries.
- `encodeCalls()` builds the CREATE-style `eth_call` data payload.
- `decodeResults()` parses the packed ghostcall response.

Full reference: [API docs](https://ghostcall.volga.sh/api/).

## Development

```sh
npm install
npm run build:sdk
npm run test
npm run check
```

Docs are built with Astro Starlight:

```sh
npm run docs:dev
npm run docs:build
```

The repository is hosted at [github.com/volga-sh/ghostcall](https://github.com/volga-sh/ghostcall).
