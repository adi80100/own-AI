
import express from "express";
import { addKnowledge, getAllKnowledge, searchKnowledge } from "../controller/knowledgeController.js";



const router = express.Router();

router.route("/").post( addKnowledge);
router.route("/").get( getAllKnowledge);
router.route("/search").post(searchKnowledge);
export default router;
