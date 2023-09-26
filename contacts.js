const axios = require('axios');
const mysql = require('mysql2/promise');
const config = require('./config.json'); // Adjust the path as needed

const hubSpotAccessToken = config.hubSpotAccessToken;
const mysqlConfig = config.mysql;

const dataServerUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';

// Setup database connection pool using the MySQL configuration from the config file
const pool = mysql.createPool({
  host: mysqlConfig.host,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
  connectionLimit: 10, // Adjust this as needed
});

// Function to populate contacts from HubSpot to MySQL
async function populateContacts() {
  try {
    let nextCursor = null;
    let contactsCount = 0;

    do {
      const params = {
        limit: 100, // Adjust the limit as needed
      };

      if (nextCursor) {
        params.after = nextCursor;
      }

      const response = await axios.get(dataServerUrl, {
        headers: {
          Authorization: `Bearer ${hubSpotAccessToken}`,
        },
        params,
      });

      const contacts = response.data.results;

      const connection = await pool.getConnection();
      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        // Insert the contact data into MySQL
        await connection.query('INSERT INTO contacts (first_name, last_name, email, hs_object_id) VALUES (?, ?, ?, ?)', [
          contact.properties.firstname,
          contact.properties.lastname,
          contact.properties.email,
          contact.properties.hs_object_id,
        ]);
      }

      connection.release();
      contactsCount += contacts.length;

      console.log(`Fetched ${contacts.length} contacts. Total contacts fetched: ${contactsCount}`);

      nextCursor = response.data.paging?.next?.after;
    } while (nextCursor);

    console.log('Contacts added to MySQL');
  } catch (error) {
    console.error('Error populating contacts:', error);
  }
}

// Function to display contacts from MySQL
async function displayContacts() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM contacts');
    connection.release();

    console.log('Contacts in MySQL:');
    console.table(rows); // Display contacts in a tabular format
  } catch (error) {
    console.error('Error displaying contacts:', error);
  }
}

// Main function
async function main() {
  try {
    await populateContacts();
    await displayContacts();
  } finally {
    console.log('Process completed.');
  }
}

main();
