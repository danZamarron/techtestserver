const { Router } = require('express');
const router  = new Router();

const {catchErrors} = require("../middlewares/index")

const {
    postSignUp,
    postLogin,
    getLogOut,
    getCurrentUser
} = require ("../controllers/auth")

router.post("/login", catchErrors(postLogin))
router.post("/signup", catchErrors(postSignUp))
router.get("/logout", getLogOut)
router.get("/currentUser", getCurrentUser)

module.exports = router;