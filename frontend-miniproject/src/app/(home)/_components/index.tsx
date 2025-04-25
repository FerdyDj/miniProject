import DataCarouselComponent from "./carousel";
import Hero from "./hero";

export default function HomePage(){
    return(
        <div className="max-w-screen min-h-screen">
            <Hero />
            <DataCarouselComponent />
        </div>
    )
}