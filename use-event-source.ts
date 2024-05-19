import { createContext, useContext, useEffect, useState } from "react";

const eventSourcesContext = createContext<
  Map<string, { count: number; source: EventSource }>
>(new Map());

export const useEventSource = <
  SSEData extends Record<string, unknown> = never,
>({
  url,
  channel = "message",
}: {
  url: string;
  channel?: string;
}) => {
  const map = useContext(eventSourcesContext);
  const [data, setData] = useState<SSEData | null>(null);

  useEffect(() => {
    const value = map.get(url) ?? {
      count: 0,
      source: new EventSource(url),
    };
    ++value.count;
    map.set(url, value);

    function handler(event: MessageEvent) {
      const data = JSON.parse(event.data as string) as SSEData;
      setData(data);
    }

    value.source.addEventListener(channel, handler);

    return () => {
      value.source.removeEventListener(channel, handler);
      --value.count;
      if (value.count <= 0) {
        value.source.close();
        map.delete(url);
      }
    };
  }, [channel, map, url]);

  return data;
};
