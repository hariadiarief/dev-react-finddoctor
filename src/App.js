import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import NotFound from './Screens/NotFoud404'
import { Layout } from './Components'

import { publicRoutes } from './Routes'

export default function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    {publicRoutes.map((route, index) => (
                        <Route exact={route.exact} path={route.path} element={route.component} key={index} />
                    ))}
                    <Route path='*' element={<NotFound />} key='404' />
                </Routes>
            </Layout>
        </Router>
    )
}
