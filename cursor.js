var cursor = module.exports = {
	users : [],
	hasUser : function(name){
		var users = this.users.filter(function(element){
			return element === name;
		});

		if(users.length > 0)
			return true;
		else
			return false;
	},
	addUser : function(name){
		this.users.push(name);
	}
};