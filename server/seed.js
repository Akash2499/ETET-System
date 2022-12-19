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
        

        //groups ceation between different users
        const group1 = await groupData.createGroup([user2._id,user3._id],'North St',[],user7._id);
        const group2 = await groupData.createGroup([user3._id,user1._id], 'Beach St', [],user4._id);
        const group3 = await groupData.createGroup([user1._id,user2._id],'All Boyz', [],user4._id);
        const group4 = await groupData.createGroup([user4._id,user6._id],'Group 4', [],user5._id);
        const group5 = await groupData.createGroup([user5._id,user8._id,user9._id],'Group 5', [],user6._id);
       


        //Group 1 Transactions
    
        const trans2 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-15' },{userId: user5._id, amountOwed: '-5'},{userId :user6._id, amountOwed:'-10'}],'Patel Grocery', 'Food', user4._id, "30",group4._id,[],'11/15/2022');
        const trans3 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-15.5' },{userId: user5._id, amountOwed: '-10'},{userId :user6._id, amountOwed:'-10.5'}],'Patel Grocery', 'Food', user5._id, "36",group4._id,[]);
        const trans4 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-150' },{userId: user5._id, amountOwed: '-70'},{userId :user6._id, amountOwed:'-0'}],'Zara', 'Shopping', user4._id, "220",group4._id,[],'10/15/2022');
        const trans5 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-20' },{userId: user5._id, amountOwed: '-20'},{userId :user6._id, amountOwed:'-20'}],'Amc', 'Entertanment', user5._id, "60",group4._id,[]);
        const trans7 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-10' },{userId: user5._id, amountOwed: '-10'},{userId :user6._id, amountOwed:'-10'}],'Plumber', 'Others', user5._id, "30",group4._id,[],'11/15/2022');
        const trans8 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-15' },{userId: user5._id, amountOwed: '-10'},{userId :user6._id, amountOwed:'-10'}],'Dinner', 'Food', user5._id, "35",group4._id,[],'10/15/2022');

        const trans9 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-15' },{userId: user2._id, amountOwed: '-5'},{userId :user4._id, amountOwed:'-10'}],'Apna Grocery', 'Food', user1._id, "30",group3._id,[]);
        const trans10 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-150.5' },{userId: user2._id, amountOwed: '-70'},{userId :user4._id, amountOwed:'-30'}],'Sams Grocery', 'Food', user2._id, "250.5",group3._id,[],'11/15/2022');
        const trans11 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-15' },{userId: user2._id, amountOwed: '-7'},{userId :user4._id, amountOwed:'-0'}],'H&M', 'Shopping', user4._id, "22",group3._id,[],'10/15/2022');
        const trans12 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-20' },{userId: user2._id, amountOwed: '-20'},{userId :user4._id, amountOwed:'-20'}],'Amc', 'Entertanment', user1._id, "60",group3._id,[]);
        const trans13 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-100' },{userId: user2._id, amountOwed: '-100'},{userId :user4._id, amountOwed:'-0'}],'Maintainance', 'Others', user4._id, "200",group3._id,[],'11/15/2022');
        const trans14 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-15' },{userId: user2._id, amountOwed: '-10'},{userId :user4._id, amountOwed:'-10'}],'Lunch', 'Food', user2._id, "35",group3._id,[]);

        const trans30 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-15' },{userId: user3._id, amountOwed: '-5'},{userId :user7._id, amountOwed:'-10'}],'Apna Grocery', 'Food', user2._id, "30",group1._id,[]);
        const trans31 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-150.5' },{userId: user3._id, amountOwed: '-70'},{userId :user7._id, amountOwed:'-30'}],'Sams Grocery', 'Food', user3._id, "250.5",group1._id,[],'10/15/2022');
        const trans32 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-15' },{userId: user3._id, amountOwed: '-7'},{userId :user7._id, amountOwed:'-0'}],'H&M', 'Shopping', user7._id, "22",group1._id,[],'10/15/2022');
        const trans33 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-20' },{userId: user3._id, amountOwed: '-20'},{userId :user7._id, amountOwed:'-20'}],'Amc', 'Entertanment', user2._id, "60",group1._id,[]);
        const trans34 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-100' },{userId: user3._id, amountOwed: '-100'},{userId :user7._id, amountOwed:'-0'}],'Maintainance', 'Others', user3._id, "200",group1._id,[],'11/15/2022');
        const trans35 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-15' },{userId: user3._id, amountOwed: '-10'},{userId :user7._id, amountOwed:'-10'}],'Lunch', 'Food', user7._id, "35",group1._id,[]);

        const trans36 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-15' },{userId: user1._id, amountOwed: '-5'},{userId :user3._id, amountOwed:'-10'}],'Patel Grocery', 'Food', user4._id, "30",group2._id,[]);
        const trans37 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-150.5' },{userId: user1._id, amountOwed: '-100'},{userId :user3._id, amountOwed:'-100.5'}],'Cosco Grocery', 'Food', user5._id, "351",group2._id,[]);
        const trans38 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-20' },{userId: user1._id, amountOwed: '-40'},{userId :user3._id, amountOwed:'-33.33'}],'Zara', 'Shopping', user4._id, "93.33",group2._id,[],'11/15/2022');
        const trans39 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-20' },{userId: user1._id, amountOwed: '-20'},{userId :user3._id, amountOwed:'-20'}],'Top Golf', 'Entertanment', user5._id, "60",group2._id,[],'11/15/2022');
        const trans40 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-10' },{userId: user1._id, amountOwed: '-10'},{userId :user3._id, amountOwed:'-10'}],'Repair', 'Others', user5._id, "30",group2._id,[],'10/15/2022');
        const trans41 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-15' },{userId: user1._id, amountOwed: '-10'},{userId :user3._id, amountOwed:'-10'}],'Dinner and desert', 'Food', user5._id, "35",group2._id,[],'11/15/2022');


     
        

        const trans15 = await transactionData.addTransaction([{ userId: user6._id, amountOwed: '-15' },{userId: user8._id, amountOwed: '-25'},{userId :user9._id, amountOwed:'-25'}],'Transaction 15', 'Travel', user5._id, "65",group5._id,[],'11/15/2022');
        const trans16 = await transactionData.addTransaction([{ userId: user6._id, amountOwed: '-300' },{userId: user8._id, amountOwed: '-50'},{userId :user9._id, amountOwed:'-25'}],'Transaction 16', 'Food', user5._id, "375",group5._id,[],'10/15/2022');
        const trans17 = await transactionData.addTransaction([{ userId: user5._id, amountOwed: '-15' },{userId: user9._id, amountOwed: '-25'},{userId :user8._id, amountOwed:'-25'}],'Transaction 17', 'Travel', user6._id, "650",group5._id,[],'11/15/2022');
        const trans18 = await transactionData.addTransaction([{ userId: user5._id, amountOwed: '-300' },{userId: user9._id, amountOwed: '-50'},{userId :user8._id, amountOwed:'-25'}],'Transaction 18', 'Food', user6._id, "375",group5._id,[]);
        const trans19 = await transactionData.addTransaction([{ userId: user5._id, amountOwed: '-15' },{userId: user6._id, amountOwed: '-25'},{userId :user9._id, amountOwed:'-25'}],'Transaction 19', 'Travel', user8._id, "65",group5._id,[],'11/15/2022');
        const trans20 = await transactionData.addTransaction([{ userId: user5._id, amountOwed: '-300' },{userId: user6._id, amountOwed: '-50'},{userId :user9._id, amountOwed:'-25'}],'Transaction 20', 'Other', user8._id, "375",group5._id,[],'11/15/2022');
        const trans21 = await transactionData.addTransaction([{ userId: user5._id, amountOwed: '-15' },{userId: user6._id, amountOwed: '-25'},{userId :user9._id, amountOwed:'-25'}],'Transaction 21', 'Travel', user8._id, "650",group5._id,[]);
        const trans22 = await transactionData.addTransaction([{ userId: user5._id, amountOwed: '-300' },{userId: user6._id, amountOwed: '-50'},{userId :user9._id, amountOwed:'-25'}],'Transaction 22', 'Other', user8._id, "375",group5._id,[],'10/15/2022');


        const trans50 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-300' },{userId: user2._id, amountOwed: '-75'}],'T1', 'Food', user1._id, "375",'',[],'10/15/2022');
        const trans51 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-100.5' },{userId: user3._id, amountOwed: '-50'}],'T2', 'Travel', user3._id, "150.5",'',[],'11/15/2022');
        const trans52 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '-120' },{userId: user6._id, amountOwed: '-15.7'}],'T3', 'Others', user1._id, "135.7",'',[]);

        const trans53 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-300' },{userId: user5._id, amountOwed: '-75'}],'T4', 'Food', user2._id, "375",'',[],'10/15/2022');
        const trans54 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-100.5' },{userId: user6._id, amountOwed: '-50'}],'T5', 'Travel', user2._id, "150.5",'',[]);
        const trans55 = await transactionData.addTransaction([{ userId: user2._id, amountOwed: '-120' },{userId: user7._id, amountOwed: '-15.7'}],'T6', 'Others', user2._id, "135.7",'',[],'11/15/2022');

        const trans56 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-300' },{userId: user1._id, amountOwed: '-75'}],'T4', 'Food', user4._id, "375",'',[]);
        const trans57 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-100.5' },{userId: user8._id, amountOwed: '-50'}],'T5', 'Travel', user4._id, "150.5",'',[],'10/15/2022');
        const trans58 = await transactionData.addTransaction([{ userId: user4._id, amountOwed: '-120' },{userId: user3._id, amountOwed: '-15.7'}],'T6', 'Others', user4._id, "135.7",'',[],'11/15/2022');


        //await userData.addGroupToUser(user1._id,user2._id)
        //add transcations to groups
        //const trans1 = await transactionData.addTransaction([{ userId: user1._id, amountOwed: '5' },{userId: user2._id, amountOwed: '5'},{userId :user3._id, amountOwed:'2.5'}],'Uber', 'Travel', user2._id, "12.50",group1._id,[]);
        // const trans2 = await transactionData.addTransaction([user1._id,user2._id], 'Patel', 'Grocery',user2._id,"50",group1._id,[]);
        // const trans3 = await transactionData.addTransaction([user1._id,user2._id,user3._id,user4._id], 'Top Golf', 'Other', user2._id, "40", group3._id,[],'12/12/2022');
        // const trans4 = await transactionData.addTransaction([user3._id,user4._id],'Party', 'Other', user4._id, "55.60",group2._id,[]);
        // const trans5 = await transactionData.addTransaction([user1._id,user4._id], 'Apna', 'Grocery', user1._id, "77", null,[]);
        // const trans6 = await transactionData.addTransaction([user3._id,user4._id], 'Apna', 'Grocery', user3._id, "20", null,[]);

        //Adding comments to ransactions 

        const comment1 = await transactionData.addCommentToTransaction(trans2._id,'This is a comment on trancation');
        const comment2 = await transactionData.addCommentToTransaction(trans2._id,'This is second comment on trancation');
        const comment3 = await transactionData.addCommentToTransaction(trans3._id,'This is a comment on trancation');
        const comment4 = await transactionData.addCommentToTransaction(trans3._id,'This is second comment on trancation');
        const comment5 = await transactionData.addCommentToTransaction(trans4._id,'This is a comment on trancation');
        const comment6 = await transactionData.addCommentToTransaction(trans4._id,'This is second comment on trancation');
        const comment7 = await transactionData.addCommentToTransaction(trans5._id,'This is a comment on trancation');
        const comment8 = await transactionData.addCommentToTransaction(trans5._id,'This is second comment on trancation');
        const comment9 = await transactionData.addCommentToTransaction(trans7._id,'This is a comment on trancation');
        const comment10 = await transactionData.addCommentToTransaction(trans7._id,'This is second comment on trancation');
        const comment11 = await transactionData.addCommentToTransaction(trans8._id,'This is a comment on trancation');
        const comment12 = await transactionData.addCommentToTransaction(trans8._id,'This is second comment on trancation');
        const comment13 = await transactionData.addCommentToTransaction(trans9._id,'This is a comment on trancation');
        const comment14 = await transactionData.addCommentToTransaction(trans9._id,'This is second comment on trancation');
        const comment15 = await transactionData.addCommentToTransaction(trans10._id,'This is a comment on trancation');
        const comment16 = await transactionData.addCommentToTransaction(trans10._id,'This is second comment on trancation');
        const comment17 = await transactionData.addCommentToTransaction(trans11._id,'This is second comment on trancation');
        const comment18 = await transactionData.addCommentToTransaction(trans11._id,'This is a comment on trancation');
        const comment19 = await transactionData.addCommentToTransaction(trans12._id,'This is second comment on trancation');
        const comment20 = await transactionData.addCommentToTransaction(trans13._id,'This is a comment on trancation');
        const comment21 = await transactionData.addCommentToTransaction(trans14._id,'This is a comment on trancation');
        const comment22 = await transactionData.addCommentToTransaction(trans14._id,'This is second comment on trancation');
        const comment23 = await transactionData.addCommentToTransaction(trans15._id,'This is a comment on trancation');
        const comment24 = await transactionData.addCommentToTransaction(trans15._id,'This is second comment on trancation');
        const comment25 = await transactionData.addCommentToTransaction(trans16._id,'This is a comment on trancation');
        const comment26 = await transactionData.addCommentToTransaction(trans16._id,'This is second comment on trancation');
        const comment27 = await transactionData.addCommentToTransaction(trans17._id,'This is second comment on trancation');
        const comment28 = await transactionData.addCommentToTransaction(trans17._id,'This is a comment on trancation');
        const comment29 = await transactionData.addCommentToTransaction(trans18._id,'This is second comment on trancation');
        const comment30 = await transactionData.addCommentToTransaction(trans18._id,'This is a comment on trancation');
        const comment31 = await transactionData.addCommentToTransaction(trans19._id,'This is a comment on trancation');
        const comment32 = await transactionData.addCommentToTransaction(trans19._id,'This is second comment on trancation');
        const comment33 = await transactionData.addCommentToTransaction(trans20._id,'This is a comment on trancation');
        const comment34 = await transactionData.addCommentToTransaction(trans20._id,'This is second comment on trancation');
        const comment35 = await transactionData.addCommentToTransaction(trans21._id,'This is a comment on trancation');
        const comment36 = await transactionData.addCommentToTransaction(trans21._id,'This is second comment on trancation');
        const comment37 = await transactionData.addCommentToTransaction(trans22._id,'This is second comment on trancation');
        const comment38 = await transactionData.addCommentToTransaction(trans32._id,'This is a comment on trancation');
        const comment39 = await transactionData.addCommentToTransaction(trans32._id,'This is second comment on trancation');
        const comment40 = await transactionData.addCommentToTransaction(trans30._id,'This is a comment on trancation');
        const comment41 = await transactionData.addCommentToTransaction(trans30._id,'This is a comment on trancation');
        const comment42 = await transactionData.addCommentToTransaction(trans30._id,'This is second comment on trancation');
        const comment43 = await transactionData.addCommentToTransaction(trans31._id,'This is a comment on trancation');
        const comment44 = await transactionData.addCommentToTransaction(trans31._id,'This is second comment on trancation');
        const comment45 = await transactionData.addCommentToTransaction(trans33._id,'This is a comment on trancation');
        const comment46 = await transactionData.addCommentToTransaction(trans33._id,'This is second comment on trancation');
        const comment47 = await transactionData.addCommentToTransaction(trans34._id,'This is second comment on trancation');
        const comment48 = await transactionData.addCommentToTransaction(trans35._id,'This is a comment on trancation');
        const comment49 = await transactionData.addCommentToTransaction(trans35._id,'This is second comment on trancation');
        const comment50 = await transactionData.addCommentToTransaction(trans36._id,'This is a comment on trancation');

        
        const friend1 = await userData.addFriendToUser(user1._id,user2._id);
        const friend2 = await userData.addFriendToUser(user1._id,user3._id);
        const friend3 = await userData.addFriendToUser(user1._id,user4._id);
        const friend4 = await userData.addFriendToUser(user1._id,user5._id);
        const friend5 = await userData.addFriendToUser(user1._id,user6._id);
        const friend6 = await userData.addFriendToUser(user1._id,user7._id);
        const friend7 = await userData.addFriendToUser(user1._id,user8._id);
        const friend8 = await userData.addFriendToUser(user1._id,user9._id);

        const friend9 = await userData.addFriendToUser(user2._id,user3._id);
        const friend10 = await userData.addFriendToUser(user2._id,user4._id);
        const friend11 = await userData.addFriendToUser(user2._id,user5._id);
        const friend12 = await userData.addFriendToUser(user2._id,user6._id);
        const friend13 = await userData.addFriendToUser(user2._id,user7._id);
        const friend14 = await userData.addFriendToUser(user2._id,user8._id);
        const friend15 = await userData.addFriendToUser(user2._id,user9._id);

        const friend16 = await userData.addFriendToUser(user3._id,user4._id);
        const friend17 = await userData.addFriendToUser(user3._id,user5._id);
        const friend18 = await userData.addFriendToUser(user3._id,user6._id);
        const friend19 = await userData.addFriendToUser(user3._id,user7._id);
        const friend21 = await userData.addFriendToUser(user3._id,user8._id);
        const friend20 = await userData.addFriendToUser(user3._id,user9._id);

        const friend24 = await userData.addFriendToUser(user4._id,user5._id);
        const friend25 = await userData.addFriendToUser(user4._id,user6._id);
        const friend26 = await userData.addFriendToUser(user4._id,user7._id);
        const friend27 = await userData.addFriendToUser(user4._id,user8._id);
        const friend28 = await userData.addFriendToUser(user4._id,user9._id);
        



        console.log('-------------------------------------------------------------------------------------------------------')
    }
    catch(e){
        console.log(e.toString());
    }
    console.log('Done seeding database');
  
    dbConnection.closeConnection();
  }
  
  main();
  