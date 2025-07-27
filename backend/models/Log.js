const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    type_log:{
        type:String,
        required: true,
        enum: ['IDPS', 'SIEM', 'FIREWALL']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },

    src_ip: String,
    dest_ip: String,
    src_port: Number,
    dest_port: Number,
    proto: String,

    raw_log: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
});

LogSchema.index({ src_ip: 1 });
LogSchema.index({ dest_ip: 1 });
LogSchema.index({ type_log: 1 });
LogSchema.index({ timestamp: 1 });

module.exports = mongoose.model('Log', LogSchema);