

var API_KEY = "123456";

var express = require('express');
var router = express.Router();
const { poolPromise, sql } = require('../db')



//=========================================================================
//  API TEST
//=========================================================================

router.get('/', function (req, res) {
    res.end("API RUNNING")
});



//=========================================================================
// USER TABLE
// GET ALL
// QUERY: http://localhost:5000/userAll?key=123456
//=========================================================================

router.get('/userAll', async (req, res, next) => {

    console.log(req.query);

    if (req.query.key != API_KEY) {
        res.send(JSON.stringify({ success: false, message: 'Wrong API Key!' }));
    }
    else {

        var user_id = req.query.userId;

        try {
            const pool = await poolPromise
            const queryResult = await pool.request()
                .input('UserId', sql.Int, user_id)
                .query('SELECT UserId, UserPhone, Name, Address FROM [User]')
            if (queryResult.recordset.length > 0) {
                res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
            }
            else {
                res.send(JSON.stringify({ success: false, message: 'Empty!' }));
            }
        } catch (err) {
            res.status(500) // Internal Server Error
            res.send(JSON.stringify({ success: false, message: err.message }));
        }
    }
});



//=========================================================================
// USER TABLE
// GET BY ID
// QUERY: http://localhost:5000/userById?key=123456&userid=1
//=========================================================================

router.get('/userById', async (req, res, next) => {

    console.log(req.query);

    if (req.query.key != API_KEY) {
        res.send(JSON.stringify({ success: false, message: 'Wrong API Key!' }));
    }
    else {

        var userid = req.query.userid;

        if (userid != null) {

            try {
                const pool = await poolPromise
                const queryResult = await pool.request()
                    .input('UserId', sql.Int, userid)
                    .query('SELECT userPhone, name, address, userid FROM [User] WHERE UserId=@UserId')
                if (queryResult.recordset.length > 0) {
                    res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
                }
                else {
                    res.send(JSON.stringify({ success: false, message: 'The record no exists!' }));
                }
            } catch (err) {
                res.status(500) // Internal Server Error
                res.send(JSON.stringify({ success: false, message: err.message }));
            }
        }
        else {
            res.send(JSON.stringify({ success: false, message: 'Missing userid in query!' }));
        }
    }
});



//=========================================================================
// USER TABLE
// SEARCH BY NAME
// QUERY: http://localhost:5000/searchUser?key=123456&Name=Ca
//=========================================================================

router.get('/searchUser', async (req, res, next) => {

    console.log(req.query);

    if (req.query.key != API_KEY) {
        res.send(JSON.stringify({ success: false, message: 'Wrong API Key!' }));
    }
    else {

        var search_query = req.query.Name;

        if (search_query != null) {

            try {
                const pool = await poolPromise
                const queryResult = await pool.request()
                    .input('SearchQuery', sql.VarChar, '%' + search_query + '%')
                    .query('SELECT UserId, UserPhone, Name, Address FROM [User] WHERE Name LIKE @SearchQuery')
                if (queryResult.recordset.length > 0) {
                    res.send(JSON.stringify({ success: true, result: queryResult.recordset }));
                }
                else {
                    res.send(JSON.stringify({ success: false, message: 'Empty!' }));
                }
            } catch (err) {
                res.status(500) // Internal Server Error
                res.send(JSON.stringify({ success: false, message: err.message }));
            }
        }
        else {
            res.send(JSON.stringify({ success: false, message: 'Missing userName in query!' }));
        }
    }
});



//=========================================================================
// USER TABLE
// POST - CREATE - UPDATE
// QUERY: http://localhost:5000/user
//========================================================================= 

router.post('/user', async (req, res, next) => {

    console.log(req.body)

    if (req.body.key != API_KEY) {
        res.send(JSON.stringify({ success: false, message: 'Wrong API Key!' }));

    }
    else {
        var user_phone = req.body.userPhone;
        var user_name = req.body.userName;
        var user_address = req.body.userAddress;
        var userid = req.body.userid;

        if (userid != null) {

            try {
                const pool = await poolPromise
                const queryResult = await pool.request()
                    .input('UserPhone', sql.VarChar, user_phone)
                    .input('UserName', sql.VarChar, user_name)
                    .input('UserAddress', sql.VarChar, user_address)
                    .input('UserId', sql.Int, userid)
                    .query('IF EXISTS(SELECT * FROM [User] WHERE UserId=@UserId)'
                        +  ' UPDATE [User] SET Name=@UserName,Address=@UserAddress WHERE UserId=@UserId'
                        +  ' ELSE'
                        +  ' SET IDENTITY_INSERT [dbo].[User] ON;'
                        +  ' INSERT INTO [User](UserId,UserPhone,Name,Address) OUTPUT Inserted.UserId,Inserted.UserPhone,Inserted.Name,Inserted.Address'
                        +  ' VALUES(@UserId,@UserPhone,@UserName,@UserAddress)'
                );

                console.log(queryResult); // Debug to sees

                if (queryResult.rowAffected != null) {
                    res.send(JSON.stringify({ success: true, message: "Succesfully" }));
                }

            } catch (err) {
                res.status(500) // Internal Server Error
                res.send(JSON.stringify({ success: false, message: err.message }));
            }
        }
        else {
            res.send(JSON.stringify({ success: false, message: 'Missing userid in body of POST request!' }));

        }
    }
})



//=========================================================================
// USER TABLE
// DELETE - DELETE
// QUERY: http://localhost:5000/deleteUser?key=123456&userid=3
//========================================================================= 

router.delete('/deleteUser', async (req, res, next) => {

    console.log(req.query)

    if (req.query.key != API_KEY) {
        res.send(JSON.stringify({ success: false, message: 'Wrong API Key!' }));

    }
    else {

        var userid = req.query.userid;

        if (userid != null) {

            try {
                const pool = await poolPromise
                const queryResult = await pool.request()
                    .input('UserId', sql.Int, userid)
                    .query('DELETE FROM [User] WHERE UserId=@UserId')

                res.send(JSON.stringify({ success: true, message: "Succesfully" }));

            } catch (err) {
                res.status(500) // Internal Server Error
                res.send(JSON.stringify({ success: false, message: err.message }));
            }
        }
        else {
            res.send(JSON.stringify({ success: false, message: 'Missing userid in query!' }));

        }
    }
})



module.exports = router;