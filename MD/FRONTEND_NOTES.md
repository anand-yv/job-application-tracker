## Axios instance + request interceptor

### The problem it solves
Every authenticated request to the backend needs an `Authorization: Bearer <token>`
header. Without a shared setup, you'd have to manually add that header in every
single API call across every page — repetitive and easy to forget on one call.

### How it works
- `axios.create({...})` makes a **configured instance** (baseURL, timeout, default
  headers) instead of using the global `axios` object directly — so every file
  that imports this instance automatically gets the same config.
- `instance.interceptors.request.use(onFulfilled, onRejected)` registers a function
  that runs **before every outgoing request**, letting you modify the request
  config (e.g. inject headers) in one place.
- The `onFulfilled` function receives `config` (the request's settings object) and
  **must return it** (modified or not) — forgetting to return breaks every request
  silently.
- The `onRejected` function handles failures in *building* the request itself
  (rare) — `Promise.reject(error)` correctly propagates the failure instead of
  swallowing it.

### Key pieces used
```js
baseURL: import.meta.env.VITE_API_URL   // Vite's way of reading .env values,
                                          // must be prefixed with VITE_ to be
                                          // exposed to client-side code
timeout: 5000                            // fail fast instead of hanging forever
                                          // if backend is down/unreachable
```

### Gotcha avoided
Used a `TOKEN_KEY` constant (`src/constants.js`) instead of the raw string
`"access_token"` scattered across files (interceptor, Login page, logout logic).
One typo or rename in one spot = silent auth bugs that are hard to trace.
Same principle as backend: JWT expiration lives in `application.properties`,
not hardcoded — one source of truth, change it once.

### Analogy to backend
This interceptor is like `JwtAuthFilter` but on the *sending* side instead of
the *receiving* side — JwtAuthFilter reads the incoming Authorization header
and validates it; this interceptor writes the outgoing Authorization header
before the request even leaves the browser.