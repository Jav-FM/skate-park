const { getUserDB } = require('../database');

const getUsers = async (req, res) => {
  const response = await getUserDB;
  if (!response.ok) {
    return res.status(500).json({ error: response.error });
  }
  return res.json({ data: response.data });
};

module.exports = { getUsers };
