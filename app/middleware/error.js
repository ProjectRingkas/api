const errorCode = {
    'DB01': 'database error',
    'REG01': 'please complete registration form',
    'REG02': 'username already registered',
    'AUTH01': 'unregistered username',
    'AUTH02': 'username or password is not correct',
    'AUTH03': 'cannot verify email or password',
    'PRSN01': 'please complete customer registration form',
    'PRSN02': 'please complete vendor registration form',
    'ITEM01': 'product not found',
    'ITEM02': 'please complete product registration form',
    'ITEM03': 'please complete invenory update form',
    'INVC01': 'invoice not found',
    'INVC02': 'please complete invoice registration form',
    'BILL01': 'bill not found',
    'BILL02': 'please complete bill registration form',
    'BILL03': 'invalid bill periodic',
    'PAY01': 'please complete payment registration form',
    'PAY02': 'invalid payment type',
    'PAY03': 'payment not found',
    'PAY04': 'invalid payment report category',
    'COA01': 'code of account not found',
};
module.exports = {
    error: function (error, req, res, next) {
        let errorCodeFiltered = Object.keys(errorCode).filter((code) => {
            if ('stack' in error) {
                return error.stack.indexOf(code) > -1;
            } else {
                return false;
            }
        });
        if (errorCodeFiltered.length == 0) {
            res.status(500).json({
                status: 500,
                message: 'Unknown Error',
                detail: error.stack
            });
        } else if (errorCodeFiltered[0] == 'AUTH02') {
            res.status(401).json({
                status: 401,
                message: errorCode[errorCodeFiltered[0]]
            });
        } else if (errorCodeFiltered[0] == 'AUTH03') {
            res.status(422).json({
                status: 422,
                message: errorCode[errorCodeFiltered[0]]
            });
        } else {
            res.status(400).json({
                status: 400,
                message: errorCode[errorCodeFiltered[0]]
            });
        }
    }
}