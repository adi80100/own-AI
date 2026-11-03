
import  { Router } from "express";

import {
    insertVector,
    getAllVectors,
    getVectorById,
    searchVectors,
    insertMultipleVectors,
    deleteVector,
    updateVector
} from "../controller/vectorController.js";

const router = Router();

router.route("/bulk").post( insertMultipleVectors);

// Insert vector
router.route("/").post( insertVector);

// Get all vectors
router.route("/").get( getAllVectors);

// Get vector by ID
router.route("/:id").get( getVectorById);



router.route("/:id").put( updateVector);

router.route("/:id").delete( deleteVector);

// Search vectors
router.route("/search").post( searchVectors);

export default router;
