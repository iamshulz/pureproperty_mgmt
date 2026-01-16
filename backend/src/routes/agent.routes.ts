import { Router, Request, Response } from "express";
import { agents } from "../models/stores/agentStore";
import { PropertyAgent } from "../models/PropertyAgent";
import {v4 as uuidv4} from 'uuid';
import validator from "validator";

const router = Router();

//Create an agent
router.post("/", (req: Request, res: Response) => {
    const { firstName, lastName, email, mobileNumber } = req.body;

    // Check if mail already exists
    const emailExists = agents.some(a => a.email === email);
    // Check if format is correct
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
    }

    // Push to array
    const agent = {
        id: uuidv4(),
        firstName,
        lastName,
        email,
        mobileNumber,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    agents.push(agent);

    res.status(201).json(agent);
});

//Show all agents
router.get("/", (_req: Request, res: Response) => {

    res.status(200).json(agents);
});

//Show Agent
router.get("/:id", (req: Request, res: Response) => {
    const agent = agents.find(a => a.id === req.params.id);

    if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
    }
    res.json(agent);
});

//Update Agent via ID
router.put("/:id", (req: Request, res: Response) => {
    const agent = agents.find(a => a.id === req.params.id);

    if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
    }

    //Extract and update dats
    const { firstName, lastName, mobileNumber, updatedAt } = req.body;

    agent.firstName = firstName ?? agent.firstName;
    agent.lastName = lastName ?? agent.lastName;
    agent.mobileNumber = mobileNumber ?? agent.mobileNumber;
    agent.updatedAt = new Date(),

    res.json(agent);
});

/// Delte Agent
router.delete("/:id", (req: Request, res: Response) => {
  const index = agents.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Agent not found" });
  }

  agents.splice(index, 1);
  res.status(204).json({message: `Agent with id: ${req.params.id} deleted`});
});

export default router;