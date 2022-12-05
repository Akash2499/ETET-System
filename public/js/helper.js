// Functions for client side input validation

function checkEmail(email){
    //code for function checkUsername
    //Basic regex that covers all the tests more option available
    
    let regex = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
    if(regex.test(email) == false){
        throw 'Invalid Username';
    }
}

function checkPassword(password){
    //code for function checkPassword
    if(password.length < 6){
        throw 'Minimum length for password is 6';
    }
    let regex1= /^.*[A-Z]$/;
    let regex2=/^.*[0-9]$/;
    let regex3=/^.*[!@#\$%\^\&*\)\(+=._-]$/;
    
    if(regex1.test(password) == false){
        throw 'Passowrd must have at least one uppercase character';
    }
    if(regex2.test(password) == false){
        throw 'Passowrd must have at least one number';
    }
    if(regex3.test(password) == false){
        throw 'Passowrd must have at least one special character';
    }

}


module.exports = {
    checkEmail,
    checkPassword
}