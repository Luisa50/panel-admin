import React, { useEffect, useState } from "react";
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
  Box
} from "@mui/material";

import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";

export default function Ciudades() {

  const [ciudades, setCiudades] = useState([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const [regionales, setRegionales] = useState([]);

  const [regionalSeleccionada, setRegionalSeleccionada] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const obtenerCiudades = async () => {

      try {

        const response = await fetchWithAuth(`${API_URL}/Ciudad`);
        if (!response) return;

        if (!response.ok) {
          throw new Error("Error al obtener ciudades");
        }

        const data = await response.json();

        setCiudades(data);

        const regionesUnicas = [
          ...new Map(
            data
              .filter(c => c.regional)
              .map(c => [c.regional.regCodigo, c.regional])
          ).values()
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

  const handleFiltroRegional = (codigoRegional) => {

    setRegionalSeleccionada(codigoRegional);

    const filtradas = ciudades.filter(
      c => c.regional?.regCodigo === codigoRegional
    );

    setCiudadesFiltradas(filtradas);
  };

  return (
    <Container className="mt-5">

      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>

        <Typography variant="h4" gutterBottom>
          Lista de Ciudades
        </Typography>

        {loading && <CircularProgress />}

        {error && (
          <Typography color="error">
            {error}
          </Typography>
        )}

        {!loading && !error && (

          <>
          

            <Box sx={{ mb: 4, maxWidth: 300 }}>

              <TextField
                select
                fullWidth
                label="Selecciona una regional"
                value={regionalSeleccionada}
                onChange={(e) =>
                  handleFiltroRegional(e.target.value)
                }
                size="small"
              >

                <MenuItem value="">
                  Seleccionar
                </MenuItem>

                {regionales.map((reg) => (

                  <MenuItem
                    key={reg.regCodigo}
                    value={reg.regCodigo}
                  >
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
                    <TableCell><strong>Código</strong></TableCell>
                    <TableCell><strong>Ciudad</strong></TableCell>
                    <TableCell><strong>Regional</strong></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  {ciudadesFiltradas.map((ciudad) => (

                    <TableRow key={ciudad.ciuCodigo}>

                      <TableCell>{ciudad.ciuCodigo}</TableCell>

                      <TableCell>{ciudad.ciuNombre}</TableCell>

                      <TableCell>
                        {ciudad.regional?.regNombre}
                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            )}

          </>

        )}

      </Paper>

    </Container>
  );
}