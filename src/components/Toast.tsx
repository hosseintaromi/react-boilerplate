import { IconButton, Snackbar, SnackbarProps } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";

interface ToastProps extends SnackbarProps {
  closable?: boolean;
}

export const Toast = () => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<ToastProps>({});
  const handleClose = () => {
    setOpen(false);
  }

  useEffect(() => {

  }, [])

  const closeButton = (
    <IconButton size="small" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  return (
    <Snackbar
      autoHideDuration={5000}
      open={open}
      onClose={handleClose}
      action={(toast.closable ?? true) ? closeButton : toast.action}
      {...toast}
    />
  )
}
