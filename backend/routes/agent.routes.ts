import { Router, Request, Response } from "express";
import { agents } from "../models/agenStore";
import { PropertyAgent } from "../models/PropertyAgent";

const router = Router();

/**
 * CREATE
 */
router.post("/", (req: Request, res: Response) => {

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