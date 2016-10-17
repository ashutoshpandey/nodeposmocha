exports.up = function(knex, Promise) {
    return Promise.all([

        knex.schema.createTable('articles', function(table) {
            table.increments('id').primary();
            table.string('title');
            table.string('url');
            table.string('text');
            table.timestamps();
        }),
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
    ]);
};
