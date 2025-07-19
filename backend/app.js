const express = require("express");
const axios = require("axios"); // for sending REST API requests
const app = express();
const port = 5002;

app.use(express.json());

// FRONTEND URL
const FRONTEND_API = "http://localhost:3000/receive-lo";

async function sendToFrontend(data) {
    try {
        await axios.post("http://localhost:3000/", data);
        console.log("✅ Forwarded log to frontend");
    } catch (err) {
        console.error("❌ Failed to send log to frontend:", err.message);
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
//     await sendToFrontend(req.body);

//     res.status(200).send("ok");
// });

app.post('/wazuh-log', async (req, res) => {
    console.log("Received SEIM log");

    // Forward to frontend
    await sendToFrontend(req.body);

    res.status(200).send("Log received SEIM");
});

app.post('/firewall-log', async (req, res) => {
    console.log("Firewall log received================>:", req.body);

    // Forward to frontend
    await sendToFrontend(req.body);

    res.status(200).send("Firewall log received");
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
