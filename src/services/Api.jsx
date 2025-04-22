import  axios  from 'axios'
import React from 'react'

// Configuración basica de Axios
const Api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Dirección de la Api 
  timeout: 5000, // tiempo máximo de espera
  headers: {
    "Content-Type": "application/json",
    //Aquí se pueden agregar más headers como token de autenticación
  }
}) 


export default Api;