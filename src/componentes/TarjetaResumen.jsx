const TarjetaResumen = ({ titulo, valor, icono }) => {
  return (
    <div className="tarjeta-resumen">
       <div className="icono-tarjeta">{icono}</div>
      <div className="titulo-tarjeta">{titulo}</div>
      <div className="valor-tarjeta">{valor}</div>
     
    </div>
  );
};

export default TarjetaResumen;
