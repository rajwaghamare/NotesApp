import { setCORS, handlePreflight } from "../lib/cors.js";

export default function handler(req, res) {
  // Preflight request (OPTIONS) handle karo
  if (handlePreflight(req, res)) return;

  // Normal requests ke liye CORS headers set karo
  setCORS(res);

  res.status(200).json({ status: "ok" });
}
