const express = require('express')
const router = express.Router()

router.get("/", (req,res) => {
	res.send("hello employees")
})

module.exports = router
// vim: tabstop=3
