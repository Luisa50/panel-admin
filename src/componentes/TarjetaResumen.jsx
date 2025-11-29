const TarjetaResumen = ({ titulo, valor, icono }) => {
  return (
    <div className="tarjeta-resumen">

      <div className="tarjeta-header">
        <div className="icono-tarjeta">{icono}</div>
        <div className="titulo-tarjeta">{titulo}</div>
      </div>

      <div className="valor-tarjeta">{valor}</div>

    </div>
  );
};

export default TarjetaResumen;

