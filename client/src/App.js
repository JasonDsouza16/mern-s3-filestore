import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { CloudUpload, Link as LinkIcon } from "@mui/icons-material";

const App = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/file/")
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [file]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    axios
      .post("http://localhost:5000/api/file/", formData, {
        onUploadProgress: (progressEvent) => {
          setProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      })
      .then((response) => {
        setFiles([...files, response.data]);
        setProgress(0);
        setFile(null);
        setTitle("");
        setDescription("");
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "success",
        });
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || "Failed to upload file";
        setSnackbar({ open: true, message: message, severity: "error" });
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Video and Audio Upload
      </Typography>
      <Box component="form" sx={{ mb: 3 }}>
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          sx={{ mt: 2 }}
        >
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {file && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Selected File: {file.name}
          </Typography>
        )}
        {progress > 0 && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="text.secondary">
              {`${progress}%`}
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ mt: 2 }}
          disabled={!file}
        >
          Upload
        </Button>
      </Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Uploaded Files
      </Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{
            "& td, & th": {
              borderBottom: 1,
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f8ff" }}>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Title
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  URL
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow
                key={file._id}
                sx={{ "&:hover": { backgroundColor: "#e3f2fd" } }}
              >
                <TableCell>{file.title}</TableCell>
                <TableCell>{file.description}</TableCell>
                <TableCell>
                  <Link
                    href={file.s3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkIcon sx={{ color: "red" }} />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <br></br>
    </Container>
  );
};

export default App;
