import { Router, Request, Response } from "express";
import { notes } from "../models/stores/noteStore";
import { agents } from "../models/stores/agentStore";
import { properties } from "../models/stores/propertyStore";
import {v4 as uuidv4} from 'uuid';


const router = Router();

//Create Note
router.post("/", (req: Request, res: Response) => {
    const { description, email, propertyName } = req.body;

    const foundAgent = agents.find(a => a.email === email);
    const foundProperty = properties.find(p => p.title === propertyName);

    if (!foundAgent || !foundProperty) {
        return res.status(404).json({ message: "Agent or Property not found" });
    }

    const now = new Date();
    const newNote = {
        id: uuidv4(),
        propertyId: foundProperty?.id,
        agentId: foundAgent.id,
        description: description,
        createdAt: now,
        updatedAt: now,
    };

    notes.push(newNote);

    res.status(201).json(notes);
});

//Show Via Email
router.post("/email", (_req: Request, res: Response) => {

    const { email } = _req.body;

    const foundAgent = agents.find(a => a.email === email);
    const notesList = notes.filter(n => n.agentId === foundAgent?.id)

    res.status(200).json(notesList);
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