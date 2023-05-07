class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1a) Filtering
        const queryObject = {...this.queryString};
        //console.log(queryObject);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObject[el]);
        //console.log(this.query, queryObject);
        //console.log(queryObject);
        // 1b) Advanced filtering
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        //console.log(JSON.parse(queryString));
        this.query.find(JSON.parse(queryString));

        return this;
    }

    sort() {
        // 2) Sorting
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            //console.log(sortBy);
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        // 3) Limit
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v'); // exclude __v
        }
        return this;
    }

    paginate() {
        //4) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.queryString = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
