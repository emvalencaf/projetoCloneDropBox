var express = require('express');
var router = express.Router();
var formidable = require('formidable')
var fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//method GET para abrir arquivos

router.get('/file', (req, res) => {

  let path = req.query.path

  if(!fs.existsSync(path)) return res.status(404).json({err:'File not found'})

  fs.readFile(path, (err, data) => {

    if(err) {

      console.error(err)
      res.status(400).json({err})

    } else {

      res.status(200).end(data)

    }

  })

})

//method DELETE arquivos no servidor

router.delete('/file', (req, res) => {

  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {

    let path = fields.path

    console.log(path)

    if(!fs.existsSync(path)) return res.status(404).json({err:'File not found'})

    fs.unlink(path, err => {

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
