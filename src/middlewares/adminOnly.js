const adminOnly = (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).send({ errorMessage: "Access denied" });
      }
      next();
    } catch (error) {
      return res.status(403).send({ errorMessage: "Access denied" });
    }
  };
  
  export default adminOnly;
  