var express 	= require('express');
var app 		= express();
var mongoose 	= require('mongoose');

// Conexión con la base de datos
mongoose.connect('mongodb://localhost:27017/angular-todo');

// Configuración
app.configure(function() {
	// Localización de los ficheros estaticos
	app.use(express.static(__dirname + '/public'));
	// Muestra un log de todos los request en la consola
	app.use(express.logger('dev'));
	// Permite cambiar el HTML con el método POST
	app.use(express.bodyParser());
	// Simula DELETE y PUT
	app.use(express.methodOverride());
});

// Definición de modelos
var Todo = mongoose.model('Todo', {
	name: String,
	dueDate: Date,
	priority: Number
});

// API
app.get('/task/pending', function(req, res) {
		var cutoff = new Date();
		cutoff.setDate(cutoff.getDate());
		var query = Todo.find({dueDate: {$gt: cutoff}})
		query.exec(function(err, overdue){
		if(err) {
			res.send(err);
		}
		res.json(overdue);
	});
});

app.get('/task/overdue', function(req, res) {
	var cutoff = new Date();
	cutoff.setDate(cutoff.getDate());
	var query = Todo.find({dueDate: {$lte: cutoff}})
	query.exec(function(err,pending){
	if(err) {
		res.send(err);
	}
	res.json(pending);
});
});

app.post('/task/create', function(req, res) {
	Todo.create({
		name: req.body.name,
		dueDate: req.body.dueDate,
		priority: req.body.priority,
		done: false
	}, function(err, todo){
		if(err) {
			res.send(err);
		}

		Todo.find(function(err, todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});
	});
});

// DELETE un TODO específico y devuelve todos tras borrarlo.
app.delete('/task/destroy/:todo', function(req, res) {
	Todo.remove({
		_id: req.params.todo
	}, function(err, todo) {
		if(err){
			res.send(err);
		}

		Todo.find(function(err, todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});

	})
});

// Carga una vista HTML simple donde irá nuestra Single App Page
// Angular Manejará el Frontend
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

// Escucha en el puerto 8080 y corre el server
app.listen(8080, function() {
	console.log('App listening on port 8080');
});
