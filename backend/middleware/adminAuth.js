const createHttpError = require("../utils/httpError");

const getConfiguredAdminPassword = () => {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw createHttpError(500, "ADMIN_PASSWORD is missing. Add it to backend/.env.");
  }

  return password;
};

const requireAdmin = (req, _res, next) => {
  try {
    const configuredPassword = getConfiguredAdminPassword();
    const suppliedPassword = req.header("x-admin-password");

    if (!suppliedPassword || suppliedPassword !== configuredPassword) {
      throw createHttpError(401, "Invalid admin password.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfiguredAdminPassword,
  requireAdmin,
};

