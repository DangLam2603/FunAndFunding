import React,{useState} from 'react'
import './index.css' 
const DropItem = ({onDrop}) => {
  const [showdrop, setShowDrop] = useState(false);
  return (
    <section 
      className={showdrop ? 'drop_item' : 'hide_drop'}
      // className='drop_item' 
      onDragEnter={() => setShowDrop(true)} onDragLeave={() => setShowDrop(false)} onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        onDrop()
        setShowDrop(false)
      }}>
      Drop Area
    </section>
  )
}

export default DropItem
