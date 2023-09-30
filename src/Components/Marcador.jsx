import React from 'react';

function Marcador({state, x, y, onClick }) {
  const color = state == 0 ?  'red' : 'green'
  const style = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    backgroundColor: color,
    width: '15px',
    height: '15px',
    borderRadius: '100%',
    cursor: 'pointer',
  };

  return <div style={style} onClick={onClick}></div>;
}

export default Marcador;