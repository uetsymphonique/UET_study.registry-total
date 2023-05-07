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
        this.query.pipeline()
            .push({
                $match: prefilterObject
            });
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
            /\b(gte|gt|lte|lt|toInt)\b/g,
            (match) => `$${match}`
        );
        queryString = queryString.replace(/"(\d+)"/g, "$1");
        //console.log(queryString);
        this.query.pipeline()
            .push({
                $match: JSON.parse(queryString)
            });
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
            const sorts = this.queryString.sort.split(',');
            //console.log(sorts);
            let sortObject = {};
            sorts.forEach(sort => {
                sortObject[sort.replace('-', '')
                    .toString()] = (sort.startsWith('-')) ? -1 : 1;
            })
            this.query.pipeline()
                .push({$sort: sortObject})
        } else {
            this.query.pipeline()
                .push({$sort: {createdAt: -1}})
        }
        //console.log(this.query.pipeline());
        return this;
    }


    limitFields() {
        console.log('hahahah');
        // 3) Limit
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',');
            let projectObject = {};
            fields.forEach(field => {
                projectObject[field.replace('-', '')
                    .toString()] = (field.startsWith('-')) ? 0 : 1;
            })
            this.query.pipeline()
                .push({$project: projectObject})
        } else {
            this.query.pipeline()
                .push({$project: {__v: 0}})
        }
        //console.log(this.query.pipeline());
        return this;
    }

    paginate() {
        //4) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query.pipeline()
            .push(
                {$skip: skip}, {$limit: limit}
            )
        return this;
    }
}

module.exports = APIFeatures_aggregate;
