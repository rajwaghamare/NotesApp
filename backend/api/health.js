import { setCORS, handlePreflight } from '../lib/cors.js';

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  setCORS(res);
  res.status(200).json({ status: 'ok' });
}
