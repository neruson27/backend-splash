var app = require('express')(),
    swig = require('swig'),
    serveStatic = require('serve-static')
var nodemailer = require('nodemailer');
var BootstrapEmail = require('bootstrap-email');
var singleTemplate = new BootstrapEmail(__dirname + '/../src/email/page.html')
singleTemplate.compileAndSave(__dirname + '/../src/email/pageB.html')
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'damiangonz2702@gmail.com',
    pass: 'Luisana2702'
  }
});

app.use(serveStatic(__dirname + '/../src/email'))
app.use("/files", serveStatic (__dirname + '/../src/files' ));

app.get('/', function (req, res) {
  var tmpl = swig.compileFile(__dirname + '/../src/email/page.html'),
    renderedHtml = tmpl({
      products: [
        { 
          hightlight: '/files/1591669773464.png',
          name: 'hola',
          description: 'esto es la descripcion',
          quantity: 2,
          price: 2000,
        },
        { 
          hightlight: '/files/1591670166689.png',
          name: 'hola2',
          description: 'esto es la descripcion2',
          quantity: 1,
          price: 2500,
        },
        { 
          hightlight: '/files/1591669773464.png',
          name: 'hola3',
          description: 'esto es la descripcion3',
          quantity: 3,
          price: 4000,
        },
        { 
          hightlight: '/files/1591670166689.png',
          name: 'hola4',
          description: 'esto es la descripcion4',
          quantity: 4,
          price: 1060,
        },
      ],
      orden: '00001',
      nombre: 'Nelson',
      dni: '24227142',
      tlf: '04147852491',
      dir: 'Calle 1 sector x',
      email: 'kaironelson@gmail.com',
      fecha: Date('26/09/2020'),
      total: 50000,
    });

    var mailOptions2 = {
      from: 'damiangonz2702@gmail.com',
      to: "kaironelson@gmail.com",
      subject: 'Compra exitosa!',
      html: renderedHtml
    }

    console.log("sending email", mailOptions2)

    // transporter.sendMail(mailOptions2, function (error, info) {
    //   console.log("senMail returned!");
    //   if (error) {
    //     console.log("ERROR!!!!!!", error);
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //   }
    // })

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(renderedHtml);
});

app.listen(1337, () => {
  console.log('Application Started on http://localhost:1337/');
})
