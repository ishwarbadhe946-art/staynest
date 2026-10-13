const router = require("express").Router();
const c = require("../controllers/hostelController");

router.get("/", c.getAllHostels);
router.get("/:id", c.getHostelById);
router.post("/", c.createHostel);
router.put("/:id", c.updateHostel);
router.delete("/:id", c.deleteHostel);

module.exports = router;
