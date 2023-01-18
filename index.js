const httpServer = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');
const { getUnpackedSettings } = require('http2');

// Read data from file
// Template
const tempLoan = fs.readFileSync(
   `${__dirname}/data/data.json`,
   'utf-8'
);

// Template
const tempLoanHTML = fs.readFileSync(
    `${__dirname}/template/templateLoanInfo.html`,
    'utf-8'
 );
 
const dataObj = JSON.parse(tempLoan);

//////////////////////////////////
// Create Server 
const server = httpServer.createServer((req, res) => {  
    const {query, pathname} = url.parse(req.url, true); // object destructors
    
    //if(urlParameter.query.id){ // if there is a query parameter named id
    if(query.id){ // if there is a query parameter named id
    // Loans page
        if (pathname === '/' || pathname.toLowerCase() === '/loans') {
            res.writeHead(200, { //everything ran successfully
               'Content-type': 'text/html'
            });
            //calculating the Total Loan Amount Owed by the Customer with a formula
            let totalAmountOwed = (dataObj[query.id].loanAmount + 
                (dataObj[query.id].loanAmount * dataObj[query.id].interest) * (dataObj[query.id].loanTermYears));
            const totalAmountf = totalAmountOwed;
            const totalAmount = (totalAmountf).toLocaleString('en-US', {style: 'currency', currency: 'USD'})
            const loan = dataObj[Number(query.id)]; //convert string to numeric value
            const strCourseName = JSON.stringify(loan);
            const loanHTML = replaceTemplate(tempLoanHTML, loan, totalAmount); //function that will replace course values in html

            res.end(loanHTML);
        }
        else{
            res.writeHead(404, { //server did not find what you were looking for
                'Content-type': 'text/html'
            });
            res.end('Resource not found')
        
        }    
    }   
});

//start listening to requests
server.listen(8000, 'localhost', () => {
    console.log('Listening to requests on port 8000');
});