const Log = require('../models/Log');


const LogService = {
    async saveLog(logData) {
        try {
            const { src_ip, dest_ip, src_port, dest_port, proto, type_log } = logData;

            const newLog = new Log({
                type_log,
                src_ip,
                dest_ip,
                src_port,
                dest_port,
                proto,
                timestamp: logData.timestamp,
                raw_log: logData
            });
            await newLog.save();
            return newLog;

        } catch (error) {
            console.error("Error saving log:", error);
            throw error;
        }
    },

    async findSpecificIPs(options = {}) {
      const { limit = 100, skip = 0, sortBy = 'timestamp', sortOrder = -1 } = options;
      
      try {
        const query = {
          $or: [
            { $and: [{ src_ip: '100.65.143.235' }, { dest_ip: '100.65.239.23' }] },
            { $and: [{ src_ip: '100.65.239.23' }, { dest_ip: '100.65.143.235' }] }
          ]
        };
        
        const sort = { [sortBy]: sortOrder };
        
        const logs = await Log.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit);
          
        const total = await Log.countDocuments(query);
        
        return { logs, total };
      } catch (error) {
        console.error('Error querying specific IPs:', error);
        throw error;
      }
    },
};

module.exports = LogService;