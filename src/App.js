import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

import Formulario from './components/Formulario';
import Cancion from './components/Cancion';
import Info from './components/Info';


// https://lyricsovh.docs.apiary.io/#reference/0/lyrics-of-a-song/search


function App() {

  // state para la busqueda de la letra
  const [ busquedaLetra, guardarBusquedaLetra] = useState( {} );

  // Agregar state para la letra
  const [letra, guardarLetra] = useState('');

  // Agregar state de info de la api
  const [info, guardarInfo] = useState( {} );

  const [ error, guardarError] = useState(false);

  useEffect(() => {
    // La primera vez busqueda letra esta vacio
    if (Object.keys( busquedaLetra).length === 0 ) return;
    // if (Object.keys( guardarInfo).length === 0 ) return;
    // console.log('no se ejecuta');

    
    const consultarApiLetra = async () => {

      try {
        
        const { artista, cancion } = busquedaLetra;
  
        const url = `https://api.lyrics.ovh/v1/${artista}/${cancion}`;
  
        const url2= `https://theaudiodb.com/api/v1/json/1/search.php?s=${artista}`;

        const [ letra, informacion ] = await Promise.all([
          axios.get(url),
          axios.get(url2)
        ])
          .catch(
            (error) => {
              guardarError( true );
            }
          );

          guardarError( false );

        // console.log(letra);
        // console.log(letra.data.lyrics);
        // console.log(informacion);
        // console.log(informacion.data.artists[0]);
  
        //  console.log(resultado);// info de la API.
        // console.log(resultado.data.lyrics); // para acceder a la letra de la canción
        
        // guardarLetra( resultado.data.lyrics );

        guardarLetra( letra.data.lyrics );
        
        guardarInfo( informacion.data.artists[0])

      } catch (error) {

        console.log(error);
      }
    }

    consultarApiLetra();

  }, [ busquedaLetra, info ])
  return (
    <Fragment>
      <Formulario 
        guardarBusquedaLetra= { guardarBusquedaLetra }  
      />

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            {
              (error)
                ? 
                <p className="alert alert-primary text-center">
                No se encontró la Información
                </p>
                :
                <Info info= { info } />
            }
          </div>

          <div className="col-md-6">
          {
              (error)
                ? 
                <p className="alert alert-primary text-center">
                No se encontró la letra de la canción
                </p>
                :
                <Cancion letra= { letra } />
            }
            
          </div>

        </div>

      </div>
    </Fragment>
  );
}

export default App;
