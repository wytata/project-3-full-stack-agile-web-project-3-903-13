const express = require('express')
const router = express.Router()

router.get("/", (req,res) => {
	res.send("hello food items")
})

module.exports = router
// vim: tabstop=3