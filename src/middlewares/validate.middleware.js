const validate = (schema) => (req, res, next) => {
  if (!req.body) return res.status(400).send({ message: "Invalid request" });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validate;
