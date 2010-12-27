require 'cgi'

module RsaForm
  def self.included(base)
    base.extend ClassMethods
  end

  def ensure_unique(name)
    begin
      self[name] = yield
    end while self.class.exists?(name => self[name])
  end

  module ClassMethods
    def RsaForm.decrypt_form( encstr, key_pair)

      dstr = decrypt( encstr, key_pair.private_key.exponent, key_pair.public_key.modulus) 

      url = dstr[2..-1]
			puts "decode = [%s] url [%s] checksum [%s]" % [dstr, url, dstr[0,2]]

      sum = 0
      url.each_byte { |b| sum += b.to_i }

      if dstr[0,2] != ("%x" % [sum & 0xff])
#				puts "checksum mismatch, expected " + dstr[0,2] + " received " + ("%x" % [sum & 0xff])
        return nil
      end
      
      cparms = CGI.parse(url)
       
      params = {}
      cparms.each do |k,v|
#       puts "for k %s v %s" % [k, v.to_s]
        matches = k.match(/([^\[]+)\[([^\]]+)\]/)
        
        if matches
          if !params[matches[1]]
            params[matches[1]] = { matches[2] => v.to_s } 
          else
            params[matches[1]].merge!({ matches[2] => v.to_s })
          end
        end
      end
    
      params.symbolize_keys!
    end

    def RsaForm.decrypt( encrypted, dec_key, enc_mod) 

      blocks = encrypted.split(' ')
      result = ''
      max = blocks.length - 1

      0.upto(max) do |i|
        dec = blocks[i].hex
        pdec = powmod( dec, dec_key, enc_mod)

        ascii = ''
        while pdec != 0
          ascii =  ascii + (pdec & 0xff).chr
          pdec = pdec >> 8
        end

        result << ascii
      end

      result
    end

    def RsaForm.powmod(b,x,m)

      return 1 if x == 0

      tmp = powmod(b, x / 2, m)

      if (x % 2 == 1)
        return (((tmp * tmp) % m) * b) % m
      else
        return (tmp * tmp) % m
      end
    end	

    def RsaForm.keys
      keys = []
      0.upto(11) do |ndx|
        keys[ndx] = case ndx
                    when 3: "del.png"
                    when 7: "clr.png"
                    else
                      while true
                        str = rand(10).to_s + ".png"
                        break if keys.index(str) == nil
                      end			
                      str											
                    end
      end
      
      keys
    end
  end	
end