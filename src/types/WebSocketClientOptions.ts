import { TokenProvider } from "./TokenProvider";

export type WebSocketClientOptions = {
  /** Full ws(s):// URL, or base URL; token will be appended as ?token=... */
  url: string;
  /** Provide access token (e.g., from your auth store). Return null/empty to skip connecting. */
  getToken: TokenProvider;
  /** Optional override for environments/tests. Defaults to globalThis.WebSocket. */
  WebSocketImpl?: typeof WebSocket;
  /** Heartbeat interval in ms. Default: 10_000 */
  heartbeatMs?: number;
  /** Max reconnect attempts with backoff. Default: 10 */
  maxReconnects?: number;
  /** Optional logger */
  log?: (...args: any[]) => void;
};