# remix-event-stream

Utilities for easier integration of [_server sent events_](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
with [_remix_](https://remix.run/).

1. Create a [Resource Route:](https://remix.run/docs/en/main/guides/resource-routes#creating-resource-routes)

   ```ts
   // app/routes/time.sse.ts
   import { LoaderFunctionArgs } from "@remix-run/node";
   import { EventStream } from "remix-event-stream/server";

   // This loader returns an EventStream to allow for
   // server-sent events. It sends the time every 5 seconds.

   export function loader({ request }: LoaderFunctionArgs) {
     return new EventStream(request, (send) => {
       const timer = setInterval(() => {
         send(new Date().toISOString());
       }, 5_000);

       return () => {
         clearInterval(timer);
       };
     });
   }
   ```

2. Receive data in React:

   ```ts
   // app/routes/time.tsx
   import { useEventSource } from "remix-event-stream/browser";

   export default function TimeRoute() {
     const sseData = useEventSource({ url: "/time.see" });
     return sseData;
   }
   ```
