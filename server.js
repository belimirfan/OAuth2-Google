const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const app = express();

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: "Client - ID",
      clientSecret: "Secret code",
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

// Home
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

// Redirect to Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Google callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  },
);

// Protected page
app.get("/profile", (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }
  res.send("Welcome " + req.user.displayName);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
