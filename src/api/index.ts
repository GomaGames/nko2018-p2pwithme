import { Router } from "express";

import store from "../store";
import { access } from "fs";

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
  const accessToken = parseAuthorizationHeader(req.headers.authorization);
  if (!accessToken) {
    throw new Error(`Unauthorized`);
  }

  const host = store.unregister(accessToken);
  res.json(host);
});

/**
 * Retrieves the access token stored with the host action connection.
 * @param authorizationHeader The Bearer Token string to parse the credentials from
 */
function parseAuthorizationHeader(authorizationHeader?: string) {
  if (!authorizationHeader) {
    return null;
  }

  const matches = /^Bearer (.*)$/.exec(authorizationHeader);

  if (!matches) {
    return null;
  } else {
    return matches[1];
  }
}

export default router;
