
module.exports = {
    name: 'api-auth-rbac',
    policy: (authTypeHandler,policyConfig) => {
        return async function(req,res,next){
            next();
        }
    }
};



