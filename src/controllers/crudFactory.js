const Media = require('../models/Media');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/respuesta');

/**
 * Genera las operaciones CRUD estandar para un modelo.
 * Cada modulo reutiliza esta fabrica para no repetir codigo.
 *
 * @param {import('mongoose').Model} Modelo  Modelo de Mongoose
 * @param {string} etiqueta                  Nombre legible del recurso
 * @param {string[]} camposBusqueda          Campos de texto sobre los que aplica ?buscar=
 * @param {string} campoEnMedia              Campo de Media que referencia a este modelo
 */
function crudFactory(Modelo, etiqueta, camposBusqueda = ['nombre'], campoEnMedia = null) {
  const obtenerOFallar = async (id) => {
    const documento = await Modelo.findById(id);
    if (!documento) {
      throw new ApiError(404, `${etiqueta} con id ${id} no encontrado`);
    }
    return documento;
  };

  /**
   * Impide borrar un registro que alguna produccion todavia esta usando.
   * Sin esto, las medias quedarian apuntando a un documento inexistente.
   */
  const verificarNoEstaEnUso = async (id) => {
    if (!campoEnMedia) return;

    const enUso = await Media.countDocuments({ [campoEnMedia]: id });
    if (enUso === 0) return;

    const alternativa = Modelo.schema.path('estado')
      ? 'Si desea retirarlo del catalogo, desactivelo con PATCH /:id/estado en lugar de eliminarlo.'
      : 'Elimine o reasigne primero esas producciones.';

    throw new ApiError(
      409,
      `No se puede eliminar: ${etiqueta.toLowerCase()} esta asociado a ${enUso} produccion(es)`,
      [{ campo: campoEnMedia, mensaje: alternativa }]
    );
  };

  return {
    /** GET /  -> lista con paginacion, filtro por estado y busqueda por texto */
    listar: asyncHandler(async (req, res) => {
      const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1);
      const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 10, 1), 100);

      const filtro = {};
      if (req.query.estado) filtro.estado = req.query.estado;
      if (req.query.buscar && camposBusqueda.length) {
        filtro.$or = camposBusqueda.map((campo) => ({
          [campo]: { $regex: req.query.buscar, $options: 'i' },
        }));
      }

      const [total, datos] = await Promise.all([
        Modelo.countDocuments(filtro),
        Modelo.find(filtro)
          .sort({ fechaCreacion: -1 })
          .skip((pagina - 1) * limite)
          .limit(limite),
      ]);

      return ok(res, {
        mensaje: `Listado de ${etiqueta.toLowerCase()}`,
        meta: { total, pagina, limite, paginas: Math.ceil(total / limite) || 1 },
        datos,
      });
    }),

    /** GET /:id */
    obtener: asyncHandler(async (req, res) => {
      const documento = await obtenerOFallar(req.params.id);
      return ok(res, { mensaje: `${etiqueta} encontrado`, datos: documento });
    }),

    /** POST / */
    crear: asyncHandler(async (req, res) => {
      const documento = await Modelo.create(req.body);
      return ok(res, {
        statusCode: 201,
        mensaje: `${etiqueta} creado correctamente`,
        datos: documento,
      });
    }),

    /** PUT /:id  -> actualiza el registro completo */
    actualizar: asyncHandler(async (req, res) => {
      await obtenerOFallar(req.params.id);
      const documento = await Modelo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      return ok(res, { mensaje: `${etiqueta} actualizado correctamente`, datos: documento });
    }),

    /** DELETE /:id */
    eliminar: asyncHandler(async (req, res) => {
      const documento = await obtenerOFallar(req.params.id);
      await verificarNoEstaEnUso(req.params.id);
      await documento.deleteOne();
      return ok(res, { mensaje: `${etiqueta} eliminado correctamente`, datos: { id: req.params.id } });
    }),

    /** PATCH /:id/estado -> cambia entre Activo e Inactivo (borrado logico) */
    cambiarEstado: asyncHandler(async (req, res) => {
      const documento = await obtenerOFallar(req.params.id);
      documento.estado = documento.estado === 'Activo' ? 'Inactivo' : 'Activo';
      await documento.save();
      return ok(res, {
        mensaje: `${etiqueta} ahora esta en estado ${documento.estado}`,
        datos: documento,
      });
    }),
  };
}

module.exports = crudFactory;
