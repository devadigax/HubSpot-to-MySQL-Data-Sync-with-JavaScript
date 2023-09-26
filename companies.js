const axios = require('axios');
const mysql = require('mysql2/promise');
const config = require('./config.json'); // Adjust the path as needed

const hubSpotAccessToken = config.hubSpotAccessToken;
const mysqlConfig = config.mysql;

const companiesServerUrl = 'https://api.hubapi.com/crm/v3/objects/companies';

// Setup database connection pool using the MySQL configuration from the config file
const pool = mysql.createPool({
  host: mysqlConfig.host,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
  connectionLimit: 10, // Adjust this as needed
});

// Function to populate companies from HubSpot to MySQL
async function populateCompanies() {
  try {
    let nextCursor = null;
    let companiesCount = 0;

    do {
      const params = {
        limit: 100, // Adjust the limit as needed
      };

      if (nextCursor) {
        params.after = nextCursor;
      }

      const response = await axios.get(companiesServerUrl, {
        headers: {
          Authorization: `Bearer ${hubSpotAccessToken}`,
        },
        params,
      });

      const companies = response.data.results;

      const connection = await pool.getConnection();
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        // Insert the company data into MySQL
        await connection.query('INSERT INTO companies (name, domain, description, hs_object_id) VALUES (?, ?, ?, ?)', [
          company.properties.name,
          company.properties.domain,
          company.properties.description,
          company.properties.hs_object_id,
        ]);
      }

      connection.release();
      companiesCount += companies.length;

      console.log(`Fetched ${companies.length} companies. Total companies fetched: ${companiesCount}`);

      nextCursor = response.data.paging?.next?.after;
    } while (nextCursor);

    console.log('Companies added to MySQL');
  } catch (error) {
    console.error('Error populating companies:', error);
  }
}

// Function to display companies from MySQL
async function displayCompanies() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM companies');
    connection.release();

    console.log('Companies in MySQL:');
    console.table(rows); // Display companies in a tabular format
  } catch (error) {
    console.error('Error displaying companies:', error);
  }
}

// Main function
async function main() {
  try {
    await populateCompanies();
    await displayCompanies();
  } finally {
    console.log('Process completed.');
  }
}

main();
