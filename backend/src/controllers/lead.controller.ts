import { Prisma, LeadStatus } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const allowedStatuses = Object.values(LeadStatus);

export const createLead = async (req: Request, res: Response) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const rawStatus = req.body.status;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    let status: LeadStatus = LeadStatus.NEW;

    if (rawStatus !== undefined) {
      if (typeof rawStatus !== "string" || !allowedStatuses.includes(rawStatus as LeadStatus)) {
        return res.status(400).json({
          message: "Invalid status value",
          allowedValues: allowedStatuses,
        });
      }

      status = rawStatus as LeadStatus;
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        status,
      },
    });

    return res.status(201).json(lead);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ message: "Email already exists" });
    }

    console.error("Create lead error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(leads);
  } catch (error) {
    console.error("Get leads error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};