import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from 'Services/API'

export default function Home() {
    const [doctors, setDoctors] = useState('')

    useEffect(() => {
        API.get('').then((res) => {
            if (res.status) {
                setDoctors(res.data.data)
            }
        })
    }, [])

    return (
        <div className=''>
            <div className='home__title'>Available Doctor</div>
            <div className='home__grid container'>
                {!doctors.length ? (
                    <div>Loading...</div>
                ) : (
                    doctors.map((doctor, index) => (
                        <div className='home__grid__item' key={index}>
                            <Link className='home__grid__item__content' to={`/doctor/${doctor.doctor_id}`}>
                                <img
                                    alt={doctor.name}
                                    className='home__grid__item__content__image'
                                    src={doctor.photo.formats.thumbnail || require('Assets/loader.gif').default}
                                    onError={(e) => {
                                        e.target.onError = null
                                        e.target.src = require('Assets/broken.png').default
                                    }}
                                />
                                <span>{doctor.name}</span>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
