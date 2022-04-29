const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const SaucesCtrl = require("../controllers/sauces");

router.get("/", auth, SaucesCtrl.getSauces);
router.get("/:id", auth, SaucesCtrl.getOneSauce);
router.post("/", auth, multer, SaucesCtrl.createSauce);
router.post("/:id/like", auth, SaucesCtrl.likeSauce);
router.put("/:id", auth, multer, SaucesCtrl.modifySauce);
router.delete("/:id", auth, SaucesCtrl.deleteSauce);

module.exports = router;
