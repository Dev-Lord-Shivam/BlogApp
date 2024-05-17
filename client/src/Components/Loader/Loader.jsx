import React from 'react'
import LoaderGif from '../../assets/images/loader.gif'
const Loader = () => {
  return (
    <div className='loader'>
        <did className="loader_image">
            <img src={LoaderGif} alt="" />
        </did>
    </div>
  )
}

export default Loader
