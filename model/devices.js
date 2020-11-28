const mongoose = require ('mongoose');

const DeviceInforSchema = mongoose.Schema({
    model:{
      type:String,
      unique: true
    },
    agentCode:{
      type:String,
    },
    email:{
      type:String,
    },
    platform:{
      type:String,
    },
    uuid:{
      type:String
    },
    platform:{
      type:String
    },
    platform:{
      type:String
    },
    manufacturer:{
      type:String
    }
  });

  const Device = module.exports = mongoose.model('Device', DeviceInfoSchema);

  module.exportscreatDevice=function(newDevice, callback){
    newDevice.save(callback);
  }