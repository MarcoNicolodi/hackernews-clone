const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');


async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    user,
    token,
  };
}

async function login(parent, args, context, info) {
  const user = await context.db.query.user({ where: { email: args.email } }, '{ id password }');
  if (!user) {
    throw new Error('Invalid user');
  }

  const isValid = bcrypt.compare(args.password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    user,
    token,
  };
}

function post(parent, args, context, info) {
  const userId = getUserId(context);
  return context.db.mutation.createLink(
    {
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
      },
    },
    info,
  );
}


module.exports = {
  login,
  signup,
  post,
};
