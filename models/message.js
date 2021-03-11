module.exports = (sql, type) => {
  //crear modelo de tabla (estructura)
  return sql.define(
    "message",
    {
      //id queda fijo

      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      message: {
        type: type.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Debe ingresar nombre",
          },
          len: {
            arg: [3],
            msg: "el nombre debe contener al menos tres letras",
          },
        },
      },
    },
    { timestamps: true }
  );
};
