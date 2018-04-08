const jwt = require('jsonwebtoken');

const APP_SECRET = 'GraphQL-is-aw3some';

function getUserId(context) {
  const Authorization = context.request.get('Authorization');
  if (!Authorization) {
    throw new Error('Not authenticated');
  }

  const token = Authorization.replace('Bearer ', '');
  const { userId } = jwt.verify(token, APP_SECRET);
  return userId;
}

module.exports = {
  getUserId,
  APP_SECRET,
};
