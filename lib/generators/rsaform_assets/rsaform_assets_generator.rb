class RsaformAssetsGenerator < Rails::Generator::Base
	def self.source_root
		@source_root ||= File.join(File.dirname(__FILE__), 'templates')
	end

  def manifest
    record do |m|
#      m.migration_template 'blog_comments_migration.rb', "db/migrate", {:migration_file_name => "create_blog_comments"}
#      m.sleep 1 # not ideal, but makes sure the timestamps differ
#			m.file "config/blog_kit.yml", "config/blog_kit.yml"
#			m.file "blog_kit.css", "public/stylesheets/blog_kit.css"
    end
  end
end
