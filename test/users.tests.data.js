module.exports ={
    generateUsersTestData() {
        return [
            {
                id: 1, 
                username: 'michael@jones.com', 
                password: '$2b$10$s/9a9ktziiL7CptxBXomMuG7z27nXC0UBrNYYlkE1aQzd9QNEmfyW', //michael
                role_id: 1, 
                company_id: 1
            }, 
            {
                id: 2, 
                username: 'mary@jones.com', 
                password: '$2b$10$.VAA.Ljyex1pu8fPnAu31OfYbhfCp.SpDHIkPb91HUc03LQALYIx.',  //mary
                role_id: 1, 
                company_id: 2
            }, 
            {
                id: 3, 
                username: 'paul@jones.com', 
                password: '$2b$10$sAo8/pbz1oR2rmTSVgpjo.yEwG3rqMOZ8/Bix6a/UVsahEg/dVsVq', //paul
                role_id: 2, 
                company_id: 1
            }
        ]
    }
}