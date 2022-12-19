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
        const user1 = await userData.createUser('Akash', 'Patel','01/24/1999','akash1999patel@gmail.com','Akash@1234','500');
        const user2 = await userData.createUser('Harshil', 'Dani', '02/18/2000', 'dani@gmail.com', 'Dani@1234', '100');
        const user3 = await userData.createUser('Kavi', 'Prajapati', '12/24/1999', 'kavi@gmail.com', 'Kavi@1234', '4000');
        const user4 = await userData.createUser('Kush', 'Jani', '04/15/2000', 'kush@gmail.com', 'Kush@1234', '300');
        const user5 = await userData.createUser('Kahani', 'Patel', '06/25/2000', 'kahani@gmail.com', 'Kahani@1234', '400');
        const user6 = await userData.createUser('Hitanshi', 'Patel', '08/05/1999', 'hitanshi_patel@gmail.com', 'Hitanshi@1234', '666');
        const user7 = await userData.createUser('Jayraj', 'Kanani', '10/10/1999', 'kanani18@gmail.com', 'Kanani@1234', '550');
        const user8 = await userData.createUser('Aashay', 'Pandya', '06/06/1999', 'pandy06@gmail.com', 'Pandya@1234', '200');
        const user9 = await userData.createUser('Achal', 'Shah', '06/23/1999', 'achal06@gmail.com', 'Achal@1234', '2200');
        const user10 = await userData.createUser('Pranav', 'Parikh', '12/13/1989', 'pranav@gmail.com', 'Pranav@1234', '270');
        const user11 = await userData.createUser('Raj', 'Bhagat', '12/15/1999', 'rajb@gmail.com', 'Raj@1234', '2800');
        const user12 = await userData.createUser('Anmol', 'Bhow', '11/17/2000', 'bhow12@gmail.com', 'Bhow@1234', '3000');
        const user13 = await userData.createUser('Samyak', 'Shah', '10/17/1998', 'samboy2@gmail.com', 'Gareb@1234', '15');
        const user14 = await userData.createUser('Ankush', 'Desai', '11/02/2000', 'Ankush@gmail.com', 'Ankush@1234', '300');
        const user15 = await userData.createUser('Devshree', 'Parikh', '02/22/2000', 'dpparikh@gmail.com', 'Devshree@1234', '4000');


        //groups ceation between different users
        const group1 = await groupData.createGroup([user2._id,user3._id],'North St',[],user1._id);
        const group2 = await groupData.createGroup([user3._id], 'Beach St', [],user4._id);
        const group3 = await groupData.createGroup([user1._id,user2._id,user4._id],'All Boyz', [],user3._id);


        await userData.addGroupToUser(user1._id,user2._id)
        //add transcations to groups
        //const trans1 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '5' },{userId: user2._id, amountOwed: '5'},{userId :user3._id, amountOwed:'2.5'}],'Uber', 'Travel', user2._id, "12.50",group1._id,[]);
        // const trans2 = await transactionData.addTransaction([user1._id,user2._id], 'Patel', 'Grocery',user2._id,"50",group1._id,[]);
        // const trans3 = await transactionData.addTransaction([user1._id,user2._id,user3._id,user4._id], 'Top Golf', 'Other', user2._id, "40", group3._id,[],'12/12/2022');
        // const trans4 = await transactionData.addTransaction([user3._id,user4._id],'Party', 'Other', user4._id, "55.60",group2._id,[]);
        // const trans5 = await transactionData.addTransaction([user1._id,user4._id], 'Apna', 'Grocery', user1._id, "77", null,[]);
        // const trans6 = await transactionData.addTransaction([user3._id,user4._id], 'Apna', 'Grocery', user3._id, "20", null,[]);





        console.log('-------------------------------------------------------------------------------------------------------')
    }
    catch(e){
        console.log(e.toString());
    }
    console.log('Done seeding database');
  
    dbConnection.closeConnection();
  }
  
  main();
  