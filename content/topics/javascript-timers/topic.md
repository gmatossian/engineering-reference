---
id: '52ff9588-9f91-4fa9-9181-2fdb53620d67'
title: 'Timers: delays and cancellation'
status: 'accepted'
summary: 'When timeout callbacks become eligible and what clearing a timer actually cancels.'
iconKey: 'timer'
domains:
  - 'javascript'
kind: 'concept'
childTopicIds:
  - '71f4a102-3d2d-432a-ae2c-67dd7991550f'
relatedTopicIds: []
---

**A timer delay is a scheduling threshold, not a reservation on the CPU.** Becoming eligible does not guarantee that the callback runs immediately.

## Zero delay still means later

```js
setTimeout(() => console.log('timer'), 0);
console.log('now');
// now → timer
```

`0` means later eligibility, **not immediate execution**. Busy JavaScript, queued work, background-tab throttling (browsers delaying timers in inactive tabs to save resources), and browser timer rules can all postpone execution.

## Cancel future callbacks

```js
const timerId = setTimeout(showReminder, 500);
clearTimeout(timerId); // Prevent the pending callback.
```

Clear obsolete timers when **a component is destroyed** or **newer input supersedes old work**.

- **`clearTimeout(id)`:** cancel a pending timeout callback.
- **`clearInterval(id)`:** stop future interval callbacks.

> Clearing a timer **does not undo an executed callback** or **cancel a request it already started**. Cancel that operation separately.

## Repeated ticks do not await requests

`setInterval` schedules repeated callbacks. The callbacks execute **one at a time on this JS thread**, but asynchronous operations started by different ticks **can overlap**. For request polling, see the child topic.
