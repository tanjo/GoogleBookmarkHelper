namespace :googlebookmarkhelper do
  desc "appid の登録"
  task :setup, ["appid"] do |task, args|
    cd "GoogleBookmarkHelper" do
      open("background.js", "r+") {|f|
        f.flock(File::LOCK_EX)
        body = f.read
        body = body.gsub(/({%appid%})/) do |tmp|
          "#{args.appid}"
        end
        f.rewind
        f.puts body
        f.truncate(f.tell)
      }
    end
  end
end
