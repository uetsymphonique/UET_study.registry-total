const {filter} = require('compression');

class APIFeatures_aggregate {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    prefilter(prefilterFields) {
        const queryObject = {...this.queryString};
        const includedFields = [...prefilterFields];
        const prefilterObject = {};
        includedFields.forEach(field => {
            if (queryObject[field]){
                prefilterObject[field] = queryObject[field];
            }
        });
        let queryString = JSON.stringify(prefilterObject);
        //console.log(queryString);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        queryString = queryString.replace(/"(\d+)"/g, "$1");
        this.query.match(JSON.parse(queryString));
        return this;
    }
    filter(prefilterFields) {
        // 1a) Filtering
        const queryObject = {...this.queryString};
        // console.log(queryObject);
        const excludedFields = ['page', 'sort', 'limit', 'fields', ...prefilterFields];
        excludedFields.forEach((el) => delete queryObject[el]);
        //console.log(this.query, queryObject);
        //console.log(queryObject);
        // 1b) Advanced filtering
        let queryString = JSON.stringify(queryObject);
        //console.log(queryString);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        queryString = queryString.replace(/"(\d+)"/g, "$1");
        //console.log(queryString);
        // this.query.pipeline()
        //     .push({
        //         $match: JSON.parse(queryString)
        //     });
        this.query.match(JSON.parse(queryString));
        //console.log(JSON.stringify(this.query.pipeline()));
        return this;
    }

    push(...objects) {
        objects.forEach(object => this.query.pipeline()
            .push(object));
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
        //console.log(this.query.pipeline());
    }


    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.project(fields);
        } else {
            this.query = this.query.project('-__v'); // exclude __v
        }
        // console.log(this.query.pipeline());
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures_aggregate;