import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'

import { ReactComponent as IconMenu } from 'Assets/menu.svg'
import { ReactComponent as IconMenuOpen } from 'Assets/menu-open.svg'

class Layout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isMobileNavShow: null,
        }
    }

    componentDidMount() {
        this.setState({ isMobileNavShow: window.innerWidth >= 640 ? true : false })
        window.addEventListener('resize', this.updateDimensions)

        const el = document.querySelector('nav')
        this.setState({ top: el.offsetTop, height: el.offsetHeight })
        window.addEventListener('scroll', this.handleScroll)
        this.handleScroll()
    }

    componentDidUpdate() {
        this.state.scroll > this.state.top ? (document.body.style.paddingTop = `${this.state.height}px`) : (document.body.style.paddingTop = 0)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions)
    }

    updateDimensions = () => {
        this.setState({ isMobileNavShow: window.innerWidth >= 640 ? true : false })
    }

    handleScroll = () => {
        this.setState({ scroll: window.scrollY })
    }

    render() {
        return (
            <div className='layout'>
                <nav className={this.state.scroll > this.state.top ? 'layout__header--scrolled' : 'layout__header'}>{this.renderMenu()}</nav>
                <main className='layout__main'>{this.props.children}</main>
            </div>
        )
    }

    renderMenu() {
        const { isMobileNavShow } = this.state

        return (
            <Fragment>
                <div className='layout__header__menu-btn'>
                    <i onClick={() => this.setState({ isMobileNavShow: !isMobileNavShow })}>{isMobileNavShow ? <IconMenuOpen /> : <IconMenu />}</i>
                </div>
                <div className='layout__header__navigations' style={isMobileNavShow ? { display: 'flex' } : { display: 'none' }}>
                    <NavLink to='/' exact className='layout__header__navigation'>
                        <div className='layout__header__navigation--home'>
                            <img src={require('Assets/logo.png').default} alt='home-logo' />
                        </div>
                    </NavLink>
                    <NavLink to='/' className={(navData) => (navData.isActive ? 'layout__header__navigation--active' : 'layout__header__navigation')}>
                        Home
                    </NavLink>
                    <NavLink to='/about' className={(navData) => (navData.isActive ? 'layout__header__navigation--active' : 'layout__header__navigation')}>
                        About
                    </NavLink>
                </div>
            </Fragment>
        )
    }
}

export default Layout
