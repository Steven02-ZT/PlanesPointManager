import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Link} from 'react-router-dom'

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

import planeData from '../assets/planes.json'

const requiredImages = planeData.planes.map(air => `${air.path}/${air.plane}`)
const importImages = async () => {
    const images = [];
    for (const dir of requiredImages) {
      const path = `../assets/docs/${dir}`;
      const module = await import(path);
      images.push(module.default); 
    }
    return images;
  };  
  

function Home() {
    const [slidesPerView,setSlidesPerView] = useState(3)
    const [images, setImages] = useState([]);

    useEffect(() => {
        if(window.innerWidth <= 450){
            setSlidesPerView(1)
        }else if(window.innerWidth <= 1050){
            setSlidesPerView(2)
        }

        importImages().then((loadedImages) => {
            setImages(loadedImages);
          });
    },[])

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Pick your plane.</h1>

            <Swiper slidesPerView={slidesPerView} spaceBetween={30} pagination={{clickable: true,}}
                modules={[Pagination]} className="mySwiper" style={styles.swiper}>
                    {planeData && planeData.planes.map((air,index) => (
                        <SwiperSlide style={styles.swiperSlide} key={air.id}>
                            <img src={images[index]} alt={air.model} style={styles.image} />
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
        position:"relative"
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