jQuery(document).ready(function() {
		$(".pbutton").attr( "width","40");
		$(".pbutton").hover( 
				function(){
					$(this).css("opacity",0.9);
			}, 
				function(){
					$(this).css("opacity",1.0);
			});
																						
		$("#rsa_password").attr("value","");
		code = [];
		
		$(".pbutton").mousedown( function(){
				
				$(this).css("opacity",0.7);
				
				src = $(this).attr("src");
				v = src.substr(8);
				v = v.substr(0, v.indexOf(".png"));
								
				cur = $("#rsa_password").attr("value");
				
				if( v[0] == "r"){ // return key (ajax back)
					alert("sending code " + code.join(","));
				}
				else if( v[0] == "c"){ // clear key
					$("#rsa_password").attr("value", "");
					code.length = 0;
				}
				else if( v[0] == "d"){
					$("#rsa_password").attr("value", cur.substr(0,cur.length-1));
					code.length	-= 1;
				}
				else	{
					$("#rsa_password").attr("value", cur + v[0]); // v[1]
					code[code.length] = v;
				}
		});
											 
		$(".pbutton").mouseup( function(){
				$(this).css("opacity",0.9);
				$("#rsa_password").focus();
		});
		
		$("#rsa_password").keypress( function(e){
			if( !(kcode = e.charCode))
						kcode = e.keyCode;
						
			v = String.fromCharCode(kcode);
			
			if( v >= "0" && v <= "9")
				return false;
			
			code[code.length] = v;
			
			return true;
		});				

		$("#rsa_login_form").jCryption( {getKeysURL:"/rsakey", dontEncryptSelector:'[name="authenticity_token"]'});
		
//		setTimeout(function(){
//			window.location = "/login";
//		}, 1000 * 60 * 2);
	});