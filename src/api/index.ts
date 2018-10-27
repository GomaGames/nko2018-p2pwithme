import { Router } from "express";

import store from "../store";

const router = Router();

/**
 * Displays host connections
 */
router.get("/hosts", (req, res) => {
  res.json(store.connections);
});

router.post("/hosts", (req, res) => {
  if (!req.body.hostname) {
    throw new Error(`Invalid request: ${req.body}`);
  }
  const host = store.register({
    endpoint: req.body.hostname
  });
  res.json(host);
});

export default router;
