# Topic findability audit

## Status and scope

This discovery artifact supports
[issue #56](https://github.com/gmatossian/engineering-reference/issues/56). It
uses the 67 versioned Topics on `main` at starting revision `705f295` as its
authoritative baseline. Local untracked Topic directories are excluded and must
remain untouched.

The audit investigates four retrieval jobs independently:

1. finding a known Topic;
2. browsing within a technical domain;
3. distinguishing and browsing by content kind; and
4. moving laterally to related Topics.

It does not change the production UI, Topic content, catalog, or the accepted
product, content, interaction, architecture, and visual-design authorities.

## Method and limitations

The expectation pass below was produced from an alphabetical list of titles
only. Topic files, metadata, catalog relationships, and UI paths were not
consulted while writing it. The section is frozen before the fresh actual-path
audit; later evidence will be recorded separately rather than retrofitted into
these expectations.

This is a heuristic assessment, not a formally blind usability study. The
reviewer had prior exposure to portions of the repository and application, so
that familiarity cannot be removed. Ambiguity inferred from a title is retained
because it is itself relevant evidence about discoverability.

The domain and kind vocabulary is deliberately provisional. It describes what
a reader might infer from a title, not a proposed final taxonomy.

## Title-only expectations

| Topic | Expected domain and kind | Plausible browse paths | Likely search vocabulary | Expected nearby or related Topics |
| --- | --- | --- | --- | --- |
| ArrayList versus LinkedList | Java collections; comparison or decision guide | Java → Collections → List → implementations; Java → Collections → comparisons | `ArrayList`, `LinkedList`, list implementation, performance | List; Creating lists; List operations and traps; Complexity |
| Arrays | Java fundamentals; concept overview | Java → Arrays; Java → Data structures → Arrays | Java array, fixed-size collection, array syntax | Arrays and lists; Copying arrays; List |
| Arrays and lists | Java collections; comparison or conversion reference | Java → Collections → comparisons; Java → Arrays → lists | array vs list, convert array list, fixed vs dynamic | Arrays; List; Copying arrays; Creating lists |
| Choosing a Set implementation | Java collections; decision guide | Java → Collections → Set → implementations; Java → Collections → choosing implementations | HashSet vs TreeSet, set implementation, ordered set | Set; Creating sets; Sorted and navigable sets; Equality and hash codes |
| Choosing a synchronization strategy | Java concurrency; decision guide | Java → Concurrency → synchronization; Java → Concurrency → decision guides | synchronization strategy, lock, atomic, concurrent collection | Visibility and atomicity; Concurrent maps; Concurrent queues; Executors and task execution |
| Choosing storage | Databases or system design; decision guide | Databases → choosing storage; System Design → data and storage decisions; system-design exercises → storage | database choice, SQL vs NoSQL, storage selection, key-value | Databases; Trade-off triggers; Scale and estimation; URL shortener |
| Collections framework | Java collections; domain overview or map | Java → Collections; Java → standard library → Collections | Java collections framework, Collection hierarchy, list set map queue | List; Set; Map; Queue; Arrays and lists |
| Complexity | Algorithms or data structures; concept/reference | Algorithms → Complexity; Java → Collections → performance; individual structures → Complexity | Big O, time complexity, space complexity, collection performance | Heap behavior; List operations and traps; Queue; Sorting lists |
| Concurrency | Java concurrency; domain overview | Java → Concurrency; Java → runtime → Concurrency | Java concurrency, threads, synchronization, concurrent collections | Visibility and atomicity; Executors and task execution; Virtual threads and resource limits; Choosing a synchronization strategy |
| Concurrent lists | Java concurrency and collections; implementation reference | Java → Concurrency → concurrent collections → lists; Java → Collections → List → concurrent variants | concurrent list, CopyOnWriteArrayList, thread-safe list | List; ArrayList versus LinkedList; Concurrent maps; Concurrent sets; Choosing a synchronization strategy |
| Concurrent maps | Java concurrency and collections; implementation reference | Java → Concurrency → concurrent collections → maps; Java → Collections → Map → concurrent variants | ConcurrentHashMap, concurrent map, thread-safe map | Map; Lookup and update patterns; Concurrent lists; Concurrent sets; Visibility and atomicity |
| Concurrent queues | Java concurrency and collections; implementation reference | Java → Concurrency → concurrent collections → queues; Java → Collections → Queue → concurrent variants | concurrent queue, blocking queue, thread-safe queue | Queue; Deque operations; Concurrent lists; Executors and task execution |
| Concurrent sets | Java concurrency and collections; implementation reference | Java → Concurrency → concurrent collections → sets; Java → Collections → Set → concurrent variants | concurrent set, thread-safe set, ConcurrentHashMap set | Set; Choosing a Set implementation; Concurrent maps; Equality and hash codes |
| Copying arrays | Java arrays; operations quick reference | Java → Arrays → operations → copying; Java → Collections → Arrays | copy array, `arraycopy`, `copyOf`, clone array | Arrays; Arrays and lists; Creating lists |
| Creating lists | Java collections; creation quick reference | Java → Collections → List → creation; Java → Collections → recipes | create list, `List.of`, mutable list, ArrayList | List; ArrayList versus LinkedList; Arrays and lists; List operations and traps |
| Creating maps | Java collections; creation quick reference | Java → Collections → Map → creation; Java → Collections → recipes | create map, `Map.of`, HashMap, mutable map | Map; Lookup and update patterns; Map views and iteration; Sorted and navigable maps |
| Creating sets | Java collections; creation quick reference | Java → Collections → Set → creation; Java → Collections → recipes | create set, `Set.of`, HashSet, mutable set | Set; Choosing a Set implementation; Sorted and navigable sets; Equality and hash codes |
| Databases | Data persistence; domain overview | landing page → Databases; System Design → Databases; data → persistence | database, SQL, persistence, data store | Choosing storage; SQL window functions; JPA; Pagination: offset vs cursor |
| Deque operations | Java collections; operations quick reference | Java → Collections → Queue → Deque; Java → Collections → Deque → operations | deque methods, add first last, stack queue, ArrayDeque | Queue; Stacks with Deque; PriorityQueue; Concurrent queues |
| Dirty checking, flush, and commit | Java persistence/JPA; lifecycle reference | Java → JPA → persistence context; Databases → ORM → JPA | JPA dirty checking, flush, commit, persistence context | EntityManager and entity lifecycle; persist, merge, and save; Optimistic locking with @Version |
| EntityManager and entity lifecycle | Java persistence/JPA; concept and lifecycle reference | Java → JPA → EntityManager; Databases → ORM → entity lifecycle | EntityManager, JPA lifecycle, managed detached entity | Dirty checking, flush, and commit; persist, merge, and save; Relationship loading and query shape |
| Equality and hash codes | Java language and collections; contract/reference | Java → language fundamentals → equality; Java → Collections → hashing contracts | equals hashCode, equality contract, hash collection | Set; Map; Choosing a Set implementation; Records |
| Executors and task execution | Java concurrency; API and operations reference | Java → Concurrency → executors; Java → Concurrency → task execution | ExecutorService, thread pool, submit task, Future | Concurrency; Virtual threads and resource limits; Parallel streams; Choosing a synchronization strategy |
| Heap behavior | Algorithms/data structures; concept/reference | Algorithms → data structures → heap; Java → Collections → PriorityQueue → heap | binary heap, min heap, max heap, priority queue complexity | PriorityQueue; Complexity; Sorting lists |
| HTTP | Web protocols; domain overview | landing page → HTTP; networking → HTTP; web development → protocols | HTTP protocol, request response, web headers | HTTP status codes; possibly caching, methods, headers, or semantics Topics |
| HTTP status codes | Web protocols; lookup reference | HTTP → Status codes; web development → HTTP → responses | HTTP 200, 404, 500, status code lookup | HTTP; other HTTP semantics or error-handling references |
| Java | Programming language; landing domain | landing page → Java | Java reference, JVM language, Java APIs | Collections framework; Concurrency; JPA; Java language evolution |
| Java language evolution | Java language; chronological or feature collection | Java → Language evolution; Java → language features → recent releases | modern Java, Java versions, new Java features | Records; Sealed classes; Pattern matching; Switch expressions; Text blocks; Scoped values |
| JPA | Java persistence; domain overview | Java → JPA; Databases → ORM → JPA | JPA, Jakarta Persistence, ORM, entities | EntityManager and entity lifecycle; Dirty checking, flush, and commit; Relationship loading and query shape; Spring Data repository methods |
| Lambdas and method references | Java language; syntax/usage reference | Java → language features → Lambdas; Java → functional programming | lambda expression, method reference, functional interface | Streams; Operations and collectors; Java language evolution |
| List | Java collections; interface overview | Java → Collections → List | Java List, ordered collection, list interface | Creating lists; List operations and traps; ArrayList versus LinkedList; Sorting lists |
| List operations and traps | Java collections; operations and pitfalls reference | Java → Collections → List → operations; Java → Collections → pitfalls | list add remove get, `Arrays.asList`, list pitfalls | List; Creating lists; ArrayList versus LinkedList; Sorting lists |
| Lookup and update patterns | Ambiguous; likely Java Map operations or database access patterns | Java → Collections → Map → operations; alternatively Databases → access patterns | map lookup update, `computeIfAbsent`, database lookup pattern | Map; Creating maps; Map views and iteration; Concurrent maps |
| Map | Java collections; interface overview | Java → Collections → Map | Java Map, key value collection, map interface | Creating maps; Lookup and update patterns; Map views and iteration; Sorted and navigable maps |
| Map views and iteration | Java collections; operations reference | Java → Collections → Map → views and iteration | `entrySet`, `keySet`, map iteration, values view | Map; Lookup and update patterns; Creating maps; Streams |
| Operations and collectors | Java Streams; operations quick reference | Java → Streams → operations and collectors; Java → functional programming → Streams | stream operations, collectors, `groupingBy`, `toList` | Streams; Stream pitfalls; Streams vs loops; Lambdas and method references |
| Optimistic locking with @Version | Java persistence/JPA; concurrency pattern/reference | Java → JPA → concurrency and locking; Databases → ORM → optimistic locking | `@Version`, optimistic locking, lost update, JPA lock | Dirty checking, flush, and commit; EntityManager and entity lifecycle; Visibility and atomicity |
| Pagination: offset vs cursor | Databases, APIs, or system design; comparison/decision guide | Databases → query patterns → pagination; System Design → API/data access decisions; HTTP → API patterns | offset pagination, cursor pagination, keyset pagination | SQL window functions; Databases; Trade-off triggers; Scale and estimation |
| Parallel streams | Java Streams and concurrency; decision/reference | Java → Streams → parallel streams; Java → Concurrency → parallel processing | parallel stream, ForkJoinPool, stream performance | Streams; Streams vs loops; Executors and task execution; Virtual threads and resource limits |
| Pattern matching | Ambiguous; likely modern Java language feature | Java → Language evolution → Pattern matching; alternatively text/regex topics | Java pattern matching, instanceof pattern, switch pattern, regex | Java language evolution; Switch expressions; Sealed classes; Records |
| persist, merge, and save | Java persistence/JPA/Spring Data; comparison/reference | Java → JPA → entity operations; Java → Spring Data → repository methods | JPA persist merge, repository save, detached entity | EntityManager and entity lifecycle; Spring Data repository methods; Dirty checking, flush, and commit |
| PriorityQueue | Java collections; implementation reference | Java → Collections → Queue → PriorityQueue; Algorithms → heaps → Priority queue | Java PriorityQueue, heap queue, comparator priority | Queue; Heap behavior; Complexity; Deque operations |
| Queue | Java collections; interface overview | Java → Collections → Queue | Java Queue, FIFO, queue interface | Deque operations; PriorityQueue; Concurrent queues; Complexity |
| Records | Ambiguous; likely modern Java language feature | Java → Language evolution → Records; Java → data modeling | Java record, immutable data carrier, record class | Java language evolution; Equality and hash codes; Pattern matching; Sealed classes |
| Relationship loading and query shape | Java persistence/JPA; performance and query reference | Java → JPA → relationships and fetching; Databases → ORM → query performance | lazy eager loading, N+1, fetch join, query shape | JPA; EntityManager and entity lifecycle; Spring Data repository methods; SQL window functions |
| Scale and estimation | System design; foundational calculation reference | System Design → fundamentals → scale and estimation; system-design exercises → preparation | capacity estimation, QPS, bandwidth, storage estimate | Trade-off triggers; Choosing storage; URL shortener; Complexity |
| Scoped values | Java concurrency/language evolution; feature reference | Java → Concurrency → context propagation; Java → Language evolution → Scoped values | Java ScopedValue, thread context, ThreadLocal alternative | Virtual threads and resource limits; Concurrency; Java language evolution |
| Sealed classes | Java language evolution; feature reference | Java → Language evolution → Sealed classes; Java → type system | Java sealed class, permits, closed hierarchy | Java language evolution; Records; Pattern matching; Switch expressions |
| Sequenced collections | Java collections/language evolution; feature overview | Java → Collections → Sequenced collections; Java → Language evolution → collection changes | SequencedCollection, reversed collection, Java 21 collections | Collections framework; List; Set; Map; Java language evolution |
| Set | Java collections; interface overview | Java → Collections → Set | Java Set, unique collection, set interface | Creating sets; Choosing a Set implementation; Sorted and navigable sets; Equality and hash codes |
| Short URL identifiers | System design and URL shortener; focused design reference | System Design → exercises → URL shortener → identifiers; System Design → identifiers | short code generation, base62, URL ID, collision | URL shortener; Choosing storage; Scale and estimation; Trade-off triggers |
| Sorted and navigable maps | Java collections; specialized implementation/API reference | Java → Collections → Map → sorted and navigable maps | TreeMap, NavigableMap, SortedMap, range query | Map; Creating maps; Map views and iteration; Sorted and navigable sets |
| Sorted and navigable sets | Java collections; specialized implementation/API reference | Java → Collections → Set → sorted and navigable sets | TreeSet, NavigableSet, SortedSet, range set | Set; Choosing a Set implementation; Creating sets; Sorted and navigable maps |
| Sorting lists | Java collections; operations quick reference | Java → Collections → List → sorting; Java → algorithms → sorting APIs | sort list, comparator, `List.sort`, `Collections.sort` | List; List operations and traps; Lambdas and method references; Complexity |
| Spring Data repository methods | Java persistence/Spring Data; API reference | Java → JPA → Spring Data; Java → Spring → repositories | Spring Data repository, query method, `save`, `findBy` | JPA; persist, merge, and save; Relationship loading and query shape |
| SQL window functions | Databases/SQL; syntax and operations reference | Databases → SQL → window functions; data querying → analytics | SQL window function, `OVER`, `PARTITION BY`, ranking | Databases; Pagination: offset vs cursor; Relationship loading and query shape |
| Stacks with Deque | Java collections; implementation recipe | Java → Collections → Queue/Deque → stack; Java → data structures → Stack | Java stack, ArrayDeque stack, push pop peek | Deque operations; Queue; List operations and traps |
| Stream pitfalls | Java Streams; pitfalls reference | Java → Streams → pitfalls; Java → functional programming → Streams | Java stream pitfalls, side effects, reuse stream, lazy evaluation | Streams; Operations and collectors; Streams vs loops; Parallel streams |
| Streams | Java functional APIs; overview | Java → Streams; Java → functional programming → Streams | Java Stream API, stream pipeline, functional collection processing | Operations and collectors; Stream pitfalls; Streams vs loops; Parallel streams |
| Streams vs loops | Java; comparison or decision guide | Java → Streams → comparisons; Java → language/collections → iteration choices | stream vs for loop, performance, readability | Streams; Stream pitfalls; Operations and collectors; Parallel streams |
| Switch expressions | Java language evolution; feature reference | Java → Language evolution → Switch expressions; Java → control flow | Java switch expression, arrow case, yield | Java language evolution; Pattern matching; Sealed classes |
| System Design | Architecture; landing domain | landing page → System Design | system design, architecture, distributed systems | Scale and estimation; Trade-off triggers; URL shortener; Choosing storage |
| Text blocks | Java language evolution; syntax reference | Java → Language evolution → Text blocks; Java → strings | Java text block, multiline string, triple quote | Java language evolution; Records; Switch expressions |
| Trade-off triggers | System design; decision aid/checklist | System Design → fundamentals → decision making; system-design exercises → supporting references | system design trade-offs, requirement to design choice, architecture decisions | Scale and estimation; Choosing storage; URL shortener; Pagination: offset vs cursor |
| URL shortener | System design; exercise or case study | System Design → exercises → URL shortener; architecture case studies → URL shortener | URL shortener design, tiny URL, system design exercise | Short URL identifiers; Choosing storage; Scale and estimation; Trade-off triggers |
| Virtual threads and resource limits | Java concurrency; decision and operational reference | Java → Concurrency → virtual threads; Java → Language evolution → concurrency features | virtual threads, Project Loom, blocking IO, resource limits | Executors and task execution; Scoped values; Choosing a synchronization strategy; Concurrency |
| Visibility and atomicity | Java concurrency; foundational concept/reference | Java → Concurrency → memory model; Java → Concurrency → correctness | visibility, atomicity, volatile, happens-before | Concurrency; Choosing a synchronization strategy; Concurrent maps; Optimistic locking with @Version |

## Actual-path audit

The fresh audit used a clean archive of revision `705f295`, generated with the
repository's content pipeline and served independently of the working tree. An
automated traversal followed every Topic link exposed from the landing page and
every subsequent Topic view. It visited 75 distinct browse paths and reached all
67 unique Topics. Representative paths were also inspected visually at wide and
narrow layouts.

### Catalog-level observations

| Measure | Result |
| --- | ---: |
| Versioned Topics | 67 |
| Landing Topics | 4 |
| Topics one click from landing | 4 |
| Topics two clicks from landing | 12 |
| Topics three clicks from landing | 30 |
| Topics four clicks from landing | 20 |
| Topics five clicks from landing | 1 |
| Content-only leaves | 51 |
| Topics reachable through more than one full path | 8 |
| Topics with only one full path | 59 |

Only four Topics have more than one direct parent: **Arrays and lists**,
**Equality and hash codes**, **Streams**, and **Virtual threads and resource
limits**. The other four multiple-path results inherit their alternative path
through **Streams**.

The landing page exposes four cards and no search, all-Topics index, filter, or
other retrieval entry point. Landing cards show a title, summary, and decorative
icon. All deeper navigation rows show only a title and decorative icon; they do
not expose summaries, content-kind labels, parent paths, or relationship labels.
The table abbreviates these presentations as:

- **LS** — landing title, summary, and decorative icon;
- **TI** — child-row title and decorative icon only.

The icons cannot serve as content-kind labels. The accepted model defines them
as decorative reusable concepts, and the System Design list uses the same
architecture icon for an exercise, a decision aid, and a pagination comparison.

### Topic-by-topic actual paths and gaps

“From Topic” records the only Topic links available after opening that page:
its immediate children. It does not count the global Home link or browser Back.

| Topic | Actual browse path(s); minimum clicks | Cue | From Topic | Expected-versus-actual finding |
| --- | --- | --- | --- | --- |
| ArrayList versus LinkedList | Java → Collections framework → List → ArrayList versus LinkedList; 4 | TI | None | Expected route exists; no links onward to List, creation, operations, or complexity references. |
| Arrays | Java → Arrays; 2 | TI | Copying arrays; Arrays and lists | Strong route match; related coverage is limited to children and does not include List. |
| Arrays and lists | Java → Arrays → Arrays and lists; also Java → Collections framework → List → Arrays and lists; 3 | TI | None | Both expected contexts exist; the leaf provides no return or lateral context when opened directly. |
| Choosing a Set implementation | Java → Collections framework → Set → Choosing a Set implementation; 4 | TI | None | Expected route exists; related implementations, equality, and sorted sets are not exposed from the page. |
| Choosing a synchronization strategy | Java → Concurrency → Choosing a synchronization strategy; 3 | TI | None | Expected route exists; the decision aid has no links to the concurrency references it helps select among. |
| Choosing storage | System Design → URL shortener → Choosing storage; 3 | TI | None | One plausible exercise route exists, but expected Databases and general System Design routes are absent; the leaf has no contextual links. |
| Collections framework | Java → Collections framework; 2 | TI | List; Set; Queue; Map | Expected route and primary interface neighbors align well. |
| Complexity | Java → Collections framework → Queue → Complexity; 4 | TI | None | The generic title is available only in the Queue context, not through Algorithms or other data structures. |
| Concurrency | Java → Concurrency; 2 | TI | Choosing a synchronization strategy; Visibility and atomicity; Executors and task execution; Virtual threads and resource limits | Expected route and foundational children align, but concurrent collection Topics are absent. |
| Concurrent lists | Java → Collections framework → List → Concurrent lists; 4 | TI | None | Collection route exists; the expected Concurrency route and related concurrent structures are absent. |
| Concurrent maps | Java → Collections framework → Map → Concurrent maps; 4 | TI | None | Collection route exists; the expected Concurrency route and related concurrency concepts are absent. |
| Concurrent queues | Java → Collections framework → Queue → Concurrent queues; 4 | TI | None | Collection route exists; the expected Concurrency route and producer-consumer references are absent. |
| Concurrent sets | Java → Collections framework → Set → Concurrent sets; 4 | TI | None | Collection route exists; the expected Concurrency route and related concurrent structures are absent. |
| Copying arrays | Java → Arrays → Copying arrays; 3 | TI | None | Expected route exists; arrays/list conversion and other array operations are not exposed from the leaf. |
| Creating lists | Java → Collections framework → List → Creating lists; 4 | TI | None | Expected route exists; no path from the leaf to List operations or implementation choice. |
| Creating maps | Java → Collections framework → Map → Creating maps; 4 | TI | None | Expected route exists; no path from the leaf to lookup, iteration, or specialized maps. |
| Creating sets | Java → Collections framework → Set → Creating sets; 4 | TI | None | Expected route exists; no path from the leaf to implementation choice, equality, or sorted sets. |
| Databases | Landing → Databases; 1 | LS | SQL window functions | Broad entry point matches, but Choosing storage, pagination, and JPA-related references are not discoverable here. |
| Deque operations | Java → Collections framework → Queue → Deque operations; 4 | TI | None | Expected route exists; Stacks with Deque and neighboring Queue references are not exposed from the leaf. |
| Dirty checking, flush, and commit | Java → JPA → Dirty checking, flush, and commit; 3 | TI | None | Expected route exists; the tightly related lifecycle, persist/merge, and locking Topics are not exposed. |
| EntityManager and entity lifecycle | Java → JPA → EntityManager and entity lifecycle; 3 | TI | None | Expected route exists; related JPA lifecycle operations disappear once the Topic is opened. |
| Equality and hash codes | Java → Collections framework → Set → Equality and hash codes; also through Map; 4 | TI | None | Two expected collection contexts exist; broader Java and record-related context is absent from the leaf. |
| Executors and task execution | Java → Concurrency → Executors and task execution; 3 | TI | None | Expected route exists; virtual threads, parallel streams, and synchronization choices are not linked. |
| Heap behavior | Java → Collections framework → Queue → PriorityQueue → Heap behavior; 5 | TI | None | The deepest Topic is reachable only through PriorityQueue; expected Algorithms/data-structure discovery is absent. |
| HTTP | Landing → HTTP; 1 | LS | HTTP status codes | Broad entry point and child match the current small corpus. |
| HTTP status codes | HTTP → HTTP status codes; 2 | TI | None | Expected route exists; the leaf has no HTTP context or adjacent protocol references. |
| Java | Landing → Java; 1 | LS | Arrays; Collections framework; Streams; Concurrency; JPA; Java language evolution | Broad domain entry and major areas align well. |
| Java language evolution | Java → Java language evolution; 2 | TI | Lambdas and method references; Streams; Switch expressions; Text blocks; Records; Sealed classes; Pattern matching; Sequenced collections; Virtual threads and resource limits; Scoped values | Expected feature collection exists; the unlabelled list mixes language syntax, APIs, collections, and concurrency features. |
| JPA | Java → JPA; 2 | TI | Spring Data repository methods; EntityManager and entity lifecycle; persist, merge, and save; Dirty checking, flush, and commit; Relationship loading and query shape; Optimistic locking with `@Version` | Expected Java route and JPA grouping exist; no Databases route is available. |
| Lambdas and method references | Java → Java language evolution → Lambdas and method references; 3 | TI | None | A plausible evolution route exists; expected functional/Streams context is not exposed. |
| List | Java → Collections framework → List; 3 | TI | Creating lists; ArrayList versus LinkedList; List operations and traps; Arrays and lists; Sorting lists; Concurrent lists | Expected route and focused children align; the page offers no path to sibling collection types or its parent. |
| List operations and traps | Java → Collections framework → List → List operations and traps; 4 | TI | None | Expected route exists; related List operations and implementation choices are not exposed from the leaf. |
| Lookup and update patterns | Java → Collections framework → Map → Lookup and update patterns; 4 | TI | None | Placement resolves the title's Map-versus-database ambiguity, but that context disappears on a direct visit. |
| Map | Java → Collections framework → Map; 3 | TI | Creating maps; Lookup and update patterns; Map views and iteration; Equality and hash codes; Sorted and navigable maps; Concurrent maps | Expected route and focused children align; sibling and parent context is absent. |
| Map views and iteration | Java → Collections framework → Map → Map views and iteration; 4 | TI | None | Expected route exists; related Map operations and Streams are not exposed. |
| Operations and collectors | Java → Streams → Operations and collectors; also through Java language evolution → Streams; 3 | TI | None | Multiple inherited paths help discovery, but the leaf has no Streams neighbors or Lambdas link. |
| Optimistic locking with `@Version` | Java → JPA → Optimistic locking with `@Version`; 3 | TI | None | Expected JPA route exists; related persistence and concurrency references are not exposed. |
| Pagination: offset vs cursor | System Design → Pagination: offset vs cursor; 2 | TI | None | One expected design route exists; expected Databases/API routes and related scale/trade-off references are absent. |
| Parallel streams | Java → Streams → Parallel streams; also through Java language evolution → Streams; 3 | TI | None | Streams paths exist; expected Concurrency context and neighboring execution strategies are absent. |
| Pattern matching | Java → Java language evolution → Pattern matching; 3 | TI | None | Placement resolves the Java-versus-regex ambiguity, but the direct page does not expose that context or related features. |
| persist, merge, and save | Java → JPA → persist, merge, and save; 3 | TI | None | Expected route exists; lifecycle, dirty checking, and repository-method references are not linked. |
| PriorityQueue | Java → Collections framework → Queue → PriorityQueue; 4 | TI | Heap behavior | Expected Queue route and heap child align; no comparator, sorting, or general complexity links are exposed. |
| Queue | Java → Collections framework → Queue; 3 | TI | Complexity; Deque operations; Stacks with Deque; PriorityQueue; Concurrent queues | Expected route and focused children align, but children follow the complete main content and begin below the initial narrow viewport. |
| Records | Java → Java language evolution → Records; 3 | TI | None | Placement resolves the Java-versus-database ambiguity; related equality, pattern matching, and sealed types are absent. |
| Relationship loading and query shape | Java → JPA → Relationship loading and query shape; 3 | TI | None | Expected JPA route exists; SQL and repository-query references are not exposed. |
| Scale and estimation | System Design → Scale and estimation; 2 | TI | None | Expected foundational route exists; exercises and decision aids that use it are not linked. |
| Scoped values | Java → Java language evolution → Scoped values; 3 | TI | None | Evolution route exists; expected Concurrency and virtual-thread routes are absent. |
| Sealed classes | Java → Java language evolution → Sealed classes; 3 | TI | None | Expected route exists; related pattern matching, records, and switch features are not exposed. |
| Sequenced collections | Java → Java language evolution → Sequenced collections; 3 | TI | None | Evolution route exists; expected Collections framework route and related List/Set/Map Topics are absent. |
| Set | Java → Collections framework → Set; 3 | TI | Creating sets; Choosing a Set implementation; Equality and hash codes; Sorted and navigable sets; Concurrent sets | Expected route and focused children align; parent and sibling collection context is absent. |
| Short URL identifiers | System Design → URL shortener → Short URL identifiers; 3 | TI | None | Expected exercise route exists; Choosing storage, scale, and trade-off references are not exposed. |
| Sorted and navigable maps | Java → Collections framework → Map → Sorted and navigable maps; 4 | TI | None | Expected route exists; its analogous Set Topic and ordering references are not exposed. |
| Sorted and navigable sets | Java → Collections framework → Set → Sorted and navigable sets; 4 | TI | None | Expected route exists; its analogous Map Topic and implementation-choice reference are not exposed. |
| Sorting lists | Java → Collections framework → List → Sorting lists; 4 | TI | None | Expected route exists; comparator, lambdas, complexity, and other List operations are not linked. |
| Spring Data repository methods | Java → JPA → Spring Data repository methods; 3 | TI | None | Expected route exists; persist/merge semantics and query-shape references are not exposed. |
| SQL window functions | Databases → SQL window functions; 2 | TI | None | Expected route exists; no other database or query-pattern context is available from the leaf. |
| Stacks with Deque | Java → Collections framework → Queue → Stacks with Deque; 4 | TI | None | Expected route exists; Deque operations and Queue context are not exposed from the leaf. |
| Stream pitfalls | Java → Streams → Stream pitfalls; also through Java language evolution → Streams; 3 | TI | None | Multiple inherited paths help discovery; sibling Stream references disappear on the leaf. |
| Streams | Java → Streams; also Java → Java language evolution → Streams; 2 | TI | Operations and collectors; Streams vs loops; Stream pitfalls; Parallel streams | Two expected contexts and focused children align well. |
| Streams vs loops | Java → Streams → Streams vs loops; also through Java language evolution → Streams; 3 | TI | None | Expected comparison route exists; sibling operations, pitfalls, and parallel guidance are not exposed. |
| Switch expressions | Java → Java language evolution → Switch expressions; 3 | TI | None | Expected route exists; pattern matching and sealed-class context are absent. |
| System Design | Landing → System Design; 1 | LS | Scale and estimation; URL shortener; Trade-off triggers; Pagination: offset vs cursor | Broad entry exists, but the unlabelled list mixes a foundation, an exercise, a decision aid, and a comparison; no exercise grouping is visible. |
| Text blocks | Java → Java language evolution → Text blocks; 3 | TI | None | Expected route exists; the leaf offers no language-evolution context when opened directly. |
| Trade-off triggers | System Design → Trade-off triggers; 2 | TI | None | Expected foundational route exists; no design exercises, storage choice, pagination, or scale references are exposed. |
| URL shortener | System Design → URL shortener; 2 | TI | Short URL identifiers; Choosing storage | Expected exercise route and focused children align, but nothing labels it as an exercise or links to supporting System Design references. |
| Virtual threads and resource limits | Java → Concurrency → Virtual threads and resource limits; also Java → Java language evolution → Virtual threads and resource limits; 3 | TI | None | Both expected contexts exist; executors and scoped values are not exposed from the leaf. |
| Visibility and atomicity | Java → Concurrency → Visibility and atomicity; 3 | TI | None | Expected foundational route exists; synchronization choices and concurrent structures are not linked. |

### Representative layout observations

- Wide and narrow System Design views preserve the same four links and order,
  but neither layout explains their different content kinds. Responsive reflow
  therefore preserves the ambiguity rather than causing it.
- The narrow Queue view places its five child links after approximately 1,314
  CSS pixels of main content; the child-navigation region begins around 1,540
  pixels down a page whose measured viewport height was 1,055 pixels. Related
  child discovery therefore requires scrolling past the main reference.
- The narrow Choosing storage leaf contains no Topic links, breadcrumb, parent
  label, or related-navigation region. Its only exits are Home and browser Back.
- Narrow pages had no page-level horizontal overflow in the inspected cases;
  responsive layout quality is not the source of the findability failure.

## Findings and information-model options

### The MVP works as specified, but its assumption no longer covers the corpus

The current application correctly implements the accepted MVP: a deliberately
sparse catalog browsed from broad Topics to increasingly specific children. It
is not failing to render a richer taxonomy or retrieval system; those
capabilities were explicitly excluded or left unresolved.

The dogfooding problem is that the corpus now supports more jobs than
broad-to-specific browsing alone:

| Retrieval job | Current support | Evidence |
| --- | --- | --- |
| Browse from a broad technical area | Strong | Four clear landing areas; Java's major branches and many collection branches closely match title-only expectations. |
| Find a known Topic without knowing its parent | Weak | No search or index; 59 Topics have one full path; UUID URLs are stable but not guessable. |
| Browse by content kind | Unsupported | The model has no kind; child rows expose no label or summary; System Design mixes several kinds. |
| Explore related knowledge from the current Topic | Weak to unsupported | Only immediate children are shown; 51 leaves expose no Topic links. |
| Understand a directly opened Topic's context | Unsupported | No parent/context display; Home and history Back do not explain where the Topic belongs. |

### Recurring failure patterns

#### 1. One browse hierarchy is being used as both taxonomy and retrieval

Many unambiguous Java API Topics fit the hierarchy well. Cross-cutting Topics
do not. Choosing storage, pagination, concurrent collections, JPA, complexity,
and heap behavior all have more than one plausible domain or use context, but
most receive one route.

The existing graph already permits multiple parents and uses that capability
successfully for Arrays and lists, Equality and hash codes, Streams, and
Virtual threads and resource limits. That proves that one canonical Topic can
support several contexts, but adding more parents alone would still require a
reader to guess one of those contexts.

#### 2. Content kind is absent from both the model and presentation

The System Design list is the clearest example:

- **Scale and estimation** is a foundational reference;
- **URL shortener** is an exercise or case study container;
- **Trade-off triggers** is a decision aid; and
- **Pagination: offset vs cursor** is a focused comparison.

They appear as one undifferentiated list. The shared architecture icon does not
resolve the ambiguity and, by contract, must remain decorative rather than
carry taxonomic meaning.

#### 3. Leaf pages become contextual dead ends

The catalog contains 51 content-only leaves. A direct visit to one of them
shows no parent, collection, sibling, or curated related Topic. Browser Back can
recover the previous view only when the reader arrived through the application;
it cannot explain context after a direct link or a new tab.

#### 4. Child navigation is not equivalent to related navigation

Children communicate narrower material owned by the current browse context.
Related knowledge often lives beside, above, or across that context. For
example, Choosing a synchronization strategy should lead to the concurrency
choices it helps evaluate, and Choosing storage should lead to Databases and
other system-design decision aids. Making every related Topic a child would
blur containment and produce increasingly repetitive navigation lists.

#### 5. Main-content-first ordering can hide the only onward routes

The accepted Topic layout places children after complete main content. This is
appropriate for progressive disclosure, but it weakens exploration when
children are also the only form of related navigation. In the inspected narrow
Queue page, the five child links began below the first viewport after a long
reference body.

#### 6. Ambiguous titles depend on a path that the destination does not retain

Titles such as Complexity, Records, Pattern matching, and Lookup and update
patterns become clear in their browse path. The Topic view intentionally has
path-independent meaning, but it supplies no replacement context when opened
directly.

### Proposed conceptual model

Preserve Topic identity and authored content, but stop asking one ordered edge
to encode every form of organization. The post-MVP conceptual model should
separate these dimensions:

```text
Topic
├── identity and canonical content          existing
├── domain membership (one or more)         classification
├── content kind                            classification
├── ordered children                        progressive disclosure
├── curated collections                     browse entry points
└── curated related Topics                  lateral exploration
```

#### Domain

A Topic may belong to one or more technical domains. Domain membership answers
“where could I reasonably browse for this?” without asserting that any domain
owns the Topic. Examples include Java, Collections, Concurrency, Persistence,
Databases, HTTP, and System Design. The final vocabulary should be deliberately
small and reviewed against the full corpus.

#### Content kind

Each Topic should expose one primary retrieval-oriented kind. A candidate
vocabulary derived from the baseline is:

- **area** — an organizing entry point such as Java or Databases;
- **concept** — explanatory reference such as Visibility and atomicity;
- **operations** — API, syntax, or task lookup such as Creating maps;
- **decision aid** — a comparison or choice guide such as Trade-off triggers;
- **exercise** — an applied design problem such as URL shortener; and
- **pattern or technique** — a reusable solution shape when the published
  corpus gains examples that justify it.

This is a proposal to validate, not a final enum. The useful distinction is that
domain and kind are orthogonal: URL shortener can be a System Design Topic whose
kind is exercise.

#### Ordered children

Retain the existing broad-to-specific relationship for intentional progressive
disclosure. It remains valuable for Java → Collections framework → Queue and
for an exercise → focused subproblem. It should no longer be the only
discoverability mechanism.

#### Curated collections

Collections provide named entry points such as **System design exercises** or
**Java collection choices** without changing Topic identity or pretending that
collection membership is parentage. Some collections may be derived from
domain and kind; intentionally ordered collections may require explicit source
data.

#### Related Topics

Add a curated lateral relationship for the small set of links that materially
help retrieval from a Topic page. Related links should not automatically equal
all siblings or all Topics sharing a domain. Begin with a simple relationship;
introduce typed edges only if concrete presentation or authoring needs justify
them.

#### Derived reverse context

The build can derive incoming parents, domain membership, and collection
membership for display as **Browse contexts** or **Found in**. This is more
accurate than a canonical breadcrumb in a graph where a Topic can have several
parents. It also preserves path-independent Topic URLs.

#### Search index

Known-item retrieval should search the already bundled, immutable catalog on
the client. Start with derived title, summary, and content text rather than
requiring authors to maintain a second keyword registry. Add aliases only when
observed misses justify them. The current corpus size does not require a
backend, network request, personalization, or behavioral tracking.

### Candidate navigation directions

#### Direction A: enrich the existing graph only

Add more parent references and navigation-only grouping Topics, such as System
design exercises. Keep the UI and runtime model otherwise unchanged.

**Advantages:** smallest product and technical change; preserves the proven
browse interaction; uses existing DAG support.

**Costs:** known-item retrieval still requires route guessing; content kind
remains implicit; leaf pages remain dead ends; many placements must be curated
and repeated.

#### Direction B: add a classified all-Topics browse surface

Add domain and kind metadata, an alphabetical all-Topics index, grouped domain
views, and curated related links. Retain the current landing and child
hierarchy, but do not add free-text search initially.

**Advantages:** makes every Topic inspectable from one entry point; clearly
separates exercises from references; supports lateral exploration; keeps
retrieval deterministic and visually browsable.

**Costs:** an alphabetical or faceted index still makes a known title slower
than direct search; adds metadata and content-governance work; requires changes
to accepted model, storage, interaction, and visual authorities.

#### Direction C: hybrid browse, search, context, and relationships

Retain the landing domains and ordered child hierarchy, add a client-side Topic
finder and all-Topics browse surface, group domain pages by kind where useful,
and add Browse contexts plus curated Related Topics to Topic pages.

**Advantages:** directly supports all five observed retrieval jobs; preserves
the strongest part of the current experience; gives direct links context; can
scale through derived indexes without a backend.

**Costs:** largest product-contract and UI change; requires careful responsive,
keyboard, focus, ranking, empty-state, and accessibility design; classification
and relationships require editorial ownership.

### Comparison against representative journeys

| Journey | Current hierarchy | Direction A: richer graph | Direction B: classified index | Direction C: hybrid |
| --- | --- | --- | --- | --- |
| Find Choosing storage by name | Must know System Design → URL shortener | Could gain more guessed domain paths | Find under all Topics or domain/kind filters | Search directly; browse routes remain available |
| Browse system-design exercises | Exercise is mixed with three other kinds | Add an Exercises grouping Topic | Filter or group System Design by exercise | Grouped domain view plus search/index |
| From Set, discover Queue and Collections framework | No parent or sibling links | Could add artificial child links, blurring meaning | Browse context and domain index | Browse context plus curated related links |
| Open Choosing storage directly and understand context | No Topic context or links | Extra parents still are not displayed | Display domains, kind, and related links | Display contexts and related links; finder remains available |
| Browse Java → Collections framework → Queue | Works well | Preserved | Preserved alongside new index | Preserved alongside finder and context |
| Find Heap behavior without knowing PriorityQueue | Five-click guessed path | More parents could shorten it | All-Topics index or Algorithms/data-structure filter | Search directly or browse a classified index |

Direction A improves selected placements but does not solve the systemic
retrieval problem. Direction B is a credible low-complexity product increment.
Direction C best matches the complete evidence and is the recommended target,
provided it is delivered in bounded slices rather than one implementation
issue.

### Low-fidelity navigation shape

The recommendation is an information architecture, not a final composition.
A minimal conceptual layout is:

```text
Landing
├── Find a topic
├── Browse all topics
└── Domains: Java | System Design | HTTP | Databases

System Design
├── Exercises
│   └── URL shortener
├── Foundations and decisions
│   ├── Scale and estimation
│   └── Trade-off triggers
└── Techniques and comparisons
    └── Pagination: offset vs cursor

Topic
├── title and content
├── narrower children, when present
├── Browse contexts / Found in
└── Related topics
```

This sketch intentionally avoids deciding final component placement, labels,
breakpoints, or visual treatment.

## Recommendation and follow-up boundaries

### Recommended direction

Adopt Direction C as the target information architecture while implementing it
incrementally:

1. preserve the existing Topic identity, URLs, content rendering, and ordered
   child navigation;
2. introduce independent domain and kind classification;
3. add an all-Topics browse/index surface and simple client-side title search;
4. group domain browsing by kind where that improves recognition, beginning
   with System Design;
5. expose derived Browse contexts and a small curated Related Topics region on
   Topic pages; and
6. add richer search vocabulary or relationship types only after observed use
   demonstrates the need.

Do not replace the hierarchy with search. Broad-to-specific browsing remains
useful and is the strongest current journey. The change is to make the
hierarchy one retrieval view rather than the complete information architecture.

### Stitch decision

Do not use Stitch to decide the information model. The current evidence is
about classification, entry points, and relationship semantics rather than
visual styling. After the human owner accepts or adjusts the recommended
direction, Stitch could add value in a focused follow-up by comparing wide and
narrow compositions for:

- the landing finder and domain entry points;
- a System Design view grouped by kind;
- an all-Topics browse/search result view; and
- a Topic page with Browse contexts and Related Topics.

That prototype should use the real baseline titles and relationships and must
not treat generated styling or invented metadata as accepted product behavior.

### Authority implications

The recommendation conflicts with deliberate MVP exclusions, but not with an
unresolved implementation detail. Before production work, the human owner must
accept the post-MVP change and authorize amendments to:

- `docs/product-brief.md` for the expanded retrieval jobs and capabilities;
- `docs/content-model.md` for domain, kind, collections, and related
  relationships;
- `docs/content-storage.md` for their authored and generated representation;
- `docs/interaction-model.md` for search/index, context, related navigation,
  focus, URLs, and responsive behavior;
- `docs/visual-design.md` for previously excluded search, classification, and
  secondary navigation; and
- `docs/application-architecture.md` for derived indexes and component/service
  responsibilities.

The existing authorities remain binding until those amendments are reviewed
and accepted.

### Proposed follow-up sequence

1. **Accept the post-MVP retrieval model and amend governing documents.**
2. **Optionally prototype the accepted surfaces with Stitch** if layout choices
   remain consequential after the model decision.
3. **Extend the Topic contracts and generator** with validated classification,
   collections, relationships, and derived reverse indexes.
4. **Classify the 67 published Topics and curate initial relationships** as a
   separate content migration with deliberate review.
5. **Implement the finder, index, grouped domain navigation, and Topic context**
   in bounded UI slices.
6. **Verify known-item, browse, direct-link, keyboard, responsive, and
   assistive-technology journeys** against the accepted interaction model.

### Limitations

- One evaluator produced the expectation pass and had prior repository
  familiarity.
- The audit measured reachability, path structure, and presentation cues; it
  did not run a timed study with independent users.
- Click depth is evidence, not a standalone usability verdict. Predictability
  and recognition matter as much as the number of interactions.
- The audit intentionally excludes local untracked Topics, analytics, and
  speculative future content.
- Search ranking, exact taxonomy vocabulary, relationship authoring rules, and
  final UI composition require acceptance or focused follow-up validation.
