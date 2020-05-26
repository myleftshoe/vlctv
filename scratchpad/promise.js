async function promise() {
    return new Promise(resolve => {
        setTimeout(() => resolve({test: "test"}), 5000)
    })
}


async function callPromise() {
    const res = await promise()
    const json = JSON.stringify(res)
    return json
}

async function run() {
    const res = Promise.all([callPromise(), callPromise()])
    console.log(res)
    await res
    console.log(res)
}

run()