interface IUser {
  email: string;
  age: string;
}

export class DataBase {
  private db: IUser[];
  constructor() {
    this.db = [];
  }

  getNewUser(email: string, age: string) {
    const user = {
      email: email,
      age: age,
    }
    this.db.push(user);
  }

  checkUser(email: string) {
    let bool = true;
    this.db.forEach(user => {
      if (user.email === email) {
        bool = false;
      }
    })
    return bool;
  }

  getDatabase() {
    return this.db;
  }
}