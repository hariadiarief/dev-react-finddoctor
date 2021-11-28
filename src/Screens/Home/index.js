import React, { useEffect, useState, useCallback } from 'react'
import { uniq, cloneDeep, debounce } from 'lodash'
import { Link } from 'react-router-dom'

import API from 'Services/API'

export default function Home() {
    const [doctors, setDoctors] = useState([])
    const [hospitals, setHospitals] = useState([])
    const [specializations, setSpecializations] = useState([])

    const [keyword, setKeyword] = useState()
    const [selectedSpecializations, setSelectedSpecializations] = useState('')
    const [selectedHospitals, setSelectedHospitals] = useState('')

    const [isFiltered, setIsFiltered] = useState(false)
    const [filteredDoctors, setFilteredDoctors] = useState([])

    useEffect(() => {
        API.get('').then((res) => {
            if (res.status) {
                setDoctors(res.data.data)
                setFilteredDoctors(res.data.data)
                let hospitals = []
                let specializations = []
                res.data.data.forEach((item) => {
                    item.hospital.forEach((hospital) => {
                        hospitals.push(hospital.name)
                    })
                    specializations.push(item.specialization.name)
                })
                setHospitals(uniq(hospitals))
                setSpecializations(uniq(specializations))
            }
        })
    }, [])

    useEffect(() => {
        if (selectedHospitals) {
            setKeyword('')
            setSelectedSpecializations('')

            setFilteredDoctors(doctors.filter((doctor) => selectedHospitals && doctor.hospital.some(({ name }) => name === selectedHospitals)))
        }
    }, [selectedHospitals])

    useEffect(() => {
        if (selectedSpecializations) {
            setKeyword('')
            setSelectedHospitals('')

            setFilteredDoctors(doctors.filter((doctor) => doctor.specialization.name === selectedSpecializations))
        }
    }, [selectedSpecializations])

    useEffect(() => {
        if (keyword) {
            setSelectedHospitals('')
            setSelectedSpecializations('')

            setFilteredDoctors(doctors.filter((doctor) => doctor.name.toLowerCase().includes(keyword.toLowerCase())))
        }
    }, [keyword])

    const handleSearch = useCallback(
        debounce((value) => setKeyword(value), 500),
        []
    )

    return (
        <div className=''>
            <div className='home__title'>Available Doctor</div>
            <div className='container'>
                <input
                    type='text'
                    placeholder='Cari Dokter'
                    onChange={({ target: { value } }) => {
                        handleSearch(value)
                        setIsFiltered(true)
                    }}
                />
                <select
                    name=''
                    id=''
                    value={selectedHospitals}
                    onChange={({ target: { value } }) => {
                        setIsFiltered(true)
                        setSelectedHospitals(value)
                    }}
                >
                    <option value=''>Rumah Sakit</option>
                    {hospitals.map((hospital, index) => (
                        <option key={index} value={hospital}>
                            {hospital}
                        </option>
                    ))}
                </select>
                <select
                    name=''
                    id=''
                    value={selectedSpecializations}
                    onChange={({ target: { value } }) => {
                        setIsFiltered(true)
                        setSelectedSpecializations(value)
                    }}
                >
                    <option value=''>Spesialis</option>
                    {specializations.map((specialization, index) => (
                        <option key={index} value={specialization}>
                            {specialization}
                        </option>
                    ))}
                </select>
            </div>
            <div className='home__grid container'>
                {!doctors.length ? (
                    <div>Loading...</div>
                ) : !isFiltered ? (
                    doctors.map((doctor, index) => renderDoctor(doctor, index))
                ) : (
                    filteredDoctors.map((doctor, index) => renderDoctor(doctor, index))
                )}
            </div>
        </div>
    )

    function renderDoctor(doctor, index) {
        return (
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
        )
    }
}
