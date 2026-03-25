const { createHotItem, getLatestHotItems } = require("../services/hotService");

const listHotItems = async (_req, res, next) => {
  try {
    const items = await getLatestHotItems();
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const createManualHotItem = async (req, res, next) => {
  try {
    const item = await createHotItem(req.body || {});
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createManualHotItem,
  listHotItems,
};

