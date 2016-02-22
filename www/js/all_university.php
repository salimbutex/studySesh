<?php


header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Origin: *');

require_once("common/common.php");



try{

	//Required Field
	
	$requiredField =	array();
			
	$validResponse = checkRequired($requiredField);
	  	  
	if(count($validResponse) > 0){
	  
		throw new Exception(implode(' , ' , $validResponse));
		
    }
	
	//Not Required Field
	
	$field =	array('admin'   => assignDefault($_REQUEST['admin']  ),'id'   => assignDefault($_REQUEST['id']  ));	
	
	$paramArray = array_merge($requiredField , $field);  // typecast this array  , (  (array) $requiredField , (array ) $field  )
	
	array_walk($paramArray , 'getSafeValue');	
	
	extract($paramArray ,EXTR_OVERWRITE);
		
	
	
	
	/* 
	 if(!dbExist($username,'`username`' , USER_TABLE)){
	      throw new Exception('user name already registered');	 
	
	} 
	if(!dbExist($email,'`email`' , USER_TABLE)){
	
			throw new Exception('email already register');	 
	
	}*/

	if( $paramArray['admin']!='' OR  $paramArray['id']==''){ 
	
		 $query = "SELECT * FROM `".GROUP."` WHERE `admin`='". $admin ."' ";
	$queryResult  = executeQuery( $query, true , FAILURE_CODE , 'Insert Query Execution Failed ' , false);
	foreach($queryResult as $key=>$val){
		 $subQuery.=$queryResult[$key]['id'].',';
	}
	 $subQuery=rtrim($subQuery, ",");
	 $query1 = "SELECT `".GROUP."`.* FROM `".GROUP_MEMBER."` INNER JOIN  `".GROUP."` on `".GROUP_MEMBER."`.groupid=`".GROUP."`.id WHERE `".GROUP_MEMBER."`.`userid`='". $admin ."' and `".GROUP."`.id NOT IN ({$subQuery})";
	$queryResult1  = executeQuery( $query1, true , FAILURE_CODE , 'Insert Query Execution Failed ' , false);
    $queryResult=array_merge($queryResult,$queryResult1);
	}else{
	 $query = "SELECT * FROM `".GROUP."` WHERE `".GROUP."`.`id`='". $id ."'";
	$queryResult  = executeQuery( $query, true , FAILURE_CODE , 'Insert Query Execution Failed ' , false);
	 $query_members = "SELECT `".GROUP_MEMBER."`.id as groupmemberRELid,`".USER_TABLE."`.id as userid,`".USER_TABLE."`.first_name,`".USER_TABLE."`.last_name,`".USER_TABLE."`.pic FROM `".GROUP."` LEFT JOIN `".GROUP_MEMBER."` on `".GROUP_MEMBER."`.groupid=`".GROUP."`.id LEFT JOIN `".USER_TABLE."` on `".USER_TABLE."`.id=`".GROUP_MEMBER."`.userid WHERE `".GROUP."`.`id`='". $id ."'";
	 $queryResult1  = executeQuery( $query_members, true , FAILURE_CODE , 'Insert Query Execution Failed ' , false);
	 if($queryResult1[0]['userid']==null){
		 $queryResult[0]['members']=null; 
	 }else{
	 $queryResult[0]['members']=$queryResult1 ;
	 }
	}

						
    if($queryResult == false){

			throw new Exception('Universities Coudn\'t be Found');
    
	 }	
					
	$status['code'] = SUCCESS_CODE;
	
	$status['message'] = 'Universities retrieved successfully';	
	
	$body = $queryResult;
	
	sendResponse($status , $body);  	

}
catch(Exception $e)
{			
  
		$status['code'] = FAILURE_CODE;
		
		$status['message'] = $e->getMessage();	
		
		sendResponse($status);  			
}
?>