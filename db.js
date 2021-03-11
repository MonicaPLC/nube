const Sequelize = require("sequelize");
// va ausar sequelize
// va a usar el modelo de tabla Message y modelo de tabla User
const MessageModel = require("./models/message");
const UserModel = require("./models/user");

const sql = new Sequelize("whatsapp", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

const Message = MessageModel(sql, Sequelize);
const User = UserModel(sql, Sequelize);

User.hasMany(Message);
Message.belongsTo(User);

sql.sync().then(() => {
  console.log("Tablas creada. Base de datos en uso");
});

module.exports = {
  User,
  Message,
};
