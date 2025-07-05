const db = require("../db/queries");

const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

async function serveHomePage(req, res) {
  const messages = await db.getAllMessages();
  console.log(req.user);
  res.render("index", {
    title: "The Clubhouse",
    text: "Welcome to the clubhouse.",
    text2: "Click here to sign-up",
    text3: "Click here to log in to view post authors.",
    messages: messages,
    signedIn: req.user ? true : false,
    user: req.user,
  });
}

async function signUpGet(req, res) {
  res.render("sign-up", {
    title: "Sign up",
    text: "Enter the form below to sign up to the clubhouse. ",
  });
}

async function signUpPost(req, res) {
  const errors = validationResult(req);
  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.render("sign-up", {
      title: "Sign up",
      text: "Complete the form below to sign up to the clubhouse.",
      errors: errors.array(),
      formData: req.body,
    });
  }

  const username = req.body.username;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const admin = req.body.admin;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await db.addUser(username, hashedPassword, first_name, last_name, admin);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}

async function logInGet(req, res) {
  res.render("log-in", {
    title: "Log in",
    text: "Enter your username and password below to log in to the Clubhouse. ",
  });
}

async function newMessageGet(req, res) {
  const user = req.user;
  res.render("new-message", {
    title: "New message",
    text: "Enter your message text below",
    user: user,
  });
  console.log(req.user);
}

async function newMessagePost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("new-message", {
      title: "New message",
      text: "Enter your message text below.",
      errors: errors.array(),
      formData: req.body,
      user: req.user,
    });
  }

  try {
    const id = req.user.id;
    const message = req.body.message;
    const date = new Date();

    await db.addMessage(id, message, date);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}

async function deleteMsgPost(req, res) {
  await db.deleteMessage(req.params.id);
  res.redirect("/");
}

async function joinClubGet(req, res) {
  res.render("join-club", {
    user: req.user,
  });
}

async function joinClubPost(req, res) {
  const user = req.user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("join-club", {
      title: "Sign up",
      text: "Complete the form below to sign up to the clubhouse.",
      errors: errors.array(),
      formData: req.body,
      user: user,
    });
  }

  try {
    const id = req.user.id;
    await db.upgradeToMember(id);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  serveHomePage,
  signUpGet,
  signUpPost,
  logInGet,
  deleteMsgPost,
  newMessageGet,
  newMessagePost,
  joinClubGet,
  joinClubPost,
};
