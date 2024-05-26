import fs from 'fs';
import fsp from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directorioDeAlmacenamiento = '/uploads';

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let rutaCompleta = path.resolve(__dirname, `../${directorioDeAlmacenamiento}`);

    // Verificar si se proporciona la carpeta en la query
    const carpeta = req.query.carpeta;
    if (carpeta) {
      // Si hay una carpeta, ajustar la ruta completa
      rutaCompleta = path.join(rutaCompleta, carpeta);
      fs.mkdirSync(rutaCompleta, { recursive: true });
    }

    cb(null, rutaCompleta);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const cargarArchivos = multer({ storage: storage }).array('archivos', 15);

const listarArchivos = async (req, res) => {
  try {
    const directory = req.params.directory || ''; // Asegúrate de tener una cadena vacía si no se proporciona el parámetro
    const fullPath = path.join(__dirname, '../uploads', directory);

    const files = (await Promise.all(
      (await fsp.readdir(fullPath)).map(async (file) => {
        const filePath = path.join(fullPath, file);
        const fileStat = await fsp.stat(filePath);
        return fileStat.isFile() && file.includes('.') ? file : null;
      })
    )).filter(Boolean);

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de archivos.' });
  }
};

const listarDirectorios = async (req, res) => {
  try {
      const directory = req.params.directory || ''; // Asegúrate de tener una cadena vacía si no se proporciona el parámetro
      const fullPath = path.join(__dirname, '../uploads', directory);

      const directories = await listarDirectoriosRecursivo(fullPath);

      res.json(directories);
  } catch (error) {
      console.error('Error al obtener la lista de directorios:', error);
      res.status(500).json({ error: 'Error al obtener la lista de directorios.' });
  }
};

const listarDirectoriosRecursivo = async (fullPath) => {
  const files = await fsp.readdir(fullPath);

  // Filtrar solo los directorios
  const directories = await Promise.all(
      files.map(async (file) => {
          const filePath = path.join(fullPath, file);
          const fileStat = await fsp.stat(filePath);

          if (fileStat.isDirectory()) {
              // Obtener directorios hijos de forma recursiva
              const subDirectories = await listarDirectoriosRecursivo(filePath);

              return {
                  name: file,
                  children: subDirectories,
              };
          }

          return null;
      })
  );

  // Filtrar los directorios no nulos y devolver la estructura con la información de los directorios hijos
  return directories.filter(Boolean);
};





const listarUltimosArchivos = async (req, res) => {
  try {
    const directory = req.params.directory || '';
    const fullPath = path.join(__dirname, '../uploads', directory);

    const files = (await Promise.all(
      (await fsp.readdir(fullPath)).map(async (file) => {
        const filePath = path.join(fullPath, file);
        const fileStat = await fsp.stat(filePath);
        return fileStat.isFile() && file.includes('.') ? { name: file, path: filePath } : null;
      })
    )).filter(Boolean);
    const ultimosArchivos = files.slice(-5);

    res.json(ultimosArchivos);
  } catch (error) {
    console.error('Error al obtener los últimos archivos:', error);
    res.status(500).json({ error: 'Error al obtener los últimos archivos.' });
  }
};

/*const obtenerArchivo = async (req, res) => {
  // Implementar lógica para obtener un archivo por su ID
  const filePath = req.params.filePath;
  const fullPath = path.join(__dirname, filePath);

  try {
    const content = await fsp.readFile(fullPath, 'utf-8');
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el archivo.' });
  }
};*/

const subirArchivos = (req, res) => {
  cargarArchivos(req, res, async (err) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      const carpeta = req.query.carpeta;

      //console.log(req.files)

      // No necesitas la clase FileSystem, solo guarda la información en la base de datos o realiza otras operaciones según sea necesario
      const archivos = req.files.map(file => ({
          nombreArchivo: file.originalname,
          rutaArchivo: !carpeta ? file.path : file.destination+'\\'+carpeta+'\\'+file.filename
      }));

      try {
          // Realiza cualquier operación adicional necesaria
          // ...

          res.json({ archivos });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  });
};


const actualizarArchivo = async (req, res) => {
  // Implementar lógica para actualizar un archivo por su ID
  const filePath = req.params.filePath;
  const fullPath = path.join(__dirname, filePath);
  const content = req.body.content;

  try {
    await fs.writeFile(fullPath, content);
    res.json({ message: 'Archivo actualizado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el archivo.' });
  }
};

const eliminarArchivo = async (req, res) => {
  try {
    // Verificar si req.params.fileName está definido
    if (!req.params.nombre) {
      throw new Error('El nombre del archivo no está especificado.');
    }

    // Construir la ruta completa del archivo
    const carpeta = req.query.carpeta || '';  // Si se proporciona una carpeta, se incluirá en la ruta
    const fullPath = path.join(__dirname, '../uploads', carpeta, req.params.nombre);

    // Eliminar el archivo
    await fsp.unlink(fullPath);

    res.json({ message: 'Archivo eliminado exitosamente.' });
  } catch (error) {
    res.json({ message: 'El archivo no fue encontrado en la ruta señalada' });
    console.error('Error al eliminar el archivo:', error);
    
    // Verificar si el encabezado ya se ha enviado
    if (res.headersSent) {
      return res.end();
    }

    // Verificar si el error es del tipo 'ERR_HTTP_HEADERS_SENT'
    if (error.code === 'ERR_HTTP_HEADERS_SENT') {
      res.status(500).json({ error: 'Error al eliminar el archivo. Encabezados HTTP ya enviados.' });
    } else {
      res.status(500).json({ error: 'Error al eliminar el archivo.' });
    }
  }
};



const crearNuevaCarpetas = async (req, res) => {
  const { nombresCarpetas } = req.body;
  try {
      if (!nombresCarpetas || !Array.isArray(nombresCarpetas)) {
          throw new Error("Se esperaba un array de nombres de carpetas.");
      }

      const rutasCarpetasCreadas = [];
      const carpetaPadre = req.query.carpeta || '';  // Carpeta señalada

      for (const nombreCarpeta of nombresCarpetas) {
          const rutaCompleta = path.resolve(__dirname, `../${directorioDeAlmacenamiento}`, carpetaPadre, nombreCarpeta);
          await fsp.mkdir(rutaCompleta, { recursive: true });
          rutasCarpetasCreadas.push(rutaCompleta);
      }

      res.json({ carpetasCreadas: rutasCarpetasCreadas });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


export {
  listarArchivos,
  //obtenerArchivo,
  subirArchivos,
  actualizarArchivo,
  eliminarArchivo,
  crearNuevaCarpetas,
  listarUltimosArchivos,
  listarDirectorios,
};
