object "ZCall" {
    code {
        // ZCall is an initcode-only batching program for CREATE-style eth_call.
        //
        // The caller sends:
        //   <compiled initcode><payload>
        //
        // Payload layout:
        //   N bytes  repeated call entries
        //
        // Each call entry layout:
        //   20 bytes target
        //    2 bytes calldata length (big-endian uint16)
        //    N bytes calldata
        //
        // Output layout:
        //   N bytes  repeated result entries
        //
        // Each result entry layout:
        //   2 bytes  packed header
        //            bit 15    = success flag
        //            bits 0-14 = returndata length (big-endian uint15)
        //   N bytes  returndata
        //
        // The engine assumes the SDK validates the payload format. On-chain checks are kept only
        // where they protect parser correctness or CREATE return-size safety.

        let maxReturnSize := 0x6000
        let maxEntrySize := 0x7fff
        let callHeaderSize := 0x16

        // dataoffset("user_payload_anchor") resolves to the end of the compiled initcode. Caller-
        // appended payload bytes begin exactly there.
        let payloadCursor := dataoffset("user_payload_anchor")
        let payloadEnd := codesize()

        let responsePtr := 0x20
        let writePtr := responsePtr

        for {} 1 {} {
            if eq(payloadCursor, payloadEnd) {
                break
            }

            // CODECOPY pads with zeros past the end of code, so a single bounds check on the next
            // cursor is enough to reject both truncated headers and truncated calldata.
            codecopy(0x00, payloadCursor, 0x20)

            let headerWord := mload(0x00)
            let target := shr(96, headerWord)
            let calldataSize := or(shl(8, byte(20, headerWord)), byte(21, headerWord))

            let calldataOffset := add(payloadCursor, callHeaderSize)
            let nextCursor := add(calldataOffset, calldataSize)

            if gt(nextCursor, payloadEnd) {
                revert(0x00, 0x00)
            }

            let calldataPtr := add(writePtr, 0x02)
            codecopy(calldataPtr, calldataOffset, calldataSize)

            let success := call(gas(), target, 0, calldataPtr, calldataSize, 0, 0)
            let returndataSize := returndatasize()

            if gt(returndataSize, maxEntrySize) {
                revert(0x00, 0x00)
            }

            let nextWritePtr := add(add(writePtr, 0x02), returndataSize)

            if gt(sub(nextWritePtr, responsePtr), maxReturnSize) {
                revert(0x00, 0x00)
            }

            mstore(writePtr, shl(240, or(shl(15, success), returndataSize)))
            returndatacopy(add(writePtr, 0x02), 0, returndataSize)

            writePtr := nextWritePtr
            payloadCursor := nextCursor
        }

        return(responsePtr, sub(writePtr, responsePtr))

    }

    data "user_payload_anchor" hex""
}
