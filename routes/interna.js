const { Router } = require("express");
const router = Router();
const { Message, User } = require("../db");

//::::::IMPEDIR QUE SE SALTEN EL LOGIN::::
function checkLogin(req, res, next) {
  if (req.session.user == null) {
    req.flash(
      "errores",
      "Tienes que estar logeado para entrar a esta parte del sistema."
    );
    return res.redirect("/login");
  }
  res.locals.user = req.session.user;
  next();
}

//PARA MOSTRAR VISTA PANTALLA, CON TODOS LOS MENSAJES DE LA BD Y ALERTAS.
router.get("/", [checkLogin], async (req, res) => {
  const mensaje = await Message.findAll({
    include: [User],
  });
  console.log(mensaje);

  let aviso = req.flash("aviso");
  let error = req.flash("error");

  res.render("pantalla", { mensaje, aviso, error });
});

//::::::::GUARDAR LOS MENSAJES EN LA BASE DE DATOS::::::::::::
router.post("/mensajes", async (req, res) => {
  const user = await User.findByPk(req.session.user.id);
  //message del objeto es el campo message.
  user.createMessage({ message: req.body.mensaje });

  res.json({ estado: "Ok" });
});

module.exports = router;
