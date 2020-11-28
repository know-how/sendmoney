const multer  = require('multer');
const path = require('path');
////set storage
///storage engine for Auctions
var storageProfile = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/profiles/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,req.body.email + '-' + file.fieldname+'-'+file.originalname);
    }
  });


  // Init Upload
  ///for profile
  const uploadProfile = multer({
    storage:storageProfile,
    limits:{fileSize:2000000},
    fileFilter: function(req, file, cb){
      checkFileType(file,cb);
    }
  }).single('image');
  
  // Check file type
  function checkFileType(file, cb){
    // Allowed extensions
    //const filetypes = /doc|docx|odt|pdf|xls|xlsx|ppt|pptx|txt|ods/;
    const filetypes = /png|jpg|jpeg/;
    // Check Extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check the mime type
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null, true );
    } else{
        cb('You can only upload images');
    }
  }
  
  module.exports ={
    uploadProfile,
  }