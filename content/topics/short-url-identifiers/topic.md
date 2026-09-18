---
id: '8cd3c5fb-eea7-4398-ba7e-8b6496ec431f'
title: 'Short URL identifiers'
summary: 'Choose how a short code is generated, represented, and placed safely in a URL.'
iconKey: 'conversion'
domains:
  - 'system-design'
kind: 'decision-aid'
childTopicIds: []
relatedTopicIds:
  - 'bec92ddc-6f0c-48a5-a576-1e49a92d5c3a'
---

**Encoding changes representation—not uniqueness, secrecy, or trust.** Generate the
identifier first, then choose how to spell it in the URL.

## Keep three decisions separate

| Step | Decision            | Questions                                              |
| ---- | ------------------- | ------------------------------------------------------ |
| 1    | Generate a value    | Must it be ordered, unpredictable, or decentralized?   |
| 2    | Represent the value | Which alphabet, length, case, and padding rules apply? |
| 3    | Place it in context | Must it survive a URL path, logs, typing, or copying?  |

For a short URL, Base62 can make an integer identifier compact and URL-friendly;
it does **not** decide how that identifier was allocated.

## Choose the value first

| Source value   | Useful when                                      | Watch for                                       |
| -------------- | ------------------------------------------------ | ----------------------------------------------- |
| Sequence       | Compact codes and collision-free allocation      | Predictability and coordination                 |
| Random value   | Decentralized, hard-to-guess code generation     | Collision budget, sufficient entropy, retries   |
| Truncated hash | The same canonical input should produce one code | Canonicalization and unavoidable collision risk |

The source value determines uniqueness and predictability. The encoding only
changes its textual form.

## Choose an alphabet

Each character carries approximately:

```text
bits per character = log2(number of symbols)
```

| Encoding  | Bits / character | Represents        | Useful when                        | Watch for                                |
| --------- | ---------------- | ----------------- | ---------------------------------- | ---------------------------------------- |
| Hex       | 4                | Bytes or integers | Logs, hashes, and debugging        | Easy to read, but least compact          |
| Base32    | 5                | Bytes             | People may type or dictate it      | Alphabets vary; specify the variant      |
| Base58    | 5.86             | Integers or bytes | Human-facing compact identifiers   | No universal alphabet                    |
| Base62    | 5.95             | Usually integers  | Short alphanumeric public codes    | Case-sensitive; no universal standard    |
| Base64    | 6                | Bytes             | Binary transport and named formats | `+`, `/`, and padding complicate URLs    |
| Base64URL | 6                | Bytes             | Binary values in URLs and tokens   | Padding and canonical form depend on use |

More symbols usually mean fewer characters, but compactness is only one
constraint. If a protocol or data format names an encoding, use that encoding and
its exact alphabet and padding rules.

## Two valid short-code paths

### Numeric value

```text
sequence-generated integer → Base62 → short alphanumeric code
```

- The allocator provides **uniqueness**.
- Base62 provides the **compact spelling**.
- Sequential values may make nearby codes predictable.

### Random bytes

```text
cryptographically secure random bytes → Base64URL → short URL-safe code
```

- The generator provides **randomness and entropy**.
- Base64URL provides the **text representation**.
- Choose the byte length from the collision and guessing budget, not only the
  preferred visual length.

## Do not confuse transformations

| Operation | Purpose                          | Reversible?         | Key required? |
| --------- | -------------------------------- | ------------------- | ------------- |
| Encode    | Change representation            | Yes                 | No            |
| Hash      | Produce a fixed-size fingerprint | No, by design       | No            |
| Compress  | Reduce size                      | Yes                 | No            |
| Encrypt   | Hide content                     | Yes, with the key   | Yes           |
| Sign/MAC  | Prove integrity and authenticity | No payload recovery | Yes           |
