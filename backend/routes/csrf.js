const { Router } = require("express");

const router = Router();

/**
 * {{url}}/api/csrf
 */

//  token csrf
router.get("/getCSRFToken", (req, res) => {
  try {
    // res.cookie("XSRF-TOKEN", req.csrfToken());
    console.log("CSRF GET TOKENN");

    // console.log("_csrf-my-app", req.cookies["_csrf-my-app"]);
    // console.log({ csrfToken: req.csrfToken() });
    res.json({ csrfToken: req.csrfToken() });
  } catch (err) {
    next(err); // handleError middleware
  }
});

//  token delete csrf
router.get("/deleteCSRFToken", (req, res) => {
  // res.cookie("XSRF-TOKEN", req.csrfToken());
  console.log("CSRF GET TOKENN DELETE");
  try {
    return res
      .clearCookie("_csrf-my-app", {
        httpOnly: true, // dont read JS
        secure: process.env.SECURE_COOKIES === "true" ? true : false, //http"S"
        sameSite: process.env.SAMESITE_COOKIES === "true" ? true : "none",
      })
      .status(200)
      .json({ message: "Success Loggedout" });
  } catch (err) {
    next(err); // handleError middleware
  }
});

module.exports = router;
