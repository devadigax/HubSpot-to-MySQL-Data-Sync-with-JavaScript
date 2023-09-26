# HubSpot to MySQL Data Sync

This repository contains a JavaScript application that allows you to synchronize contact and company data from HubSpot to a MySQL server. This README provides step-by-step instructions on how to set up and run the application.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

1. MySQL server is installed and running.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/hubspot-to-mysql-data-sync.git
2. Change into the project directory:
   ```bash
   cd hubspot-to-mysql-data-sync
3. Install the required Node.js packages by running:
   ```bash
   npm install
## Configuration
1. Create a config.json file in the project root directory and add your HubSpot access token and MySQL credentials as shown below:
   ```bash
   {
    "hubSpotAccessToken": "<your_hubspot_access_token>",
    "mysql": {
        "host": "localhost",
        "user": "root",
        "password": "<your_mysql_password>",
        "database": "hubspot"
    }
   }


## Database Setup
1. Set up the required MySQL tables by executing the SQL scripts provided in contacts.sql and companies.sql in your MySQL server.
## Usage
1. To synchronize contact and company data from HubSpot to MySQL, follow these steps:

## Copy Contacts
1. Run the following command to copy contacts from HubSpot to MySQL:
   ```bash
   node contacts.js

## Copy Companies
1. Run the following command to copy companies from HubSpot to MySQL:
   ```bash
   node companies.js

## License
This project is licensed under the MIT License - see the LICENSE file for details.

This README provides detailed instructions for setting up and running the HubSpot to MySQL data synchronization application. Make sure to replace `<your_hubspot_access_token>` and `<your_mysql_password>` with your actual HubSpot access token and MySQL password in the `config.json` file.
