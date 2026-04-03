import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import leadRoutes from "./routes/lead.routes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "API is running" });
});

app.use("/leads", leadRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});