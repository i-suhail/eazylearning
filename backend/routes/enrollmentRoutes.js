const express = require("express");
const router = express.Router();
const {
    saveEnrollment,
    getEnrollments,
    getEnrollmentById,
    updateEnrollmentStatus,
    updateEnrollment,
    deleteEnrollment,
    getDashboardStats
} = require("../controllers/enrollmentController");
router.post("/enroll", saveEnrollment);
router.get("/enrollments", getEnrollments);
router.get("/enrollments/:id", getEnrollmentById);
router.patch("/enrollments/:id/status", updateEnrollmentStatus);
router.put("/enrollments/:id", updateEnrollment);
router.delete("/enrollments/:id", deleteEnrollment);
router.get("/dashboard/stats", getDashboardStats);
module.exports = router;