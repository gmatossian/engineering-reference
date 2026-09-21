---
id: 'eb48ad81-c168-48ec-a5ac-602901e5d284'
title: 'Set'
summary: 'Choose and use a collection that represents unique membership rather than position.'
iconKey: 'set'
domains:
  - 'java'
  - 'collections'
  - 'algorithms-data-structures'
kind: 'concept'
childTopicIds:
  - '131944ce-d9f9-4053-889d-87f229e38516'
  - 'e080cdee-eecc-4c33-92d8-3a75acbf5d34'
  - '1cfa160f-9b9b-4f56-855d-74b87a5f76da'
  - 'c3707cd5-08e6-46da-b6ba-49b10459c00b'
relatedTopicIds: []
---

## Choose and use a set

![Set interface operations and implementation choices by ordering or specialized requirement](./set-choice-map.svg)

## Operations between collections

Given `left = {1, 2, 3}` and `right = {3, 4}`, these operations mutate `left`:

| Intent                           | Java operation          | `left` afterward |
| -------------------------------- | ----------------------- | ---------------- |
| Include elements from either set | `left.addAll(right)`    | `{1, 2, 3, 4}`   |
| Keep elements present in both    | `left.retainAll(right)` | `{3}`            |
| Remove elements present in right | `left.removeAll(right)` | `{1, 2}`         |
