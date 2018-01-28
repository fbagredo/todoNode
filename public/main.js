angular.module('angularTodo', []);

function mainController($scope, $http) {
	$scope.formData = {};

	$http.get('/task/pending')
		.success(function(data) {
			$scope.pending = data;
			console.log(data)
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

		$http.get('/task/overdue')
			.success(function(data) {
				$scope.overdue = data;
				console.log(data)
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

	// Cuando se añade un nuevo TODO, manda el texto a la API
	$scope.createTodo = function(){
		$http.post('/task/create', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error:' + data);
			});
	};

	// Borra un TODO despues de checkearlo como acabado
	$scope.deleteTodo = function(id) {
		$http.delete('/task/destroy/' + id)
			.success(function(data) {
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error:' + data);
			});
	};
}
