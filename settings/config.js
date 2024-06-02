export const config = {
    expireTime: 60 * 60 * 1000,
    getDbConection: function(){
        return '';
    },
    secrets:{
        jwt: process.env.JWT || 'mysecret',

    }
}

