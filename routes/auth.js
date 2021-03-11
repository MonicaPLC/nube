// rutas de autenticación.
const { Router } = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../db");
const router = Router();

//:::::::CARGAR PARA  REGISTRO::::::::::::
router.get("/registro", async (req, res) => {
  let errores = req.flash("errores");
  let aviso = req.flash("aviso");
  res.render("registro", { errores, aviso });
});

//:::::::::CARGAR VISTA DE LOGIN:::::::::::
router.get("/login", async (req, res) => {
  let errores = req.flash("errores");
  let aviso = req.flash("aviso");
  res.render("login", { errores, aviso });
});

//::::::::GUARDAR A LOS USUARIOS EN BASE DE DATOS::::::::::::
router.post("/guardar_usuario", async (req, res) => {
  const password_encrypted = await bcrypt.hash(req.body.password, 10);

  try {
    if (
      req.body.name == "" ||
      req.body.email == "" ||
      req.body.password == "" ||
      req.body.repite_contraseña == ""
    ) {
      throw new Error("Debe completar todos los campos");
    }
    const new_user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: password_encrypted,
    });

    req.flash("aviso", "Usuario registrado con éxito");
    req.session.user = new_user;
  } catch (error) {
    console.log(error.message);

    req.flash("errores", error.message);
    return res.redirect("/guardar_usuario");
  }

  res.redirect("/login");
});

//:::::::::::ENTRADA POR LOGIN A USUARIOS REGISTRADOS::::::::::::
router.post("/autenticacion", async (req, res) => {
  const new_user = await User.findOne({ where: { email: req.body.email } });

  if (new_user == null) {
    // en caso de que ese email no exista devolver a ruta registro.
    req.flash("errores", "Usuario inexistente o contraseña incorrecta");
    res.redirect("/registro");
  }
  //Comparación de contraseña la que ingresa con la de la BD
  var isCorrect = await bcrypt.compare(req.body.password, new_user.password);

  //si la comparación del email de bd y del input es falsa.
  if (isCorrect == false) {
    // mensaje y retorna a autenticacion ( o sea no deja pasar)
    req.flash("errores", "Usuario o contraseña incorrecta");
    res.redirect("/login");
  }

  // si no es falso guardamos la sesión (visita) del usaurio.
  req.session.user = new_user;

  // enviamos al home (le damos el pase).
  res.redirect("/");
});

// 4. Ruta para cerrar sesión
router.get("/logout", async (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

module.exports = router;
