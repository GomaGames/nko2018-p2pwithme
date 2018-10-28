import { Router } from "express";

import store from "../store";
import { ClientHost } from "../../types";

const router = Router();

/**
 * Displays host connections
 */
router.get("/hosts", (req, res) => {
  const filters = req.query;
  const filterKeys = Object.keys(filters);
  let hosts: Partial<ClientHost>[] = store.hosts.map(scrubAccessToken);

  if (filterKeys.length > 0) {
    hosts = hosts.filter(host =>
      filterKeys.every(key => host[key] === filters[key])
    );
  }
  res.json(hosts);
});

/**
 * Handles a host connection request
 */
router.post("/connect", (req, res) => {
  if (!req.body.entry_url) {
    throw new Error(`Invalid request: ${req.body}`);
  }

  const host = store.register(req.body);
  res.json(host);
});

/**
 * Handles updating an existing host
 */
router.patch("/host/:hostId", (req, res) => {
  const { hostId } = req.params;
  const accessToken = parseAuthorizationHeader(req.headers.authorization);

  if (!accessToken) {
    throw new Error(`Unauthorized`);
  }

  if (!hostId) {
    throw new Error("Not Found");
  }
  if (!req.body) {
    throw new Error("Unprocessable Entity");
  }

  const host = store.update(hostId, req.body, accessToken);
  if (host) {
    res.json(scrubAccessToken(host));
  }
  {
    throw new Error("Not Found");
  }
});

/**
 * Handles a host connection request
 */
router.post("/host/:hostId/disconnect", (req, res) => {
  const { hostId } = req.params;
  const accessToken = parseAuthorizationHeader(req.headers.authorization);
  if (!accessToken) {
    throw new Error(`Unauthorized`);
  }

  if (!hostId) {
    throw new Error("Not Found");
  }

  const host = store.unregister(accessToken);
  if (host) {
    return res.json(scrubAccessToken(host));
  } else {
    throw new Error("Not Found");
  }
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

function scrubAccessToken(connection: ClientHost): Partial<ClientHost> {
  const { access_token, ...scrubbedConnection } = connection;

  return scrubbedConnection;
}

export default router;
