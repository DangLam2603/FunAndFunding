import React from 'react'
import { Outlet } from 'react-router'
import Footer from '../../components/Footer'

function UserLayout() {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    )
}

export default UserLayout