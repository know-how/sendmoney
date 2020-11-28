const mongoose= require("mongoose");

const TransactionSchema = mongoose.Schema({
  transaction_code:{
    type:String,
  },
    agentCode:{
        type:String
    },
    status:{
      type:String
    },
    amount:{
        type:String
    },
    date:{
      type:String
    },
    senderName:{
        type:String
    },
    senderID:{
      type:String
  },
    senderNumber:{
        type:String
      },
    senderAddress:{
      type:String
    },
    receiverName:{
      type:String
    },
    receiverNumber:{
        type:String
    },
    receiverID:{
      type:String
  },
    receiverAddress:{
      type:String
    },
    clearBy:{
      type:String
    },
    updated_at:{
      type:String
    }
},{ timestamps: true });

const Transaction = module.exports = mongoose.model('Transaction', TransactionSchema);
//Create new Transaction
module.exports.createTransaction = (newTransaction, callback)=>{
    newTransaction.save(callback);
}