var express = require('express');
var router = express.Router();
var formidable = require('formidable')
var fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//method DELETE

router.delete('/file', (req, res) => {

  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {

    let path = fields.path

    console.log(path)

    if(fs.existsSync(path)) fs.unlink(path, err => {

      if(err) return res.status(400).json({err})

      console.log(fields)

      res.json({
        fields
      })

    })


  })

})


//method POST 
router.post('/upload', (req, res) => {
  
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {

    res.json({

      files

    })

  })

});

module.exports = router;
