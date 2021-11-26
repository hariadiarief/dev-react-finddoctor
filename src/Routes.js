import Home from './Screens/Home'
import Favorite from './Screens/Favorite'
import About from './Screens/About'

export const publicRoutes = [
    {
        component: <Home />,
        path: '/',
        exact: true,
    },
    {
        component: <Favorite />,
        path: '/favorite',
        exact: true,
    },
    {
        component: <About />,
        path: '/about',
        exact: true,
    },
]
