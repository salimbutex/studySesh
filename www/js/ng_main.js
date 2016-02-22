/*******************************NgAPP*****************************************************/
var mainApp = angular.module("mainApp", ['ngRoute', 'ngAnimate' ,'ui.bootstrap']);
//var api_url='http://localhost/phonegap/studysesh/api/';
var api_url='http://studysesh.co/api/';

/**********************************Routing*****************************************************/
mainApp.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'html/home.html',
            controller: 'loginController'
        }).when('/register', {
            templateUrl: 'html/register.html',
            controller: 'registerController'
        }).when('/create_register', {
            templateUrl: 'html/signup.html',
            controller: 'create_registerController'
        }).when('/session', {
            templateUrl: 'html/session.html',
            controller: 'sessionController'
        }).when('/create_session', {
            templateUrl: 'html/create_session.html',
            controller: 'create_sessionController'
        }).when('/find_session', {
            templateUrl: 'html/find_session.html',
            controller: 'find_sessionController'
        }).when('/find_result/:professor/:courses/:date', {
            templateUrl: 'html/find_result.html',
            controller: 'find_resultController'
        }).when('/join_session/', {
            templateUrl: 'html/join_session.html',
            controller: 'join_sessionController'
        }).when('/my_session/', {
            templateUrl: 'html/my_session.html',
            controller: 'my_sessionController'
        }).when('/chat/:session_id/:course_name', {
            templateUrl: 'html/chat.html',
            controller: 'chatController'
        }).when('/setting', {
            templateUrl: 'html/setting.html',
            controller: 'settingController'
        }).when('/edit_session/:session_id', {
            templateUrl: 'html/edit_session.html',
            controller: 'edit_sessionController'
        }).when('/block_unblock/:course_id', {
            templateUrl: 'html/block_unblock.html',
            controller: 'block_unblock_sessionController'
        }).when('/my_created_session', {
            templateUrl: 'html/my_created_session.html',
            controller: 'my_created_sessionController'
        }).when('/notification', {
            templateUrl: 'html/notification.html',
            controller: 'notificationController'
        }).when('/logout', {
            templateUrl: 'html/home.html',
            controller: 'logoutController'
        }).when('/forgetpassword', {
            templateUrl: 'html/forgetpassword.html',
            controller: 'forgetpasswordController'
        }).otherwise({
            redirectTo: '/home'
        });
});

/**********************************Filters**********************************************/
mainApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
 mainApp.filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });


/**********************************controller*****************************************************/
mainApp.controller('forgetpasswordController', function($scope,$filter, $routeParams, $rootScope, $http, $location) {
	
	$scope.forget_password = function(){
		if( $scope.loginForm.$invalid==1){
			$scope.loginForm.email.$pristine=false;
		}else{
			$http({
	            method: 'POST',
	            url     : api_url + 'forgetpasswordverify.php',
	            data: $.param($scope.userForm),
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	        }).success(function(response) {
	            $scope.loginError=response.status.message;
	        }).error(function(response) {
	        	$scope.loginError=response.status.message;
	        });
    	}
	}
});


/**********************************controller*******************************************/
mainApp.controller('chatController', function($scope,$routeParams, $rootScope, $http, $location) {
	document.addEventListener("backbutton", shutuploading, false);
	function shutuploading(){
			$('.spinner').stop().fadeOut('fast');	
	}
    $scope.course_name=$routeParams.course_name.substring(0, 20);
	$scope.session_id=$routeParams.session_id;
	$scope.chatSendstatus=0;
	$scope.openImg=function(imguri){
		cordova.ThemeableBrowser.open(imguri, '_blank', {statusbar: {
				color: '#f77500'
			},toolbar: {
				height: 44,
				color: '#f77500'
			},title: {
				color: '#EBEBEB',
				showPageTitle: true
			},backButton: {
			   /*  wwwImage : 'images/close.jpg',
				imagePressed: 'back_pressed',
				align: 'left',
				event: 'backPressed' */
			},
			forwardButton: {
			  /*  wwwImage : 'images/close.jpg',
				imagePressed: 'forward_pressed',
				align: 'left',
				event: 'forwardPressed'*/
			},
			closeButton: {
				wwwImage : 'images/close.jpg',
				imagePressed: 'images/close.jpg',
				align: 'left',
				event: 'closePressed'
			},
			customButtons: [
			 /*   {
					wwwImage : 'images/close.jpg',
					imagePressed: 'share_pressed',
					align: 'right',
					event: 'sharePressed'
				} */
			],
			menu: {
			/*     wwwImage : 'images/close.jpg',
				imagePressed: 'menu_pressed',
				title: 'Test',
				cancel: 'Cancel',
				align: 'right',
				items: [
					{
						event: 'helloPressed',
						label: 'Hello World!'
					},
					{
						event: 'testPressed',
						label: 'Test!'
					}
				]  */
			},
			backButtonCanClose: true
		}).addEventListener('closePressed', function(r) {
		   // e.path('#/search-results?service=events');
			g.backOpenedMain=i.listingid;		   
			window.history.back();			
		}).addEventListener('helloPressed', function(e) {
		   // alert('hello pressed');
		}).addEventListener('sharePressed', function(e) {
		   // alert(e.url);
		}).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
			console.error(e.message);
		}).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
			console.log(e.message);
		});
	}
	$scope.openFile=function(imguri){
		window.requestFileSystem(
		    LocalFileSystem.PERSISTENT, 0,
		    function onFileSystemSuccess(fileSystem) {
		        fileSystem.root.getFile(
		            "dummy.html", {
		                create: true,
		                exclusive: false
		            },
		            function gotFileEntry(fileEntry) {
		                console.log(fileEntry);
		                var sPath = fileEntry.nativeURL.replace("dummy.html", "");
		                var fileTransfer = new FileTransfer();
		                fileEntry.remove();
		                fileTransfer.download(
		                    imguri,
		                    sPath + "dummy.png",
		                    function(theFile) {
		                        console.log("download complete: " + theFile.toURI());
		                        window.open(theFile.toURL(), '_blank', 'location=no,closebuttoncaption=Close,enableViewportScale=yes');
		                    },
		                    function(error) {
		                        console.log("download error source " + error.source);
		                        console.log("download error target " + error.target);
		                        console.log("upload error code: " + error.code);
		                    }
		                );
		            },
		            fail);
		    },
		    fail);		
	};

	
	
	
    $scope.send=function(){ 
	$scope.chatSendstatus=1;	
	  	 $('.spinner').fadeIn('fast');
		$http({  
		  method  : 'POST',
		  url     : api_url + 'chat.php',
		  data    : $.param({ sender:$rootScope.isloggedIn, group_id:$scope.session_id,message:$scope.message }),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		 }).success(function(data) { 
			if(data.status.code == 1){
				$scope.chats.push({
					created: data.body.created,
					message: data.body.message,
					first_name: data.body.first_name,
					pic: data.body.pic,
					sentbyme:1,
					type:0
				});	
				$scope.lastid=data.body.chat_id;
				$scope.chatSendstatus=0;
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				$scope.message='';
		    }else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 	
			$('.spinner').stop().fadeOut('fast');			
		  }); 
	}

	jQuery('#message_area').keypress(function (e) {
        var key = e.which;
    });
			
		var win = function(r) {
			
		$('.spinner').stop().fadeOut('fast');
		$http({  
		  method  : 'POST',
		  url     : api_url + 'getPic.php',
		  data    : $.param({ sender:$rootScope.isloggedIn, session_id:$scope.session_id}),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		 }).success(function(data) { 
			if(data.status.code == 1){	
				$scope.chats.push({
					created: data.body.created,
					message: data.body.message,
					first_name: data.body.first_name,
					sentbyme:1,
					type:1
				});	
				$scope.lastid=data.body.id;
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
				$scope.chatSendstatus=0;
		    }else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 	
			$('.spinner').stop().fadeOut('fast');			
		  }); 
		
			 
			  
		}

		var fail = function(error) {
			$('.spinner').stop().fadeOut('fast');
		console.log("upload error source " + error.source);
		console.log("upload error target " + error.target);
		}
   var onSuccess = function(FILE_URI) {
        $scope.picData='';
        $scope.picData = FILE_URI;
        $scope.$apply();		
		var myImg =$scope.picData;	
		var options = new FileUploadOptions();
		options.fileKey="message";
		options.chunkedMode = false;
		options.fileName="myphoto.jpg";
		options.mimeType="image/jpeg";
		var params = {sender:$rootScope.isloggedIn, group_id:$scope.session_id};
		options.params = params; 
		var ft = new FileTransfer();
		ft.headers = { Connection: "close" };
		ft.upload(myImg,encodeURI(api_url + "chat.php"), win, fail,options);
	};
    var onFail = function(e) {
        alert("On fail " + e);
        $('.spinner').stop().fadeOut('fast');
    }
	
	$scope.takePic = function() {
		$('.spinner').fadeIn('fast');
		$scope.chatSendstatus=1;
		var options =   {
            quality: 10,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 2, 
            encodingType: 0 
        }
        navigator.camera.getPicture(onSuccess,onFail,options);
	}
	$scope.takePic_ = function() {
		$('.spinner').fadeIn('fast');
		$scope.chatSendstatus=1;
		var options = {
            quality: 10,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: 0 
        }
        navigator.camera.getPicture(onSuccess,onFail,options);
	}

	$scope.chat_interval = function() {
		clearInterval(chat_interval);
		javascript:history.back();
	}
		
		$http({
		  method  : 'POST',
		  url     : api_url + 'getchatbyid.php',
		  data    : $.param({ id:$rootScope.isloggedIn ,session_id:$scope.session_id }),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		 })
		  .success(function(data) {	
		 if (!data.success ) {
			 if(data.status.code==0){
              $scope.chats=[];	

					chat_interval = setInterval(function(){
						if($scope.lastid=='' || $scope.lastid==undefined){
							$scope.lastid=0;
						}
						if($scope.chatSendstatus==0){		
						  	$http({
							  method  : 'POST',
							  url     : api_url + 'recievedchat.php',
							  data    : $.param({id:$rootScope.isloggedIn ,session_id:$scope.session_id ,lastid:$scope.lastid}), 
							  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
							  })
						  .success(function(data) {	
							 if (!data.success) {
								 if(data.status.code==0){	
								 }else{
					              $("html, body").animate({ scrollTop: $(document).height() }, "slow");				 
								  for(var key in data.body) {
									$scope.chats.push(data.body[key]); 
									 
					               var value = data.body[key];
							        $scope.lastid=data.body[key]['chat_id'];
					               } 		
									}
								} else {
								
								}
						  });
						} 
					}, 30000); 

			 }else{ 
			  $scope.chats=data.body;
			  for(var key in $scope.chats) {
               var value = $scope.chats[key];
                 $scope.lastid=$scope.chats[key]['chat_id'];	
               }  
			   
				chat_interval = setInterval(function(){
					if($scope.lastid=='' || $scope.lastid==undefined){
						$scope.lastid=0;
					}
					if($scope.chatSendstatus==0){	
					$http({
					  method  : 'POST',
					  url     : api_url + 'recievedchat.php',
					  data    : $.param({id:$rootScope.isloggedIn ,session_id:$scope.session_id ,lastid:$scope.lastid}), 
					  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
					 })
					  .success(function(data) {	
					 if (!data.success) {
						 if(data.status.code==0){	
						 }else{
						 $("html, body").animate({ scrollTop: $(document).height() }, "slow");
						  for(var key in data.body) {
							$scope.chats.push(data.body[key]); 
							 
			               var value = data.body[key];
					        $scope.lastid=data.body[key]['chat_id'];
							
			               } 
							}		 
						} else {

						}
					  });
					} }, 3000);	  
			   
				}

			} else {
				 $scope.chats=[];
			}
		  });
		});

/**********************************controller*****************************************************/
mainApp.controller('edit_sessionController', function($scope,$filter, $routeParams, $rootScope, $http, $location) {
	$scope.id=$routeParams.session_id;	
	$('.spinner').fadeIn('fast');
	$http({
		  method  : 'POST',
		  url     : api_url + 'all_professor.php',
		  data    : $.param({admin:$rootScope.isloggedIn}),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	 })
		  .success(function(data) {
			if(data.status.code == 1){
			$scope.professor = data.body;
	$http({  
	  method  : 'POST',
	  url     : api_url + 'get_session_by_id.php',
	  data    : $.param({ id: $scope.id }),
	  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
	 }).success(function(data) {
		if(data.status.code == 1){
		$scope.findError = data.status.message;
		$rootScope.userForm = data.body;
		var db_date = data.body.started_on.split(/\-|\s/);
		$scope.userForm.date = new Date(db_date.slice(0,3).reverse().join('/')+' '+db_date[3]);;

		$scope.userForm.courses = data.body.courses;
		$scope.userForm.professor = data.body.professor;	
		$scope.userForm.time = data.body.time;
		$http({
		  method  : 'POST',
		  url     : api_url + 'all_university.php',
		  data    : $.param({admin:$rootScope.isloggedIn,professor:data.body.professor}), 
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
	 })
		  .success(function(data) {
			if(data.status.code == 1){
			$scope.courseoptions = data.body;
	}
});


	$http({
		  method  : 'POST',
		  url     : api_url + 'all_time.php',
		  data    : $.param({admin:$rootScope.isloggedIn,course:data.body.courses,professor:data.body.professor}),// pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	 })
		  .success(function(data) {
			if(data.status.code == 1){
			$scope.timeoptions = data.body;
			$scope.userForm = $rootScope.userForm;
	}
});
	/*******************************************************************/
		}
		 $('.spinner').stop().fadeOut('fast');
		});			
	}
});

	

	$scope.getValue=function(){
	$http({
		  method  : 'POST',
		  url     : api_url + 'all_university.php',
		  data    : $.param({admin:$rootScope.isloggedIn,professor:$scope.userForm.professor}), 
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
	 })
		  .success(function(data) {
			if(data.status.code == 1){
			$scope.courseoptions = data.body;
	}
});
	}
	
	
	$scope.getCourseValue=function(){	
	$http({
		  method  : 'POST',
		  url     : api_url + 'all_time.php',
		  data    : $.param({admin:$rootScope.isloggedIn, course:$scope.userForm.courses, professor:$scope.userForm.professor}),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	 })
		  .success(function(data) {
			if(data.status.code == 1){
			$scope.timeoptions = data.body;
	}
});
	}
	

	$scope.save_session=function(){
		if( $scope.loginForm.$invalid==1){
			$scope.loginForm.professor.$pristine=false;
    		$scope.loginForm.courses.$pristine=false;
    		$scope.loginForm.location.$pristine=false;
    		$scope.loginForm.time.$pristine=false;
    		$scope.loginForm.date.$pristine=false;
		}else{
			$scope.userForm.admin=$rootScope.isloggedIn;
			$rootScope.isloggedIn = $scope.userForm.admin;

			if(!$scope.userForm.session_type){
				$scope.userForm.session_type='0';
			}
			$('.spinner').fadeIn('fast');

		    $http({
				  method  : 'POST',
				  url     : api_url + 'save_edit_session.php',
				  data    : $.param($scope.userForm),
				  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
				 })
			  .success(function(data) {
				if(data.status.code == 1){
				 $location.path("/my_created_session"); 
				}else{
				 $scope.loginError=data.status.message;
				}
				$('.spinner').stop().fadeOut('fast');
			  });	 
			}
	}
});

/********************************* BLOCK/UNBLOCK *************************************************/
mainApp.controller('block_unblock_sessionController', function($scope,$routeParams, $rootScope, $http, $location) {
		$('.spinner').fadeIn('fast');
		$http({  
		  method  : 'POST',
		  url     : api_url + 'getCourseStatus.php',
		  data    : $.param({ id: $routeParams.course_id  }),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		  // set the headers so angular passing info as form data (not request payload)
		 }).success(function(data) { 
			if(data.status.code == 1){
		    $scope.findError=data.status.message;
		    $scope.requests=data.body;
		    }else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 
			$('.spinner').stop().fadeOut('fast');
		  });
		  
	$scope.session_block=function(id,index){
	$('.spinner').fadeIn('fast');
	$http({  
		  method  : 'POST',
		  url     : api_url + 'block.php',
		  data    : $.param({ id:id }),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		  // set the headers so angular passing info as form data (not request payload)
		 }).success(function(data) { 
			if(data.status.code == 1){
		    $scope.findError=data.status.message;
			 $location.path("/block_unblock/" + $routeParams.course_id ); 
		   }else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 	
			 $('.spinner').stop().fadeOut('fast');
		  });	
}

$scope.session_unblock=function(id,index){
	$('.spinner').fadeIn('fast');
	$http({  
		  method  : 'POST',
		  url     : api_url + 'unblock.php',
		  data    : $.param({ id:id }),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		  // set the headers so angular passing info as form data (not request payload)
		 }).success(function(data) { 
			if(data.status.code == 1){
		    $scope.findError=data.status.message;
			$location.path("/block_unblock/" + $routeParams.course_id ); 
		   }else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 	
			$('.spinner').stop().fadeOut('fast');
		  });	
}
	 

});

/**********************************controller*****************************************************/
mainApp.controller('notificationController', function($scope,$route, $routeParams, $rootScope, $http, $location) {
		$('.spinner').fadeIn('fast');
		$http({  
		  method  : 'POST',
		  url     : api_url + 'request.php',
		  data    : $.param({ id:$rootScope.isloggedIn }),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		  // set the headers so angular passing info as form data (not request payload)
		 }).success(function(data) { 
			if(data.status.code == 1){
		    $scope.findError=data.status.message;
		    $scope.requests=data.body;
		    }else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 
				$('.spinner').stop().fadeOut('fast');
		  });


		  $scope.extend=function(id, type, session_id){
		  	$('.spinner').fadeIn('fast');
			$http({  
				  method  : 'POST',
				  url     : api_url + 'time_extend.php',
				  data    : $.param({ request_id:id, type: type,session_id:session_id}),
				  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
			 }).success(function(data) { 
				$location.path("/session"); 
				$('.spinner').stop().fadeOut('fast');
			  });
		  }
		  
		  
		  $scope.accept=function(id,index){
		  $('.spinner').fadeIn('fast');
			$http({  
			  method  : 'POST',
			  url     : api_url + 'accept_request.php',
			  data    : $.param({ id:id}),
			  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
			 }).success(function(data) { 
				if(data.status.code == 1){
			    $scope.findError=data.status.message;
				 $scope.requests.splice(index,1);
			    }else{
				$scope.findError=data.status.message;
				}if (!data.success) {
		        $scope.findError=data.status.message;
				} else {} 
					$('.spinner').stop().fadeOut('fast');
			  });
		  }
		  
		  
		  $scope.cancel=function(id,index){
			$('.spinner').fadeIn('fast');
			$http({  
			  method  : 'POST',
			  url     : api_url + 'cancel_request.php',
			  data    : $.param({ id:id }),  // pass in data as strings
			  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
			  // set the headers so angular passing info as form data (not request payload)
			 }).success(function(data) { 
				if(data.status.code == 1){
			    $scope.findError=data.status.message;
			    $scope.requests.splice(index,1);
			    }else{
				$scope.findError=data.status.message;
				}if (!data.success) {
		        $scope.findError=data.status.message;
				} else {}
					$('.spinner').stop().fadeOut('fast');
			  });
		  }

});
/**********************************controller*****************************************************/
mainApp.controller('my_created_sessionController', function($scope,$routeParams, $rootScope, $http, $location) {
$('.spinner').fadeIn('fast');

		$http({  
		  method  : 'POST',
		  url     : api_url + 'getusercreatedsession.php',
		  data    : $.param({ id:$rootScope.isloggedIn }),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		 }).success(function(data) {
			console.log(data);
			if(data.status.code == 1){
		    $scope.findError=data.status.message;
		    $scope.sessions=data.body;
		    }else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 	
			$('.spinner').stop().fadeOut('fast');
		  }); 
		  
		  
$scope.session_delete=function(id,index){
	$('.spinner').fadeIn('fast');
	$http({  
		  method  : 'POST',
		  url     : api_url + 'deletesession.php',
		  data    : $.param({ id:id }),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		 }).success(function(data) { 
			if(data.status.code == 1){
		    $scope.findError=data.status.message;
			 $scope.sessions.splice(index, 1);
		   }else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 
				$('.spinner').stop().fadeOut('fast');
		  });	
}

 $scope.edit=function(id){ 
  $location.path("/edit_session/"+id); 
 }
 
 
  $scope.session_names=function(courseid){ 
  $location.path("/block_unblock/"+courseid); 
 }
 
 $scope.live=function(id){
	$http({  
		  method  : 'POST',
		  url     : api_url + 'session_status.php',
		  data    : $.param({ id:id }),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		  // set the headers so angular passing info as form data (not request payload)
		 }).success(function(data) { 
			if(data.status.code == 1){
		    $scope.findError=data.status.message;
			}else{
			$scope.findError=data.status.message;
			}if (!data.success) {
	        $scope.findError=data.status.message;
			} else {} 			
		  }); 
		  } 
	 });




/**********************************controller*****************************************************/
mainApp.controller('my_sessionController', function($scope,$routeParams, $rootScope, $http, $location) {
	$('.spinner').fadeIn('fast');
	$http({  
	  method  : 'POST',
	  url     : api_url + 'getmysession.php',
	  data    : $.param({ id:$rootScope.isloggedIn }),
	  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
	 }).success(function(data) { 
		if(data.status.code == 1){
		    $scope.findError=data.status.message;
		    $scope.sessions=data.body;
	    }else{
		$scope.findError=data.status.message;
		}if (!data.success) {
        $scope.findError=data.status.message;
		} else {} 	
		$('.spinner').stop().fadeOut('fast');
	  }); 


});

/**********************************controller*****************************************************/
mainApp.controller('find_resultController', function($scope,$routeParams, $rootScope, $http, $location) {

	$scope.searchform={};
	$scope.searchform.admin=$rootScope.isloggedIn;
	$scope.searchform.professor=$routeParams.professor;	
	$scope.searchform.date=$routeParams.date;
	$scope.searchform.courses=$routeParams.courses;
	 
    $scope.join=function(index,session_id,session_type){
		console.log(session_id);
		$http({  
		  method  : 'POST',
		  url     : api_url + 'join_session.php',
		  data    : $.param({ user_id:$rootScope.isloggedIn,session_id:session_id,session_type:session_type }),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		 }).success(function(data) { 
			

			if(data.status.code == 1){
		    	$scope.findError = data.status.message;
		    	$scope.sessions.splice(index, 1);
			}else{
				$scope.findError=data.status.message;
			}if (!data.success) {
	        	$scope.findError=data.status.message;
			}	
				
		  }); 
		  }
		  $('.spinner').fadeIn('fast');
		  
		$http({   method  : 'POST',
		  url     : api_url + 'searchsession.php',
		  data    : $.param($scope.searchform),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		 })
		  .success(function(data) {
		  	console.log(data);
			if(data.status.code == 1){
		   		$scope.findError=data.status.message;
		    	$scope.sessions=data.body;
			}else{
				$scope.findError=data.status.message;
			}
		   $('.spinner').stop().fadeOut('fast');			
		});	

});



/**********************************controller*****************************************************/
mainApp.controller('registerController', function($scope,$filter, $rootScope, $http, $location) {
	
	$scope.facebookLogin=function(){  
	   facebookConnectPlugin.login( ["email"], 
        function (response) {
		facebookConnectPlugin.api( "me/?fields=id,name,email,picture", ["user_birthday"],
        function (response) {
		var length=response.name.split(' ').length;
		var firstName = response.name;
		var lastName = response.name;
			if(length>1){
			var fullName =response.name;
			firstName ='';
			lastName ='';
			firstName = fullName.split(' ').slice(0, -1).join(' ');
			lastName  =  fullName.split(' ').slice(-1).join(' ');
			}
			
			$http({   method  : 'POST',
			url     : api_url + 'fblogin.php',
			data    : $.param({fbid:response.id,first_name:firstName,last_name:lastName,email:response.email,pic:response.picture.data.url }),  // pass in data as strings
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		  // set the headers so angular passing info as form data (not request payload)
		     }).success(function(data) {
			if(data.status.code == 1){
			 $rootScope.isloggedIn = data.body.id; 	
			 $scope.loginError=data.status.message;
			 window.localStorage.setItem("fbid", data.body.fbid);
			 window.localStorage.setItem("fblogin", 1);
			  window.localStorage.setItem("institute", data.body.institute);
		     window.localStorage.setItem("admin", data.body.id);
		     window.localStorage.setItem("fullname", data.body.first_name+" "+data.body.last_name); 
			 $location.path("/session"); 
			}else{
			 $scope.registerError=data.status.message;
			}if (!data.success) {
	         $scope.registerError=data.status.message;
			} else {}
		  });},
          function (response) { 
		  alert(JSON.stringify(response));
		  alert('Some error found during login with facebook.') }); 
		},function (response) {
		alert(JSON.stringify(response));
		alert('Some error found during login with facebook.'); });

	}	
	
	
});

/**********************************controller*****************************************************/
mainApp.controller('settingController', function($scope,$filter,$route, $rootScope, $http,$location){
	  $('.spinner').stop().fadeOut('fast');
	  if(window.localStorage.getItem("fblogin")==1){
		    $scope.fblogin = 1; 
	  }
	  else{  $scope.fblogin = false; }
		var win = function(r) {
			$('.spinner').stop().fadeOut('fast');
		}
	
	var fail = function(error) {
		console.log("upload error source " + error.source);
		console.log("upload error target " + error.target);
	}
    
    var onSuccess = function(FILE_URI) {
		$('.spinner').stop().fadeOut('fast');
        $scope.picData='';
		$scope.picData = FILE_URI;
		var random = Math.floor(Math.random()*1000);
        $scope.profilepic = FILE_URI + "?dummy=" + random;
		//alert(fileName);
        $scope.$apply();		
		var myImg =$scope.picData;	
		var options = new FileUploadOptions();
		options.fileKey="pic";
		options.chunkedMode = false;
		options.fileName="myphoto.jpg";
		options.mimeType="image/jpeg";
		var params = {userid:$rootScope.isloggedIn};
		options.params = params; 
		var ft = new FileTransfer();
		ft.headers = { Connection: "close" };
		ft.upload(myImg,encodeURI(api_url + "changeprofilepic.php"), win, fail,options);	
	};
    var onFail = function(e) {
        console.log("On fail " + e);
    }
	
	$scope.takePic = function() {
		$('.spinner').fadeIn('fast');
		$scope.chatSendstatus=1;
		var options =   {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 2,
            encodingType: 0
        }
        navigator.camera.getPicture(onSuccess,onFail,options);
	}
	$scope.takePic_ = function() {
		$('.spinner').fadeIn('fast');
		$scope.chatSendstatus=1;
		var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: 0
        }
        navigator.camera.getPicture(onSuccess,onFail,options);
	}

		$scope.profilepic=api_url + 'upload/study_seshlogo.png';
		$http({
		  method  : 'POST',
		  url     : api_url + 'user_all_university.php',
		data    : $.param,
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		 }).success(function(data) {
			if(data.status.code == 1){
				$scope.instituteoptions = data.body;
				$('.spinner').stop().fadeOut('fast');
			} });
		
		$scope.userForm={};
		$scope.userForm.id=$rootScope.isloggedIn;
		$http({   method  : 'POST',
		url     : api_url + 'getuserbyid.php',
		data    : $.param($scope.userForm),  // pass in data as strings
		headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
	}).success(function(data) {
		$scope.userForm=data.body;
		$scope.profilepic=data.body.pic;
		if(data.status.code == 1){
		if((window.localStorage.getItem("fblogin")==1) && (window.localStorage.	getItem("institute")=='')){
			$scope.registerError='Please select a university first.';
			alert('Please select a university first.');
		}
	}else{
		 $scope.registerError=data.status.message;
	}if (!data.success) {
		 $scope.registerError=data.status.message;
	} else {
    }});	

	$scope.registerError='';
	$scope.processsettingForm=function(){
		if( $scope.loginForm.$invalid==1){
			$scope.loginForm.first_name.$pristine=false;
			$scope.loginForm.last_name.$pristine=false;
			$scope.loginForm.email.$pristine=false;
			$scope.loginForm.institute.$pristine=false;
			if($scope.fblogin == false){
				$scope.loginForm.oldpassword.$pristine=false;
			}
		}else{
			var URL= api_url + 'savesetting.php';
		 	if(window.localStorage.getItem("fblogin")==1){
				URL= api_url + 'savesetting.php?fbid='+window.localStorage.getItem("fbid");
			}
			
			window.localStorage.setItem("institute",$scope.loginForm.institute);
			$http({   method  : 'POST',
				url     :URL,
				data    : $.param($scope.userForm),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
				}).success(function(data) {
					if(data.status.code == 1){
					  $location.path("/session"); 
					}else{
						 $scope.registerError=data.status.message;
					}
				});

 		}
 	}
});

/**********************************controller*****************************************************/
mainApp.controller('find_sessionController', function($scope,$filter, $rootScope, $http, $location) {
	$('.spinner').fadeIn('fast');

	$scope.master = {};
	$scope.update = function(user) {
		$scope.master = angular.copy(searchform);
	};
	$scope.reset = function() {
		$scope.searchform = angular.copy($scope.master);
	};
	$scope.reset();

	$http({
		  method  : 'POST',
		  url     : api_url + 'single_user.php',
		  data    : $.param({user_id:$rootScope.isloggedIn}),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
	 }).success(function(data) {
	 	console.log(data.body['0'].institute);

	 	if( typeof data.body['0'].institute !== 'undefined' && data.body['0'].institute!=null) {
			$scope.university=1;
		}else{
			$scope.university=0;
		}
	});

	$http({
		  method  : 'POST',
		  url     : api_url + 'all_professor.php',
		  data    : $.param({admin:$rootScope.isloggedIn}),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
	 }).success(function(data) {
			if(data.status.code == 1){
			$scope.professor = data.body;
			$('.spinner').stop().fadeOut('fast');
	}else{
		$('.spinner').stop().fadeOut('fast');
		$scope.findError=data.status.message;
	}
	});
	$scope.getTimeVal=function(){
		$scope.searchform.date1 = $filter('date')( $scope.searchform.date, 'yyyy-MM-dd');	
	}


	$scope.getValue=function(){	
		$scope.getSelection = true;
		$http({
			  method  : 'POST',
			  url     : api_url + 'all_university.php',
			  data    : $.param({admin:$rootScope.isloggedIn,professor:$scope.searchform.professor}), 
			  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		 })
			  .success(function(data) {
				if(data.status.code == 1){
				$scope.courseoptions = data.body;
		}
		});
	}

    $scope.find=function(){
		if( $scope.loginForm.$invalid==1){
			$scope.loginForm.professor.$pristine=false;
		}else{
			var find_path='/find_result/'+$scope.searchform.professor+'/'+$scope.searchform.courses+'/'+$scope.searchform.date1;
			$location.path(find_path);
		}
	}

});

/**********************************controller*****************************************************/
mainApp.controller('create_registerController', function($scope,$filter, $rootScope, $http, $location) {

	$scope.master = {};
	$scope.update = function(user) {
		$scope.master = angular.copy(userForm);
	};
	$scope.reset = function() {
		$scope.userForm = angular.copy($scope.master);
	};
	$scope.reset();

$scope.processregisterForm=function(){
	if( $scope.loginForm.$invalid==1){
		$scope.loginForm.first_name.$pristine=false;
		$scope.loginForm.last_name.$pristine=false;
		$scope.loginForm.password.$pristine=false;
		$scope.loginForm.email.$pristine=false;
	}else{
		$('.spinner').fadeIn('fast');
     	$http({   method  : 'POST',
		  url     : api_url + 'register.php',
		  beforeSend : function() {  $('.spinner').fadeIn('fast'); },
		  data    : $.param($scope.userForm),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		}).success(function(data) {
		  	$('.spinner').fadeOut('fast');
			if(data.status.code == 1){
			 	$rootScope.isloggedIn =  data.body['0'].id; 
				 window.localStorage.setItem("fblogin", false);
			     window.localStorage.setItem("admin", data.body['0'].id);
			     window.localStorage.setItem("fullname", data.body['0'].first_name+" "+data.body['0'].last_name); 
				 $location.path("/session"); 
			}else{
				$scope.registerError=data.status.message;
			}
			$('.spinner').stop().fadeOut('fast');
		});
	}
}
});
/**********************************controller*****************************************************/
mainApp.controller('create_sessionController', function($scope,$filter, $rootScope, $http, $location) {
	
 	$scope.master = {};
	$scope.update = function(user) {
		$scope.master = angular.copy(userForm);
	};
	$scope.reset = function() {
		$scope.userForm = angular.copy($scope.master);
	};
	$scope.reset();


	$('.spinner').fadeIn('fast');
	$http({
		  method  : 'POST',
		  url     : api_url + 'single_user.php',
		  data    : $.param({user_id:$rootScope.isloggedIn}),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
	 }).success(function(data) {
	 	if( typeof data.body['0'].institute !== 'undefined' && data.body['0'].institute!=null) {
			$scope.university=1;
		}else{
			$scope.university=0;
		}
	});



	$http({
		  method  : 'POST',
		  url     : api_url + 'all_professor.php',
		  data    : $.param({admin:$rootScope.isloggedIn}),
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	 })
		  .success(function(data) {
			if(data.status.code == 1){
			$scope.professor = data.body;
			$('.spinner').stop().fadeOut('fast');
		}else{
			$('.spinner').stop().fadeOut('fast');
			$scope.findError=data.status.message;
		}
	});

	$scope.getValue=function(){
		$http({
				  method  : 'POST',
				  url     : api_url + 'all_university.php',
				  data    : $.param({admin:$rootScope.isloggedIn,professor:$scope.userForm.professor}),  // pass in data as strings
				  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
			 })
				  .success(function(data) {
					if(data.status.code == 1){
					$scope.courseoptions = data.body;
			}
		});
	}
	
	$scope.getCourseValue=function(){
	$http({
		  method  : 'POST',
		  url     : api_url + 'all_time.php',
		  data    : $.param({admin:$rootScope.isloggedIn,course:$scope.userForm.courses,professor:$scope.userForm.professor}),  // pass in data as strings
		  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
	 })
		  .success(function(data) {
			if(data.status.code == 1){
			$scope.timeoptions = data.body;
	}
	});
	}
	

	$scope.create_session=function(){
    	if( $scope.loginForm.$invalid==1){
    		$scope.loginForm.professor.$pristine=false;
    		$scope.loginForm.courses.$pristine=false;
    		$scope.loginForm.location.$pristine=false;
    		$scope.loginForm.time.$pristine=false;
    		$scope.loginForm.date.$pristine=false;
    	}else{
    		$scope.userForm.admin=$rootScope.isloggedIn;
			$rootScope.isloggedIn = $scope.userForm.admin;

			if(!$scope.userForm.session_type){
				$scope.userForm.session_type='0';
			}
			$('.spinner').fadeIn('fast');
    		$http({
				  method  : 'POST',
				  url     : api_url + 'create_session.php',
				  data    : $.param($scope.userForm),
				  headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
				 })
			  .success(function(data) {
					if(data.status.code == 1){
						$location.path("/my_created_session"); 
					}else{
						$scope.loginError=data.status.message;
					}
					$('.spinner').stop().fadeOut('fast');
			  });
		}	 
	}		
});

/**********************************controller*****************************************************/
mainApp.controller('logoutController', function($scope, $rootScope, $http, $location) {
	$location.path("/home");

	window.localStorage.setItem("admin", '');
	window.localStorage.setItem("fullname",'');				 
	window.localStorage.setItem("fbid", '');
	window.localStorage.setItem("fblogin", '');
	window.localStorage.setItem("pic", '');
	window.localStorage.setItem("firstName", '');
	window.localStorage.setItem("lastName", '');
	if(window.localStorage.getItem("emailLogin") != '' && window.localStorage.getItem("pwdLogin") != '') {				
	var emailLocal = window.localStorage.getItem("emailLogin");	
	$rootScope.userForm1 = window.localStorage.getItem("emailLogin");		
	$('#email').val(emailLocal);					
	$('#pwd').val(window.localStorage.getItem("pwdLogin"));				
	$('#remember').attr('checked', 'checked');
	console.log(window.localStorage.getItem("emailLogin"));
	console.log(window.localStorage.getItem("pwdLogin"));
	}
	

	if( typeof chat_interval !== 'undefined' ) {
		clearInterval(chat_interval);
	}
});

/**********************************controller*****************************************************/
mainApp.controller('sessionController', function($scope, $rootScope, $http, $location) {
 $('.spinner').stop().fadeOut('fast');
 function redirect(){
	 if(window.localStorage.getItem("admin")!='' || window.localStorage.getItem("admin")!=null || $rootScope.isloggedIn==undefined){
		$rootScope.isloggedIn=window.localStorage.getItem("admin");		
	 }else{
		$location.path("/home"); 
	 }
 }
 document.addEventListener("backbutton", redirect, false);
  if(window.localStorage.getItem("admin")!='' || window.localStorage.getItem("admin")!=null || $rootScope.isloggedIn==undefined){
		$rootScope.isloggedIn=window.localStorage.getItem("admin");		
	 }else{
		$location.path("/home"); 
	 }
 	if(window.localStorage.getItem("institute")==''){
		$location.path("/setting"); 
	};
	if( typeof chat_interval !== 'undefined' ) {
        clearInterval(chat_interval);
    }
});
/**********************************controller*****************************************************/
mainApp.controller('loginController', function($scope, $rootScope, $http, $location,$timeout){
	$scope.facebookLogin=function(){  
	   facebookConnectPlugin.login( ["email"], 
        function (response) {
		facebookConnectPlugin.api( "me/?fields=id,name,email,picture", ["user_birthday"],
        function (response) {
		var length=response.name.split(' ').length;
		var firstName = response.name;
		var lastName = response.name;
			if(length>1){
			var fullName =response.name;
			firstName ='';
			lastName ='';
			firstName = fullName.split(' ').slice(0, -1).join(' ');
			lastName  =  fullName.split(' ').slice(-1).join(' ');
			}
			
			$http({   method  : 'POST',
			url     : api_url + 'fblogin.php',
			data    : $.param({fbid:response.id,first_name:firstName,last_name:lastName,email:response.email,pic:response.picture.data.url }),  // pass in data as strings
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		  // set the headers so angular passing info as form data (not request payload)
		     }).success(function(data) {
			if(data.status.code == 1){
			 $rootScope.isloggedIn = data.body.id; 	
			 $scope.loginError=data.status.message;
			 window.localStorage.setItem("fbid", data.body.fbid);
			 window.localStorage.setItem("fblogin", 1);
			 window.localStorage.setItem("institute", data.body.institute);
		     window.localStorage.setItem("admin", data.body.id);
		     window.localStorage.setItem("fullname", data.body.first_name+" "+data.body.last_name); 
			 $location.path("/session"); 
			}else{
			 $scope.registerError=data.status.message;
			}if (!data.success) {
	         $scope.registerError=data.status.message;
			} else {}
		  });},
          function (response) { 
		  //alert(JSON.stringify(response));
		  alert('Some error found during login with facebook.') }); 
		},function (response) {
		//alert(JSON.stringify(response));
		alert('Some error found during login with facebook.'); });

	}
  
	 if(window.localStorage.getItem("admin")!='' && window.localStorage.getItem("admin")!=null && $rootScope.isloggedIn==undefined){
		$rootScope.isloggedIn=window.localStorage.getItem("admin");
		$location.path("/session");
	 }
	 else{
		$location.path("/home");
	 }	 
	
	
	 if(window.localStorage.getItem("emailLogin")!='' && window.localStorage.getItem("emailLogin")!=null ){	 
	 $scope.userForm = [];
	 $timeout(function() {
            $scope.userForm.email = window.localStorage.getItem("emailLogin");
			$scope.userForm.password = window.localStorage.getItem("pwdLogin");
			$scope.userForm.remember = true;
        });   
	
	 }
	
	 $('#remember_me').click(function() {
	 if( $(this).prop("checked") == true ) {
	  //if ($('#remember_me').is(':checked')) {
	 //alert("cheked"+$('#email').val());
	 window.localStorage.setItem('emailLogin', $('#email').val());
	 window.localStorage.setItem('pwdLogin', $('#pwd').val());
	// alert("get"+window.localStorage.getItem("emailLogin"));
	 /*$('#remember').attr('checked', 'checked');
	 $('#email').val(window.localStorage.getItem("emailLogin"));
	 $('#pwd').val(window.localStorage.getItem("pwdLogin"));*/
	 } 
	 else {
	  window.localStorage.setItem('emailLogin', '');
	  window.localStorage.setItem('pwdLogin', '');
	}
	 });         
	
	 
 $scope.loginError='';
 $scope.userForm ={};
 $scope.processloginForm = function() {
	 	if( $scope.loginForm.$invalid==1){
			$scope.loginForm.email.$pristine=false;
			$scope.loginForm.password.$pristine=false;
		}else{
			$('.spinner').fadeIn('fast');
			$http({
			  method  : 'POST',
			  url     : api_url + 'login.php',
			  data    : $.param($scope.userForm), 
			  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
			 }).success(function(data) {
				if(data.status.code == 1){			 
					 $rootScope.isloggedIn = data.body.id;
					 window.localStorage.setItem("fblogin", false);
				     window.localStorage.setItem("admin", data.body.id);
				     window.localStorage.setItem("fullname", data.body.first_name+" "+data.body.last_name); 
					 $location.path("/session"); 
				}else{
				 $scope.loginError=data.status.message;
				}
				 $('.spinner').stop().fadeOut('fast');
			});
		}
	}	  	  
});

mainApp.directive("countDown", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
        	attrs.$observe('tooltip1', function(value) {
	            elem.countdown(value, function(event) {
				    $(this).html(event.strftime('%w weeks %d days %H:%M:%S'));
				});
        	});
        }
    }
});
