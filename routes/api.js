const express = require('express')
const router = express.Router()

const fs = require('fs')
const rootPath = require('app-root-path').path
const blogPath = `${rootPath}/blogs`

router.get('/blogText', (req, res) => {
    res.send('233')
})

router.get('/blogText/:id', async (req, res, next) => {
    console.log('A req')
    let id = req.params.id
    if (id == -1) {
        console.log(111)
        let fileArray = []
        const files = await fs.readdirSync(blogPath)
        for (let i=0; i < files.length; i++) {
            const title = getBlogTitle(files[i])
            fileArray.push(title)
        }
        res.send(fileArray)
    } else if (id < 0) {
        res.send('File not exist.')
    } else {
        next()
    }
}, (req, res) => {
    let id = req.params.id
    fs.readdir(blogPath, (err, files) => {
        if (id <= files.length) {
            res.sendFile(`${blogPath}/${id}.md`)
        } else {
            res.send('File not exist.')
        }
    })
})

router.post('/blogText', async (req, res) => {
    console.log('A req')
    let body = req.body
    console.log(typeof body)
    const id = await fs.readdirSync(blogPath).length
    fs.appendFileSync(`${blogPath}/${id}.md`, body.mdText)
    res.send('Receive body!')
    console.log('Receive body!')
})

function getBlogTitle(file) {
    const title = fs.readFileSync(`${blogPath}/${file}`, 'utf-8').split('\n')[0].split('# ')[1]
    return title
}

module.exports = router