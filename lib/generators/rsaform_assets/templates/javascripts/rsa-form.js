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

		$("#rsa_login_form").jCryption( {getKeysURL:"/rsakey"});
//		$("#rsa_login_form").jCryption( {getKeysURL:"/rsakey", dontEncryptSelector:'[name="authenticity_token"]'});
		
//		setTimeout(function(){
//			window.location = "/login";
//		}, 1000 * 60 * 2);
	});