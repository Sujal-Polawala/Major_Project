import React, { useState } from "react";
import { CloudUpload } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography , useMediaQuery} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadProduct } from "features/productSlice";

const CsvUploadDialog = ({ open, handleClose }) => {
  const [csvFile, setCsvFile] = useState(null);
  const {loading} = useSelector((state) => state.products)
  const isMobile = useMediaQuery('(max-width: 600px)');
  const dispatch = useDispatch(); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      alert("Please select a valid CSV file.");
      setCsvFile(null);
    }
  };

  const handleCloseDialog = () => {
    handleClose()
    setCsvFile(null)
  }

  const handleUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file first.");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", csvFile);
  
    const result = await dispatch(uploadProduct(formData)); // ✅ Wait for dispatch
  
    if (uploadProduct.fulfilled.match(result)) {
      handleCloseDialog();
    } else {
      alert(result.payload || "Upload failed!");
    }
  };
  

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" sx={{ width: isMobile ? "auto":"450px", mx: "auto" }} fullWidth>
      <DialogTitle>Upload Product CSV</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          id="upload-csv"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-csv">
          <IconButton component="span" color="primary">
            <CloudUpload fontSize="large" />
          </IconButton>
        </label>
        {csvFile && <Typography>{csvFile.name}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} variant="contained" color="error">
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          color="primary"
          variant="contained"
          disabled={!csvFile || loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CsvUploadDialog;
