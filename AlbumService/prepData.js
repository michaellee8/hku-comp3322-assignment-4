(async function main() {
  var monk = require('monk');
  var db = monk('localhost:27017/assignment4');
  await db.get("userList").drop();
  await db.get("userList").insert({
    'username': 'Eddie',
    'password': '123456',
    'friends': ['Ken', 'Alice', 'Bill']
  });
  await db.get("photoList").drop()
  await db.get("photoList").insert({
    'url': 'http://localhost:3002/uploads/1.jpg',
    'userid': 'xxxxxxx',
    'likedby': ['Ken',
      'Alice']
  });
  console.log("database prepared");
  process.exit(0);
})().catch(err => console.log(err));