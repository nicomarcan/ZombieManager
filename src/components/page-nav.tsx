import React from 'react'
import {Link} from 'react-router-dom'

export const PageNav = () =>{
    return <nav>
                <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/dashboard">dashboard</Link>
                </li>
                <li>
                    <Link to="/locations">locations</Link>
                </li>
                </ul>
            </nav>
}