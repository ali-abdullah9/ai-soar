const express = require("express");
const axios = require("axios"); // for sending REST API requests
const app = express();
const port = 5002;

const connectDB = require('./db/connection');
const LogService = require('./services/logService');
const Log = require('./models/Log');

app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
  console.log('MongoDB connection established');
}).catch(err => {
  console.error('MongoDB connection failed:', err);
});

function matchesIPFilter(logData) {
  const { src_ip, dest_ip } = logData;
  
  // Check if the log contains our specific IP pair in either direction
  return (
    (src_ip === '100.65.143.235' && dest_ip === '100.65.239.23') || 
    (src_ip === '100.65.239.23' && dest_ip === '100.65.143.235')
  );
}

// FRONTEND URL
const FRONTEND_API = "http://localhost:3000/receive-log";

async function sendToFrontend(data) {
    try {
        await axios.post("http://localhost:3000/api/receive-log", data);
        console.log("✅ Forwarded log to frontend");
    } catch (err) {
        console.error("❌ Failed to send log to frontend:", err.message);
    }
};

// Common log processing function
async function processLog(logData, logType) {
  // Add log type if not already present
  const processedLog = {
    ...logData,
    type_log: logType
  };
    try {
    // Save to MongoDB
    await LogService.saveLog(processedLog);
    
    // Forward to frontend
    await sendToFrontend(processedLog);
    
    return processedLog;
  } catch (error) {
    console.error(`Error processing ${logType} log:`, error);
    throw error;
  }
}

// app.post("/logs", async (req, res) => {
//     let { source } = req.body;

//     if (source === "idps-suricata") {
//         console.log("Logs Received ======>\n\n\n", req.body.event_type);
//     }

//     // if (source === "edr-wazuh-alerts") {
//     //     console.log("EDR LOGS=====>", req.body);
//     // }

//     // Forward the log to frontend

//     const modifiedLog = {
//         ...req.body,            // spread existing keys
//         type_log: "IDPS"    // add your custom key
//     };
    
//     await sendToFrontend(modifiedLog);

//     res.status(200).send("ok");
// });

// app.post('/wazuh-siem', async (req, res) => {
//     console.log("Received SEIM log");

//     // Forward to frontend

//     const modifiedLog = {
//         ...req.body,            // spread existing keys
//         type_log: "SIEM"    // add your custom key
//     };

//     await sendToFrontend(modifiedLog);

//     res.status(200).send("Log received SEIM");
// });

app.post('/firewall-log', async (req, res) => {
    console.log("Firewall log received================>:", req.body);

    const modifiedLog = {
        ...req.body,            // spread existing keys
        type_log: "FIREWALL"    // add your custom key
    };

    try {
      if (matchesIPFilter(modifiedLog)){
        console.log("Saving to db firewall log with specific IPs:", modifiedLog);
        await processLog(modifiedLog, "FIREWALL");
      }
    } catch (error) {
      console.error("Error processing firewall log:", error);
    }

    // Forward to frontend
    await sendToFrontend(modifiedLog);

    res.status(200).send("Firewall log received");
});

// Specific IP filtering endpoint
app.get('/api/logs/specific-ips', async (req, res) => {
    try {
      const { limit, skip, sortBy, sortOrder } = req.query;
      
      const options = {
        limit: parseInt(limit) || 100,
        skip: parseInt(skip) || 0,
        sortBy: sortBy || 'timestamp',
        sortOrder: sortOrder === 'asc' ? 1 : -1
      };
      
      const result = await LogService.findSpecificIPs(options);
      res.json(result);
    } catch (error) {
      console.error('Error querying specific IPs:', error);
      res.status(500).json({ error: 'Failed to retrieve logs for specific IPs' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
