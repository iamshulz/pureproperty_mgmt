import { Router, Request, Response } from "express";
import { properties } from "../models/stores/propertyStore";
import { agents } from "../models/stores/agentStore";
import {v4 as uuidv4} from 'uuid';
import validator from "validator";

const router = Router();

router.post("/", (req: Request, res: Response) => {
    const { agentId, title } = req.body as { agentId?: string; title?: string };

    // Basic presence checks
    if (!agentId || !title) {
        return res.status(400).json({
            message: "agentId and title are required",
        });
    }

    // Check if PropertAgent exists via ID
    const agentExists = agents.some((a) => a.id === agentId);

    if (!agentExists) {
        return res.status(404).json({ message: "Agent not found" });
    }

    // Create property
    const now = new Date();
    const newProperty = {
        id: uuidv4(),
        agentId: agentId,
        title: title.trim(),
        createdAt: now,
        updatedAt: now,
    };

    properties.push(newProperty);

    return res.status(201).json(newProperty);
});

router.get("/", (_req: Request, res: Response) => {

    res.status(200).json(properties);
});

router.get("/:id", (req: Request, res: Response) => {
    const property = properties.find(a => a.id === req.params.id);

    if (!property) {
        return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
});


router.put("/:id", (req: Request, res: Response) => {
    const property = properties.find(a => a.id === req.params.id);

    if (!property) {
        return res.status(404).json({ message: "Property not found" });
    }

    //Extract and update dats
    const { title } = req.body;

    property.title = title
    property.updatedAt = new Date(),

    res.json(property);
});

router.delete("/:id", (req: Request, res: Response) => {
    const index = properties.findIndex(a => a.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Property not found" });
    }

    properties.splice(index, 1);
    res.status(204).json({message: `Property with id: ${req.params.id} deleted`});
});

export default router;