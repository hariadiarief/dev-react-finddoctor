import Axios from 'axios'

const API = Axios.create({
    baseURL: `https://run.mocky.io/v3/c9a2b598-9c93-4999-bd04-0194839ef2dc`,
})

export default API
