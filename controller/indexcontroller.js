const crypto = require('crypto');
const ENCRYPTION_KEY = "e807f1fcf82d132f9bb018ca6738a19f"; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
const config = require('../db');
const fs = require("fs")

exports.encrypt = (text) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.decrypt = (text) => {
	try{
		let textParts = text.split(':');
		let iv = Buffer.from(textParts.shift(), 'hex');
		let encryptedText = Buffer.from(textParts.join(':'), 'hex');
		let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	}catch(e){
		return false
	}
}



exports.BfindOne = async (model,condition = {})=>{
	try{
		var outdata = null; 
		await model.findOne(condition).then(rdata=>{
			if(!rdata){
				outdata = false;
			}else{
				outdata = rdata;
			}
		});
		return outdata;
	}catch(e){
		return false;
	}
}

exports.data_save =async (indata,model)=>{
	// try{
		var handle = null;
		var savehandle = new model(indata);
		await savehandle.save().then(rdata=>{
			if(!rdata){
				handle = false;
			}else{
				handle = rdata;
			}
		});
		return handle;
	// }catch(e){
	// 	return false;
	// }
}

exports.BfindOneAndUpdate = async (model,condition = {},data) =>{
	// try{
		var updatehandle = await model.findOneAndUpdate(condition,data,{ new: true,upsert: true,})
		if(!updatehandle){
			return false
		}else{
			return updatehandle		
		}
	// }catch(e){
	// 	return false;
	// }
}

exports.BfindOneAndDelete =async (model,condition)=>{
	try{
		var deletehandle = null;
		await model.findOneAndDelete(condition).then(rdata=>{
			deletehandle = rdata;
		});
		if(!deletehandle){
			return false;
		}else{
			return deletehandle;
		}
	}catch(e){
		return false;
	}
}


exports.imageupload = (req,res,next) =>{
	// console.log(req.body);
	if(req.files.length){
		var filename = req.files[0].filename;
		var filetype = req.files[0].mimetype.split("/")[1];
		var now_path = config.BASEURL  + filename;
		var new_path = config.BASEURL  + filename + "." + filetype;
		fs.rename(now_path , new_path ,  (err) =>{
			if(err){
				req.body.imagesrc = false;
			}else{
				var img = filename + "." + filetype;
				req.body.imagesrc = img;
				next();
			}
		});
	}else{
		// req.body.imagesrc = false;
		next();
	}
}


exports.fileRemove =(baseUrl , filename) => {
	// config.BASEURL
	const url = baseUrl + "/" + filename;
	try {
	  fs.unlinkSync(url)
	  //file removed
	  return true;
	} catch(err) {
	  console.error(err)
	  return false;
	}
	return false;
 }