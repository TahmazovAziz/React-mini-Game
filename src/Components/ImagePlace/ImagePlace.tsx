import './ImagePlace.css'

interface ImagePlaceProps {
    url: string;
    transition:boolean
}

export default function ImagePlace({url, transition} : ImagePlaceProps) {
    const ImageStyle = {
        animation: transition ? 'ci 1.5s' : 'none'
        
    }
    return(
        <> 
            <div className="image-container">
                <img src={url} style={ImageStyle} alt="" width={500} height={500}/>
            </div>
        </>
    );
}