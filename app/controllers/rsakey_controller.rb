class RsakeyController < ApplicationController
	RSALength = 128
	
	def index
		key_pair = RSA::KeyPair.generate(RSALength)
		session[:key_pair] = key_pair
		session[:e] = [ key_pair.public_key.exponent, "%x" % [key_pair.public_key.exponent] ]
		session[:n] = [ key_pair.public_key.modulus, "%x" % [key_pair.public_key.modulus] ]
		session[:d] = [ RSALength, "%x" % [RSALength] ]
	end
	
	private
end
