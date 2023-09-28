import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import planesDatas from '../assets/planes.json'
import Marcador from './Marcador'

import './airplane.css'

import pointsData from '../assets/docs/air1/points.json'

async function importImage(path){
    const image = await import(path)
    return image.default
}

function Airplane() {
    const {id} = useParams()
    const airplaneInfo = planesDatas.planes.find(airplane => airplane.id === parseInt(id));
    const path = airplaneInfo ? `../assets/docs/${airplaneInfo.path}/${airplaneInfo.plane}` : '';

    const [info,setInfo] = useState({})
    const [plane,setPlane] = useState(null)
    const [marcadores, setMarcadores] = useState([]); 

    useEffect(() => {
        const airplaneInfo = planesDatas.planes.find(airplane => airplane.id === parseInt(id));

        if (airplaneInfo) {
        setInfo(airplaneInfo);
        }

        importImage(path).then((importedImage) => {
            setPlane(importedImage);
        });
    },[])

    useEffect(() => {
        setMarcadores(pointsData.points)
        console.log(marcadores)
    },[])

    const agregarMarcador = (event) => {
        const plane = event.target.getBoundingClientRect();
        
        const x = event.clientX - plane.left;
        const y = event.clientY - plane.top;

        const color = '#' + ((Math.random() * 0xFFFFFF) << 0).toString(16);
        
        setMarcadores([...marcadores, { x, y, color }]);
      };

  return (
    <div style={{height:'100vh',width:'100vw',background:'#010b14'}}>
        <h1 className='title'>{info.model}</h1>
        <div className='panel'>
            <div style={{overflow:'scroll'}}>
                <div className='container'>
                    <img id='plane' src={plane} alt={info.model}
                        onClick={agregarMarcador} className='planeImage'/>
                    {marcadores.map((marcador, index) => (
                        <Marcador
                        key={index}
                        x={marcador.x}
                        y={marcador.y}
                        color={marcador.color}
                        onClick={() => eliminarMarcador(index)}
                        />
                    ))}
                </div>
            </div>
            <div style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                <h1 style={{padding:'10px',borderBottom:'1px solid',marginBottom:'10px',color:'#b6d3f0'}}>Descripcion:</h1>
                <ul style={{listStyle:'none'}}>
                    <li>Pendiente archivo de NRC</li>
                    <li>Revisar archivo imagen2.jpg</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Airplane