import { connection } from "websocket";
interface IClients{
    connection: connection,
    index: number,
    name: string,
  };

export default class Room{
    id:string;
    users: IClients[] =[];
    constructor(id: string){
        this.id=id;
        
    }
    addUser(connection:connection, index:number, name:string){
        const user = this.users.find(it=>it.index==index);
        if(!user){
             this.users.push({connection,index,name})
        }else{
            this.users = this.users.filter(it=>it.index!=index);
        }
       
    }
    removeUser(connection:connection){
        this.users.filter(it=>it.connection!==connection);
    }
    sendUsers(){
        return this.users.map(it=>{
            return {name:it.name, index:it.index}
        });
    }
}