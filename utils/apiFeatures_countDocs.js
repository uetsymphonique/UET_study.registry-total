class APIFeatures_countDocs {
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
            /\b(gte|gt|lte|lt|ne|regex)\b/g,
            (match) => `$${match}`
        );
        // console.log(JSON.parse(queryString));
        this.query.where(JSON.parse(queryString));
        console.log(this.query);

        return this;
    }
}

module.exports = APIFeatures_countDocs;
