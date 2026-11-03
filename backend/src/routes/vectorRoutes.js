
import  { Router } from "express";

import {
    insertVector,
    getAllVectors,
    getVectorById,
    searchVectors,
    insertMultipleVectors,
    deleteVector,
    updateVector,
    getPaginatedVectors,
    searchMetadata,
    benchmarkVectors
} from "../controller/vectorController.js";

const router = Router();

router.route("/bulk").post( insertMultipleVectors);

router.route("/search").post( searchVectors);

router.route("/paginate").get( getPaginatedVectors);

router.route("/").get( getAllVectors);

router.route("/").post( insertVector);

router.route("/metadata/search").get( searchMetadata);

router.route("/benchmark").post( benchmarkVectors);

router.route("/:id").get( getVectorById);

router.route("/:id").put( updateVector);

router.route("/:id").delete( deleteVector);

// Search vectors

export default router;
