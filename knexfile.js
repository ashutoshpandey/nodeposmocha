module.exports = {

    development: {
        client: 'postgresql',
        connection: {
            database: 'posgmvc-development',
            user:     'postgres',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        }
    },

    test: {
        client: 'postgresql',
        connection: {
            database: 'posgmvc-test',
            user:     'postgres',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        }
    }
};