

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


const PORT = process.env.PORT || 4000;
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'labinfo',
  password: 'noobmaster69',
  port: 5432,
});
pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to database');
    client.release();
  });
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' , methods: ['POST'] }));

app.post('/api/labtests', async (req, res) => {
    const { client, orderedBy, referrer, selectedTest, sampleTaken, sampleTime, remarks } = req.body;
      console.log(req.body)
    try {
      const result = await pool.query('INSERT INTO lab_tests(client, ordered_by, referrer, selectedTest, sample_taken, sample_time, remarks) VALUES($1, $2, $3, $4, $5, $6, $7)', [client, orderedBy, referrer, selectedTest, sampleTaken, sampleTime, remarks]);
      res.status(200).json({ result: result.rows[0], message: 'Lab test data saved successfully' });
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while saving the lab test data' });
    }
  });

  
  app.get('/api/labtests', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM lab_tests');
       res.status(200).json({ data: result.rows });
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching lab test data' });
    }
  });
  app.post("/api/create/patients", async (req, res) => {
  const { patient_name, disease_name, date_time, doctor_name, status } = req.body;
  console.log(req.body)

  try {
    const client = await pool.connect();

    const result = await client.query(
      "INSERT INTO patients (patient_name, disease_name, date_time, doctor_name, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [patient_name, disease_name, date_time, doctor_name, status]
      
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
app.get("/api/patients", async (req, res) => {
  try {
    const client = await pool.connect();

    const patients = await client.query("SELECT * FROM patients");
    res.json(patients.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve patients" });
  }
});

  

app.set('view engine', 'ejs')
app.get("/", (req,res) => {
    res.render("index");
})

app.get("/users/register", (req,res) => {
    res.render("register")
})
app.get("/users/login", (req,res) => {
    res.render("login")
})
app.get("/users/dashboard", (req,res) => {
    res.render("dashboard", {user: 'bishal'})
})
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
 })