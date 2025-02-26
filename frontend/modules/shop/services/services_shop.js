app.factory('services_shop', ['services', '$rootScope','toastr', function(services, $rootScope, toastr) {

    let service = {list_cars: list_cars, filter_car: filter_car, print_filter_car: print_filter_car, 
                    load_pagination1: load_pagination1, load_pagination2: load_pagination2, details: details, 
                    mapbox: mapbox ,details_map: details_map, more_cars: more_cars, remove_filters: remove_filters
                    ,click_like: click_like, read_likes: read_likes, read_likes_user:read_likes_user};
    return service;

    function list_cars(pagi, items = 0) {
        var total = pagi[0].cars - 3; 
        services.post('shop', 'list_cars', {total: total, items: items})
        .then(function(response) {
            console.log(response);
            $rootScope.cars = response;
            console.log($rootScope.cars);
            mapbox(response);
            read_likes(response)
        }, function(error) {
            console.log(error);
        });
    }

    function filter_car(brand_name = null, model_name = null, color = null, categ = null, type = null) {
        var array = [{brand_name, model_name, color}];
        localStorage.setItem("filters_select", JSON.stringify(array));
        console.log(array);    
        services.post('shop', 'load_filters', {brand_name: brand_name, model_name: model_name, color: color, categ: categ, type: type})
        .then(function(response) {
            console.log(response);
            $rootScope.cars = response;
            window.location.reload();
            localStorage.setItem("filters", JSON.stringify(response));
            mapbox(response);
        }, function(error) {
            console.log(error);
        });
    }

    function print_filter_car(filtros) {
        $rootScope.cars = filtros;
        for (row in $rootScope.cars) {
            console.log($rootScope.cars);
        }
        mapbox(filtros);
    }

    function load_pagination1(total) {
        let items = 0;
        list_cars(total, items);
    }
    function load_pagination2(total) {
        let items = 3;
        list_cars(total, items);
    }

   function details(id) {
       console.log(id);
       services.post('shop', 'list_one_cars', {id : id})
       .then(function(response) {
            $rootScope.onecars_data = response;
            $rootScope.onecars = response;
            console.log(response[0]);
            setTimeout(() => {  
                new Swiper('.swiper', {
                    loop: true,
                    slidesPerView: 1,
                    navigation: {
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev',
                    },
                    autoplay: {
                        delay: 5000,
                      },
                  })
                },0)
            
            mapbox(response);   
            more_cars(response);      
       }, function(error) {
           console.log(error);
       });
   }
   

   function mapbox(data) {
       console.log(data);
       setTimeout(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmlvc2tpbjk0IiwiYSI6ImNrenloOW5xNDAwZDkzY3BiaXN6eTR3YTAifQ.Pe82p8bfNkNZ_mgJCbnwQw';
        const map = new mapboxgl.Map({
            container: 'map', 
            style: 'mapbox://styles/mapbox/streets-v11', 
            center: [-0.6096918,38.8213929], 
            zoom: 7 
        });
        map.addControl(new mapboxgl.FullscreenControl());
        details_map(map,data);
       }, 0);
        
   }

   function details_map(map, data) {
       $rootScope.maps = data;
       console.log($rootScope.maps);
       for (row in $rootScope.maps) {
            $rootScope.lat = $rootScope.maps[row].lat;
            $rootScope.lon = $rootScope.maps[row].lon;

            const popup = new mapboxgl.Popup({offset : 25})
            .setHTML("<div class='popup' id=" + $rootScope.maps[row].enrolment +"><p>"+ $rootScope.maps[row].price +"€</p><br><p id='p_brand1'>" 
            + $rootScope.maps[row].brand_name + " " + $rootScope.maps[row].model_name + 
            "<p id='p_img'><a href='#/details/:"+ $rootScope.maps[row].enrolment +"'> "+
            "<img class='img_car1' src='frontend/views/images/cars/" + $rootScope.maps[row].car_img + 
            "'style = 'max-width: 100%;'></img></a></p><br>" +
            "</p></div>");
            
            new mapboxgl.Marker({color:'red'})
            .setLngLat([$rootScope.lon, $rootScope.lat])
            .setPopup(popup)
            .addTo(map);   
       }
        
   }

   function more_cars(data) {
        let categ = data[0].category_name;
        let type = data[0].type_name;
        let car = data[0].enrolment;
        services.post('shop', 'more_related', {categ: categ, type: type, car: car})
        .then(function(response) {
            $rootScope.more_related = response;
        }, function(error) {
            console.log(error);
        });
   }

   function remove_filters() {
       localStorage.removeItem("filters");
       localStorage.removeItem("filters_select");
       window.location.reload();
   }
   
   function click_like(id, token = undefined) {
       console.log(token)
       if (!token) {
            toastr.error("Debes iniciar sesion");
            location.href = "#/login/:"+id;
       }else {
            var social_google = "google"
            var social_github = "github"
            if (token.includes(social_github)) {
                var jwt = "NO";
            }else if (token.includes(social_google)) {
                var jwt = "NO";
            }else {
                var jwt = "YES";
            }
            services.post('shop', 'load_likes', {id: id, user: token, jwt: jwt})
            .then(function(response) {
            console.log(response);
            if (response == '"LIKE"') {
                    toastr.success("LIKE REALIZADO CON ÉXITO");  
                    $rootScope.liked = id;
                    localStorage.setItem('likes','like');
            }else {
                    toastr.success("DISLIKE REALIZADO CON ÉXITO");
                    $rootScope.liked = null;
                    localStorage.removeItem('likes');
            }
            }, function(error) {
                console.log(error);
            });
        }
   }

   function read_likes(response) {
       console.log("HOLA_READLIKEs");
        var toke = localStorage.token.replace(/['\"]+/g, '');
        var toke = toke.substring(1, toke.length - 1);
        if (toke) {
            read_likes_user(response,toke);
        }
   }

   function read_likes_user(response,user) {
    console.log(response);
    console.log(user);
    $rootScope.favs = response;

    for (row in $rootScope.favs) {
        console.log($rootScope.favs[row].enrolment);
        var car = $rootScope.favs[row].enrolment;
            var social_google = "google"
            var social_github = "github"
            if (user.includes(social_github)) {
                var jwt = "NO";
            }else if (user.includes(social_google)) {
                var jwt = "NO";
            }else {
                var jwt = "YES";
            }
        services.post('shop', 'read_likes', {id: car, user: user, jwt: jwt})
        .then(function(response) {
            console.log(response);
            if (response.length == '0') {
                console.log("NOT LIKE");
            }else {
                for (row in response) {
                    var id = response[row].enrolment
                    $rootScope.liked = id;
                    console.log("LIKE");
                }
                     
            }   
        }, function(error) {
            console.log(error);
        });
    }
   }

}]);
