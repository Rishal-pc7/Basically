const {MongoClient} = require('mongodb')
const state={ db:null}

module.exports.connect = function (){
    return new Promise(async(resolve,reject)=>{

        const url='mongodb+srv://fasalrahmanpv7:fasal587@cluster0.7us8cpk.mongodb.net/?retryWrites=true&w=majority'        
        const dbName='basically'
        const client = new MongoClient(url)
        client.connect().then((data)=>{
            if(data.error){

                console.log(data.error);
            }
            else{

                console.log('successfully connected')
                state.db=client.db(dbName)
            }
        })
    })
    
        

    
}
module.exports.get = function (){
    return state.db

}