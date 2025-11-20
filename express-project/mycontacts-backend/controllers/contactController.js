const asyncHandler = require('express-async-handler');
const pool = require('../config/dbConnection'); // use correct path

const getContacts = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM contacts ORDER BY id ASC');
  res.status(200).json(result.rows);
});

const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    res.status(404);
    throw new Error('Contact not found');
  }
  res.status(200).json(result.rows[0]);
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('All fields are mandatory!');
  }

  const result = await pool.query(
    'INSERT INTO contacts (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
    [name, email, phone]
  );

  res.status(201).json(result.rows[0]);
});

const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const existing = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
  if (existing.rows.length === 0) {
    res.status(404);
    throw new Error('Contact not found');
  }

  const result = await pool.query(
    'UPDATE contacts SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *',
    [name, email, phone, id]
  );

  res.status(200).json(result.rows[0]);
});

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
  if (existing.rows.length === 0) {
    res.status(404);
    throw new Error('Contact not found');
  }

  await pool.query('DELETE FROM contacts WHERE id=$1', [id]);
  res.status(200).json({ message: `Deleted contact ${id}` });
});

module.exports = {
  getContact,
  createContact,
  getContacts,
  updateContact,
  deleteContact,
};
