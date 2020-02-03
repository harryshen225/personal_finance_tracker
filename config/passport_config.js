const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../models");
const passport = require("passport");



const authenticateUser = async (email, password, done) => {
  const user = await db.User.findOne({
    Where: {
      email: email
    }
  })
  if (!user) {
    return done(null, false, { message: "No user found" })
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user)
    } else {
      return done(null, false, { message: "password not matching" })
    }

  } catch (err) {
    return done(err);
  }
}
passport.use(new LocalStrategy({ usernameField: `email` }, authenticateUser));
passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;