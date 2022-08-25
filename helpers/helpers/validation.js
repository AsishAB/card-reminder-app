
/*

==================================================================================================================
==================================================================================================================
##################Function to validate Year  ################# 

function yearValidation(fieldId,fieldType, message) {
    var year=$('#' + fieldId).val();
    var text = /^[0-9]+$/;
    if(year.length==4 ) {
      if (year != 0) {
          if ((year != "") && (!text.test(year))) {
  
              swal("Please Enter Numeric Values Only "+message);
              $('#' + fieldId).focus();
              return false;
          }
  
          if (year.length != 4) {
             swal("Year should be of 4 numeric digits "+message);
                $('#' + fieldId).focus();
              return false;
          }
         // var current_year=new Date().getFullYear();
          // if((year < 1920))
          //     {
          //     alert("Year should be in range 1920 to current year");
          //     return false;
          //     }
          return true;
      } else{
        swal("Year should be of 4 numeric digits "+message);
           $('#' + fieldId).focus();
         return false;
      }
    }else{
        swal("Year should be of 4 numeric digits "+message);
           $('#' + fieldId).focus();
         return false;
      }
  }
  
   ############### Function to check custom special character  ############### 
  ============== custom Special character is input =============
  function checkCustomSpecialChar(fieldId,fieldName,splCharacterArr){
    var str = $('#' + fieldId).val();
    
    for (var i = 0; i < splCharacterArr.length; i++){
        if (str.indexOf(splCharacterArr[i]) > 0) {
            $('#' + fieldId).focus();
            swal("Special character " + splCharacterArr[i] + " is not allowed For "+ fieldName +"!!!");
            return false;
        }
    }
    return true;
  }



==================================================================================================================
==================================================================================================================

*/



  /*##################Function to check Textfield having no value ################# */
  exports.blankValidation = (data, fieldName, message='') => {
      /*=====================For Textfield blankValidation================== */
      //if(fieldType == "TextField" || fieldType == "TextArea"){
        if (data == '') {
          
          message = fieldName + " cannot be blank"; //fieldName example- Name, Mobile Number, etc.
          return true;
        }
        return false;
      //}
  
  
  
  }

   /*##################Function to check File Upload having no value ################# */
   exports.fileBlankValidation = (data, fieldName, message='') => {
    /*=====================For Textfield blankValidation================== */
    //if(fieldType == "TextField" || fieldType == "TextArea"){
      if (data == '' || data == undefined) {
        
        message = fieldName + " cannot be blank"; //fieldName example- Name, Mobile Number, etc.
        return true;
      }
      return false;
    //}



}
  
  /*#################Function to Check the character length of a field ####################### */
  exports.fieldLengthCheck = (data,fieldLen, fieldName,checkType) => {
    /*===============Function to Check the maxlength character of a field================ */
    let message = '';
    if(checkType == "Max"){
      if (data.length > fieldLen && data.length > 0){
          
          message = fieldName + ' cannot more than ' + fieldLen + ' charater !!!';
          return message;
      }
      return message;
    }
  
    /*===============Function to Check the minlength character of a field================ */
    if(checkType == "Min"){
      if (data.length < fieldLen && data.length > 0){
        
        message = fieldName + ' cannot less than ' + fieldLen + ' characters !!!';
        return message;
      }
      return message;
    }
  
    /*===============Function to Check the equality length character of a field================ */
    if(checkType == "Equal"){
      if (data.length != fieldLen && data.length > 0){
        
        message = fieldName + ' should be ' + fieldLen + ' digit length!!!';
        return message;
      }
      return message;
    }
  
  }
  
  /*############### Allow only Numeric Input and replace '' when find special character on keyup/keypress/keydown################*/
  /*=========Call Below function by on KeyUp======= */
  exports.checkNum = (data) => {
    var tempVal = data.replace(/[^0-9\.]/g,'');
    return tempVal;
  }
  
  exports.checkNumHiphen = (data) => {
    var tempVal = data.replace(/[^0-9\-]/g,'');
    return tempVal;
  } 
   
  exports.checkNumAndNa = (data) => {
    var tempVal = data.replace(/[^ANan0-9\.]/g,'');
    return tempVal;
  }
  exports.checkOnlyNaN = (data) => {
    if(isNaN(data)){
        if(data.toUpperCase() !='NA'){
            data = '';
            return data;
        }
    }
  }
  
  /*############### Allow only Alphabets and Numeric Input and replace '' when find special character on keyup/keypress/keydown ################ */
  /*=========Call Below function by on on KeyUp======= */
  exports.checkAlphabetAndNumber = (data) => {
    var tempVal = data.replace(/[^a-zA-Z0-9 ]/g,'');
    return tempVal;
  }
  exports.checkOnlyAlphabet = (data) => {
    var tempVal = data.replace(/[^a-zA-Z ]/g,'');
    return tempVal;
  }
  
  /*############### Allow only AlphaNumeric character ################ */
  /*=========Call Below function by on button submit ======= */
  exports.allowAlphaNumericCharacter = (data,message = '') => {
    var alphaNumericRegExp = new RegExp(/^([0-9]|[a-z])+([a-z]+)$/i);
    var fieldVal = $("#"+fieldId).val();
    
    if(alphaNumericRegExp.test(data) == false){
      message = "Only Alpha Numeric Characters are allowed. No special characters.";
      return message;
    }
    return message;
  
  }
  
  /*############### Validate Special character ################ */
  /*=========Call Below function by on form submit or any event======= */
  exports.checkSpecialCharacter = (data,message = '') => {
    var SpecialCharRegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    
    
    if(SpecialCharRegExp.test(data)){
      message = "Only Special Characters are allowed !";
      return message;
    }
    return message;
  }
  
 
  /*#################### first character not to be special character #####################*/
  exports.checkSpecialCharacterFirst = (data,message = '') => {
      var SpecialCharRegExp = new RegExp("['\\\\><!@#%?_:;.^*)(}{$&+-=|\"]");
      //var SpecialCharRegExp = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      
      var firstChar = data[0];
  
      if(SpecialCharRegExp.test(firstChar)){
        message = "First Character must not be a special character";
      }
      return message;
  }
  
  /*#################### first character not to be special character Custom input of regExp #####################*/
  exports.checkSpecialCharacterFirstCustom = (data,message = '',SpecialCharRegExp) => {
      
      var strInputval = $('#' + fieldId).val();
      var firstChar = data[0];
  
      if(SpecialCharRegExp.test(firstChar)){
        message = "First Character must be a Special Character as per the given rule";
        return message;
      }
      return message;
  }
  
  /*################ Function to check email for validation ############## */
  exports.checkEmailId = (data,message = '') => {
      //var pattern = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
      var emailPattern = /^[A-Za-z0-9\-_\.]+@+[A-Za-z0-9\-\.]+\.+[A-Za-z]{2,10}$/;
      var email = data;
      if (email != ''){
          if (emailPattern.test(email) == true)
              return true;
          else{
              message = "The Email id format is not correct. Accepted Format - example@example.com";
              return false;
          }
      }else
        return true;     
  }
  
  /* ####################### Function to check if Password and Confirm Password match */
  exports.checkPasswordConfPasswordMatch = (password, confirmPassword, message ='') => {
    if (password.toString() === confirmPassword.toString()) {
      return false;
    } else {
      message = "Password and Confirm Password Must match";
      return true;
    }
  }



  
  /*############## Function to check Valid Indian Mobile number digit 0-9 and length=10 ############# */
  /*ex:  9861098610 */
  exports.checkMobileNumberIN = (data , message = '') => {
      var mobile = data;
      var mobileReg = /^\d{10}$/;
      /* /^[0][1-9]\d{9}$|^[1-9]\d{9}$/g; */
  
      if (mobile != ''){
          if (mobileReg.test(mobile)){
              return false;
          }else {
              message = "This is not a valid Indian Mobile Number";
              return true;
          }
      }else
          return false;
  }
  
  /*############## Function to check Valid Indian Mobile number  digit 0-9, length=10, and countrycode ############# */
  /*ex:  +91 9861098610 or +919861098610 */
  exports.checkMobileNumberINCode = (data,message = '')  => {
      var mobile = data;
      var mobileReg = /^(\+\d{1,3}[-])\d{10}$/;
  
      if (mobile != ''){
          if (mobileReg.test(mobile)){
              return message;
          }else {
              message = "This is not a valid Indian mobile number";
              return message;
          }
      }else
          return message;
  }
  /*############## Validate the telephone number ############## */
  /*example:+91-674-2495452  */
  exports.validateTelephone = (data, message = '') => {
      var telephonVal = data;
      var telephoneReg = /^([1-9]{1}[0-9]{0,1}[0-9]{0,1}[\-]{1}[1-9]{1}[0-9]{1,5}[\-]{1})[1-9]{1}[0-9]{5,6}$/;
      //var telephoneReg = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
      alert((telephoneReg.test(telephonVal)));
      if (telephonVal != ''){
          if (telephoneReg.test(telephonVal))
              return message;
          else {
              message = "This is not a valid telephone/mobile number";
              return message;
          }
      }else
          return message;
  }

  //function for remove special characters from field
  exports.RemoveSQLCharacter = (data) => {
  
    var regex = new RegExp("['\\\\><!%?:;^*)(}{$&+=|\"]");
    var str = new String(data);
    let message = '';
    if(regex.test(str)){
      
      message = "Special characters are not allowed";
      return message;
    }else
      return message;
     
  }
  
 
  /*#################### first character not to be special character #####################*/
  function RemoveSQLCharacterForPassword(objId){
    //var SpecialCharRegExp = new RegExp("['\\\\><!@#%?_:;.^*)(}{&+-=|\"]");
    var tempVal = $("#"+objId).val().replace(/['\\\\><%^}{+=|\"]/g,'');
    document.getElementById(objId).value=tempVal;
  }
  
  var PatternsDict = new Object();
  // matches white space
  PatternsDict.whitespacepat = /\s+/;
  
  function isWhitespace1st(data){
    let message = '';
     var strInput   = new String(data);
     var objregExp  = new RegExp(PatternsDict.whitespacepat) ; 
     if(objregExp.test(strInput)){
       if(strInput.charAt(0)==" "){
          
          message = "White space is not allowed at first place";
          return message;
         }
      }
       return message ;
  
   }
  function isWhitespaceLast(data){
    let message = '';
    var strInput   = new String(data);
    var objregExp  = new RegExp(PatternsDict.whitespacepat) ; 
    if(objregExp.test(strInput)){
      if(strInput.charAt(strInput.length-1)==" "){
        
        message = "White space is not allowed at last place";
        return message;
        }
    }
      return message ;
  
  }
  function leftTrim(element) { 
      if(element)
          element.value=element.value.replace(/^\s+/,"");
  } 
  

  //function to check file format
  exports.checkImageFormat = (data,size) => {
    var fileSize = data.size/1024/1024;
    var validExts = new Array(".JPG", ".PNG", ".JPEG", ".PDF", ".TIFF");
    var fileExt = sender.value;
  
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    //console.log(fileExt);
    if(validExts.indexOf(fileExt.toUpperCase())<0){
      swal("Invalid file selected, valid files are of "+ validExts.toString()+ " types");
      $('#'+sender.id).val("");
      return false;
    }else if(fileSize > size){
      $('#'+sender.id).val("");
      swal("File size exceeds"+size+" MB");
    }else
      return true;
  }
  //function to check file format
  function checkImageFormatOnly(sender){
    var fileSize = $('#'+sender.id)[0].files[0].size/1024/1024;
    var validExts = new Array(".JPG", ".PNG", ".JPEG");
    var fileExt = sender.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if(validExts.indexOf(fileExt.toUpperCase())<0){
      swal("Invalid file selected, valid files are of "+ validExts.toString()+ " types");
      $('#'+sender.id).val("");
      return false;
    }else if(fileSize >5){
      $('#'+sender.id).val("");
      swal("File size exceeds 5 MB");
    }else
      return true;
  }
  //function to check file format
  function checkFileFormat(sender){
    var fileSize = $('#'+sender.id)[0].files[0].size/1024/1024;
    var validExts = new Array(".PDF");
    var fileExt = sender.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if(validExts.indexOf(fileExt.toUpperCase())<0){
      swal("Invalid file selected, valid files are of "+ validExts.toString()+ " types");
      $('#'+sender.id).val("");
      return false;
    }else if(fileSize >20){
      $('#'+sender.id).val("");
      swal("File size exceeds 10 MB");
    }else
      return true; 
  }
  
  