const File = require('../models/filestore.js');

const uploadPage = (req, res) => {
  res.render('upload');
};

const uploadFile = async (req, res) => {
  if (!req.files || !req.files.sampleFile) {
    return res.status(400).json({error: 'No files were uploaded'});
  }

  //console.log(req.files);
  const { sampleFile } = req.files;
  
  try {
    const newFile = new File(sampleFile);
    const doc = await newFile.save();
    return res.status(201).json({message: 'File stored successfully', fileId: doc._id});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Something went wrong with uploading file'});
  }
};

const retrieveFile = async (req, res) => {
  //Return 400 error if req is missing _id param
  if (!req.query._id) {
    return res.status(400).json({error: 'Missing file Id'});
  }

  let doc;
  try {
    doc = await File.findOne({_id: req.query._id}).exec();
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: 'Something went wrong with retrieving file'});
  }

  //Return 404 error if no file is found
  if (!doc) {
    return res.status(404).json({error: 'File not found'});
  }

  res.set({
    'Content-Type': doc.mimeType,
    'Content-Length': doc.size,
    'Content-Disposition': `attachment; filename="${doc.name}"`,
  });
  return res.send(doc.data);
};

module.exports = {
  uploadPage,
  uploadFile,
  retrieveFile
};