module.exports ={
    generatePtosTestData() {
        return [
            {id: 1, user_id: 1, type: 1, startdate: '2020-02-01', finishdate: '2020-02-02', comments: 'comment to request 1'}, 
            {id: 2, user_id: 1, type: 2, startdate: '2020-02-02', finishdate: '2020-02-03', comments: 'comment to request 2'}, 
            {id: 3, user_id: 1, type: 3, startdate: '2020-02-03', finishdate: '2020-02-04', comments: 'comment to request 3'}, 
            {id: 4, user_id: 1, type: 1, startdate: '2020-02-04', finishdate: '2020-02-05', comments: 'comment to request 4'}, 
            {id: 5, user_id: 1, type: 2, startdate: '2020-03-01', finishdate: '2020-03-04', comments: 'Request Personal Days from March-1 to March-4'}, 
        ]
    }
}
