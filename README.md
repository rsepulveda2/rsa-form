Rsa-Form																																						
========
Last Updated: 12/27/10

Rsa-form is a Ruby on Rails plugin that allows you to send RSA encrypted form data between your client's browser and 
your server.  This plugin is useful when submitting sensitive data such as login credentials when your server 
doesn't have SSL. Please note that Rsa-form is NOT a replacement for SSL since it doesn't use authentication.

Rsa-form also includes a login widget that can be added to your login page to reduce the chance of a keylogger 
capturing your password (see below for details).

Just create a form, then add the following javascript to your page. (Using either "script" tags or
adding it to one of your javascript files such as /javascripts/application.js)

	jQuery(document).ready(function() {
		$("#myencryptedform").jCryption( {getKeysURL:"/rsakey"});
	});

where myencryptedform is the id tag associated with your form

When the user submit's the form, the browser will request an RSA public key from the server. jCryption will then encrypt 
the serialized form data using the RSA key and return the encrypted data to the server.

To decode the data on the server side, make the following call in your controller:

	params.merge!( RsaForm.decrypt_form( params[:jCryption], session[:key_pair])) if params[:jCryption]

This decodes the form data and adds it to your params hash. Your controller will work just as before.

How does it work?
The jCryption plugin does most of the heavy lifting on the browser side. When the user submits the form, jCryption
is notified of the submit and will make an AJAX request for a RSA public key from your server (/rsakey).
The server will generate a new public/private key pair using the RSA gem and store the key_pair in the users session 
hash. It then returns the public RSA key to the client/browser. The client will serialize the form data then
encrypt it using the public key. The form is returned to the server using a single param 'jCryption'. The controller 
decrypts the form data using RsaForm.decrypt_form() utilizing the stored RSA key pair. An additional checksum is 
performed on the data to verify that the data hasn't changed during transfer.

If there is a problem with the client running jquery/jcryption, the controller automatically falls back to normal
unencrypted mode.

**Installation instructions:**

Install the rsa-form plugin:

  ./script/plugin install git://github.com/rsepulveda2/rsa-form.git

Download [jquery.js](http://docs.jquery.com/Downloading_jQuery) and 
[jquery.jcryption.js](http://www.jcryption.org/) then put them in your /public/javascripts/ folder.

Add the following lines to your application.html.erb:

	<script src="/javascripts/jquery-1.4.4.js" type="text/javascript"></script> 
	<script src="/javascripts/jquery.jcryption-1.1.js" type="text/javascript"></script> 

or the equivalent 

	<%= javascript_include_tag "jquery-1.4.2", "jquery.jcryption-1.1", "application" %>

Install the RSA ruby gem by adding the following line to your /config/environment.rb:

	config.gem "rsa"

stop your server

	shell% rake gems:install

restart your server

* Additional notes:

- The default RSA key length is 128 bits. If you wish to change this to something else for added security or
less load on your server, you can modify the RSALength constant in /vendor/plugins/rsa-form/app/controllers/rsakey_controller.rb

Rsa-form login/registration and individual keypad widget's
=========================

The Rsa-form login widget can be added to your login page as a partial. The users password
is entered using a combination of letters from the keyboard and numbers clicked by the mouse on the numeric keypad. 
The keypad ordering is changed everytime the page is refreshed. The page can be autorefreshed (on a specified time period)
if desired. This widget will also use the RSA encryption (as explained above) to add additional safety.

To add the login widget to your login webpage, include the following line:

	<%= render :partial => 'rsa_form/login' %>
  
To add the registration widget to your registration webpage, include the following line:  
  
	<%= render :partial => 'rsa_form/register' %>
  
To add a standalone keypad partials, include the following
  <%= render :partial => 'rsa_form/password1', :locals => { :name => "user[password]"}  %></p>
or  
  <%= render :partial => 'rsa_form/password1' %>

Add the following to your html header (application.html.erb):

	<link href="/stylesheets/rsa-form.css" media="screen" rel="stylesheet" type="text/css" /> 
	<script src="/javascripts/rsa-form.js" type="text/javascript"></script> 

And thats about it. Your controller will receive the data as:

	params[:login] and params[:password]

Remember to add this line to your controller:

	params.merge!( RsaForm.decrypt_form( params[:jCryption], session[:key_pair])) if params[:jCryption]

You can customize the look and feel of the login widget by:

- Changing it's css file: /stylesheets/rsa-form.css

- Replacing the graphics for the keypad. The following files can be replaced: /images/(0.png - 9.png, clr.png, del.png)

- Rewrite the widget's html.
  Copy the /vendor/plugins/rsa-form/app/views/rsa_form directory to your /app/views directory.

	Make modifications to the /app/views/rsa_form/_login.html.erb file.

	To avoid breaking the javascript, don't modify the "img" elements, and 
	don't change the id attribute of the password text field tag.
  
Here is an example of using the individual keypad partials
 
    <% form_tag users_path,:id=>"rsa_register_form" do -%>

      <%= label_tag 'login' %>
      <%= text_field_tag 'user[login]' %>

      <%= label_tag 'email' %>
      <%= text_field_tag 'user[email]' %>

      <%= label_tag 'password' %>
      <%= render :partial => 'rsa_form/password1', :locals => { :name => "user[password]"}  %>

      <%= label_tag 'password_confirmation' %>
      <%= render :partial => 'rsa_form/password2', :locals => { :name => "user[password_confirmation]"} %>

      <%= submit_tag 'Sign up' %>
    <% end -%>

    <script>
       $("form").jCryption( {getKeysURL:"/rsakey"});
    </script>
    
Issues:

There is a problem with the login widget and the restful-authentication plugin. The restful plugin doesn't like its
hidden input field, name="authenticity_token" to be encrypted then decrypted. It will flag an authenticity_token
error. The only way that I have found to work around the problem is by modifying the jCryption jquery plugin to ignore
specified input fields (pass unencrypted).

Here is the call to jCryption using a modified version:

	$(FORMSELECTOR).jCryption( {getKeysURL:"/rsakey", dontEncryptSelector:'[name="authenticity_token"]'});
  
I found another workaround this issue until I can get an official version of jCryption with my needed changes.

(http://stackoverflow.com/questions/1201901/rails-invalid-authenticity-token-after-deploy)

You can turn off checking for the "authenticity_token" on your whole app by adding this to config/environment.rb
config.action_controller.allow_forgery_protection = false

You can turn it off a single controller using
skip_before_filter :verify_authenticity_token

or turn it on
protect_from_forgery :except => :index