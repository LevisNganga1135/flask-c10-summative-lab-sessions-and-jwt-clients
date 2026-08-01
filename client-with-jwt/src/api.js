// In local dev, leave REACT_APP_API_URL unset and the proxy in package.json
// handles it. In production this falls back to the deployed Render backend
// regardless of whether the env var made it into the build.
export const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://workout-tracker-api-dyre.onrender.com"
    : "");

