const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Check username
  User.findOne({ username: req.body.username }).exec()
    .then(user => {
      if (user) {
        res.status(400).send({ message: "Username is already in use!" });
        return;
      }

      // Check email
      User.findOne({ email: req.body.email }).exec()
        .then(user => {
          if (user) {
            res.status(400).send({ message: "Email is already in use!" });
            return;
          }
          next();
        })
        .catch(err => {
          res.status(500).send({ message: err });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
