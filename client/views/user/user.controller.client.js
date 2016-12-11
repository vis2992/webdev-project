(function(){
    angular
        .module("ConcertFinder")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("AdminController", AdminController);


    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            var promise = UserService.login(username, password);

            promise
                .success( function(user) {
                    if(user == "0") {
                        Materialize.toast('Unauthorized!', 4000);
                        return;
                    }

                    if(user) {
                        if(user.role == "DEFAULT") {
                            $location.url("/"+ user._id);
                        }
                        else {
                            $location.url("/adminuser/admin");
                        }

                    } else {
                        Materialize.toast('No such user!', 4000);

                    }
                })
                .error(function(error){
                    vm.error = "Unauthorized";
                });

        }

    }

    function ProfileController($location, UserService) {
        var vm = this;

        vm.saveProfile = saveProfile;
        vm.myConcerts = myConcerts;

        function myConcerts() {
            $('.button-collapse').sideNav('hide');
            $location.url("/user/"+vm.user._id + "/concerts/");
        }

        function saveProfile() {
            UserService.updateUser(vm.user)
                .success(function(save) {
                    Materialize.toast('Saved!', 4000);
                });
        }

        var promise =  UserService.checkLogin();
        promise
            .success( function(user) {
                if(user != '0') {
                    vm.user = user;
                }
            })
            .error(function(error){
                console.log("error "+ error);
            });
    }

    function RegisterController($location, UserService) {

        var vm = this;
        vm.register = register;

        function register(username, password){

            var promise = UserService.findUserByUsername(username);

            promise
                .success( function(user) {

                    if(user)
                        alert("User already exists! Choose a different username !");
                    else
                    {
                        doRegister(username, password);
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                });


            function doRegister() {
                var user = {username:username, password: password};
                var promise = UserService.createUser(user);

                promise
                    .success( function(user) {
                        $location.url("/#");
                        Materialize.toast('Welcome!', 4000);
                    })
                    .error(function(error){
                        console.log("error "+ error);
                    });
            }

        }
    }

    function AdminController(UserService) {

        var vm = this;
        vm.deleteUser = deleteUser;

        function deleteUser(user) {

            var promise =  UserService.deleteUser(user._id);

            promise
                .success( function(user) {
                    Materialize.toast('Deleted !', 2000);

                    init();
                })
                .error(function(error){
                    Materialize.toast('Error ! ' + error, 2000);
                });
        }

        init();

        function init() {
            var promise =  UserService.checkLogin();
            promise
                .success( function(user) {
                    if(user != '0') {
                        vm.user = user;
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                    vm.error("You're not authorized !");
                });

            var promise2 =  UserService.getUserList();
            promise2
                .success( function(users) {
                    if(users) {
                        vm.users = users;
                    }
                })
                .error(function(error){
                    console.log("error "+ error);
                    vm.error("You're not authorized !");
                });

        }




    }
})();