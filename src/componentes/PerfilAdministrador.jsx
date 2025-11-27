import React, { useState } from "react";

export default function PerfilAdministrador() {
  const [formData, setFormData] = useState({
    nombre: "Administrador",
    correo: "admin@sistema.com",
    telefono: "3000000000",
    rol: "Administrador del sistema"
  });
}
