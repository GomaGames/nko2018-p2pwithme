import { Router } from "express";

import store from "../store";

const router = Router();

/**
 * Displays host connections
 */
router.get("/hosts", (req, res) => {
  res.json(store.connections);
});

/**
 * Handles a host connection request
 */
router.post("/connect", (req, res) => {
  if (!req.body.entry_url) {
    throw new Error(`Invalid request: ${req.body}`);
  }
  const host = store.register({
    display_name: req.body.display_name,
    entry_url: req.body.entry_url
  });
  res.json(host);
});

/**
 * Handles a host connection request
 */
router.post("/disconnect", (req, res) => {
  if (!req.body.id) {
    throw new Error(`Invalid request: ${req.body}`);
  }
  const host = store.register({
    display_name: req.body.display_name,
    entry_url: req.body.entry_url
  });
  res.json(host);
});

export default router;
