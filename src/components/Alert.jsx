import Swal from "sweetalert2";

export function Alerta(){
  let message = "hola mundo";
  const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
  })

  Toast.fire({
      icon: 'success',
      title: message
  })
}

export default Alerta;
