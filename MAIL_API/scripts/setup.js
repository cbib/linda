/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// continued
'use strict';
const db = require('@arangodb').db;
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bdartigues@gmail.com',
            pass: pwd
        }
    });



