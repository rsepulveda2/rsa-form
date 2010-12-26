class RsaformAssetsGenerator < Rails::Generator::Base
	def self.source_root
		@source_root ||= File.join(File.dirname(__FILE__), 'templates')
	end

  def manifest
    record do |m|
#      m.migration_template 'blog_comments_migration.rb', "db/migrate", {:migration_file_name => "create_blog_comments"}
#      m.sleep 1 # not ideal, but makes sure the timestamps differ
#			m.file "config/blog_kit.yml", "config/blog_kit.yml"
			m.file "stylesheets/rsa-form.css", "public/stylesheets/rsa-form.css"
			m.file "javascripts/rsa-form.js",  "public/javascripts/rsa-form.js"
			m.file "images/0.png",  "public/images/0.png"
			m.file "images/1.png",  "public/images/1.png"
			m.file "images/2.png",  "public/images/2.png"
			m.file "images/3.png",  "public/images/3.png"
			m.file "images/4.png",  "public/images/4.png"
			m.file "images/5.png",  "public/images/5.png"
			m.file "images/6.png",  "public/images/6.png"
			m.file "images/7.png",  "public/images/7.png"
			m.file "images/8.png",  "public/images/8.png"
			m.file "images/9.png",  "public/images/9.png"
			m.file "images/del.png",  "public/images/del.png"
			m.file "images/clr.png",  "public/images/clr.png"
    end
  end
end
