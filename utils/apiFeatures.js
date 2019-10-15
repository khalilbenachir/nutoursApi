const ApiFeatures = function(query, strQuery) {
    this.query = query;
    this.strQuery = strQuery;
    this.filter = function() {
      const queryObj = { ...this.strQuery };
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach(el => delete queryObj[el]);
  
      let queryJson = JSON.stringify(queryObj);
      queryJson = queryJson.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);
  
      this.query=this.query.find(JSON.parse(queryJson));
  
      return this;
    };
    this.sort = function() {
      if (this.strQuery.sort) {
        const sortedBy = this.strQuery.sort.split(",");
        console.log(sortedBy);
        sortedBy.map(el => (this.query = this.query.sort(el)));
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this;
    };
  
    this.limitedFields = function() {
      if (this.strQuery.fields) {
        let fields = this.strQuery.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
      return this;
    };
    this.pagination =  function() {
      const page = this.strQuery.page * 1 || 1;
      const limit = this.strQuery.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    };
};
  
module.exports = ApiFeatures;