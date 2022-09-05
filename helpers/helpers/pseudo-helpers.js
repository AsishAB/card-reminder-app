/*

// ============================================================================================================================================
// ============================================================================================================================================
 

# To prepare statement for procedure call.
	public static function makeProcedureCall($arrVals,$debug=0){
		$parmaset="SET ";
		if(!empty($arrVals)) {
			foreach($arrVals as $key => $val) {
				$parmaset .= '@p_' . $key . "='" . str_replace(array("'", "\\", '"'), array("''", "\\\\\\\\", '\"'), $val) . "',";
			}
			if($debug) {
				$parmaset .= "@p_debug=1";
			}
			
			$parmaset = rtrim($parmaset, ',');
		
		}else{
			$parmaset .= "@p_empty='1'";
		}
		return $parmaset; 
	}	
	# To prepare statement for procedure call.
	public static function makeProcedureCallArr($arrVals,$debug=0){
        //print_r($arrVals);exit;
		$parmaset="SET ";
		if(!empty($arrVals)) {
			foreach($arrVals as $key => $val) {
				if($val[0]){
					$parmaset .= '@p_' . $key . "='" . str_replace(array("'", "\\", '"'), array("''", "\\\\\\\\", '\"'), $val[1]) . "',";
				}else{
					$parmaset .= '@p_' . $key . "=" . str_replace(array("'", "\\", '"'), array("''", "\\\\\\\\", '\"'), $val[1]) . ",";
				}
			}
			if($debug) {
				$parmaset .= "@p_debug=1";
			}
			
			$parmaset = rtrim($parmaset, ',');
		
		}else{
			$parmaset .= "@p_empty='1'";
		}

		return $parmaset; 
	}	
	# To cut the string to a specific length.
    public static function cut($string, $max_length) {
        if (strlen($string) > $max_length) {
            $string = substr($string, 0, $max_length);
            $pos = strrpos($string, " ");
            if ($pos === false) {
                return substr($string, 0, $max_length) . "...";
            }
            return substr($string, 0, $pos) . "...";
        } else {
            return $string;
        }
    }
    public static function formatDateForMySqlDB($date,$time=0) {
    	$formatdate='';
    	if($time==1){
    		$formatdate = date("Y-m-d h:i:s", strtotime($date));
    	}else{
    		$formatdate = date("Y-m-d", strtotime($date));
    	}
        return $formatdate;
    }
    public static function getHasedPassword($password,$type) {
       
        if($type=='PASSWORD_ARGON2I'){
        	$haspassword = password_hash($password, PASSWORD_ARGON2I);
        }else if($type=='PASSWORD_DEFAULT'){
        	$haspassword = password_hash($password, PASSWORD_DEFAULT);
        }else{
            $haspassword = password_hash($password, PASSWORD_BCRYPT);
        }
        return $haspassword;
    }
    public static function getUserPhoto() {
        $loginUserId = session()->has('userId') ? session()->get('userId'):0;
        $result = DB::table('tbl_user_mstr')->select('TUM_User_Image')->where('TUM_User', '=', $loginUserId)->get();
        if(!empty($result[0])){
            $profileOrgImg = ($result[0]->TUM_User_Image !='')? 'storage/'.$result[0]->TUM_User_Image : 'dist/img/user2-160x160.jpg';
        }else{
            $profileOrgImg = 'asset("public/dist/img/user2-160x160.jpg")';
        }
        return $profileOrgImg;
    }

    public static function getUserName() {
        $loginUserId = session()->has('userId') ? session()->get('userId'):0;
        $result = DB::table('tbl_user_mstr')->select('TUM_User_Name','TUM_User_Lname')->where('TUM_User', '=', $loginUserId)->get();
        echo !empty($result[0]) ? $result[0]->TUM_User_Name.' '.$result[0]->TUM_User_Lname :'';
    }
    public static function getUserType() {
       $loginUserId = session()->has('userId') ? session()->get('userId'):0;
       $loginUserType = session()->has('userType') ? session()->get('userType'):'';
       $result = DB::table('tbl_user_mstr as tum')
                ->leftJoin('tbl_user_type_mstr as utm','utm.TUT_UserType','=','tum.TUM_User_UserType')
                ->select('utm.TUT_UserTypeName')
                ->where('tum.TUM_User', '=', $loginUserId)->get();
    
       echo $usertype= (!empty($result[0])) ? $result[0]->TUT_UserTypeName :'';
    }
 
    
    public static function getUserRegDate() {
        $loginUserId = session()->has('userId') ? session()->get('userId'):0;
        $result = DB::table('tbl_user_mstr')->select('TUM_User_CreatedOn')->where('TUM_User', '=', $loginUserId)->get();
        echo !empty($result[0]) ? date('M, Y',strtotime($result[0]->TUM_User_CreatedOn)) :'';
    }
    public static function getResetOtpTime() {
        $result = DB::table('tbl_user_login_setting')->select('TULS_Reset_OTP_Time')->get();
        return !empty($result[0]) ? $result[0]->TULS_Reset_OTP_Time :'';
    }
    
    public static function checkSecurity($server){    
		if(isset($server['REQUEST_METHOD']) && $server['REQUEST_METHOD']=='POST'){
			if(false !== strpos($server['SERVER_NAME'],SERVER_NAME)){      
				return true;
			}else{
				return false;
			}
			
		}else{
			return false;
		}
	}

    
//Protect form XSS
	// exports.checkXss = (string='',stripTag=true,htmlspecialcharacter=true) => {
    //     // 	Search for this - https://stackoverflow.com/questions/52966409/node-js-equivalent-for-htmlspecialchars-in-php
	// 	if($stripTag){
	// 		string=string.replace(/(<([^>]+)>)/gi, "");
	// 		string = str_ireplace( '%3Cscript', '', string );
	// 	}		
	// 	if(htmlspecialcharacter){
	// 		$string=htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
	// 	}		
	// 	return $string;
	// }
	//Check from XSS and SQL Injection
	// exports.checkXssSqlInjection = (string='',stripTag=true,htmlspecialcharacter=true,mysql_real_escape=true) => {
	// 	Search for this - https://stackoverflow.com/questions/52966409/node-js-equivalent-for-htmlspecialchars-in-php
	// 	if(stripTag){
	// 		string=string.replace(/(<([^>]+)>)/gi, "");
	// 	}
	// 	if($htmlspecialcharacter){
	// 		string=htmlspecialchars(string, ENT_QUOTES, 'UTF-8');
	// 	}
	// 	if(mysql_real_escape){
	// 		//$string=mysqli_real_escape_string($this->connection_db,$string);
	// 		string= str_replace(array('\\', "\0", "\n", "\r", "'", '"', "\x1a"), array('\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'), $string); 
	// 	}
	// 	return $string;
	// }
    	//Clean xss
	    public static function xss_clean($data){
        // Fix &entity\n;
        $data = str_replace(array('&amp;','&lt;','&gt;'), array('&amp;amp;','&amp;lt;','&amp;gt;'), $data);
        $data = preg_replace('/(&#*\w+)[\x00-\x20]+;/u', '$1;', $data);
        $data = preg_replace('/(&#x*[0-9A-F]+);iu', '$1;', $data);
        $data = html_entity_decode($data, ENT_COMPAT, 'UTF-8');
        // Remove any attribute starting with "on" or xmlns
        $data = preg_replace('#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+>#iu', '$1>', $data);
        // Remove javascript: and vbscript: protocols
        $data = preg_replace('#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $data);
        $data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $data);
        $data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $data);
        // Only works in IE: <span style="width: expression(alert('Ping!'));"></span>
        $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?expression[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
        $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?behaviour[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
        $data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:*[^>]*+>#iu', '$1>', $data);
        // Remove namespaced elements (we do not need them)
        $data = preg_replace('#</*\w+:\w[^>]*+>#i', '', $data);
        do{
		// Remove really unwanted tags
		$old_data = $data;
		$data = preg_replace('#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $data);
        }while ($old_data !== $data);
        // we are done...
        return $data;
	}

    //Genrate Key for url passing
	public static function keyMaker($id){ 
		//generate the secret key anyway you like. It could be a simple string like in this example or a database 
		//look up of info unique to the user or id. It could include date/time to timeout keys. 
		$secretkey='1HutysK98UuuhDasdfafdCrackThisBeeeeaaaatchkHgjsheIHFH44fheo1FhHEfo2oe6fifhkhs'; 
		$key=md5($id.$secretkey); 
		return $key; 
	}

    	
        public static function getLoginUserInfo() {
        $loginUserId = session()->has('userId') ? session()->get('userId'):0;
        $result = DB::table('tbl_user_mstr as tum')
        		->leftjoin('tbl_userrole_assign as tua','tum.TUM_User', '=', 'tua.TURA_User')
                ->leftjoin('tbl_userrole_mstr as turm','tua.TURA_UserRole', '=', 'turm.TURM_UserRole')
                

                ->leftjoin('tbl_grampanchayat_list_mstr as tgpl','tum.TUM_Panchayat', '=', 'tgpl.TGPM_Panchayat_Code')
                ->leftjoin('tbl_district_mstr as tdtm','tum.TUM_District', '=', 'tdtm.TDM_Dist_Code')
                ->leftjoin('tbl_block_list_mstr as tbl','tum.TUM_Block', '=', 'tbl.TBLM_Block_Code')
                ->leftjoin('tbl_caste_mstr as tcm','tum.TUM_Caste','=','tcm.TCM_Id')

                ->select('tum.TUM_User_Name','tum.TUM_User_Lname','tum.TUM_Caste','tcm.TCM_Caste','tcm.TCM_Caste_Odia','tcm.TCM_Caste_Combined', DB::raw("(GROUP_CONCAT(tua.TURA_UserRole)) as assignedRoles"),DB::raw("(GROUP_CONCAT(turm.TURM_URole_Name)) as assignedRolesName"),'tgpl.TGPM_Panchayat_Code','tgpl.TGPM_Panchayat_Name','tdtm.TDM_Dist_Code','tdtm.TDM_Dist_Name','tbl.TBLM_Block_Code','tbl.TBLM_Block_Name',"TUM_User_Mobile")
        		->where('tum.TUM_User', '=', $loginUserId)
        		->groupBy('tua.TURA_User')
        		->get();
        		
        return !empty($result[0]) ? $result[0] :array();
    }
// ============================================================================================================================================
// ============================================================================================================================================
 
*/
