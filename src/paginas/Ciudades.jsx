import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";

import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import PaginacionTablaMinimal, {
  LISTADO_TAM_PAGINA_COMPACTO,
} from "../componentes/PaginacionTablaMinimal.jsx";
import "../estilos/ciudades.css";

export default function Ciudades() {
  const [ciudades, setCiudades] = useState([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const [regionales, setRegionales] = useState([]);
  const [regionalSeleccionada, setRegionalSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginaLista, setPaginaLista] = useState(1);

  useEffect(() => {
    const obtenerCiudades = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/Ciudad`);
        if (!response) return;
        if (!response.ok) throw new Error("Error al obtener ciudades");
        const data = await response.json();
        setCiudades(data);
        const regionesUnicas = [
          ...new Map(
            data
              .filter((c) => c.regional)
              .map((c) => [c.regional.regCodigo, c.regional])
          ).values(),
        ];
        setRegionales(regionesUnicas);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las ciudades");
      } finally {
        setLoading(false);
      }
    };
    obtenerCiudades();
  }, []);

  useEffect(() => {
    setPaginaLista(1);
  }, [regionalSeleccionada, ciudadesFiltradas.length]);

  const totalPaginasCiudades = Math.max(
    1,
    Math.ceil(ciudadesFiltradas.length / LISTADO_TAM_PAGINA_COMPACTO)
  );
  const paginaCiudadesSegura = Math.min(paginaLista, totalPaginasCiudades);
  const ciudadesPagina = useMemo(() => {
    const ini = (paginaCiudadesSegura - 1) * LISTADO_TAM_PAGINA_COMPACTO;
    return ciudadesFiltradas.slice(ini, ini + LISTADO_TAM_PAGINA_COMPACTO);
  }, [ciudadesFiltradas, paginaCiudadesSegura]);

  useEffect(() => {
    setPaginaLista((p) => Math.min(p, totalPaginasCiudades));
  }, [totalPaginasCiudades]);

  const handleFiltroRegional = (codigoRegional) => {
    setRegionalSeleccionada(codigoRegional);
    const filtradas = ciudades.filter(
      (c) => c.regional?.regCodigo === codigoRegional
    );
    setCiudadesFiltradas(filtradas);
  };

  return (
    <div className="ciudades-modulo">
    <Container className="mt-5">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Lista de Ciudades
        </Typography>

        {loading && <CircularProgress />}

        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && (
          <>
            <Box sx={{ mb: 4, maxWidth: 300 }}>
              <TextField
                select
                fullWidth
                label="Selecciona una regional"
                value={regionalSeleccionada}
                onChange={(e) => handleFiltroRegional(e.target.value)}
                size="small"
              >
                <MenuItem value="">Seleccionar</MenuItem>
                {regionales.map((reg) => (
                  <MenuItem key={reg.regCodigo} value={reg.regCodigo}>
                    {reg.regNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {!regionalSeleccionada && (
              <Typography color="text.secondary">
                Selecciona una regional para visualizar las ciudades.
              </Typography>
            )}

            {regionalSeleccionada && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Código</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Ciudad</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Regional</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ciudadesPagina.map((ciudad) => (
                    <TableRow key={ciudad.ciuCodigo}>
                      <TableCell>{ciudad.ciuCodigo}</TableCell>
                      <TableCell>{ciudad.ciuNombre}</TableCell>
                      <TableCell>{ciudad.regional?.regNombre}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {regionalSeleccionada && ciudadesFiltradas.length > 0 ? (
              <PaginacionTablaMinimal
                paginaActual={paginaCiudadesSegura}
                totalPaginas={totalPaginasCiudades}
                onCambiarPagina={setPaginaLista}
                ocultarSiVacio
                totalItems={ciudadesFiltradas.length}
              />
            ) : null}
          </>
        )}
      </Paper>
    </Container>
    </div>
  );
}
