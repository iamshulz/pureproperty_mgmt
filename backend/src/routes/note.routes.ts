import { Router, Request, Response } from "express";
import { notes } from "../models/stores/noteStore";
import { agents } from "../models/stores/agentStore";
import { properties } from "../models/stores/propertyStore";
import {v4 as uuidv4} from 'uuid';


const router = Router();

//Create Note
router.post("/", (req: Request, res: Response) => {
    const { agentId, propertyId, description } = req.body;

    // Check if Property exists via ID
    const propertyExists = properties.some((a) => a.id === propertyId);
    const agentExists = agents.some((a) => a.id === agentId);

    if (!propertyExists) {
        return res.status(404).json({ message: "Property not found" });
    }
    if (!agentExists) {
        return res.status(404).json({ message: "Agent not found" });
    }

    const now = new Date();
    const newNote = {
        id: uuidv4(),
        propertyId: propertyId,
        agentId: agentId,
        description: description,
        createdAt: now,
        updatedAt: now,
    };

    notes.push(newNote);

    res.status(201).json(notes);
});

//Show all
router.get("/", (_req: Request, res: Response) => {

    res.status(200).json(notes);
});

//Show Note
router.get("/:id", (req: Request, res: Response) => {
    const note = notes.find(a => a.id === req.params.id);

    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
});

//Update Note via ID
router.put("/:id", (req: Request, res: Response) => {
    const note = notes.find(a => a.id === req.params.id);

    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }

    //Extract and update data
    const { description, agentId, propertyId } = req.body;

    note.agentId = agentId ?? note.agentId;
    note.propertyId = propertyId ?? note.propertyId;
    note.description = description ?? note.description;
    note.updatedAt = new Date()

    res.json(note);
});

//Delete Note
router.delete("/:id", (req: Request, res: Response) => {
    const index = notes.findIndex(a => a.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Note not found" });
    }

    notes.splice(index, 1);
    res.status(204).json({message: `Note with id: ${req.params.id} deleted`});
});

export default router;