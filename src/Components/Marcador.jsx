import React from 'react';

function Marcador({ x, y, color, onClick }) {
  const style = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    backgroundColor: color,
    width: '2%',
    height: '2%',
    borderRadius: '50%',
    cursor: 'pointer',
  };

  return <div style={style} onClick={onClick}></div>;
}

export default Marcador;