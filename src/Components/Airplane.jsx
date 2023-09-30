import React, { useEffect, useState } from 'react'
import { useParams,Link, json } from 'react-router-dom'

import Marcador from './Marcador'

import './airplane.css'

import Swal from 'sweetalert2'

import axios from 'axios';

import { IoIosArrowBack } from 'react-icons/io';

function verifyFiles(githubFolderUrl) {
    const requiredFiles = ['GUIA1.pdf', 'GUIA2.pdf', 'GUIA4.pdf'];

    axios.get(githubFolderUrl)
        .then((response) => {
            const files = response.data;

            const fileNames = files.map((file) => file.name);
            const missingFiles = requiredFiles.filter((requiredFile) => !fileNames.includes(requiredFile));

            if (missingFiles.length === 0) {
                console.log('Los tres archivos existen.');
            } else {
                const list = document.getElementById('descriptionList')
                list.innerHTML = '<span>Los siguientes archivos no existen en la carpeta:</span>'
                for (const miss of missingFiles){
                    list.innerHTML += `<li style="color:orange">${miss}</li>`
                }
            }
        })
        .catch((error) => {
            console.error('Error al obtener la lista de archivos:', error);
        });
}

async function updateGitHubFile(githubApiFileurl, newContent,sha) {
    try {
        const authToken = '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';
        const response = await axios.put(
            githubApiFileurl,
            {
                message: 'Actualizar archivo',
                content: btoa(newContent), 
                sha:sha, // SHA del archivo actual
            },
            {
                headers: {
                    Authorization: `token ${authToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

function Airplane() {
    const {id} = useParams()

    const githubFilePlanes = `https://api.github.com/repos/Steven02-ZT/PlanesPointManager/contents/src/assets/planes.json`

    const [marcadores, setMarcadores] = useState([]); 
    const [planeData,setPlaneData] = useState([]);
    const [githubFileUrl, setGithubFileUrl] = useState('')
    const [githubApiFileurl, setGithubApiFileurl] = useState('')

    useEffect(() => {
        const getdata = async() => {
            try {
                const response = await axios.get(githubFilePlanes);
                const data = response.data;
                if (data.content) {
                  const info = JSON.parse(atob(data.content)).planes;
                  setPlaneData(info[id])

                  const githubFolderUrl = `https://api.github.com/repos/Steven02-ZT/PlanesPointManager/contents/src/assets/docs/${info[id].path}`

                  verifyFiles(githubFolderUrl)

                  const getPoints = async() => {
                        axios.get(githubFolderUrl+'/points.json')
                        .then(response => {
                        const data = response.data
                        if (data.content){
                            setGithubFileUrl(`https://github.com/Steven02-ZT/PlanesPointManager/blob/master/src/assets/docs/${info[id].path}/points.json`)
                            setGithubApiFileurl(githubFolderUrl+'/points.json')
                            const contenido = JSON.parse(atob(data.content)).points
                            setMarcadores(contenido)
                        }else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Error en el archivo.',
                                text: 'Archivo sin contenido.',
                            })
                        }
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al obtener el archivo.',
                            text: error,
                        })
                    });
                  }

                  getPoints()

                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error en el archivo.',
                    text: 'Archivo sin contenido.',
                  });
                  return null;
                }
              } catch (error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error al obtener el archivo.',
                  text: error.message,
                });
                return null;
              }
        }

        getdata()
    },[githubFilePlanes,id])

    const agregarMarcador = (event) => {
        const plane = event.target.getBoundingClientRect();
        
        const x = event.clientX - plane.left;
        const y = event.clientY - plane.top;

        const isOn = async () => {
            const inputOptions = new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  0: 'off',
                  1: 'on',
                });
              }, 500);
            });
          
            const result = await Swal.fire({
              title: 'Select the state',
              input: 'radio',
              inputOptions: inputOptions,
              showCancelButton: true,
              inputValidator: (value) => {
                if (!value) {
                  return 'You need to choose something!';
                }
              },
            });
          
            if (result.isConfirmed) {
              const { value: state } = result;
              const id = marcadores.length > 0 ? parseInt((marcadores[marcadores.length-1].id))+1 : 0
              setMarcadores([...marcadores, { id,state, x, y }])
              Swal.fire('Saved!', '', 'success');
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info');
            }
          };

        isOn()
      };

    async function updateFile() {
        try {
            const response = await axios.get(githubApiFileurl);
            const currentSha = response.data.sha;
        
            const newContent = JSON.stringify({ points: marcadores });
            await updateGitHubFile(githubApiFileurl, newContent, currentSha);
        
            Swal.fire('Actualización exitosa')
          } catch (error) {
            console.error('Error al actualizar el archivo:', error);
          }
    }

    function deletePoint(id){
        const marcadoresActualizados = marcadores.filter((point) => point.id !== id);
        setMarcadores([...marcadoresActualizados])
    }    

    function updateState(id){
        const marcadoresActualizados = marcadores.map((point) => {
            if (point.id === id) {
              return { ...point, state: !point.state };
            }
            return point;
          });

        setMarcadores([...marcadoresActualizados])
    }

    async function showOptionsMenu(id){
        const inputOptions = new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                0: 'Delete',
                1: 'Change state'
              })
            }, 1000)
        })
          
        const action = await Swal.fire({
            title: 'Select an action.',
            input: 'radio',
            inputOptions: inputOptions,
            icon:'question',
            inputValidator: (value) => {
                if (!value) {
                return 'You need to choose something!'
                }
            }
        })
          
        if (action.value == 0) {
            deletePoint(id)
            Swal.fire({ icon:'success' })
        }else if(action.value == 1){
            updateState(id)
            Swal.fire({ icon:'success' })
        }else{
            Swal.fire({ icon:'error' })
        }
    }


  return (
    <div style={{height:'100vh',width:'100vw',background:'#010b14'}}>
        <div style={{display:'flex',alignItems:'center'}}> 
            <Link to={'/'} className='title'><IoIosArrowBack/></Link>
            <h1 className='title'>{planeData.model}</h1>
        </div>
        <div className='panel'>
            <div style={{overflow:'scroll'}}>
                <div className='container'>
                    {<img id='plane' src={`https://raw.githubusercontent.com/Steven02-ZT/PlanesPointManager/master/src/assets/docs/${planeData.path}/plane.jpg`} alt={planeData.model}
                        onClick={agregarMarcador} className='planeImage'/>}
                    {marcadores && marcadores.map((marcador,index) => (
                        <Marcador
                        key={index}
                        x={marcador.x}
                        y={marcador.y}
                        state={marcador.state}
                        onClick={() => showOptionsMenu(marcador.id)}
                        />
                    ))}
                </div>
            </div>
            <div style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                <h1 style={{padding:'10px',borderBottom:'1px solid',marginBottom:'10px',color:'#b6d3f0'}}>Descripcion:</h1>
                <ul style={{listStyle:'none',color:'#fff', textAlign:'center'}} id='descriptionList'></ul>
                <div style={{marginTop:'20px',display:'grid',gap:'10px'}}>
                    <button style={{padding:'8px',background:'#fff',textDecoration:'none',borderRadius:'5px',
                    border:'none',color:'blueviolet',fontSize:'20px',cursor:'pointer'}} onClick={updateFile}>
                        Save Points
                    </button>
                    <a href={githubFileUrl} style={{padding:'8px',background:'#fff',textDecoration:'none',borderRadius:'5px',
                    border:'none',color:'blueviolet',fontSize:'20px',fontWeight:'bold'}} target='_blank'>
                        Ir al archivo
                    </a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Airplane