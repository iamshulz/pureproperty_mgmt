import { Router, Request, Response } from "express";
import { families } from "../models/stores/familyStore";
import { properties } from "../models/stores/propertyStore";
import {v4 as uuidv4} from 'uuid';


const router = Router();

//Create Family
router.post("/", (req: Request, res: Response) => {
    const { propertyId, lastName } = req.body;

    // Check if Property exists via ID
    const propertyExists = properties.some((a) => a.id === propertyId);

    if (!propertyExists) {
        return res.status(404).json({ message: "Property not found" });
    }

    const now = new Date();
    const newFamily = {
        id: uuidv4(),
        propertyId: propertyId,
        lastName: lastName.trim(),
        createdAt: now,
        updatedAt: now,
    };
    
    families.push(newFamily);

    res.status(201).json(families);
});

//Show all
router.get("/", (_req: Request, res: Response) => {

    res.status(200).json(families);
});

//Show Family
router.get("/:id", (req: Request, res: Response) => {
    const family = families.find(a => a.id === req.params.id);

    if (!family) {
        return res.status(404).json({ message: "Family not found" });
    }
    res.json(family);
});

//Update Family via ID
router.put("/:id", (req: Request, res: Response) => {
    const family = families.find(a => a.id === req.params.id);

    if (!family) {
        return res.status(404).json({ message: "Family not found" });
    }

    //Extract and update dats
    const { firstName, lastName, mobileNumber, updatedAt } = req.body;


    family.lastName = lastName,
    family.updatedAt = new Date()

    res.json(family);
});

// Delete Family
router.delete("/:id", (req: Request, res: Response) => {
    const index = families.findIndex(a => a.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Agent not found" });
    }

    families.splice(index, 1);
    res.status(204).json({message: `Agent with id: ${req.params.id} deleted`});
});

export default router;