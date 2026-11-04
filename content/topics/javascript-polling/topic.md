---
id: '71f4a102-3d2d-432a-ae2c-67dd7991550f'
title: 'Polling without overlapping requests'
status: 'accepted'
summary: 'Schedule the next timeout after the current operation settles, with explicit stop and timeout policies.'
iconKey: 'concurrency'
domains:
  - 'javascript'
kind: 'pattern'
childTopicIds: []
relatedTopicIds: []
---

**To wait after each operation finishes, schedule the next timeout after `await`.** An interval does not wait for an async callback's Promise.

## Interval versus completion-based polling

With a **1-second interval** and a **3-second request**, multiple requests can be outstanding. This is overlapping asynchronous work, not simultaneous JavaScript callbacks.

![One shared time axis compares three-second requests: the interval starts requests at 0, 1, and 2 seconds, so they overlap. Completion-based polling runs the first request from 0 to 3 seconds, waits 1 second, then runs the second from 4 to 7 seconds. Times are illustrative, measured from the first request start.](polling-timing.svg)

**Completion-based cadence = operation time + delay + scheduling overhead.** A 3-second operation followed by a 1-second delay gives roughly 4 seconds between starts, not 1 second.

## Start and stop one poller

- `startPolling(...)` **sets up one poller** and returns its stop function.
- The nested `tick()` **runs one refresh**, waits for it to settle, then schedules
  the next tick—even after a failure.

`refresh()` must return a Promise covering the **whole operation**. `reportError` must not throw.

```js
function startPolling(refresh, reportError, delayMs = 1000) {
  let stopped = false;
  let timerId;

  async function tick() {
    try {
      await refresh();
    } catch (error) {
      reportError(error);
    } finally {
      if (!stopped) timerId = setTimeout(tick, delayMs);
    }
  }

  timerId = setTimeout(tick, delayMs);
  return () => {
    stopped = true;
    clearTimeout(timerId);
  };
}
```

**Start it, keep the returned function, then call that function to stop:**

```js
const stop = startPolling(refresh, reportError, 1000);

// Later:
stop();
```

The nested `tick` and the stop function share this call's `stopped` and `timerId`,
**even after `startPolling` returns**. Each new call creates separate poller state.

The first tick waits `delayMs`. **One poller does not overlap its `refresh` calls.**

## Two limits to handle

- Stopping prevents future ticks. It **does not abort a request already running**; that needs separate cancellation.
- A request that never settles prevents the next tick. Real polling needs an operation-timeout policy. **Timing out the wait does not cancel the underlying request**; abort it as appropriate if overlap must remain impossible.
