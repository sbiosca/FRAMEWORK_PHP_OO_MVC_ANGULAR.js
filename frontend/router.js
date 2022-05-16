var app = angular.module('FRAMEWORK_PHP_OO_MVC_ANGULAR.JS', ['ngRoute', 'toastr']);

app.config(['$routeProvider', function ($routeProvider) { 
    $routeProvider
    .when ("/contact", {
        templateUrl: "frontend/modules/contact/views/contact_list.html", 
        controller: "ctrl_contact"
    }).when ("/home", {
        templateUrl: "frontend/modules/home/views/home.html", 
        controller: "ctrl_home",
        resolve: {
            carrousel_brand: function (services) {
                return services.get('home','carrousel_brand');
            },
            categ: function (services) {
                return services.get('home','categ');
            },
            type: function (services) {
                return services.get('home','type');
            }
        }
    }).otherwise ("/home", {
        templateUrl: "frontend/modules/home/views/home.html", 
        controller: "ctrl_home",
        /*resolve: {
            carousel: function (services) {
                return services.get('home','carousel');
            },
            categoria: function (services) {
                return services.get('home','categoria');
            },
            brands: function (services) {
                return services.get('home','brands');
            }
        }*/
    });

}]);

app.run(function(){ 
    console.log("HOLLAAAA_ RUN");
});