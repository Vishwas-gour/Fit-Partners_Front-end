import { Outlet } from "react-router-dom"
import Footer from '../NonOutlets/Footer.jsx'
import MyNav from '../NonOutlets/MyNav.jsx'
import Search from "../NonOutlets/Search.jsx"
import { useSelector } from "react-redux";


function UserLayout() {
    const searchContainer = useSelector((state) => state.counts.search);

    return (
        <>
            <Search />
            <div style={(searchContainer) ? ({ filter: "blur(5px)", pointerEvents: "none" }) : ({ filter: "blur(0px)" })}>
                <MyNav />
                <Outlet />
                <Footer />
            </div>

        </>
    )
}

export default UserLayout