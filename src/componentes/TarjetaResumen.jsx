const TarjetaResumen = ({
  titulo,
  valor,
  icono,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`tarjeta-resumen ${className}`.trim()}>
      <div className="tarjeta-header">
        <div className="icono-tarjeta">{icono}</div>
        <div>
          <div className="titulo-tarjeta">{titulo}</div>
          {subtitle ? (
            <div className="tarjeta-subtitle">{subtitle}</div>
          ) : null}
        </div>
      </div>

      <div className="valor-tarjeta">{valor}</div>
    </div>
  );
};

export default TarjetaResumen;
