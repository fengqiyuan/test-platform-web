import { ref, toRefs } from 'vue';

export function showMessage(message, type, text) {
    message.type = type
    message.text = text
    message.isShow = true
    setTimeout(() => {
        message.isShow = false
    }, 2000)
}

export function dateToString(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function dateToString1(date) {
    console.log(date)
    console.log(typeof date)
    if (!(date instanceof Date)) {
        date = new Date(date);
        console.log(date)
    }
    // Get local timezone offset in minutes
    const offsetMinutes = new Date().getTimezoneOffset();

    // Convert to local datetime string
    const localDatetime = date.toLocaleString(undefined, {
        timeZoneOffset: offsetMinutes,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    console.log(localDatetime)

    return localDatetime
}

export function addKeyValue(obj, newKeyValue) {
    obj[newKeyValue.key] = newKeyValue.value
    newKeyValue.key = ''
    newKeyValue.value = ''
    console.log(obj)
}
export const deleteKeyValue = (obj, key) => {
    delete obj[key]
    console.log(obj)
}

export function changeRequestData(data, dataRaw, bodyType) {
    console.log(dataRaw)
    console.log(data.value)
    if (bodyType === 'raw') {
        dataRaw.value = data.value && Object.keys(data.value).length != 0 ? JSON.stringify(data.value) : ''
    } else {
        data.value = dataRaw.value ? JSON.parse(dataRaw.value.replace(/'/g, "\"")) : {}
    }
    console.log(dataRaw)
    console.log(data.value)
}

export function getNewRequestData(data, dataRaw, bodyType) {
    let newData = undefined
    if (bodyType === 'raw') {
        newData = dataRaw.value ? JSON.parse(dataRaw.value.replace(/'/g, "\"")) : undefined
    } else {
        newData = Object.keys(data.value).length != 0 ? data.value : undefined
    }
    return newData
}

// axios response 处理

export function assign(response, res) {
    response.status = res.status
    response.data = res.data
    for (const [key, value] of Object.entries(res.headers)) {
        response.headers[key] = value;
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}