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
                        <Link className='home__grid__item' key={index} to={`/doctor/${doctor.doctor_id}`}>
                            <div className='home__grid__item__content'>
                                <img
                                    alt={doctor.name}
                                    className='home__grid__item__content__image'
                                    src={doctor.photo.formats.thumbnail || require('Assets/loader.gif').default}
                                    onError={(e) => {
                                        e.target.onError = null
                                        e.target.src = require('Assets/broken.png').default
                                    }}
                                />

                                <div className='home__grid__item__content__detail'>
                                    <div>
                                        <span>{doctor.name}</span>
                                        <span>
                                            {doctor.hospital.map((item) => item.name).join(', ')} - {doctor.specialization.name}
                                        </span>
                                        <span title={doctor.about_preview.replaceAll('&nbsp;', ' ')}>{doctor.about_preview.replaceAll('&nbsp;', ' ')}</span>
                                    </div>
                                    <span>{doctor.price.formatted}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
