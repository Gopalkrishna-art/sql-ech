const {
    Client
} = require('pg');


const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "root",
    database: "test"
})

client.on("connect", () => {
    console.log("Database connected");
})
client.on("end", () => {
    console.log("Database connection ended");
})
module.exports = client;


