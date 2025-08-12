
import { useNavigate } from 'react-router-dom';
import './css/slide.css'
import Carousel from 'react-bootstrap/Carousel';
function Slide() {
const navigate = useNavigate();

    return (

        <div className='slidebar' >
            <Carousel black>
                <Carousel.Item>
                    <img  onClick={()=>navigate('/allProducts')} src="https://neemans.com/cdn/shop/files/ND_-_COB_-_Web_Banner_-_Desktop_1920_x_800_px.jpg?v=1739879182&width=1500" alt="" />
                    <Carousel.Caption>

                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img  onClick={()=>navigate('/allProducts')} src="https://neemans.com/cdn/shop/files/Web_Banner_UC_-_Desktop_1920_x_800.jpg?v=1740038766&width=1500" alt="" />

                    <Carousel.Caption>

                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img  onClick={()=>navigate('/allProducts')} src="https://www.asianfootwears.com/_next/image?url=https%3A%2F%2Fcdn.asianlive.in%2Fdigital-website%2FHerobanner-Desktop-new-launch_66594349059286605822.jpg&w=3840&q=75" alt="" />
                    <Carousel.Caption>

                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img  onClick={()=>navigate('/allProducts')} src="https://www.asianfootwears.com/_next/image?url=https%3A%2F%2Fs3-ap-southeast-1.amazonaws.com%2Fasianapp%2Fdigital-website%2FClogs_Hero%20Banner_D_10835864319244847339.png&w=3840&q=75" alt="" srcset="" />
                    <Carousel.Caption>

                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>

    )
}

export default Slide
