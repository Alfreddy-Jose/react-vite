// unlighthouse.config.js
export default {
  site: 'https://react-vite-75pm.vercel.app/',
  auth: {
    type: 'form',
    url: 'https://react-vite-75pm.vercel.app/login',
    fields: {
      // Reemplaza con los nombres reales de tus campos de formulario
      username: 'email', // o 'username' según tu formulario
      password: 'password'
    },
    username: 'ADMINISTRADOR@GMAIL.COM',
    password: '12345678',
    // Opcional: selector para verificar que el login fue exitoso
    loginSelector: '.panel' // selector que existe después del login
  },
  urls: [
    '/',
    '/panel',
    '/usuarios',
    '/usuarios/create',
    // añade todas las rutas que quieres analizar
  ],
  scanner: {
    // Para aplicaciones SPA (React/Vue)
    samples: 3,
    throttle: true,
    device: 'mobile' // o 'desktop'
  }
}