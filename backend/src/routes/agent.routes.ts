import { Router, Request, Response } from "express";
import { agents } from "../models/agentStore";
import { PropertyAgent } from "../models/PropertyAgent";
import {v4 as uuidv4} from 'uuid';
import validator from "validator";

const router = Router();

/**
 * CREATE
 */
router.post("/", (req: Request, res: Response) => {
    const { firstName, lastName, email, mobileNumber } = req.body;

    // Check if mail already exists
    const emailExists = agents.some(a => a.email === email);

    if (!validator.isEmail(email)) {
        console.log(email);
        console.log(validator.isEmail(email))
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
    }

    // Push to array
    const agent: PropertyAgent = {
        id: uuidv4(),
        firstName,
        lastName,
        email,
        mobileNumber
    };

    agents.push(agent);

    res.status(201).json(agent);
});

//SHOW ALL
router.get("/", (_req: Request, res: Response) => {

    res.status(200).json(agents);
});

//Show One :id
router.get("/:id", (req: Request, res: Response) => {
    const agent = agents.find(a => a.id === req.params.id);

    if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
    }
    res.json(agent);
});

//Update Item
router.put("/:id", (req: Request, res: Response) => {

});

/// Delte Item
router.delete("/:id", (req: Request, res: Response) => {

});

export default router;