---
id: '78b29290-d46f-45b2-aaba-c31597ceb6d4'
title: 'Java language evolution'
summary: 'Find the Java release that introduced a significant modern language or core-library feature.'
iconKey: 'java'
childTopicIds:
  - '4ca7a180-254f-46f3-9999-4f70f41957eb'
  - '2d23f8e8-66db-4d0a-b5bc-bfc0536d5ab8'
  - 'dad2f45c-44a0-4667-be7f-4eeda8bafdfe'
  - 'b1e43b80-78cb-48cb-91da-92a562933891'
  - '9e290750-ab85-4acb-bca2-88d7ad758cd7'
  - '97341609-b898-4072-8f4f-2823fc366ce1'
  - '5e30bfec-47fe-46bf-b777-88cd055cd27b'
  - 'c6d0c192-60ee-45ba-9580-745e7bf29259'
  - '30e2c64a-8978-447e-bde6-022686cefe8d'
  - 'cd880907-60d6-4874-b8fd-2f9eacf0e5e6'
---

This is a curated retrieval index, not complete release notes. It includes features
that materially changed common Java code and are useful to recognize or write.

| Java    | Feature                       | Why it matters                                      |
| ------- | ----------------------------- | --------------------------------------------------- |
| 8       | Lambdas and method references | Pass behavior without an anonymous class            |
| 8       | Stream API                    | Transform and aggregate sequences declaratively     |
| 14      | Switch expressions            | Produce values without accidental fall-through      |
| 15      | Text blocks                   | Write readable multiline strings                    |
| 16      | Records                       | Declare concise data carriers                       |
| 17      | Sealed classes                | Restrict which types may extend a hierarchy         |
| 16 / 21 | Pattern matching              | Bind matched values and branch by type              |
| 21      | Sequenced collections         | Use uniform first, last, and reversed operations    |
| 21      | Virtual threads               | Scale workloads containing many blocking operations |
| 25      | Scoped values                 | Pass bounded per-thread context down a call chain   |

Only finalized features are included. Preview features belong here after their final
shape and release are established.
