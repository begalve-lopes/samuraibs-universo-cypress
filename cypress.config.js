const { defineConfig } = require("cypress");
const { Pool } = require("pg");

const pool = new Pool({
  host: "dpg-d7a1rd9r0fns73aoa8k0-a.ohio-postgres.render.com",
  user: "samuraibs_dev_8idq_user",
  password: "iRfVj7zDfz4O8JKA1SOXmUxGcjK29kbl",
  database: "samuraibs_dev_8idq",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3000",
    viewportHeight: 900,
    viewportWidth: 1440,

    setupNodeEvents(on, config) {
      on("task", {
        deleteUser(email) {
          return pool
            .query("DELETE FROM users WHERE EMAIL = $1", [email])
            .then((result) => ({ success: result.rowCount }))
            .catch((error) => {
              throw error;
            });
        },
      });

      return config;
    },
  },
});
