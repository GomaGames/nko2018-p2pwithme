import { Router } from "express";

import store from "../store";

const router = Router();

router.get("/hosts", (req, res) => {
  res.json(store.connections);
});

export default router;
