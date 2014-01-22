var Toucan = module.exports = function(){
    var locked = false;

    var perms = {}

    return {
        permit: function(permission)
        {
            if(locked)
            {
                throw new Error("Cannot add permissions after token has been locked");
            }

            perms[permission] = true;
            return this;
        },
        deny: function(permission)
        {
            if(locked)
            {
                throw new Error("Cannot add permissions after token has been locked");
            }

            perms[permission] = false;
            return this;
        },
        lock: function(permission)
        {
            locked = true;
            return this;
        },
        can: function(permission)
        {
            if(!locked)
            {
                throw new Error("Access token is not locked")
            }

            // Allow-by-default mode
            if("*" in perms)
            {
                // Allow all on, check for any explicit denies
                if(permission in perms){
                    return perms[permission];
                }
                // Or allow by default
                return true;
            }

            // Permission must be explicitly set
            if(permission in perms)
            {
                return perms[permission];
            }

            // Deny by default
            return false;
        }
    }
}