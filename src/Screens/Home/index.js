import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

import { uniq } from 'lodash'
import { Link } from 'react-router-dom'

import { Select, Input } from 'antd'

import API from 'Services/API'

export default function Home() {
    const { Option } = Select

    const [doctors, setDoctors] = useState([])
    const [hospitals, setHospitals] = useState([])
    const [specializations, setSpecializations] = useState([])

    const [keyword, setKeyword] = useState('')
    const [selectedSpecializations, setSelectedSpecializations] = useState([])
    const [selectedHospitals, setSelectedHospitals] = useState([])

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
        if (selectedHospitals.length) {
            setKeyword('')
            setSelectedSpecializations([])

            setFilteredDoctors(doctors.filter((doctor) => selectedHospitals.includes(doctor.hospital[0].name)))
        }
    }, [selectedHospitals, doctors])

    useEffect(() => {
        if (selectedSpecializations.length) {
            setKeyword('')
            setSelectedHospitals([])

            setFilteredDoctors(doctors.filter((doctor) => selectedSpecializations.includes(doctor.specialization.name)))
        }
    }, [selectedSpecializations, doctors])

    useEffect(() => {
        if (keyword) {
            setSelectedHospitals([])
            setSelectedSpecializations([])

            setFilteredDoctors(doctors.filter((doctor) => doctor.name.toLowerCase().includes(keyword.toLowerCase())))
        }
    }, [keyword, doctors])

    useEffect(() => {
        if (!keyword && !selectedSpecializations.length && !selectedHospitals.length) {
            setFilteredDoctors(doctors)
        }
    }, [keyword, selectedSpecializations, selectedHospitals, doctors])

    return (
        <div className='home'>
            <div className='home__title'>Available Doctor</div>
            <img className='home__backround' src={require('Assets/wave.svg').default} alt='' />

            <div className='home__filter container'>
                <Input
                    placeholder='Cari Dokter'
                    value={keyword}
                    style={{ width: '30%', height: '31px', marginRight: '12px' }}
                    onChange={({ target: { value } }) => {
                        setKeyword(value)
                        setIsFiltered(true)
                    }}
                />

                <Select
                    mode='multiple'
                    allowClear
                    style={{ width: '30%', height: '31px', marginRight: '12px' }}
                    placeholder='Rumah Sakit'
                    onChange={(value) => {
                        setIsFiltered(true)
                        setSelectedHospitals(value)
                    }}
                    value={selectedHospitals}
                >
                    {hospitals.map((hospital, index) => (
                        <option key={index} value={hospital}>
                            {hospital}
                        </option>
                    ))}
                </Select>

                <Select
                    mode='multiple'
                    allowClear
                    style={{ width: '30%', height: '31px', marginRight: '12px' }}
                    placeholder='Spesialis'
                    onChange={(value) => {
                        setIsFiltered(true)
                        setSelectedSpecializations(value)
                    }}
                    value={selectedSpecializations}
                >
                    {specializations.map((specialization, index) => (
                        <Option key={specialization}>{specialization}</Option>
                    ))}
                </Select>
            </div>
            <div className='home__grid container'>
                {!doctors.length
                    ? renderLoadingDoctor()
                    : !isFiltered
                    ? doctors.map((doctor, index) => renderDoctor(doctor, index))
                    : filteredDoctors.map((doctor, index) => renderDoctor(doctor, index))}
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

    function renderLoadingDoctor() {
        return Array.apply(null, Array(6)).map(() => <Skeleton height={125} />)
    }
}
