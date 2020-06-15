const express = require("express");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);

	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}

	next();
});

app.use(isAuth);

app.use(
	"/graphql",
	graphqlHttp({
		schema: graphQLSchema,
		rootValue: graphQLResolvers,
		graphiql: true
	})
);

mongoose
	.connect(
		"mongodb+srv://" +
			process.env.MONGO_USER +
			":" +
			process.env.MONGO_PASSWORD +
			"@graphqlapicluster-dni6u.mongodb.net/" +
			process.env.MONGO_DB +
			"?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		}
	)
	.then(() => {
		app.listen(8000);
	})
	.catch((err) => {
		console.log(err);
	});
