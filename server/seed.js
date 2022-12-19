const dbConnection = require('./config/mongoConnection')
const data = require('./data');
const userData = data.users;
const transactionData = data.transactions;
const groupData = data.groups;


async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
  
    // try{
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
        

        //groups ceation between different users
        const group1 = await groupData.createGroup([user2._id,user3._id],'North St',[],user7._id);
        const group2 = await groupData.createGroup([user3._id,user1._id], 'Beach St', [],user4._id);
        const group3 = await groupData.createGroup([user1._id,user2._id],'All Boyz', [],user4._id);
        const group4 = await groupData.createGroup([user4._id,user6._id],'Group 4', [],user5._id);
        const group5 = await groupData.createGroup([user5._id,user8._id,user9._id],'Group 5', [],user6._id);
       


        //Group 1 Transactions
    
        const trans2 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '15' },{userId: user5._id, amountOwed: '5'},{userId :user6._id, amountOwed:'10'}],'Patel Grocery', 'Food', user4._id, "30",group4._id,[]);
        const trans3 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '15.5' },{userId: user5._id, amountOwed: '10'},{userId :user6._id, amountOwed:'10.5'}],'Patel Grocery', 'Food', user5._id, "36",group4._id,[]);
        const trans4 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '150' },{userId: user5._id, amountOwed: '70'},{userId :user6._id, amountOwed:'0'}],'Zara', 'Shopping', user4._id, "220",group4._id,[]);
        const trans5 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '20' },{userId: user5._id, amountOwed: '20'},{userId :user6._id, amountOwed:'20'}],'Amc', 'Entertanment', user5._id, "60",group4._id,[]);
        const trans7 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '10' },{userId: user5._id, amountOwed: '10'},{userId :user6._id, amountOwed:'10'}],'Plumber', 'Others', user5._id, "30",group4._id,[]);
        const trans8 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '15' },{userId: user5._id, amountOwed: '10'},{userId :user6._id, amountOwed:'10'}],'Dinner', 'Food', user5._id, "35",group4._id,[]);

        const trans9 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '15' },{userId: user2._id, amountOwed: '5'},{userId :user4._id, amountOwed:'10'}],'Apna Grocery', 'Food', user1._id, "30",group3._id,[]);
        const trans10 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '150.5' },{userId: user2._id, amountOwed: '70'},{userId :user4._id, amountOwed:'30'}],'Sams Grocery', 'Food', user2._id, "250.5",group3._id,[]);
        const trans11 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '15' },{userId: user2._id, amountOwed: '7'},{userId :user4._id, amountOwed:'0'}],'H&M', 'Shopping', user4._id, "22",group3._id,[]);
        const trans12 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '20' },{userId: user2._id, amountOwed: '20'},{userId :user4._id, amountOwed:'20'}],'Amc', 'Entertanment', user1._id, "60",group3._id,[]);
        const trans13 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '100' },{userId: user2._id, amountOwed: '100'},{userId :user4._id, amountOwed:'0'}],'Maintainance', 'Others', user4._id, "200",group3._id,[]);
        const trans14 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '15' },{userId: user2._id, amountOwed: '10'},{userId :user4._id, amountOwed:'10'}],'Lunch', 'Food', user2._id, "35",group3._id,[]);

        const trans30 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '15' },{userId: user3._id, amountOwed: '5'},{userId :user7._id, amountOwed:'10'}],'Apna Grocery', 'Food', user2._id, "30",group1._id,[]);
        const trans31 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '150.5' },{userId: user3._id, amountOwed: '70'},{userId :user7._id, amountOwed:'30'}],'Sams Grocery', 'Food', user3._id, "250.5",group1._id,[]);
        const trans32 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '15' },{userId: user3._id, amountOwed: '7'},{userId :user7._id, amountOwed:'0'}],'H&M', 'Shopping', user7._id, "22",group1._id,[]);
        const trans33 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '20' },{userId: user3._id, amountOwed: '20'},{userId :user7._id, amountOwed:'20'}],'Amc', 'Entertanment', user2._id, "60",group1._id,[]);
        const trans34 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '100' },{userId: user3._id, amountOwed: '100'},{userId :user7._id, amountOwed:'0'}],'Maintainance', 'Others', user3._id, "200",group1._id,[]);
        const trans35 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '15' },{userId: user3._id, amountOwed: '10'},{userId :user7._id, amountOwed:'10'}],'Lunch', 'Food', user7._id, "35",group1._id,[]);

        const trans36 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '15' },{userId: user1._id, amountOwed: '5'},{userId :user3._id, amountOwed:'10'}],'Patel Grocery', 'Food', user4._id, "30",group2._id,[]);
        const trans37 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '150.5' },{userId: user1._id, amountOwed: '100'},{userId :user3._id, amountOwed:'100.5'}],'Cosco Grocery', 'Food', user5._id, "351",group2._id,[]);
        const trans38 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '20' },{userId: user1._id, amountOwed: '40'},{userId :user3._id, amountOwed:'33.33'}],'Zara', 'Shopping', user4._id, "93.33",group2._id,[]);
        const trans39 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '20' },{userId: user1._id, amountOwed: '20'},{userId :user3._id, amountOwed:'20'}],'Top Golf', 'Entertanment', user5._id, "60",group2._id,[]);
        const trans40 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '10' },{userId: user1._id, amountOwed: '10'},{userId :user3._id, amountOwed:'10'}],'Repair', 'Others', user5._id, "30",group2._id,[]);
        const trans41 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '15' },{userId: user1._id, amountOwed: '10'},{userId :user3._id, amountOwed:'10'}],'Dinner and desert', 'Food', user5._id, "35",group2._id,[]);



        //await userData.addGroupToUser(user1._id,user2._id)
        //add transcations to groups
        //const trans1 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '5' },{userId: user2._id, amountOwed: '5'},{userId :user3._id, amountOwed:'2.5'}],'Uber', 'Travel', user2._id, "12.50",group1._id,[]);
        // const trans2 = await transactionData.addTransaction([user1._id,user2._id], 'Patel', 'Grocery',user2._id,"50",group1._id,[]);
        // const trans3 = await transactionData.addTransaction([user1._id,user2._id,user3._id,user4._id], 'Top Golf', 'Other', user2._id, "40", group3._id,[],'12/12/2022');
        // const trans4 = await transactionData.addTransaction([user3._id,user4._id],'Party', 'Other', user4._id, "55.60",group2._id,[]);
        // const trans5 = await transactionData.addTransaction([user1._id,user4._id], 'Apna', 'Grocery', user1._id, "77", null,[]);
        // const trans6 = await transactionData.addTransaction([user3._id,user4._id], 'Apna', 'Grocery', user3._id, "20", null,[]);





        console.log('-------------------------------------------------------------------------------------------------------')
    // }
    // catch(e){
    //     console.log(e.toString());
    // }
    console.log('Done seeding database');
  
    dbConnection.closeConnection();
  }
  
  main();
  