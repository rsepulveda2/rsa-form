Rsa-Form																																						
========
Last Updated: 1/7/11

Rsa-form is a Ruby on Rails plugin that allows you to send RSA encrypted form data between your client's browser and 
your server. This plugin is useful when submitting sensitive data such as login credentials when your server 
doesn't have SSL. Please note that Rsa-form is NOT a replacement for SSL since it doesn't use authentication.

Rsa-form also includes login/registration and keypad partials that can be added to your pages to reduce the 
chance of a keylogger capturing your passwords (see below for details).

Just create a form, then add the following javascript to your page. (Using either "script" tags or
adding it to one of your javascript files such as /javascripts/application.js)

    jQuery(document).ready(function() {
      $("#myencryptedform").jCryption( {getKeysURL:"/rsakey",formFieldSelector:':input:not([name=authenticity_token])'});
    });

where myencryptedform is the id tag associated with your form

Or use:

    jQuery(document).ready(function() {
      $("#myencryptedform").jCryption( {getKeysURL:"/rsakey",formFieldSelector:':input:not([name=authenticity_token])', 
        beforeEncryption:validate_inputs});
    });
  
if you wish to validate the form inputs with your browser prior to submission. This can reduce server load 
since the client will not contact the server until all inputs are validated. Rsa-form also includes several 
javascript routines which can be used to test password, string, URL, and e-mail address validity. See 
/javascripts/rsa-form.js for more details.

When the user submit's the form, the browser will request an RSA public key from the server. jCryption will then encrypt 
the serialized form data using the RSA public key and return the encrypted data to the server.

To decode the data on the server side, make the following call in your controller:

	params.merge!( RsaForm.decrypt_form( params[:jCryption], session[:key_pair])) if params[:jCryption]

This decodes the form data and adds it to your params hash. Your controller will work just as before.

#### How does it work?
The jCryption plugin does most of the heavy lifting on the browser side. When the user submits the form, jCryption
is notified of the submit and will make an AJAX request for a RSA public key from your server (/rsakey).
The server will generate a new public/private key pair using the RSA gem and store the key_pair in the users session 
hash. It then returns the public RSA key to the client/browser. The client will serialize the form data then
encrypt it using the public key. The form is returned to the server using a single param 'jCryption'. The controller 
decrypts the form data using RsaForm.decrypt_form() utilizing the stored RSA key pair. An additional checksum is 
performed on the data to verify that the data hasn't changed during transfer.

If there is a problem with the client running jquery/jcryption, the controller automatically falls back to normal
unencrypted mode.

Installation Instructions
========

Install the rsa-form plugin:

    ./script/plugin install git://github.com/rsepulveda2/rsa-form.git

Download [jquery.js](http://docs.jquery.com/Downloading_jQuery) and 
[jquery.jcryption.js](http://github.com/HazAT/jCryption) then put them in your /public/javascripts/ folder.

Add the following lines to your application.html.erb:

	<script src="/javascripts/jquery-1.4.4.js" type="text/javascript"></script> 
	<script src="/javascripts/jquery.jcryption.js" type="text/javascript"></script> 

or the equivalent 

	<%= javascript_include_tag "jquery-1.4.2", "jquery.jcryption", "application" %>

Install the RSA ruby gem by adding the following line to your /config/environment.rb:

	config.gem "rsa"

stop your server

	shell% rake gems:install

restart your server

Rsa-form partial's/widget's
=========================

Rsa-form comes with premade login, registration and keypad partials. For example:

<img src="http://macdevshop.com/images/login.jpg" /> 

These Rsa-form partials can be easily added to your webpages. The users password
is entered using a combination of letters from the keyboard and numbers clicked on the numeric keypad. 
The keypad ordering is changed everytime the page is refreshed and the page can be autorefreshed if desired.
The widget will be submitted using RSA encryption (as explained above) for added security.

To add the login widget to your login webpage, include the following line:

    <%= render :partial => 'rsa_form/login' %>
  
To add the registration widget to your registration webpage, include the following line:  
  
    <%= render :partial => 'rsa_form/register' %>
  
To add a standalone keypad partial, include one or both of the following lines: (Note: the tag name can be specified)

    <%= render :partial => 'rsa_form/password1', :locals => { :name => "user[password]"}  %>
    <%= render :partial => 'rsa_form/password2', :locals => { :name => "user[password_confirmation]"}  %>

or if you wish to use the default tag names ("password" and "password_confirmation" respectively)

    <%= render :partial => 'rsa_form/password1' %>
    <%= render :partial => 'rsa_form/password2' %>

Add the following to your html header (application.html.erb):

	<link href="/stylesheets/rsa-form.css" media="screen" rel="stylesheet" type="text/css" /> 
	<script src="/javascripts/rsa-form.js" type="text/javascript"></script> 

Your controller will receive the data as: (depending on which partial that you are using)

	params[:login] and params[:password] and params[:password_confirmation]

Remember to add this line to your controller:

	params.merge!( RsaForm.decrypt_form( params[:jCryption], session[:key_pair])) if params[:jCryption]

Customize the look and feel of each widget
========

- Change it's css file: /stylesheets/rsa-form.css

- Replace the graphics for the key's in the keypad. The following files can be replaced: /images/(0.png - 9.png, clr.png, del.png)

- Rewrite the widget's html.
  Copy the /vendor/plugins/rsa-form/app/views/rsa_form directory to your /app/views directory.

	Make modifications to the /app/views/rsa_form/_login.html.erb file or the /app/views/rsa_form/_register.html.erb

	To avoid breaking the javascript, don't modify the "img" elements, and 
	don't change the id attribute of the password text field tag.
  
#### Here is an example of a custom registration webpage using the keypad partials
 
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
       $("form").jCryption( {getKeysURL:"/rsakey",formFieldSelector:':input:not([name=authenticity_token])',
         beforeEncryption:validate_inputs});       
    </script>
    
Submitting your encrypted form's using AJAX
========

Say that I want to submit an encrypted form to the server using a post request to the same controller and action
as normal but using AJAX. I want the controller to return javascript that will be executed by the browser. 
(Such as displaying an alert or modifying the DOM.)

- Add the following javascript to your html or to a javascript file such as /javascripts/application.js
IMPORTANT: Make sure that you add this code AFTER the call to $(form).jCryption();. If you don't,
then this routine will be executed first and submit normal unencrypted data.

<pre><code>$("#rsa_login_form").submit( function (){
  $.post( $(this).attr("action"), $(this).serialize(), null, 'script');
  return false;
});    
</code></pre> 

- Add code to your controller to differentiate between a normal GET/POST action and
an AJAX GET/POST action. For example:

<pre><code>respond_to do |format|
  format.html { redirect_back_or_default('/') } # normally execute this redirect
  format.js   { @route = "/" }                  # setup a variable that will be used in the javascript view
end
</code></pre> 
   
- Create a view that will be returned from the AJAX request.
  
Assuming that we are using a controller called 'session' and an action named 'create', create this file:
  
<pre><code>/app/views/session/create.js.erb
</code></pre> 
  
That contains some javascript that will be executed on the client, for example:
  
<pre><code>alert("You are successfully logged in");  // displays an alert
document.location = "{%=@route%}";        // does a redirect to the specified route
</code></pre> 
      
And that's about it!
    
There are many options available for AJAX calls, such as doing a GET instead of a POST. Returning 
'json', 'xml', 'text' instead of returning 'javascript'. Please refer to the jQuery documentation
for more information.  
    
Additional notes
========

- The default RSA key length is 128 bits. If you wish to change this to something else for added security or
less load on your server, you can modify the RSALength constant in /vendor/plugins/rsa-form/app/controllers/rsakey_controller.rb

- The widgets/partials are validated by the browser prior to submission to the server. You may want to modify the default password/login name
constraints to fit your website. Currently, the default password constraints are: 6 characters minimum, at least 1 alpha character, 
and at least 1 numeric character. See /javascripts/rsa-form.js in routine validate_inputs() for more details.
        
Issues
========

None at this time