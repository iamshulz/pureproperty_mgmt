import { Router, Request, Response } from "express";
import { families } from "../models/stores/familyStore";
import { tenants } from "../models/stores/tenantStore";
import {v4 as uuidv4} from 'uuid';


const router = Router();

//Create Tenant
router.post("/", (req: Request, res: Response) => {
    const { familyId , firstName, middleName, lastName } = req.body;

    // Check if Family exists via ID
    const familyExists = families.some((a) => a.id === familyId);

    if (!familyExists) {
        return res.status(404).json({ message: "Family ID not found" });
    }

    const now = new Date();
    const newTenant = {
        id: uuidv4(),
        familyId: familyId,
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        createdAt: now,
        updatedAt: now
    };

    tenants.push(newTenant);

    res.status(201).json(tenants);
});

//Show all
router.get("/", (_req: Request, res: Response) => {

    res.status(200).json(tenants);
});

//Show Tenant
router.get("/:id", (req: Request, res: Response) => {
    const tenant = tenants.find(a => a.id === req.params.id);

    if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
    }
    res.json(tenant);
});

//Update Tenant via ID
router.put("/:id", (req: Request, res: Response) => {
    const tenant = tenants.find(a => a.id === req.params.id);

    if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
    }

    //Extract and update dates
    const { firstName, middleName, lastName, familyId } = req.body;

    tenant.familyId = familyId ?? tenant.familyId;
    tenant.firstName = firstName ?? tenant.firstName;
    tenant.middleName = middleName ?? tenant.middleName;
    tenant.lastName = lastName ?? tenant.lastName;
    tenant.updatedAt = new Date();

    res.json(tenant);
});

// Delete Tenant
router.delete("/:id", (req: Request, res: Response) => {
    const index = tenants.findIndex(a => a.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Tenant not found" });
    }

    tenants.splice(index, 1);
    res.status(204).json({message: `Tenant with id: ${req.params.id} deleted`});
});

export default router;