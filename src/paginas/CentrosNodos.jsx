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
} from "@mui/material";

import { fetchWithAuth } from "../services/auth";

export default function CentrosNodos() {

  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const obtenerCentros = async () => {

      try {

        const response = await fetchWithAuth(
          "http://healthymind10.runasp.net/api/Centro"
        );

        if (!response.ok) {
          throw new Error("Error al obtener centros");
        }

        const data = await response.json();
        setCentros(data);

      } catch (err) {

        console.error(err);
        setError("No se pudieron cargar los centros");

      } finally {

        setLoading(false);

      }
    };

    obtenerCentros();

  }, []);

  return (
    <Container className="mt-5">
      <Paper elevation={4} className="p-4 rounded-4">

        <Typography variant="h4" gutterBottom>
          Centros y Nodos
        </Typography>

        {loading && <CircularProgress />}

        {error && (
          <Typography color="error">
            {error}
          </Typography>
        )}

        {!loading && !error && (

          <Table>

            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Centro</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Regional</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {centros.map((centro) => (

                <TableRow key={centro.cenCodigo}>

                  <TableCell>{centro.cenCodigo}</TableCell>

                  <TableCell>{centro.cenNombre}</TableCell>

                  <TableCell>{centro.cenDireccion}</TableCell>

                  <TableCell>
                    {centro.regional
                      ? centro.regional.regNombre
                      : "Sin regional"}
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        )}

      </Paper>
    </Container>
  );
}