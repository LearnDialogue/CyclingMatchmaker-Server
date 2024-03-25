const { GraphQLScalarType, Kind } = require('graphql');
const { DateTime } = require('luxon');

module.exports = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Custom scalar for Dates',
        serialize(value) {
            if (value instanceof Date) {
                return value.toISOString();
            }
            throw Error('Expected `Date` object');
        },
        parseValue(value) {
            //construct JS Date object
            if (!(typeof value !== 'integer' | typeof value !== 'string'))
                throw Error('Expected integer or string for date value');
            const jsDate = new Date(value);
            //ensure date is valid (i.e. not Feb 30) w/ luxon
            const date = DateTime.fromJSDate(jsDate);
            if (!date.isValid)
                throw Error('Date is invalid: ' + date.invalidExplanation);
            return date.toISO();
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(parseInt(ast.value, 10));
            } else if (ast.kind === Kind.STRING) {
                return new Date(ast.value);
            }
            return null
        }
    })
}