const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/banco-inter', {useNewUrlParser: true}, {useUnifiedTopology: true})
.then(() => {
    console.log('Conectado ao banco de dados');
}).catch((err) => 
{
    console.log('Erro ao conectar ao banco de dados: ' + err);
})