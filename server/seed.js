const dbConnection = require('./config/mongoConnection')
const data = require('./data');
const userData = data.users;
const transactionData = data.transactions;
const groupData = data.groups;


async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
  
    try{
        //Multiple users addition
        const user1 = await userData.createUser('Akash', 'Patel','01/24/1999','akash1999patel@gmail.com','Akash@1234','5000');
        const user2 = await userData.createUser('Harshil', 'Dani', '02/18/2000', 'dani@gmail.com', 'Dani@1234', '1000');
        const user3 = await userData.createUser('Kavi', 'Prajapati', '12/24/1999', 'kavi@gmail.com', 'Kavi@1234', '4000');
        const user4 = await userData.createUser('Kush', 'Jani', '04/15/2000', 'kush@gmail.com', 'Kush@1234', '3000');


        //groups ceation between different users
        const group1 = await groupData.createGroup([user1._id,user2._id,user3._id],'North St',[]);
        const group2 = await groupData.createGroup([user3._id,user4._id], 'Beach St', []);
        const group3 = await groupData.createGroup([user1._id,user2._id,user3._id,user4._id],'All Boyz', []);

        //add transcations to groups
        const trans1 = await transactionData.addTransaction([user1._id,user2._id,user3._id],'Uber', 'Travel', user2._id, "12.50",group1._id,[]);
        const trans2 = await transactionData.addTransaction([user1._id,user2._id], 'Patel', 'Grocery',user2._id,"50",group1._id,[]);
        const trans3 = await transactionData.addTransaction([user1._id,user2._id,user3._id,user4._id], 'Top Golf', 'Other', user2._id, "40", group3._id,[],'12/12/2022');
        const trans4 = await transactionData.addTransaction([user3._id,user4._id],'Party', 'Other', user4._id, "55.60",group2._id,[]);
        const trans5 = await transactionData.addTransaction([user1._id,user4._id], 'Apna', 'Grocery', user1._id, "77", null,[]);
        console.log('-------------------------------------------------------------------------------------------------------')
    }
    catch(e){
        console.log(e.toString());
    }
    console.log('Done seeding database');
  
    dbConnection.closeConnection();
  }
  
  main();
  