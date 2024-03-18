const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Define endpoint for running tests
app.post('/run-tests', (req, res) => {
  // Execute your testing script
  exec('node ./testing-script-method.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(`Output: ${stdout}`);
    res.json({ output: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server from openai is listening on port ${port}`);
});
