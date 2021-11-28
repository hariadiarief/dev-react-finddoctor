import Home from './Screens/Home'
import About from './Screens/About'
import Detail from './Screens/Detail'

export const publicRoutes = [
    {
        component: <Home />,
        path: '/',
        exact: true,
    },
    {
        component: <About />,
        path: '/about',
        exact: true,
    },
    {
        component: <Detail />,
        path: '/doctor/:id',
    },
]
