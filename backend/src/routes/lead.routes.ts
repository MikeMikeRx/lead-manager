import { Router } from "express";
import { createLead, getLeads } from "../controllers/lead.controller";

const router = Router();

router.post("/", createLead);
router.get("/", getLeads);

export default router;