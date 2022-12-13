// Functions for server side input validation

const {ObjectId} = require('mongodb');

function checkEmail(email){
    //code for function checkUsername
    //Basic regex that covers all the tests more option available
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(regex.test(email) == false){
        throw 'Invalid Email';
    }
}

function checkPassword(password){
    //code for function checkPassword
    if(password.length < 6){
        throw 'Minimum length for password is 6';
    }
    let regex1= /^.*[A-Z].*$/;
    let regex2=/^.*[0-9].*$/;
    let regex3=/^.*[!@#\$%\^\&*\)\(+=._-].*$/;
    
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

function checkFnameLname(name){
    let regex =/^[a-zA-Z]{2,}$/
    if(regex.test(name) == false){
        throw 'Enter a valid name';
    }
}
function checkleapYear(year)
{
  if ((year % 4 == 0) && (year != 100) || (year == 400)){
      return true;
  }
  else{
      return false;
  }
}


function checkDOB(date){
    let regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/
    if (typeof date != 'string' || !regex.test(date)){
       throw 'Enter Date in valid format i.e mm/dd/yyyy';
    }
    
    let todayDate = new Date();
    GivenDate = new Date(date);


    if(GivenDate > todayDate){
        throw 'Given date is greater than the current date';
    }

    let currentDate = date.split('/');

    if(currentDate.length != 3){
        return false;
    }
    
    let year = parseInt(currentDate[2]);
    if(((new Date().getFullYear())- year) >= 12 == false){
        throw 'You need to atleast be 12 years old';
    }
    if(year > new Date().getFullYear()){
        throw 'You need to be borned first :)';
    }
    let month = parseInt(currentDate[0]);
    console.log
    if(month < 1 || month > 12 ){
        throw 'Invalid Month';
    }
    let daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    let days = parseInt(currentDate[1]);
    if(month == 2){
        if(checkleapYear(year)){
            if(days < 1 || days > daysInMonth[1]+1){
                throw 'Invalid day feb leap year';
            }
        } else if(days < 1 || days > daysInMonth[1]){
            throw 'Invalid day feb';
        }
    } else if(days < 1 || days > daysInMonth[month-1]){
        throw 'Invalid day';
    }
}
function checkBudget(value){
    if(typeof(value) !== 'number'){
        throw 'Invalid Budget';
    }
    
    if(/^([0-9]{1,}(.[0]*)?)$/.test(value) && (Number.isInteger(Number(value)) && Number(value) > 0 )){
        return true;
    }
    throw 'Invalid Budget';
}
function checkUserId(userid){
    if(!Array.isArray(userid)){
        throw 'userID must me an array only';
    }
}
function checkAmount(amount){
    if(typeof(amount) !== 'string'){
        throw 'Invalid Amount';
    }
    if(amount.length == 0){
        throw 'Invalid Amount';
    }
    if(/^([0-9]{1,}.{0,1}[0-9]{0,})$/.test(amount)  && Number(amount) > 0){
        return true;
    }
    throw 'Invalid Amount';
}

function checkString(name){
    if(!name){
        throw 'Enter a value'
    }
}
function checkGroupName(name){
    if(typeof name != 'string' || name.trim().length < 2){
        throw 'Invalid Group Name';
    }
}
function checkObjectId(id){
    id = id.toString();
    id = id.trim();
    if(!ObjectId.isValid(id)){
        throw "Invalid id";
      }
}

function checkGroupMembers(members){
    if(!members || members==undefined || !Array.isArray(members)) throw "Group members should be an array"
    members.map((m)=>{
        checkObjectId(m)
    })
}

function checkGroupTransactions(transactions){
    if(!transactions || transactions==undefined || !Array.isArray(transactions)) throw "Group transactions should be an array"
    transactions.map((t)=>{
        checkObjectId(t)
    })
}

const getTodaysDate = () => {
    today = new Date()
    day = today.getDate()
    month = today.getMonth()
    year = today.getFullYear()
    day = day < 10 ? '0'+day : day+''
    month = month < 10 ? '0'+month : month+''
    return month+"/"+day+"/"+year
}

module.exports = {
    checkEmail,
    checkPassword,
    checkAmount,
    checkBudget,
    checkDOB,
    checkFnameLname,
    checkGroupName,
    checkString,
    checkUserId,
    checkObjectId,
    checkGroupMembers,
    checkGroupTransactions,
    getTodaysDate
}

