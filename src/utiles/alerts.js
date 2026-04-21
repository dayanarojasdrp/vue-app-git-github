import Swal from 'sweetalert2'

export function successAlert(mensaje) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: mensaje,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: '#f0fdf4',
    color: '#166534'
  })
}

export function errorAlert(mensaje) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: mensaje,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#fef2f2',
    color: '#991b1b'
  })
}
export function confirmAlert(mensaje) {
  return new Promise((resolve) => {
    const ok = window.confirm(mensaje)
    resolve(ok)
  })
}