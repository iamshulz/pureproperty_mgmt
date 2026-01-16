import { Router, Request, Response } from "express";
import { agents } from "../models/agenStore";
import { PropertyAgent } from "../models/PropertyAgent";

const router = Router();

/**
 * CREATE
 */
router.post("/", (req: Request, res: Response) => {
    const { firstName, lastName, email } = req.body;

    // Check if mail already exists
    const emailExists = agents.some(a => a.email === email);
    if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
    }

    
});

//SHOW ALL
router.get("/", (_req: Request, res: Response) => {

});

//Show One :id
router.get("/:id", (req: Request, res: Response) => {

});

//Update Item
router.put("/:id", (req: Request, res: Response) => {

});

/// Delte Item
router.delete("/:id", (req: Request, res: Response) => {

});

export default router;