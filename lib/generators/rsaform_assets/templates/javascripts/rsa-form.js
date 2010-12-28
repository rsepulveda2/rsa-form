jQuery(document).ready(function() {
  $(".pbutton,.pbutton2").hover( 
    function(){
      $(this).css("opacity",0.9);
    }, 
    function(){
      $(this).css("opacity",1.0);
    });
                                  
  $("#rsa_password,#rsa_password2").attr("value","");

  $(".pbutton,.pbutton2").mousedown( function(){

    $(this).css("opacity",0.7);

    src = $(this).attr("src");
    v = src.substr(8);
    v = v.substr(0, v.indexOf(".png"));
    
    if( $(this).attr("class") == "pbutton")
      pw = $("#rsa_password");
    else 
      pw = $("#rsa_password2");
        
    cur = pw.attr("value");

    if( v[0] == "r"){ // return key (ajax back)
    }
    else if( v[0] == "c"){ // clear key
      pw.attr("value", "");
    }
    else if( v[0] == "d"){
      pw.attr("value", cur.substr(0,cur.length-1));
    }
    else	{
      pw.attr("value", cur + v[0]); // v[1]
    }
  });
             
  $(".pbutton,.pbutton2").mouseup( function(){
    $(this).css("opacity",0.9);

    if( $(this).attr("class") == "pbutton")        
      $("#rsa_password").focus();
    else
      $("#rsa_password2").focus();        
  });

  $("#rsa_password,#rsa_password2").keypress( function(e){
    if( !(kcode = e.charCode))
      kcode = e.keyCode;

    v = String.fromCharCode(kcode);

    if( v >= "0" && v <= "9")
      return false;

    return true;
  });				
  
  // uncomment for autorefresh
/*  
  if( $("#rsa_login_form").length){ // change form selector if needed
    minutes = 2;                    // change refresh rate if needed
    setTimeout(function(){
      window.location = "/login";   // change page route if needed
    }, 1000 * 60 * minutes);
  }
*/  

  // attach the encryption script to your form
  $("#rsa_login_form").jCryption( {getKeysURL:"/rsakey", beforeEncryption:validate_inputs});
  
//$("#rsa_login_form").jCryption( {getKeysURL:"/rsakey"});  // if you don't want to check the form before submission
//$("#rsa_login_form").jCryption( {getKeysURL:"/rsakey", dontEncryptSelector:'[name="authenticity_token"]'});

  // test the form inputs before submission to the server, saves server load if there are bad inputs
  function validate_inputs()
  {
    // modify this hash according to your pw requirements (see validateString) 
    var pwoptions = { minLength:6, alpha:1, numeric:1}; 
    
    // validate password
    if( $("#rsa_password").length && !validate_password( $("#rsa_password").attr("value"), pwoptions)){
    
  //    display your error message
        alert( "Your password must be at least " + pwoptions.minLength + " characters long and contain at least " + 
          + pwoptions.alpha + " alpha and " + pwoptions.numeric + " numeric");
          
        $(":input:submit").attr("disabled",false);  // reenable submit button
        $("#rsa_password").attr("value", "");       // clear pw field
        
        return false;
    }

    // validate password verification
    if( $("#rsa_password2").length){
    
      if( !validate_password( $("#rsa_password2").attr("value"), pwoptions)){
      
  //    display your error message
        alert( "Your verification password must be at least " + pwoptions.minLength + " characters long and contain at least " + 
          + pwoptions.alpha + " alpha and " + pwoptions.alpha + " numeric");    
            
        $(":input:submit").attr("disabled",false);   // reenable submit button
        $("#rsa_password2").attr("value", "");       // clear pw field
                    
        return false;
      }
      
      // if registration, validate that both passwords match
      if( $("#rsa_password").attr("value") != $("#rsa_password2").attr("value")){
      
  //    display your error message
        alert( "Password's don't match");       
      
        $(":input:submit").attr("disabled",false);  // reenable submit button
        $("#rsa_password").attr("value", "");       // clear pw field
        $("#rsa_password2").attr("value", "");      // clear pw field
                          
        return false;
      }        
    }
    
    // modify this hash according to your login name requirements (see validateString)
    var login_options = { minLength:4, alpha:1, noSpecial:true, custom:[/^[a-zA-Z]+[a-zA-Z0-9]*/]}; 
    
    // validate login name
    if( $('[name="login"]').length){
      
        if( !validateString( $('[name="login"]').attr("value"), login_options)){ 
      
    //    display your error message
          alert( "Your login name must be at least " + login_options.minLength + 
            " characters long, must begin with an alpha and contain no special characters");    
            
          $(":input:submit").attr("disabled",false);   // reenable submit button
          $('[name="login"]').attr("value", "");       // clear field
                    
          return false;
        }
      }    
    
    // add test's to validate_url, validate_email and validateString when needed
    
    return true;
  }

  function validate_password( str, options)
  {	
    return validateString( str, options) 
  }

  function validate_url( str)
  {
    var options = {
      custom:   [/^(http(s?):\/\/)?(www\.)?[a-zA-Z0-9\.\-\_]+(\.[a-zA-Z]{2,3})+(\/[a-zA-Z0-9\_\-\s\.\/\?\%\#\&\=]*)?$/]
    };
    
    return validateString( str, options) 
  }

  function validate_email( str)
  {
    var options = {
      custom:   [/^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i]
    };
    
    return validateString( str, options) 
  }

  /*
    Password Validator 0.1
    (c) 2007 Steven Levithan <stevenlevithan.com>
    MIT License
  */

  // returns true on succuess
  function validateString( str, options) 
  {
    // default options (allows any string)
    var o = {
      lower:    0,  // min number of lowercase
      upper:    0,  // min number of uppercase
      alpha:    0,  // min number of lower + upper
      numeric:  0,  // min number of numerics
      special:  0,  // min number of special chars
      noSpecial: false, // prohibit special chars
      minLength:0,  // min length
      length:   [0, Infinity], // length range [ min, max]
      custom:   [ /* regexes and/or functions */ ],
      badWords: [],               // array of bad words to prohibit
      badSequenceLength: 0,       // bad sequence length
      noQwertySequences: false,   // prohibit conseq chars on keyboard (min number)
      noSequential:      false    // prohibit conseq identical chars
    };
    
    for( var property in options)
      o[property] = options[property];
    
    var	re = {
        lower:   /[a-z]/g,
        upper:   /[A-Z]/g,
        alpha:   /[A-Z]/gi,
        numeric: /[0-9]/g,
        special: /[\W_]/g
      },
      rule, i;

    // enforce min/max length
    if( str.length < o.minLength || str.length < o.length[0] || str.length > o.length[1])
    {
      return false;
    }
    
    // enforce lower/upper/alpha/numeric/special rules
    for( rule in re) {
      if( (str.match(re[rule]) || []).length < o[rule])
      {
        return false;
      }
    }
    
    // enforce no special characters
    if( o.noSpecial && (str.match(re.special) || []).length){
      return false;
    }

    // enforce word ban (case insensitive)
    for( i = 0; i < o.badWords.length; i++) {
      if( str.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1)
      {
        return false;
      }
    }

    // enforce the no sequential, identical characters rule
    if( o.noSequential && /([\S\s])\1/.test( str))
    {
      return false;
    }

    // enforce alphanumeric/qwerty sequence ban rules
    if( o.badSequenceLength) {
      var	lower   = "abcdefghijklmnopqrstuvwxyz",
        upper   = lower.toUpperCase(),
        numbers = "0123456789",
        qwerty  = "qwertyuiopasdfghjklzxcvbnm",
        start   = o.badSequenceLength - 1,
        seq     = "_" +   str.slice(0, start);
        
        for( i = start; i <   str.length; i++) {
          seq = seq.slice(1) +   str.charAt(i);
          if(
            lower.indexOf(seq)   > -1 ||
            upper.indexOf(seq)   > -1 ||
            numbers.indexOf(seq) > -1 ||
            (o.noQwertySequences && qwerty.indexOf(seq) > -1)
          ) {
            return false;
        }
      }
    }

    // enforce custom regex/function rules
    for( i = 0; i < o.custom.length; i++) {				
      rule = o.custom[i];
      if( rule instanceof RegExp) {
        if( !rule.test(  str))
        {
          return false;
        }
      } else if( rule instanceof Function) {
        if( !rule(  str))
        {
          return false;
        }
      }
    }

    // great success!
    return true;
  }

});