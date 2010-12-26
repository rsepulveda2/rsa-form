Rsa-Form
========

Rsa-form is a plugin that allows you to send RSA encrypted form data between your client and server. This can be 
useful when transferring sensitive data (i.e. login credentials) and your server doesn't have SSL. NOTE: RSA-form 
is NOT a replacement for SSL since it doesn't use authentication.

Rsa-form also includes a login widget that can be added to your login page to reduce the chance of a keylogger capturing login 
credentials (see below).

Just create a form as usual, then add the following javascript to your page. (Either using <script></script> tags or
adding it to one of your javascript files such as /javascripts/application.js)

$(document).ready( function(){
	$("#myencryptedform").jCryption( {getKeysURL:"/rsakey"});
});

where myencryptedform is the id tag associated with your <form>

When the user submit's the form, the browser will request an RSA public key from the server, then encrypt 
the form data using the RSA key, and send the encrypted data back to your server.

To decode the data on the server side, make the following call in your controller:

params.merge!( RsaForm.decrypt_form( params[:jCryption], session[:key_pair])) if params[:jCryption]

This decodes the form data then adds the form data to your params hash:

How does it work?
the jCryption plugin does most of the heavy lifting on the browser side. When the user submits the form, jCryption
is notified of the submit and will make an AJAX request for a RSA public key from your server (/rsakey).
The server will generate a new public/private key pair using the RSA gem and store the key_pair in the users session 
hash. It returns the public key to the client. The client will serialize the form data then
encrypt it using the public key. The form is returned to the server using a single param 'jCryption'. The controller 
decrypts the form data using RsaForm.decrypt_form() utilizing the stored RSA key pair. An additional checksum is 
performed on the data to verify that the data hasn't changed during transfer.

If there is a problem with the client running jquery/jcryption, the controller automatically falls back to normal
unencrypted mode.

Installation instructions:

install the rsa-form plugin:
./script/plugin install git:http://github.com/rsepulveda2/rsa-form.git

install the javascript dependencies:

Download then put jquery.js (http://docs.jquery.com/Downloading_jQuery) and 
jquery.jcryption.js (http://www.jcryption.org/) in your /public/javascripts/ folder

Then add the following lines to your application.html.erb:
<script src="/javascripts/jquery-1.4.4.js" type="text/javascript"></script> 
<script src="/javascripts/jquery.jcryption-1.1.js" type="text/javascript"></script> 

or equivalent 
<%= javascript_include_tag "jquery-1.4.2", "jquery.jcryption-1.1", "application" %>

Install the RSA ruby gem:

add the following line to your /config/environment.rb:
config.gem "rsa"

Then:
stop your server
run: rake gems:install
restart your server

Rsa-form login widget
=========================

The Rsa-form login widget can be added to your login page as a partial. The users password
is entered using a combination of letters on the keyboard and numbers on a mouse driven numeric keypad. 
The keypad ordering is changed everytime the page is refreshed. The page can be autorefreshed (by a specified time period)
if the website owner desires. This widget will also use the RSA encryption (as explained above) to add additional safety.

To include the login widget to your login webpage, add the following line:

<%= render :partial => 'rsa_form/login' %>

Add the following to your html header (application.html.erb):

<link href="/stylesheets/rsa-form.css" media="screen" rel="stylesheet" type="text/css" /> 
<script src="/javascripts/rsa-form.js" type="text/javascript"></script> 

And thats about it. Your controller will receive the data as:

params[:login] and params[:password]

Remember to add this line to your controller:
params.merge!( RsaForm.decrypt_form( params[:jCryption], session[:key_pair])) if params[:jCryption]

You can customize the look and feel of the login widget by changing the css file: /stylesheets/rsa-form.css

You can replace the key graphics for the keypad by substituting the following files (just use the same names)
/images/(0.png - 9.png, clr.png, del.png)

Or if you would like to totally rewrite the widget's html, copy the:
/vendor/plugins/rsa-form/app/views/rsa_form directory to your /app/views directory.

Make your modifications to the /app/views/rsa_form/_login.html.erb file.

To avoid breaking the javascript, don't modify the <img /> tags, and 
don't change the id attribute of the password text field tag and the 
form tag.

Issues:

There is a problem with the login widget and the restful-authentication plugin. The restful plugin doesn't like its
hidden input field, name="authenticity_token" to be encrypted then decrypted. It will flag an authenticity_token
error. The only way that I have found to work around the problem is by modifying the jCryption jquery plugin to ignore
specified input fields (pass unencrypted).

Here is the call to jCryption using a modified version:

$(FORMSELECTOR).jCryption( {getKeysURL:"/rsakey", dontEncryptSelector:'[name="authenticity_token"]'});