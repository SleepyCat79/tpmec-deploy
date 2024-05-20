const mysql2 = require("mysql2");

let db;

function connectToDatabase() {
  if (!db) {
    db = mysql2.createConnection({
      host: "tpmec.clma0msasvlh.ap-southeast-2.rds.amazonaws.com",
      port: "3306",
      user: "admin",
      password: "tpmec123",
      database: "TPM_EC",
    });

    console.log("Connecting for testing BE functionality");

    db.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Connected to database successfully!");
      }
    });
    return db;
  } else {
    console.log("Already connected to database.");
    return db;
  }
}

module.exports = connectToDatabase;
