const { Router } = require("express");

const usersRouter = Router();

const usersController = require("../controllers/userController");

const db = require("../db/queries");

const { body, validationResult } = require("express-validator");

const passport = require("passport");

const validationRulesSignUp = [
  body("username")
    .trim()
    .escape()
    .toLowerCase()
    .notEmpty()
    .withMessage("Username is a required field.")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Username can only contain letters and numbers.")
    .isLength({ min: 4, max: 14 })
    .withMessage("Username can only be between 4 and 14 characters long."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/(?=.*[a-z])/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/(?=.*\d)/)
    .withMessage("Password must contain at least one number.")
    .matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage("Password must contain at least one special character."),
  body("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        "Passwords do not match. Please enter matching passwords to continue."
      );
    }
    return true;
  }),
  body("first_name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("First Name is a required field.")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("First Name can only contain letters.")
    .isLength({ min: 1, max: 50 })
    .withMessage("First Name must be less than 50 characters long."),
  body("last_name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Last Name is a required field.")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Last Name can only contain letters.")
    .isLength({ min: 1, max: 50 })
    .withMessage("Last Name must be less than 50 characters long."),
];

const validationRulesNewMessage = [
  body("message")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please enter your message below.")
    .isLength({ min: 1, max: 200 })
    .withMessage("Your message must be less than 200 characters long."),
];

const validationRulesJoinClub = [
  body("joinclub")
    .trim()
    .notEmpty()
    .withMessage("Please enter the secret code.")
    .custom((value, { req }) => {
      if (value !== "Odin") {
        throw new Error("Invalid code. Please try again.");
      }
      return true;
    }),
];

usersRouter.get("/", usersController.serveHomePage);

usersRouter.get("/sign-up", usersController.signUpGet);

usersRouter.post("/sign-up", validationRulesSignUp, usersController.signUpPost);

usersRouter.get("/log-in", usersController.logInGet);

usersRouter.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.render("log-in", {
        title: "Log in",
        text: "Enter your username and password below to log in to the Clubhouse. ",
        errors: [{ msg: "Invalid login details, please try again." }],
      });
    }
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

usersRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

usersRouter.get("/new-message", usersController.newMessageGet);

usersRouter.post(
  "/new-message",
  validationRulesNewMessage,
  usersController.newMessagePost
);

usersRouter.get("/join-club", usersController.joinClubGet);

usersRouter.post(
  "/:id/join-club",
  validationRulesJoinClub,
  usersController.joinClubPost
);
usersRouter.post("/:id/delete-msg", usersController.deleteMsgPost);

module.exports = usersRouter;
