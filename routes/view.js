const express = require("express");
const router = express.Router();
const viewContorller = require('../controllers/viewController');


router.get("/",viewContorller.getOverview);

router.get("/tour/:slug", viewContorller.getTour);

module.exports = router;
