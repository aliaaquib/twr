const createHttpError = require("../utils/httpError");
const { getConfiguredAdminPassword } = require("../middleware/adminAuth");

const loginAdmin = async (req, res, next) => {
  try {
    const submittedPassword = req.body?.password;
    const configuredPassword = getConfiguredAdminPassword();

    if (!submittedPassword || submittedPassword !== configuredPassword) {
      throw createHttpError(401, "Invalid admin password.");
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
};
