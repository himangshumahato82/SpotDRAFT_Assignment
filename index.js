const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const AIRTABLE_API_KEY = 'YOUR_AIRTABLE_API_KEY';
const AIRTABLE_BASE_ID = 'YOUR_AIRTABLE_BASE_ID';
const ASANA_TASKS_TABLE_NAME = 'Asana Tasks';

// Endpoint to receive the Asana webhook payload
app.post('/asana-webhook', (req, res) => {
  const task = req.body;
  console.log('Received new task from Asana:', task);

 
  const airtableData = {
    fields: {
      'Task ID': task.id,
      'Name': task.name,
      'Assignee': task.assignee,
      'Due Date': task.due_date,
      'Description': task.description,
    },
  };

  
  axios.post(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${ASANA_TASKS_TABLE_NAME}`,
    airtableData,
    {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
  .then((response) => {
    console.log('Task successfully added to Airtable:', response.data);
  })
  .catch((error) => {
    console.error('Error adding task to Airtable:', error.response.data);
  });

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Integration service listening on port ${PORT}`);
});
