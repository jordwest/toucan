var Toucan = module.exports = function(){
    var locked = false;

    var perms = {}

    var _permit = function(permission){
        if(locked)
        {
            throw new Error("Cannot add permissions after token has been locked");
        }

        perms[permission] = true;
    }

    var _deny = function(permission){
        if(locked)
        {
            throw new Error("Cannot add permissions after token has been locked");
        }

        perms[permission] = false;
    }

    return {
        permit: function(permission)
        {
            if(permission instanceof Array)
            {
                for(var i = 0; i < permission.length; i++)
                {
                    _permit(permission[i]);
                }
            }else{
                _permit(permission);
            }
            return this;
        },
        deny: function(permission)
        {
            if(permission instanceof Array)
            {
                for(var i = 0; i < permission.length; i++)
                {
                    _deny(permission[i]);
                }
            }else{
                _deny(permission);
            }
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
        },
        cannot: function(permission)
        {
            // Convenience function
            return !this.can(permission);
        }
    }
}