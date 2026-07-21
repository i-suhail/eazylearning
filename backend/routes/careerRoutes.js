const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { submitCareer } = require("../controllers/careerController");
router.post("/", upload.single("resume"), submitCareer);
module.exports = router;