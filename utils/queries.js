exports.filterByDateRange = (query, startDate, endDate) => {
  if (startDate && endDate) {
    query.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
  } else if (startDate) {
    query.find({
      createdAt: { $gte: new Date(startDate) },
    });
  } else if (endDate) {
    query.find({
      createdAt: { $lte: new Date(endDate) },
    });
  }
  return query;
};

exports.searchByText = (query, fields, searchText) => {
  if (searchText) {
    const searchRegex = new RegExp(searchText, "i");
    const searchConditions = fields.map((field) => ({
      [field]: { $regex: searchRegex },
    }));
    query.find({ $or: searchConditions });
  }
  return query;
};

exports.populateReferences = (query, references) => {
  if (references) {
    const populateOptions = references.split(",").map((ref) => ({
      path: ref,
      select: "name", // Default select, can be customized
    }));
    query.populate(populateOptions);
  }
  return query;
};
