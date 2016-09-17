
app.controller("Main.Ctrl", ['$scope', '$rootScope', '$mdDialog', '$mdMedia', '$http', function ($scope, $rootScope, $mdDialog, $mdMedia, $http) {

    //Get Call For Website Listing
    $http.get('https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites')
    .success(function (data) {
      
        $scope.websites = data.websites;
        $scope.Website_Cout = data.websites.length;
        setTimeout(function () {
            for (var index = 0; index < $scope.websites.length; index++) {
                document.getElementById($scope.websites[index].id + "Website_Like_Count").innerText = localStorage.getItem($scope.websites[index].id + "Website_Id") != null ? localStorage.getItem(data.websites[index].id + "Website_Id") : '';
            }
        }, 200);
    })
    .error(function (data, status, headers, config) {
        alert("failure message: " + JSON.stringify({ data: data }));
    });

  
    $scope.AddWebsite = function (ev) {
        $mdDialog.show({
            controller: AddWebsiteController,
            templateUrl: '../../WebForms/Partials/AddWebsite.html',
            targetEvent: ev,
        });
    };

    $scope.Website_Like = function (Website_Id) {
       
        localStorage.setItem(Website_Id + "Website_Id", parseInt(localStorage.getItem(Website_Id + "Website_Id") !=null ?localStorage.getItem(Website_Id + "Website_Id") : '0') + parseInt( 1));
        document.getElementById(Website_Id + "Website_Like_Count").innerText = localStorage.getItem(Website_Id + "Website_Id");
    };
    $scope.BackToHome = function () {
        $scope.showSearch = !$scope.showSearch;
        $scope.search = '';
    };
    
    function AddWebsiteController($scope, $mdDialog) {
        $scope.Website_Add = {
            Title: "",
            Url: "",
            Tag: ""
        };
        $scope.Show_Message = false;
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.Add_Website = function () {
            if ((($scope.Website_Add.Title != '' && $scope.Website_Add.Title !=undefined) && ($scope.Website_Add.Url != '' && $scope.Website_Add.Url != undefined)) && ($scope.Website_Add.Tag != '' && $scope.Website_Add.Tag != undefined) )
            {
                $scope.Show_Message = false;
                $http.post('https://hackerearth.0x10.info/api/one-push?type=json&query=push&title=' + $scope.Website_Add.Title + '&url=' + $scope.Website_Add.Url + '&tag=' + $scope.Website_Add.Tag)
       .success(function (data) {
           if (data.status != '403') {
               $scope.websites = data.websites;
               $scope.Website_Cout = data.websites.length;
               setTimeout(function () {
                   for (var index = 0; index < $scope.websites.length; index++) {
                       document.getElementById($scope.websites[index].id + "Website_Like_Count").innerText = localStorage.getItem($scope.websites[index].id + "Website_Id") != null ? localStorage.getItem(data.websites[index].id + "Website_Id") : '';
                   }
               }, 200);
           }
           else {
               alert(data.message);
               $mdDialog.cancel();
           }

       })
       .error(function (data, status, headers, config) {
           alert("failure message: " + JSON.stringify({ data: data }));
       });
            }
            else {
                $scope.Show_Message = true;
            }

        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }
}]);
