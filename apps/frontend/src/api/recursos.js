import { cliente } from './cliente';

// Generos
export const listarGeneros = (params) => cliente.listar('/generos', params);
export const obtenerGenero = (id) => cliente.obtener(`/generos/${id}`);
export const crearGenero = (datos) => cliente.crear('/generos', datos);
export const actualizarGenero = (id, datos) => cliente.actualizar(`/generos/${id}`, datos);
export const cambiarEstadoGenero = (id) => cliente.cambiarEstado(`/generos/${id}/estado`);
export const eliminarGenero = (id) => cliente.eliminar(`/generos/${id}`);

// Directores
export const listarDirectores = (params) => cliente.listar('/directores', params);
export const obtenerDirector = (id) => cliente.obtener(`/directores/${id}`);
export const crearDirector = (datos) => cliente.crear('/directores', datos);
export const actualizarDirector = (id, datos) => cliente.actualizar(`/directores/${id}`, datos);
export const cambiarEstadoDirector = (id) => cliente.cambiarEstado(`/directores/${id}/estado`);
export const eliminarDirector = (id) => cliente.eliminar(`/directores/${id}`);

// Productoras
export const listarProductoras = (params) => cliente.listar('/productoras', params);
export const obtenerProductora = (id) => cliente.obtener(`/productoras/${id}`);
export const crearProductora = (datos) => cliente.crear('/productoras', datos);
export const actualizarProductora = (id, datos) => cliente.actualizar(`/productoras/${id}`, datos);
export const cambiarEstadoProductora = (id) => cliente.cambiarEstado(`/productoras/${id}/estado`);
export const eliminarProductora = (id) => cliente.eliminar(`/productoras/${id}`);

// Tipos. Sin cambiar estado: la API no expone PATCH /tipos/:id/estado.
export const listarTipos = (params) => cliente.listar('/tipos', params);
export const obtenerTipo = (id) => cliente.obtener(`/tipos/${id}`);
export const crearTipo = (datos) => cliente.crear('/tipos', datos);
export const actualizarTipo = (id, datos) => cliente.actualizar(`/tipos/${id}`, datos);
export const eliminarTipo = (id) => cliente.eliminar(`/tipos/${id}`);

// Medias
export const listarMedias = (params) => cliente.listar('/medias', params);
export const obtenerMedia = (id) => cliente.obtener(`/medias/${id}`);
export const crearMedia = (datos) => cliente.crear('/medias', datos);
export const actualizarMedia = (id, datos) => cliente.actualizar(`/medias/${id}`, datos);
export const eliminarMedia = (id) => cliente.eliminar(`/medias/${id}`);
