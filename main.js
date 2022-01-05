const weatherStore = {
    privateCity: 'rajshahi',
    privateCountry: 'BD',
    API_kEY: '008023412376865840e32be1c8423c5d',
    set city(name) {
        console.log('city name')
        //validation 
        this.privateCity = name
    },
    set country(name) {
        console.log('country name')
        this.privateCountry = name
    },
    async fetchData() {
        const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.privateCity},${this.privateCountry}&units=metric&appid=${this.API_kEY}`)
        return await res.json()

    },
}

const storage = {
    privateCity: '',
    privateCountry: '',
    set city(name) {
        this.privateCity = name
    },
    set country(name) {
        this.privateCountry = name
    },
    saveItem() {
        localStorage.setItem('BD-weather-city', this.privateCity)
        localStorage.setItem('BD-weather-country', this.privateCountry)
    }
}

const UI = {
    loadSelectors() {
        const cityElm = document.querySelector("#city")
        const cityInfoElm = document.querySelector("#w-city")
        const iconElm = document.querySelector("#w-icon")
        const temperatureElm = document.querySelector("#w-temp")
        const pressureElm = document.querySelector("#w-pressure")
        const humidityElm = document.querySelector("#w-humidity")
        const feelElm = document.querySelector("#w-feel")
        const formElm = document.querySelector("#form")
        const countryElm = document.querySelector("#country")
        const messageElm = document.querySelector("#messageWrapper")

        return {
            cityElm,
            cityInfoElm,
            iconElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm,
            formElm,
            countryElm,
            messageElm,

        }
    },

    getInputValues() {
        const { cityElm, countryElm } = this.loadSelectors()
        const city = cityElm.value
        const country = countryElm.value

        return {
            city,
            country,
        }
    },

    validateInput(city, country) {
        let error = false
        if (city === '' || country === '') {
            error = true
        }
        return error
    },

    hideMessage() {
        const msgContentElm = document.querySelector('.err-msg')
        if (msgContentElm) {
            setTimeout(() => {
                msgContentElm.remove()
            }, 2000)

        }
    },


    showMessage(msg) {
        const { messageElm } = this.loadSelectors()
        const elm = `<div class = 'alert alert-danger err-msg'>${msg}</div>`
        const msgContentElm = document.querySelector('.err-msg')
        if (!msgContentElm) {
            messageElm.insertAdjacentHTML('afterbegin', elm)
        }

        this.hideMessage()
    },

    getIconSrc(iconCode) {
        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
    },

    printWeather(data) {
        const {
            cityInfoElm,
            iconElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm,
        } = this.loadSelectors()
        const { main, weather, name } = data
        console.log(main)
        cityInfoElm.textContent = name
        temperatureElm.textContent = `temperature: ${main.temp}°C`
        humidityElm.textContent = `Humidity: ${main.humidity}kpa`
        pressureElm.textContent = `pressure: ${main.pressure}kpa`
        feelElm.textContent = weather[0].description
        const src = this.getIconSrc(weather[0].icon)
        iconElm.setAttribute('src', src)
    },

    resetInput() {
        const { countryElm, cityElm } = this.loadSelectors()
        cityElm.value = ''
        countryElm.value = ''
    },

    init() {
        const { formElm } = this.loadSelectors()
        formElm.addEventListener("submit", async (e) => {
            e.preventDefault()
            //get the input values
            const { city, country } = this.getInputValues()
            //reset input
            this.resetInput()
            //validate input
            const error = this.validateInput(city, country)
            //show error message in UI
            if (error) return this.showMessage('please provide valid input')

            //setting data to weather data store
            weatherStore.city = city
            weatherStore.country = country
            //setting to local storage
            storage.city = city
            storage.country = country
            storage.saveItem()
            //send request to API server
            const data = await weatherStore.fetchData()
            this.printWeather(data)
        })

        document.addEventListener('DOMContentLoaded', async (e) => {
            //load data from local storage
            if (localStorage.getItem('BD-weather-city')) {
                //setting data to data store
                weatherStore.city = localStorage.getItem('BD-weather-city')
            }

            if (localStorage.getItem('BD-weather-country')) {
                //setting data to data store
                weatherStore.country = localStorage.getItem('BD-weather-country')
            }
            //send request to API server
            const data = await weatherStore.fetchData()
            //shaow data to UI
            this.printWeather(data)

        })

    },
}
UI.init()