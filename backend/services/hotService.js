const HotItem = require("../models/HotItem");
const createHttpError = require("../utils/httpError");

const trimHotItemsIfNeeded = async () => {
  const count = await HotItem.countDocuments();

  if (count <= 10) {
    return;
  }

  const oldestItems = await HotItem.find()
    .sort({ createdAt: 1 })
    .limit(3)
    .select("_id")
    .lean();

  if (oldestItems.length === 0) {
    return;
  }

  await HotItem.deleteMany({
    _id: {
      $in: oldestItems.map((item) => item._id),
    },
  });
};

const createHotItem = async ({ title, source, tag, url }) => {
  const trimmedTitle = title?.trim();
  const trimmedSource = source?.trim();
  const trimmedTag = tag?.trim();
  const trimmedUrl = url?.trim();

  if (!trimmedTitle || !trimmedSource || !trimmedTag || !trimmedUrl) {
    throw createHttpError(400, "Title, source, tag, and url are required.");
  }

  const item = await HotItem.create({
    title: trimmedTitle,
    source: trimmedSource,
    tag: trimmedTag,
    url: trimmedUrl,
  });

  await trimHotItemsIfNeeded();

  return item;
};

const getLatestHotItems = async () => {
  return HotItem.find().sort({ createdAt: -1 }).limit(10).lean();
};

module.exports = {
  createHotItem,
  getLatestHotItems,
};
