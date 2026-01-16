import { Router, Request, Response } from "express";
import { agents } from "../models/stores/agentStore";
import { properties } from "../models/stores/propertyStore";
import { reminders } from "../models/stores/reminderStore";
import {v4 as uuidv4} from 'uuid';
import validator from "validator";

const router = Router();

//Create an agent
router.post("/", (req: Request, res: Response) => {
    const { email, propertyId, propertyName, title, eventDate } = req.body;

    // Check if an agent exists (via email record) and a property exists via ID
    const foundAgent = agents.find(a => a.email === email);

    const property = properties.find(p => p.title === propertyName);
    let propertyExists = properties.some(a => a.id === property?.id);
    
    if (!propertyExists) {
        propertyExists = properties.some(a => a.id === propertyId);
    }

    if (!foundAgent) {
        return res.status(404).json({ message: "Agent with this email is not found" });
    }
    if (!propertyExists) {
        return res.status(404).json({ message: "Property not found" });
    }

    // Push to array
    const now = new Date();
    const reminder = {
        id: uuidv4(),
        agentId: foundAgent.id,
        propertyId,
        title: title.trim(),
        eventDate,
        isCompleted: false,
        createdAt: now,
        updatedAt: now
    };

    reminders.push(reminder);

    res.status(201).json(reminder);
    console.log(reminder);
});

//Find all reminders for an agent
router.get("/", (_req: Request, res: Response) => {
    const { agentId, email } = _req.body;
    const foundAgent = agents.find(a => a.email === email);
    console.log(foundAgent);
    const reminderList = reminders.filter(r => r.agentId === foundAgent?.id)


    res.status(200).json(reminderList);
    console.log(reminderList);
});

//Update Agents Reminder
router.put("/:id", (req: Request, res: Response) => {
    const reminder = reminders.find(a => a.id === req.params.id);
    const { agentId, propertyId, title, eventDate, isCompleted } = req.body;

    if (!reminder) {
        return res.status(404).json({ message: "Agent reminder not found" });
    }

    reminder.agentId = agentId ?? reminder.agentId;
    reminder.propertyId = propertyId ?? reminder.propertyId;
    reminder.title = title ?? reminder.title;
    reminder.eventDate = eventDate ?? reminder.eventDate;
    reminder.updatedAt = new Date();
    reminder.isCompleted = isCompleted ?? reminder.isCompleted;

    res.json(reminder);
    console.log(reminder);
})


export default router;