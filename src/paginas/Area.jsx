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

export default function Area() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerAreas = async () => {
      try {
        const response = await fetchWithAuth(
          "http://healthymind10.runasp.net/api/Area"
        );

        if (!response.ok) {
          throw new Error("Error al obtener áreas");
        }

        const data = await response.json();
        setAreas(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las áreas");
      } finally {
        setLoading(false);
      }
    };

    obtenerAreas();
  }, []);

  return (
    <Container className="mt-5">
      <Paper elevation={4} className="p-4 rounded-4">

        <Typography variant="h4" gutterBottom>
          Lista de Áreas
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
                <TableCell>Código Área</TableCell>
                <TableCell>Nombre Área</TableCell>
                <TableCell>Nombre Psicólogo</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Especialidad</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Correo Institucional</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {areas.map((area) => (
                <TableRow key={area.areaCodigo}>

                  <TableCell>{area.areaCodigo}</TableCell>

                  <TableCell>{area.areaNombre}</TableCell>

                  <TableCell>
                    {area.areaPsicologo
                      ? `${area.areaPsicologo.psiNombre} ${area.areaPsicologo.psiApellido}`
                      : "Sin psicólogo"}
                  </TableCell>

                  <TableCell>
                    {area.areaPsicologo?.psiDocumento || "-"}
                  </TableCell>

                  <TableCell>
                    {area.areaPsicologo?.psiEspecialidad || "-"}
                  </TableCell>

                  <TableCell>
                    {area.areaPsicologo?.psiTelefono || "-"}
                  </TableCell>

                  <TableCell>
                    {area.areaPsicologo?.psiCorreoInstitucional || "-"}
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