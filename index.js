const express = require('express');
const app = express();
const { create } = require('express-handlebars');
require('dotenv').config();

//Habilitar req.body:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Directorios estáticos:
app.use(express.static(__dirname + '/public'));

//Habilitar handlebars:
const hbs = create({
  partialsDir: ['views/partials'],
  extname: '.hbs',
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

app.use('/api/v1/', require('./routes/users.route'));
app.use('/', require('./routes/vistas.route'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ON in port http://localhost:${PORT}`);
});
