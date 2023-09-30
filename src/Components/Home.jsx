import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Link} from 'react-router-dom'

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

import { Pagination, Grid } from 'swiper/modules';
import axios from 'axios';

async function importPlanesDatas() {
    try {
        const fileUrl = 'https://raw.githubusercontent.com/Steven02-ZT/PlanesPointManager/master/src/assets/planes.json';
        const response = await axios.get(fileUrl);
        return response.data;
    } catch (error) {
        console.error('Error al importar los datos de los aviones:', error);
        return { planes: [] }; // Devuelve un objeto con una matriz vacía en caso de error.
    }
}


function Home() {
    const [slidesPerView,setSlidesPerView] = useState(3)
    const [planeData,setPlaneData] = useState(null)

    useEffect(() => {
        if(window.innerWidth <= 450){
            setSlidesPerView(1)
        }else if(window.innerWidth <= 1050){
            setSlidesPerView(2)
        }

        async function fetchPlaneData() {
            const data = await importPlanesDatas();
            setPlaneData(data);
        }

        fetchPlaneData();
    },[])

    return (
        <div style={styles.container}>
        <h1 style={styles.title}>Pick your plane.</h1>
        <Swiper
            slidesPerView={slidesPerView}
            spaceBetween={30}
            pagination={{ clickable: true }}
            modules={[Pagination,Grid]}
            className="mySwiper"
            style={styles.swiper}
            grid={{rows:2}}
        >
            {planeData &&
                planeData.planes.map((air, index) => (
                    <SwiperSlide style={styles.swiperSlide} key={air.id}>
                        <img
                            src={`https://raw.githubusercontent.com/Steven02-ZT/PlanesPointManager/master/src/assets/docs/${air.path}/plane.jpg`}
                            alt={air.model}
                            style={styles.image}
                        />
                        <Link to={`/airplane/${air.id}`}>
                            <h2 style={styles.subtittle}>{air.model}</h2>
                        </Link>
                    </SwiperSlide>
                ))}
        </Swiper>
    </div>
    )
}

const styles = {
    container:{
        height:'100vh',
        with: '100vh',
        background:'#fff',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center'
    },
    swiper:{
        width: '100%',
        height: '80%',
        padding:'20px'
    },
    swiperSlide:{
        textAlign: 'center',
        fontSize: '18px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position:"relative",
        height:'250px'
    },
    title:{
        fontSize:'50px',
        padding:'20px',
    },
    image:{
        width:"100%",
        height:"100%",
        objectFit:'cover',
        position:'absolute',
    },
    subtittle:{
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: '0',
        left: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(3px)',
        color:'#fff'
    }
}

export default Home