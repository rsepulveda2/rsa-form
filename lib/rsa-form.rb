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
  
    # decrypts the form data and returns a hash of the form data
    def RsaForm.decrypt_form( encstr, key_pair)

      # decrypt the form data using the public and private key
      dstr = decrypt( encstr, key_pair.private_key.exponent, key_pair.public_key.modulus) 

      # extract the query string
      query_string = dstr[2..-1]
#     puts "decode = [%s] query_string [%s] checksum [%s]" % [dstr, query_string, dstr[0,2]]

      # calculate its checksum
      sum = 0
      query_string.each_byte { |b| sum += b.to_i }

      # does the checksum match?
      if dstr[0,2] != ("%02x" % [sum & 0xff])
#       puts "checksum mismatch, expected " + dstr[0,2] + " received " + ("%x" % [sum & 0xff])
        return nil
      end
      
      # parse the query string
      cparms = CGI.parse(query_string)
       
      # convert the parms array into the params hash
      params = {}
      cparms.each do |key,value|
      
        # does the key match the pattern 'object[field]'?
        matches = key.match(/([^\[]+)\[([^\]]+)\]/)
        
        # if so, create a hash based on the object that contains hashes of field=>value
        if matches
          if !params[matches[1]]
            params[matches[1]] = { matches[2] => value.to_s } 
          else
            params[matches[1]].merge!({ matches[2] => value.to_s })
          end
        else # it doesn't match the pattern, therefore we just store the key=>value
          params[key] = value
        end
      end
    
      params.symbolize_keys!
    end

    # decrypts an RSA encrypted string
    def RsaForm.decrypt( encrypted, dec_key, enc_mod) 

      blocks = encrypted.split(' ')
      result = ''
      max = blocks.length - 1

      0.upto(max) do |i|
        
        # convert the block from ascii hex to bignum
        dec = blocks[i].hex
        
        # decode the block using the powmod function and the public and private keys
        pdec = powmod( dec, dec_key, enc_mod)

        # extract each character from the bignum and convert it to ascii
        ascii = ''
        while pdec != 0
          ascii +=  (pdec & 0xff).chr
          pdec = pdec >> 8
        end

        result += ascii
      end

      result
    end

    # calculates powmod of bignum 'b' using exponent 'x' and modulus 'm'
    def RsaForm.powmod(b,x,m)

      return 1 if x == 0

      tmp = powmod(b, x / 2, m)

      if (x % 2 == 1)
        return (((tmp * tmp) % m) * b) % m
      else
        return (tmp * tmp) % m
      end
    end	

    # generates random key positions for the rsa-form numeric keypad
    def RsaForm.keys
      keys = []
      0.upto(11) do |ndx|
        keys[ndx] = case ndx
                    when 3: "del.png"   # del and clr key are always in the same place
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